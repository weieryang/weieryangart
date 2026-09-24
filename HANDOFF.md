# WEIERYANG 独立站交接说明

更新日期：2026-09-20（北京时间）

## 1. 项目与仓库

- 正式网站：https://weieryangart.com/
- GitHub 发布仓库：https://github.com/weieryang/weieryangart
- 发布分支：`main`
- 当前已发布提交：`ae77dd0bca43e6cb8c6258f401ae7eacc53c45cf`（2026-09-19，两条 GitHub Pages 部署流程均成功）
- 本地开发目录：`C:\Users\Administrator\Desktop\雕塑独立站`
- Cloudflare 表单 Worker：`https://weieryang-inquiries.tangkelian.workers.dev/inquiries`

**重要：GitHub 仓库目前主要保存 `dist` 的静态发布产物，不是完整开发源码的可靠备份。** 本地项目含 `src/`、`scripts/`、`worker/`、`public/`、构建配置和未提交资源；本地 `git rev-parse HEAD` 为 `41e1a96d155dd227a99b17b7341dce8efabbc414`，与线上发布 SHA 不同。工作区有大量已修改和未跟踪文件，不能用 `git reset --hard`、`git checkout --` 或用远端覆盖本地。后续应先整理源码备份与版本管理，再考虑迁移部署架构。

## 2. 当前架构

- 当前正式发布链路：Vite/React 前端 + 多个静态 HTML 页面，`npm run build` 生成 `dist/`，GitHub Pages 工作流 `.github/workflows/deploy-pages.yml` 发布仓库根目录。
- `scripts/generate-seo-pages.mjs` 生成主要路由的静态 HTML、元数据及 Sitemap；`public/insights/` 保存独立的长文静态页；`scripts/inject-analytics.mjs` 在构建后注入 GTM。
- `scripts/deploy-dist-git-data.ps1` 比较本地 `dist/` 与 GitHub `main`，只上传变化文件，保留 Pages 工作流及仓库已有文件。**不要直接用普通 `git push` 推送整个脏工作区作为网站发布。**
- Cloudflare Worker 源码和测试在 `worker/inquiries.mjs`、`worker/inquiries.test.mjs`；配置在 `worker/wrangler.inquiries.jsonc`。
- 项目安装了 Next.js/相关实验文件，但正式网站不是 Next.js 部署。是否迁移 Next.js 应以实际性能、内容维护和部署成本为依据，不能为 SEO 单独重做首页。主页已批准的 v3 日/蓝调/夜景 Hero 和布局要保留。

## 3. 已上线工作

- 品牌定位：面向酒店、地产、景观与公共空间的高端定制雕塑；设计、结构、制作、出口包装与海外安装指导为核心能力。英语为主，网站界面支持阿拉伯语（RTL）、中文、法语、西语、德语。
- 首页与主要雕塑/材料/工艺/项目页面已加入可见的采购决策内容、Insights 入口、内链、统一导航与询盘路径。长表单在 `/commission/`，不占据首页首屏。
- 以用户授权的中东飞鸟项目施工照片作为**施工阶段证据**；不将概念图或施工照冒充已竣工客户案例。重要内容包含中东大型不锈钢地标项目、304 vs 316L、报价范围、基础锚固、出口包装、维护、安装等采购指南。
- 2026-09-19 发布 `/insights/large-outdoor-sculpture-cost-guide/`：直接回答成本问题、九项成本驱动因素、图文证据、FAQ、询盘入口；已接入首页 Buyer Guides、Insights、内链、`llms.txt`、标准及图片 Sitemap。没有编造价格区间。
- 页面已具备独立 title/description/canonical、OG/Twitter、面包屑及适用的 Article/FAQ/ImageObject 结构化数据；有 `robots.txt`、`sitemap.xml`、`image-sitemap.xml`、IndexNow。2026-09-19 IndexNow 接受 4 个变更 URL（HTTP 200），**这不等于 Google 已收录或已产生自然流量**。
- GTM 容器 `GTM-NV6T388X`，GA4 衡量 ID `G-V9XC0TRFD3`。前端记录首访来源、`utm_source`、`utm_medium`、`utm_campaign`、`utm_id`、`utm_content`、`utm_term`、`fbclid`；表单有 `commission_view`、`commission_form_start`、成功时 `generate_lead` 的 dataLayer 事件。尚未安装 Meta Pixel，不能宣称 Facebook 转化追踪已经打通。
- `/commission/` 通过 Turnstile、限流后发送邮件到 `tangkelian@weieryang.com`，最多 5 个附件，单个 10 MB、总计 15 MB；失败时保留草稿和 mailto/WhatsApp 手动跟进。Worker 最新已知版本 `2ccaa5ee-2807-4ce1-bb3b-247f61c113eb`。**无 D1/R2 持久存储、无自动 WhatsApp 通知**。

