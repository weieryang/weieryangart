import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { analyzeCsv, parseCsv, reportToCsv } from './gsc-opportunities.mjs';

const exec = promisify(execFile);
const script = fileURLToPath(new URL('./gsc-opportunities.mjs', import.meta.url));
const header = 'Query,Clicks,Impressions,CTR,Position';

test('inclusive position boundaries, strict impression threshold and exposure sort', () => {
  const report = analyzeCsv(`${header}\nlow,2,101,1.98%,8\nhigh,5,900,0.55%,20\nbelow,1,900,0.11%,7.99\nabove,1,900,0.11%,20.01\nthreshold,1,100,1%,12\n`, '/source/queries.csv');
  assert.equal(report.inputRows, 5);
  assert.deepEqual(report.opportunities.map((item) => item.query), ['high', 'low']);
  assert.equal(report.source.path, '/source/queries.csv');
  assert.deepEqual(report.filters, { positionMin: 8, positionMax: 20, impressionsGreaterThan: 100 });
});

test('BOM, CRLF, escaped quotes, quoted comma and quoted newline retain the record source line', () => {
  const report = analyzeCsv('\uFEFFTop queries,Clicks,Impressions,CTR,Position,Page\r\n"custom, sculpture\r\nwith ""steel""",12,"1,200",1%,12.5,https://example.com/custom/\r\nsecond,2,300,0.0067,9,https://example.com/second/\r\n');
  assert.equal(report.opportunities[0].query, 'custom, sculpture\r\nwith "steel"');
  assert.equal(report.opportunities[0].impressions, 1200);
  assert.equal(report.opportunities[0].ctr, 0.01);
  assert.equal(report.opportunities[1].ctr, 0.0067);
  assert.equal(report.opportunities[1].sourceRow, 4);
  assert.equal(report.pageColumnPresent, true);
  assert.equal(report.opportunities[0].page, 'https://example.com/custom/');
});

test('common Chinese headers and full-width percent are accepted', () => {
  const report = analyzeCsv('热门查询,点击次数,展示次数,点击率,平均排名,网页\n酒店雕塑,10,200,5％,8.5,https://example.com/酒店/');
  assert.equal(report.opportunities[0].query, '酒店雕塑');
  assert.equal(report.opportunities[0].ctr, 0.05);
  assert.equal(report.opportunities[0].page, 'https://example.com/酒店/');
  assert.equal(analyzeCsv('查询,点击次数,曝光次数,点击率,排名,URL\n雕塑,1,200,0.5%,10,https://example.com/').resultCount, 1);
});

test('missing or blank Page never creates a landing page', () => {
  const missing = analyzeCsv(`${header}\nsculpture,10,200,5%,12`);
  const blank = analyzeCsv(`${header},Page\nsculpture,10,200,5%,12,`);
  for (const report of [missing, blank]) {
    assert.equal(report.opportunities[0].page, null);
    assert.match(report.opportunities[0].pageStatus, /GSC 查询 \+ 页面联合导出/);
    assert.ok(report.notes.some((note) => note.includes('不是排名预测')));
  }
  assert.equal(missing.pageColumnPresent, false);
  assert.equal(blank.pageColumnPresent, true);
});

test('current GSC Chinese export header accepts 展示 and keeps small samples below the threshold', () => {
  const report = analyzeCsv('热门查询,点击次数,展示,点击率,排名\nexample sculpture,0,2,0%,10\nexample maker,0,4,0%,80.25\n');
  assert.equal(report.inputRows, 2);
  assert.equal(report.resultCount, 0);
  assert.equal(report.pageColumnPresent, false);
});

test('CSV output round-trips quoted data and includes source, page status and scope', () => {
  const report = analyzeCsv(`${header}\n"hotel, \"\"art\"\"\nconsultant",10,200,5%,12`, '/exports/query.csv');
  const output = parseCsv(reportToCsv(report));
  assert.equal(output[1].cells[0], '/exports/query.csv');
  assert.equal(output[1].cells[2], 'hotel, "art"\nconsultant');
  assert.equal(output[1].cells[3], '');
  assert.match(output[1].cells[4], /联合导出/);
  assert.equal(output[1].cells[7], '5%');
  assert.match(output[1].cells[9], /不是排名预测/);
});

test('CSV protects text formula prefixes while JSON and numeric columns retain their values', () => {
  for (const prefix of ['=', '+', '-', '@']) {
    const report = analyzeCsv(`${header},Page\n"${prefix}SUM(1,2)",10,200,5%,12,${prefix}page`, ` \t${prefix}source.csv`);
    const original = JSON.stringify(report);
    // Exercise whitespace detection on all exported text columns, independently of CSV input trimming.
    report.opportunities[0].query = ` \t${report.opportunities[0].query}`;
    report.opportunities[0].pageStatus = ` \r${prefix}status`;
    const beforeExport = JSON.stringify(report);
    const row = parseCsv(reportToCsv(report))[1].cells;
    assert.equal(row[0], `' \t${prefix}source.csv`);
    assert.equal(row[2], `' \t${prefix}SUM(1,2)`);
    assert.equal(row[3], `'${prefix}page`);
    assert.equal(row[4], `' \r${prefix}status`);
    assert.deepEqual(row.slice(5, 9), ['10', '200', '5%', '12']);
    assert.match(row[9], /单引号/);
    assert.equal(JSON.stringify(report), beforeExport);
    assert.equal(JSON.parse(original).opportunities[0].query, `${prefix}SUM(1,2)`);
    assert.ok(report.notes.some((note) => note.includes('JSON 保持原值')));
  }
});

