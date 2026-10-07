# WEIERYANG 独立站交接说明

更新日期：2026-10-07（北京时间；旧发布记录见历史章节）

## 最新发布：2026-10-07 两日优化已推送上线

用户本轮明确授权推送。此前 10 月 6–7 日的本地优化现已发布至 `weieryang/weieryangart` 的 `main`，正式提交为 `372025299a27c54c08b5db6a96fa9132fdca574d`，前一提交为 `55cbb830ef08e4dd668a140cbf6a48eadd98e189`。发布通过现有 GitHub 连接完成，不需要迁移凭据或本地 Token；使用原树作为基底，仅更新 59 个静态文件，零删除，现有 `.github/workflows/deploy-pages.yml` 的 blob 保持 `98f34303f3c899d1050098efcc71cc8eb4b21163`。未上传历史内部素材清单的本地改写、QA 模拟脚本、私有资料或广告运行目录。

两个 Pages 任务均已成功：
- `https://github.com/weieryang/weieryangart/actions/runs/37599987912`
- `https://github.com/weieryang/weieryangart/actions/runs/37599986956`

正式目录：`https://weieryangart.com/sculptures/`。四个详情、酒店服务、完整询盘、共享导航、FAQ/SEO 和安全事件归因包含本轮全部网站优化。源码同步到既有 `codex/hotel-seo-geo`，保留与静态生产分支分离的流程。下方“尚未上线”是各轮完成当时的历史状态，由本节覆盖；后续须读取 `qa/2026-10-07-deploy/` 的发布记录与生产验收结果。

生产浏览器已确认新目录与四图加载、方案短表单、空表单五项反馈与首错聚焦、390px 无横向溢出；未填客户资料、未操作验证码、未提交真实询盘。真实投递/收件箱、带附件到件及 GA4/Meta 平台收件仍需单独验收；本轮未改 Worker、安装 Pixel 或投放广告。

## 最新本地补充：2026-10-07 雕塑系列与 Facebook 询盘入口

本节优先于下方历史记录。用户确认「9.22小红薯雕塑素材」为自有或已获公开展示授权，本轮从 150 张原图及既有施工照片中整理首批 **4 个定制方向**。源码和 `dist/` 已更新，**尚未上线、未创建广告、未向 Meta 发送测试线索、未发送真实询盘邮件**。素材公开展示授权不等同于逐件作品作者身份、复制权、竣工状态或实物规格证明。

### 新增入口

- `/sculptures/`：定制雕塑系列目录，首页、共享导航和页脚可进入。
- `/sculptures/mirror-lobby-sculpture/`：镜面大堂 / 水景方向。
- `/sculptures/vertical-atrium-sculpture/`：多层中庭竖向方向。
- `/sculptures/tree-canopy-sculpture/`：入口树形 / 伞冠方向。
- `/sculptures/bird-landmark-sculpture/`：飞鸟不锈钢地标方向。

前三组保持商业/景观参考标签；飞鸟使用已核实的中东公共场地施工记录。各图完整展示，明确树形与伞冠是不同参考作品，不编写固定尺寸、价格、库存、美国酒店竣工案例或使用寿命。`src/sculptureCatalog.js` 统一英文内容与图片事实，`src/sculptureCatalogCopy.js` 提供六语可见文案；静态 SEO 使用同一英文源。

### 询盘与测量

详情页的短表单只有姓名、公司、工作邮箱、场地和项目需求五项；项目类型由登记方向自动确定，保留完整简报和图纸附件入口。完整简报与四个方向各自保存草稿，产品类别、隐藏字段、附件和成功状态不会跨方向恢复。短表单复用既有 Worker / Turnstile / 严格成功回执，不增加第二套发信路径。