## 4. 尚未完成或尚待核验

1. 用 Google Search Console 看真实索引、查询、曝光、点击和页面体验；尤其核实新增指南是否被 Google 收录。IndexNow 只说明请求被接收。
2. 询盘链路曾完成无附件真实提交（参考号 `WY-20260914-F4E701C2`），但带附件的线上送达和最终收件箱确认仍待完成。不要用测试成功替代实际业务邮件验证。
3. Meta Pixel/Dataset ID 尚未提供；隐私政策、Cookie/同意机制及面向欧盟或英国投放的要求也未定。完成这些之后再在 GTM 接入 Pixel，验证 `Lead` 事件只在 Worker 成功响应后触发，并避免发送表单个人信息。
4. WhatsApp 目前是用户点击后的手动跟进，不是自动通知。若确需自动通知，应先确认官方 WhatsApp Business API、成本、模板和合规方案。
5. 更多已获公开授权的项目完成照、材料样板、生产记录、参数和客户评价尚缺。新页面不得杜撰客户、尺寸、价格、证书或竣工状态。
6. 本地源码/资源和发布仓库尚未形成清晰的同一套版本管理。先做非破坏性的备份与盘点，再设计源码仓库或分支迁移；避免把大批生成文件和临时资源直接推到生产。

## 5. 后续目标（优先级）

1. **测量基线**：连接/检查 Search Console 与 GA4，按国家、查询、落地页和询盘事件建立每周报表；先识别已获曝光但 CTR 低、排名 8-20 的页面，再优化标题、首段和内链。
2. **高意向自然流量**：根据真实查询与业务能力完善酒店入口雕塑、定制不锈钢地标、户外雕塑供应商等服务页；每页回答采购决策与交付边界，连到真实案例和 `/commission/`。避免每天批量产出重复的 AI 文章。
3. **信任证据**：在授权范围内补充更多真实完工/施工、样板、图纸及明确的项目背景；继续清楚区分已验证施工证据和概念研究。
4. **询盘转化**：验证附件和邮箱收件；对移动端长表单做真实用户测试，分析 `commission_view` → `commission_form_start` → `generate_lead` 的流失点，优化字段和错误提示，但保持严肃项目筛选。
5. **Facebook 广告准备**：取得 Meta Pixel/Dataset ID，确定隐私和同意路径，接入并测试 Lead 转化；再设计与广告承诺一致的落地页及 UTM 规范。广告流量不应直接套用没有核验的 SEO 流量预测。
6. **技术稳定性**：审查静态页面与 React 页面的一致性、失效链接、图片加载、移动端 RTL、多语言表单、LCP/CLS；在不改变已批准 Hero 的前提下优化。

## 6. 接手操作清单

```powershell
cd 'C:\Users\Administrator\Desktop\雕塑独立站'
git status --short
git ls-remote github refs/heads/main
npm run build
node --test worker/inquiries.test.mjs src/inquiryEmail.test.js
npm run preview -- --port 4173
```

开发改动前阅读 `AGENTS.md`。本地预览由接手人启动并在浏览器检查桌面和移动端。发布前先运行 `./scripts/deploy-dist-git-data.ps1 -DryRun`，确认变更路径不包含误删或不相关内容。发布需要对 `weieryang/weieryangart` 有写权限的 GitHub 账号；不要把 Token、Turnstile secret 或邮箱凭据写入仓库。发布后检查 GitHub Pages 工作流、线上新路由、canonical、图片与 Sitemap，并只对实际改动 URL 运行 `npm run indexnow -- <url...>`。

关键入口：`src/App.jsx`（站点与表单）、`src/content.js`（六语文案）、`src/seoContent.js`（次级页面内容）、`scripts/generate-seo-pages.mjs`（静态 SEO）、`public/insights/`（长文）、`public/analytics-events.js`（归因）、`worker/inquiries.mjs`（邮件投递）。

## 7. 交接压缩包

同目录的 `weieryangart-handoff-2026-09-20.zip` 包含本文件、开发源码、站点静态页面、图片/视频资源、构建与部署脚本、Worker 源码和配置、测试、依赖清单，以及本地 `dist/` 发布产物。它是 **2026-09-20 本地工作区快照**，包含当时尚未提交的改动；`dist/` 也可能与 GitHub 当前发布提交不完全一致。压缩包不含 Git 历史、`node_modules/`、本地缓存、日志或任何部署密钥。接手后先运行 `npm ci`，不要把压缩包直接作为线上发布版本。
