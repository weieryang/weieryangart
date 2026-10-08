import { createHash } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILTER = { positionMin: 8, positionMax: 20, impressionsGreaterThan: 100 };
const SCOPE_NOTE = '仅基于原始导出的日期范围和筛选条件；这是内容检查清单，不是排名预测。';
const CSV_SAFE_NOTE = 'CSV 文本列的公式前缀（=、+、-、@，忽略前导空白）加单引号以避免表格软件执行；JSON 保持原值。';
const PAGE_CHECK = '需 GSC 查询 + 页面联合导出确认落地页';
const ALIASES = {
  query: ['query', 'top queries', '热门查询', '查询'],
  clicks: ['clicks', '点击次数'],
  impressions: ['impressions', '展示', '展示次数', '曝光次数'],
  ctr: ['ctr', '点击率'],
  position: ['position', 'average position', '排名', '平均排名'],
  page: ['page', 'top pages', '网页', 'url'],
};

// CSV records retain the original physical line number, including quoted newlines.
export function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, '');
  const rows = [];
  let cells = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;
  let line = 1;
  let recordLine = 1;
  const endField = () => {
    cells.push(field);
    field = '';
    closedQuote = false;
  };
  const endRecord = () => {
    endField();
    if (cells.some((cell) => cell.trim() !== '')) rows.push({ cells, line: recordLine });
    cells = [];
  };
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
          closedQuote = true;
        }
      } else {
        field += char;
        if (char === '\n' || (char === '\r' && text[index + 1] !== '\n')) line += 1;
      }
    } else if (char === ',') {
      endField();
    } else if (char === '\n' || char === '\r') {
      endRecord();
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      line += 1;
      recordLine = line;
    } else if (closedQuote) {
      if (char !== ' ' && char !== '\t') throw new Error(`CSV 第 ${line} 行：闭合引号后出现非法字符。`);
    } else if (char === '"') {
      if (field.length) throw new Error(`CSV 第 ${line} 行：字段内的引号必须使用双引号转义。`);
      quoted = true;
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error(`CSV 第 ${recordLine} 行：引号未闭合。`);
  if (field.length || cells.length || closedQuote) endRecord();
  return rows;
}

function numberAt(value, column, line, { integer = false, percent = false } = {}) {
  const trimmed = value.trim();
  const hasPercent = percent && /[%％]$/.test(trimmed);
  const numeric = hasPercent ? trimmed.slice(0, -1).trim() : trimmed;
  // Reject malformed grouping (e.g. 1,20) instead of silently changing its value.
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(numeric)) {
    throw new Error(`CSV 第 ${line} 行：${column} 不是有效非负数字：${JSON.stringify(value)}。`);
  }
  const result = Number(numeric.replaceAll(',', '')) / (hasPercent ? 100 : 1);
  if (!Number.isFinite(result) || (integer && !Number.isSafeInteger(result))) {
    throw new Error(`CSV 第 ${line} 行：${column} 必须是有效${integer ? '整数' : '数字'}。`);
  }
  if (percent && result > 1) {
    throw new Error(`CSV 第 ${line} 行：CTR 请使用百分数（如 5%）或 0–1 小数（如 0.05）。`);
  }
  return result;
}

export function analyzeCsv(csv, sourcePath = '') {
  const parsed = parseCsv(csv);
  if (!parsed.length) throw new Error('CSV 为空：请提供 GSC 手动导出的 UTF-8 CSV。');
  const [header, ...data] = parsed;
  const normalized = header.cells.map((name) => name.trim().toLowerCase());
  const columns = {};
  for (const [key, aliases] of Object.entries(ALIASES)) {
    const matches = normalized.flatMap((name, index) => aliases.includes(name) ? [index] : []);
    if (matches.length > 1) throw new Error(`CSV 表头重复或含义冲突：${key}。`);
    if (!matches.length && key !== 'page') throw new Error(`CSV 缺少必需列：${aliases.join(' / ')}。`);
    columns[key] = matches[0];
  }
  const opportunities = [];
  for (const { cells, line } of data) {
    if (cells.length !== header.cells.length) {
      throw new Error(`CSV 第 ${line} 行：列数为 ${cells.length}，表头为 ${header.cells.length}；含逗号的数字或文本需要加引号。`);
    }
    const query = cells[columns.query].trim();
    if (!query) throw new Error(`CSV 第 ${line} 行：查询词为空。`);
    const clicks = numberAt(cells[columns.clicks], 'Clicks', line, { integer: true });
    const impressions = numberAt(cells[columns.impressions], 'Impressions', line, { integer: true });
    const ctr = numberAt(cells[columns.ctr], 'CTR', line, { percent: true });
    const position = numberAt(cells[columns.position], 'Position', line);
    if (position < 1) throw new Error(`CSV 第 ${line} 行：Position 平均排名的有效下限为 1。`);
    if (clicks > impressions) throw new Error(`CSV 第 ${line} 行：点击次数不能大于展示次数。`);
    const page = columns.page === undefined ? null : cells[columns.page].trim() || null;
    if (position >= FILTER.positionMin && position <= FILTER.positionMax && impressions > FILTER.impressionsGreaterThan) {
      opportunities.push({
        sourceRow: line, query, clicks, impressions, ctr, position, page,
        pageStatus: page ? '来自导出页面列' : PAGE_CHECK,
      });
    }
  }
  opportunities.sort((a, b) => b.impressions - a.impressions || a.sourceRow - b.sourceRow);
  return {
    schemaVersion: 1,
    source: { path: sourcePath },
    filters: { ...FILTER },
    inputRows: data.length,
    resultCount: opportunities.length,
    pageColumnPresent: columns.page !== undefined,
    ctrUnit: 'fraction (0–1); input accepts % or a 0–1 decimal',
    notes: [
      SCOPE_NOTE,
      'CSV 通常不含日期范围、国家、设备和搜索类型，请与原始导出一并保留这些条件，复测时使用相同条件。',
      '页面值原样取自导出，未推测落地页；缺少页面时需 GSC 查询 + 页面联合导出确认。',
      '工具只生成本地清单，不登录账号、修改页面或自动提交 IndexNow。',
      CSV_SAFE_NOTE,
    ],
    opportunities,
  };
}