`interestRoute` 随询盘传入登记方向，`source` 使用对应详情页路径且移除查询参数；备用邮件和手动复制也包含静态方向、ID 与正式 canonical 来源。六语项目类型统一成相同顺序的八项，避免阿语等类别错配。产品查看、打开询盘和开始填表属于意向；仅服务确认有效 `WY-YYYYMMDD-XXXXXXXX` 编号和 `notifications.email === true` 后记录 `generate_lead`，包含固定产品 slug 和项目类型枚举，不包含表单个人内容或原始查询参数。

Meta 接线草案保存在 `.claude-ads/runs/20261007-sculpture-catalog-local/meta-lead-mapping.json`。**没有安装新的 Meta Pixel，也没有配置 CAPI / CRM / Meta Catalog / Shops。** 仍需用户提供公开数字 Pixel/Dataset ID、确定隐私同意路由、上线并在 Events Manager 和最终收件箱完成真实验收。不能从本地 dataLayer 或现有 GTM 代码推断平台收件成功或广告账号成熟度。

投放链接可按此模板准备（本轮页面尚未上线，不应先投放）：
`https://weieryangart.com/sculptures/mirror-lobby-sculpture/?utm_source=facebook&utm_medium=cpc&utm_campaign=2026q4-us-hospitality&utm_content=mirror-lobby`

### 验证与本地查看

- Node 测试 **65/65 通过**；新增内容、草稿、类别、URL/事件边界和假邮件 Worker 契约验证，没有真实网络邮件。
- 生产构建通过；**42 条 Sitemap 路由、19 个 React 页面**通过校验，全站纯 HTML 两次点击内可达，无孤立页；新目录/详情静态内容、图片、FAQ/Schema 和内链一致。详情使用 Service/WebPage/ImageObject/Breadcrumb，无虚构 Offer/价格/评分。
- 本地模拟浏览器：连续两次点击只产生一个请求和一个成功事件；无安全令牌零请求；503 不记成功且刷新保留草稿；两个方向与完整简报草稿隔离。来源、方向、类别及零附件均已核对。
- 六语手机 390px 均无横向溢出；阿语 RTL 和德语长词 320px 复查通过。手机询价锚点直接进入表单，保留整图比例。
- 本地正常预览 `http://127.0.0.1:4173/sculptures/`；4181 是禁止外部发送的模拟 QA 服务，绝不能部署其注入脚本。
- 证据、日志和截图：`qa/2026-10-07-collection/`；素材盘点与接线草案：`.claude-ads/runs/20261007-sculpture-catalog-local/`。

## 最新本地补充：2026-10-07 流量手册落地优化

本节优先于下方历史记录。本轮参考用户提供的《独立站建站后快速起流量实操手册(16).html》，改动已保存到本地源码和 `dist/`，**尚未部署**。手册作为建议材料，不构成发布、发信、广告投放或开通第三方服务的授权。

### 已落实到网站

- `/resort-sculpture/` 首段直接说明服务对象、可交付内容和责任范围；增加大堂/水景、多层中庭、酒店入口、户外/泳池四场景比较，分别说明优先审查项、协调团队和对应指南。再串联材料比较、报价范围、入口尺度、出口包装、海外安装和真实施工记录六类采购资料。既有采购章节标题改为客户实际问题。
- 新增 `hospitalityPlanning` 共同内容源，React 与静态 HTML 使用相同表格、文字和链接；手机逐行展示，桌面保留四列表格。所有 37 条 Sitemap 路由都能从首页纯 HTML 链接两次点击内到达，原 `/faq/` 孤立页已修复。
- 12 个主要页面的可见 FAQ、静态 FAQ 和 JSON-LD 改为共同来源；删除 `/faq/` 重复的 FAQPage 节点。共享静态导航/页脚集中到 `scripts/static-frame.mjs`，保留 React 启动时隐藏静态备用内容的行为。
- 询盘字段前加入真实中东飞鸟施工照片、证据链接和六语说明；提交按钮前说明订购前需要书面确认材料、审批、交付和当地安装责任。明确施工阶段照片的边界；发送成功后也可继续查看施工记录。没有补写未经证实的客户、评价、价格、工期或证书。
- 修复 React 次级页面载入时的章节定位：初次原生锚点可能早于内容渲染，现于渲染提交后的动画帧定位；选型章节与施工证据标题留出固定导航间距，非法编码 hash 安全忽略。
- 延续严肃项目简报及已有必填事实，不照搬手册的统一字段数量或 30 分钟回复承诺；现有页面仍采用已知的 1 个工作日首次评估目标。