test('empty, malformed and ambiguous input produces useful errors', () => {
  const invalid = [
    ['', /CSV 为空/],
    ['Query,Clicks\nsculpture,1', /缺少必需列/],
    [`${header},查询\nsculpture,1,200,0.5%,12,雕塑`, /表头重复/],
    [`${header}\n"sculpture,1,200,0.5%,12`, /引号未闭合/],
    [`${header}\n"sculpture"bad,1,200,0.5%,12`, /闭合引号/],
    [`${header}\nsculp"ture,1,200,0.5%,12`, /引号必须/],
    [`${header}\nsculpture,1,1,200,0.5%,12`, /列数/],
    [`${header}\nsculpture,1,"1,20",0.5%,12`, /有效非负数字/],
    [`${header}\nsculpture,-1,200,0.5%,12`, /有效非负数字/],
    [`${header}\nsculpture,1.2,200,0.5%,12`, /有效整数/],
    [`${header}\nsculpture,1,200,5,12`, /CTR 请使用/],
    [`${header}\nsculpture,1,200,101%,12`, /CTR 请使用/],
    [`${header}\nsculpture,201,200,5%,12`, /点击次数不能大于/],
    [`${header}\nsculpture,1,200,0.5%,0`, /平均排名的有效下限为 1/],
    [`${header}\nsculpture,1,200,0.5%,0.99`, /平均排名的有效下限为 1/],
    [`${header}\n,1,200,0.5%,12`, /查询词为空/],
  ];
  for (const [input, expected] of invalid) assert.throws(() => analyzeCsv(input), expected);
});

test('header-only and valid data with no candidates generate empty reports', () => {
  const noData = analyzeCsv(header);
  assert.equal(noData.inputRows, 0);
  assert.equal(noData.resultCount, 0);
  const noMatches = analyzeCsv(`${header}\nsculpture,1,100,1%,12`);
  assert.equal(noMatches.inputRows, 1);
  assert.deepEqual(noMatches.opportunities, []);
  assert.equal(parseCsv(reportToCsv(noMatches)).length, 1);
});

test('CLI writes both local reports, hashes source and leaves original bytes unchanged', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gsc-opportunities-'));
  try {
    const input = join(directory, 'export.csv');
    const bytes = Buffer.from(`\uFEFF${header}\ncustom sculpture,2,200,1%,12\n`);
    await writeFile(input, bytes);
    const { stdout, stderr } = await exec(process.execPath, [script, input, '--output-dir', 'reports'], { cwd: directory });
    assert.equal(stderr, '');
    assert.match(stdout, /筛出 1 个机会词/);
    assert.match(stdout, /联合导出/);
    const result = JSON.parse(await readFile(join(directory, 'reports', 'export-opportunities.json'), 'utf8'));
    assert.equal(result.source.path, input);
    assert.match(result.source.sha256, /^[a-f0-9]{64}$/);
    assert.equal(result.opportunities[0].page, null);
    assert.ok((await readFile(join(directory, 'reports', 'export-opportunities.csv'), 'utf8')).startsWith('\uFEFF'));
    await assert.rejects(exec(process.execPath, [script, input, '--output-dir', 'reports'], { cwd: directory }), (error) => error.code === 1 && /输出报告已存在/.test(error.stderr));
    assert.deepEqual(JSON.parse(await readFile(join(directory, 'reports', 'export-opportunities.json'), 'utf8')), result);
    assert.deepEqual(await readFile(input), bytes);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('CLI default output and empty results are explicit', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gsc-empty-'));
  try {
    const input = join(directory, 'export.csv');
    await writeFile(input, `${header}\nsculpture,1,100,1%,12`);
    const { stdout } = await exec(process.execPath, [script, input], { cwd: directory });
    assert.match(stdout, /没有符合/);
    const result = JSON.parse(await readFile(join(directory, 'qa', 'growth', 'export-opportunities.json'), 'utf8'));
    assert.equal(result.resultCount, 0);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('CLI rejects invalid UTF-8, unknown arguments and malformed CSV without reports', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'gsc-invalid-'));
  try {
    const input = join(directory, 'export.csv');
    await writeFile(input, Buffer.from([0xff, 0xfe, 0x61]));
    await assert.rejects(exec(process.execPath, [script, input], { cwd: directory }), (error) => error.code === 1 && /有效 UTF-8/.test(error.stderr));
    await writeFile(input, 'Query,Clicks\nsculpture,1');
    await assert.rejects(exec(process.execPath, [script, input], { cwd: directory }), (error) => error.code === 1 && /缺少必需列/.test(error.stderr));
    await assert.rejects(exec(process.execPath, [script, input, '--unknown'], { cwd: directory }), (error) => error.code === 1 && /未知参数/.test(error.stderr));
    await assert.rejects(readFile(join(directory, 'qa', 'growth', 'export-opportunities.json')), { code: 'ENOENT' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