function csvField(value) {
  const text = String(value ?? '');
  const safe = typeof value === 'string' && /^[=+\-@]/.test(text.trimStart()) ? `'${text}` : text;
  return /[",\r\n]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function reportToCsv(report) {
  const rows = [['source_file', 'source_row', 'query', 'page', 'page_status', 'clicks', 'impressions', 'ctr', 'position', 'analysis_scope']];
  for (const item of report.opportunities) {
    rows.push([report.source.path, item.sourceRow, item.query, item.page, item.pageStatus, item.clicks, item.impressions, `${Number((item.ctr * 100).toFixed(8))}%`, item.position, `${SCOPE_NOTE} ${CSV_SAFE_NOTE}`]);
  }
  return '\uFEFF' + rows.map((row) => row.map(csvField).join(',')).join('\r\n') + '\r\n';
}

const HELP = `用法：node scripts/gsc-opportunities.mjs <GSC导出.csv> [--output-dir <目录>]

默认输出目录：qa/growth（相对于当前工作目录）。生成 CSV 和 JSON，原始 CSV 保持不变；已有报告不会被覆盖，复测请使用新的输出目录。
必需列：Query/Top queries/查询/热门查询、Clicks/点击次数、Impressions/展示/展示次数、CTR/点击率、Position/排名/平均排名。
可选列：Page/网页/URL。缺少页面时不会猜测落地页，需 GSC 查询 + 页面联合导出确认。
筛选：平均排名 8–20（含边界），展示次数 >100，按展示次数降序。
CTR 支持 5% 或 0.05；千位逗号数字必须遵守 CSV 引号规则，如 "1,200"。
${CSV_SAFE_NOTE}
${SCOPE_NOTE}`;

export async function main(args = process.argv.slice(2)) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(HELP);
    return;
  }
  let input;
  let outputDir = 'qa/growth';
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--output-dir') {
      if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error('--output-dir 缺少目录。');
      outputDir = args[++index];
    } else if (args[index].startsWith('-') || input) {
      throw new Error(`未知参数或多余输入：${args[index]}。使用 --help 查看用法。`);
    } else {
      input = args[index];
    }
  }
  if (!input) throw new Error('缺少 GSC 导出 CSV。使用 --help 查看用法。');
  const sourcePath = resolve(input);
  const bytes = await readFile(sourcePath);
  let csv;
  try {
    csv = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('输入文件不是有效 UTF-8，请重新导出或转换为 UTF-8 CSV。');
  }
  const report = analyzeCsv(csv, sourcePath);
  report.source.sha256 = createHash('sha256').update(bytes).digest('hex');
  report.generatedAt = new Date().toISOString();
  const directory = resolve(outputDir);
  const stem = basename(sourcePath).replace(/\.csv$/i, '') + '-opportunities';
  const csvPath = join(directory, stem + '.csv');
  const jsonPath = join(directory, stem + '.json');
  if ([csvPath, jsonPath].includes(sourcePath)) throw new Error('输出文件不能覆盖原始导出文件。');
  await mkdir(directory, { recursive: true });
  let csvCreated = false;
  try {
    await writeFile(csvPath, reportToCsv(report), { encoding: 'utf8', flag: 'wx' });
    csvCreated = true;
    await writeFile(jsonPath, JSON.stringify(report, null, 2) + '\n', { encoding: 'utf8', flag: 'wx' });
  } catch (error) {
    if (csvCreated) await unlink(csvPath);
    if (error.code === 'EEXIST') throw new Error('输出报告已存在，为保留来源和历史结果，请用 --output-dir 指定新的目录。');
    throw error;
  }
  console.log(report.inputRows === 0 ? 'CSV 只有表头，没有数据行；已生成空报告。' : report.resultCount === 0 ? `已检查 ${report.inputRows} 行；没有符合排名 8–20 且展示次数 >100 的查询，已生成空报告。` : `已检查 ${report.inputRows} 行，筛出 ${report.resultCount} 个机会词。`);
  if (report.opportunities.some((item) => !item.page)) console.log(PAGE_CHECK + '；报告未填入推测页面。');
  console.log(`${SCOPE_NOTE}\nCSV：${csvPath}\nJSON：${jsonPath}\n来源保留：${sourcePath}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main().catch((error) => {
    console.error(`GSC 机会词分析失败：${error.message}`);
    process.exitCode = 1;
  });
}