### 渠道归因与使用规范

`src/attribution.js` 是 React 与静态页统计的共同校验模块，构建时复制到 `dist/attribution.js`。长广告 URL 的询盘 `source` 归一到本站 `/commission/`，无效或超长归因值丢弃，旧 session 数据重新校验，避免触发表单服务的长度拒绝。

自定义事件只使用登记的来源/campaign、固定项目类型 ID 和无查询参数的页面路径；不把自由填写的项目类型或原始 URL 查询参数送进自定义 dataLayer 事件。邮件、电话和 WhatsApp 点击属于联系意向，`generate_lead` 仍仅在服务确认邮件发送并返回有效编号后触发。兼容 `/commission`、`/commission/`、`/commission/index.html`，外站同名路径不会记作本站询盘入口。

- 来源：`whatsapp`、`email-sig`、`cold-email`、`catalog-pdf`、`alibaba`、`tradeshow`、`parcel-insert`、`linkedin`、`youtube`、`reddit`；兼容 `google`、`bing`、`facebook`、`instagram`、`meta`。
- 已登记 campaign：`always-on`、`2026q4-us-hospitality`、`us-hotel`。新活动先在共同模块登记，再制作链接；未知 campaign 不进入自定义统计。
- 自然分发采用 `utm_medium=referral`，付费链接采用 `cpc`；现有 `email`/`social`/`organic`/`paid-social`/`paid_social` 仍兼容。参数不放姓名、邮箱、手机号或客户项目编号。
- 可用链接示例：`https://weieryangart.com/resort-sculpture/?utm_source=linkedin&utm_medium=referral&utm_campaign=2026q4-us-hospitality`；邮件签名可将 source 换成 `email-sig`、campaign 换成 `always-on`。这些只是模板，本轮未向任何平台发布。

上述校验覆盖本站自定义事件。GTM 容器内自动 `page_view` 的 `page_location` 查询参数处理、GA4 DebugView 收件和 key event 设置仍需账号内验收，不能由源码检查推定已完成。

### 按真实搜索数据继续迭代

已新增 `scripts/gsc-opportunities.mjs` 和 `npm run growth:gsc`，无新增依赖。读取 UTF-8 GSC CSV，支持中英文列名、百分数、千位逗号和带引号换行；筛选平均排名 **8–20** 且展示次数 **>100**，按展示降序生成本地 CSV/JSON，并记录来源行号、原文件路径和 SHA-256。源文件和历史报告不会覆盖。CSV 文本公式前缀做安全处理，JSON 保留原值。缺少 Page 列时明确要求查询与页面联合导出，不推测落地页。

```sh
npm run growth:gsc -- '/绝对路径/Queries.csv' --output-dir qa/growth/2026-10-07
```

每周导出同一国家、设备、搜索类型和日期窗口的数据，先对清单中的查询确认真实落地页，再按意图改善标题、首段答案、证据和相关链接。保留导出筛选条件，使用相同条件复测点击、展示、CTR、位置及询盘漏斗。本轮没有 GSC 实际导出，因此没有生成假机会词或排名报告。

AI 检查可以另建固定买家问题清单，按相同平台/模式记录日期、回答截图、是否提及品牌、是否引用实际 URL；品牌提及与来源引用分别统计。本轮未运行外部平台批量查询，也未声明 AI 可见度增长。

手册中的效果承诺不作为验收指标。Google 已于 2026 年 5 月停止显示 FAQ 富结果，保留真实 FAQ 的目的在于回答客户问题及保持内容一致，不能承诺富结果或排名收益：[Google 更新记录](https://developers.google.com/search/updates)。IndexNow 的接收也不保证抓取或索引：[Bing 说明](https://www2.bing.com/indexnow/getstarted)；本轮未对尚未上线的页面提交 IndexNow。

### 验证和边界

`npm run build`、`npm test`（52 项）、`npm run test:site` 全部通过。站点检查覆盖 37 路由、143 个 WebP 引用、37 个 JSON-LD 块、14 个实际 React 路由、12 个路由的 FAQ/Schema/相关链接一致性，以及酒店比较内容和询盘证据的双端一致性。

实际浏览器检查 1280px 桌面、390px 手机比较内容与指南跳转、六语言询盘证据、320px 阿语 RTL，无横向页面溢出。截图与测试日志保存在 `qa/2026-10-07/`；本轮没有发送真实询盘。生产收件、GTM/GA4 收件、搜索收录和 Core Web Vitals 仍需实际验收。未改 Worker、未安装新追踪服务、未投放广告或发送外联消息。

本地预览：`http://127.0.0.1:4173/resort-sculpture/`。系统 Node 不在 PATH 时继续使用随附运行时 `/Users/chan/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`；锁文件和依赖版本未变。

## 最新本地补充：2026-10-06 迁移核验与询盘体验优化

本节描述新电脑上的本地工作，**尚未发布到线上**。原迁移 ZIP 保留不变；包内旧部署提交、旧电脑路径、搜索收录及邮箱送达记录均为历史信息。

- 解压到 `/Users/chan/Desktop/威尔阳项目/雕塑/`，迁移清单 1,582 个文件逐项通过字节数与 SHA-256 核验；ZIP 共 1,583 个条目，包含清单本身。两个站点均已解压；本轮仅运行和修改 `weieryangart/`，包装站未改动。Git 历史未随包迁移。
- 使用桌面应用随附 Node.js v24.19.0，通过 `npm ci` 按原锁文件恢复依赖。系统 PATH 中没有 Node/npm，调用的是随附运行时和临时 npm；未更换锁文件或升级项目依赖。
- `/commission/` 增加六语逐字段反馈、`aria-invalid`/关联错误说明、首个错误在渲染后居中定位；输入长度与已有 Worker 一致，电话使用 tel 输入。无效旧草稿类型不再造成 `.trim()` 崩溃，已选旧版项目值保留。
- 提交使用同步锁及禁用字段组防止连点或发送中改写；成功后禁用重复发送，修改表单可开始新简报。请求包含响应体读取在内最多等待 120 秒，超时取消浏览器请求；不会自动重试。失败/不完整响应不清除草稿，也不触发成功事件。仅收到有效项目编号和 `notifications.email === true` 后确认成功；不能据此声称收件箱实际到件。
- 安全验证切换语言时清除旧令牌，每次请求完成后重置。未验证时明确提示如何完成验证或使用邮件草稿/WhatsApp。网络结果不明时提示先与工作室确认，避免重复发送。
- 附件入口提供可见键盘焦点、关联数量/单个/总计大小错误提示；文件不会通过 localStorage 跨刷新恢复。
- 手机菜单增加 dialog 语义、背景 inert、首个控制焦点、Tab/Shift+Tab 循环、Esc 关闭与焦点返回，以及短屏内部滚动。桌面断点恢复时关闭菜单，避免背景仍被锁住。
- 保留已有首页、获批 v3 日景/蓝调/夜景、酒店参考与中东施工证据的事实界限；Worker 服务、GTM 配置和正式网站未改动。

验证：`npm run build`、`npm test`（31 项，其中 6 项新增）、`npm run test:site`（37 条路由、23 套静态导航/页脚、142 个 WebP 引用、37 个 JSON-LD 块和 4 个 React 路由）通过。真实内置浏览器检查六种语言、390px 手机、320px 阿语 RTL、键盘菜单循环/关闭、错误定位、草稿恢复；本地模拟带一张附件连点提交只产生 1 次请求，发送期间字段锁定，成功后重复发送禁用，503 后解锁并保留草稿，未验证时请求数为 0。

浏览器截图及语言记录在 `qa/2026-10-06/`。模拟成功截图带有 LOCAL QA 标记，**没有发送真实邮件**。`scripts/serve-inquiry-qa.py` 仅绑定回环地址 4181、临时注入模拟服务并阻止外部连接，勿用于生产；它不修改 `dist/`，也不进入发布产物。普通本地预览使用 4173。

后续仍需核验真实带附件邮件到件、生产 Turnstile、Search Console/GA4 数据与实际 Core Web Vitals。本轮没有相应账号数据，未将模拟检查当作线上验收。

## 最新补充：2026-09-30 首页酒店工程展示与 Hero 流畅度

本节优先于下面的美国酒店优化记录，正式发布提交 `55cbb830ef08e4dd668a140cbf6a48eadd98e189`，前一版本 `eeba446e74c65592f6fdb55bb9be84039c35a27a`。本轮静态发布更新 24 个文件，不删除历史资源或 Pages 工作流。

- 首页 `/#cases` 改为大堂/水景、中庭、入口/景观三类酒店工程应用研究，排在通用项目分类之前。使用完整画幅、深色展廊和轻微悬浮效果；手机单列、阿语 RTL、六语言文案及减少动态效果均有对应实现。
- 新单图 WebP：`IMG_5190.JPG` → `hotel-lobby-whale-spatial-reference.webp`，`IMG_5175.JPG` → `hotel-arrival-metal-tree-reference.webp`，并生成 640/960 宽度版本。沿用一张中庭参考，真实中东飞鸟施工证据缩为独立入口。所有商业空间图均标明参考用途，不写成已完工酒店案例。
- `src/hotelCases.js` 同时提供 React 展示、英语静态内容和图片元数据。更新首页图片 Sitemap；链接已有大堂、中庭和入口指南，不新增重复页面。
- 保留原 v3 日景/蓝调/夜景。首屏仅优先加载夜景，闲时或点击时准备其他画面，等待解码后使用 Web Animations API 逐层过渡；旧画面保持不透明，防止双重淡出造成暗闪。支持网络失败重试、连续点击锁定、卸载取消，以及减少动态效果的直接切换。
- 环境绘制在手机/粗指针、减少动态效果、节省流量、离开首屏、后台和切换期间停止；不再仅用 CSS 隐藏手机雨效但让其持续绘制。首屏四个分类入口改为实际页面链接。
- 移除首页旧案例的 GSAP/ScrollTrigger 导入，保留包依赖以避免无关锁文件改动。主 JS 从 462,753 降至 363,505 字节，按同一 Node gzip 方法从 152,418 降至 115,050 字节；这是构建体积对比，不是实测 FPS 或 Core Web Vitals。
- 修复响应式图片脚本遗漏 Vite 相对路径的问题。完整构建现在为 35 张源图处理响应式尺寸，140 个 HTML 图片标签带响应式属性；验证器额外检查 React 实际引用的所有 `/seo-media/` 原图和 srcset 目标。
- 测试：25 项单元测试通过（含新增 10 项 Hero 回归）；37 条 Sitemap 路由、37 个 JSON-LD 块、142 个 WebP 图片引用、4 个 React 路由及六语言案例模块通过源码/构建检查。`http://127.0.0.1:4173/` 返回 200 且包含新版资源。
- 验证限制：内置浏览器仍因服务组件缺失无法连接，未完成真实浏览器的视觉、帧率和移动设备实测。未提交真实询盘，未改 Worker 或统计配置。
- 上线核对：两条 Pages 工作流均对本轮提交成功，Pages build 状态为 built；正式首页、新 JS/CSS 及两张新图的原图/640/960 版本全部返回 200，下载内容 SHA-256 与本地产物一致。首页 IndexNow 提交返回 200，仅代表接收，不代表已收录或排名提升。

## 最新补充：2026-09-30 美国酒店客户优化

以下记录优先于后文的 9 月 20 日历史快照。

- 当前源码目录：`D:\雕塑独立站素材\weieryangart`；源码备份分支 `codex/hotel-seo-geo`，正式静态产物仍发布到 `main`，不要混用两条分支。
- 本轮正式发布提交：`eeba446e74c65592f6fdb55bb9be84039c35a27a`，前一版本 `e94914b7cec8bd2b0554e13092f16914ef8fa7fa`。沿用 GitHub Pages 流程，仅更新 104 个文件，不删除原有资源或工作流。
- 用户已将主要获客地区调整为美国，优先面向酒店/度假村业主、开发商、室内设计师、艺术顾问和采购团队。保留国际项目证据的真实地域，不杜撰美国办公室、当地制作、客户案例或安装团队。
- 首页与导航增加酒店服务入口；保留批准的 v3 三态 Hero，夜景图片与 HTML 预加载使用同一 URL，避免重复下载同一文件。
- `/resort-sculpture/` 是唯一酒店服务主入口，新增美国项目团队、样板与审批、运输收货、当地安装责任、材料和证据说明。`src/hospitalityContent.js` 为酒店可见内容、静态内容和 FAQ 结构化数据的共同来源。
- `/custom-outdoor-sculpture-supplier/#us-procurement` 增加供应商比较矩阵；大堂、中庭指南和 Insights 索引接入酒店服务/采购路径。没有新增重复的城市着陆页或泛酒店文章。
- 询盘增加酒店大堂/中庭、度假村入口/景观选项；英语表单接受英制和公制，电话示例改为 +1，地点提示包含城市/州/国家。旧草稿与切换语言后已选值继续显示，表单必填项和 Worker 接口保持不变。
- 参考页标题和项目页说明进一步区分商业中庭参考与已验证的中东飞鸟施工记录；不把参考图标成 WEIERYANG 酒店作品。
- 新增 `/privacy/`，描述当前浏览器草稿、邮件附件、统计与供应商处理流程，并在询盘和页脚提供入口。它是技术流程说明，不是隐私合规认证；正式广告投放前仍需站主/合规人员确认运营主体、邮箱留存周期、数据权利和同意流程。
- 构建中的 `scripts/enhance-static-pages.mjs` 统一 23 个静态页面的导航/页脚，为 32 张原图生成 62 张 640/960 像素 WebP 衍生图，并为 96 个 HTML 图片添加响应式属性。原图不删除；参考图完整显示，保留原有悬浮和减少动态效果支持。
- QA：`node scripts/verify-us-hospitality.mjs` 验证 37 条 Sitemap 路由、37 个 JSON-LD 块、143 个 WebP 图片引用、静态链接、4 个实际 React 路由渲染，以及酒店 FAQ 与 Schema 的一致性。`node --test worker/inquiries.test.mjs src/inquiryEmail.test.js src/analyticsEvents.test.js` 共 15 项通过。这些不是实际浏览器或真实收件箱测试。
- 本轮浏览器连接因服务组件缺失未恢复，移动端视觉/交互和 Core Web Vitals 待实测；没有发送真实测试询盘，没有改动 Worker、GTM 配置或安装广告像素。GA4 收件与 Search Console 的美国查询/收录数据尚未验证。
- 发布前使用 `scripts/deploy-dist-git-data.ps1 -DryRun`。源码备份可用 `scripts/backup-source-git-data.ps1`，必须提供本地变更基准及预期远端源码提交，且禁止指向 `main`。

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
