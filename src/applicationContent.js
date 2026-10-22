// Application-based navigation approved by the operator on 2026-10-22.
// A proposed application does not establish where a photographed work was installed.
// Existing fabrication, construction and authorized-reference boundaries are retained.
import { getWorkshopImage } from './workshopEvidence.js';

const categoryDefinitions = [
  {
    id: 'hospitality', path: '/resort-sculpture/',
    metaTitle: 'Hotel & Commercial Space Sculpture | WEIERYANG',
    metaDescription: 'Custom sculpture for hotel lobbies, resort arrivals, atriums and shared commercial spaces. Review visual references, site requirements and fabrication evidence.',
    gallery: [
      { key: 'lobby', file: 'hotel-lobby-whale-spatial-reference.webp', width: 1080, height: 1440, evidenceType: 'reference' },
      { key: 'atrium', file: 'hotel-atrium-sculpture-multilevel-reference.webp', width: 1200, height: 1600, evidenceType: 'reference' },
    ],
    relatedPaths: ['/sculptures/mirror-lobby-sculpture/', '/sculptures/vertical-atrium-sculpture/', '/insights/hotel-arrival-sculpture-site-brief/'],
  },
  {
    id: 'retail', path: '/retail-restaurant-sculpture/',
    metaTitle: 'Retail & Restaurant Sculpture | WEIERYANG',
    metaDescription: 'Plan custom sculpture for restaurants, cafes, flagship stores and retail interiors. Review brand artwork, customer routes, finishes and installation requirements.',
    gallery: [
      { workshopId: 'handsOverview', evidenceType: 'fabrication' },
      { workshopId: 'whaleOverview', evidenceType: 'fabrication' },
    ],
    relatedPaths: ['/process/#workshop-records', '/insights/outdoor-sculpture-quotation-scope-checklist/#rfq-template', '/materials/'],
  },
  {
    id: 'themed', path: '/themed-art-installations/',
    metaTitle: 'Themed Attractions & Character Art Installations | WEIERYANG',
    metaDescription: 'Custom themed sculpture for visitor destinations, cultural streets and character-led spaces. Define artwork rights, viewing routes, finish approvals and fabrication scope.',
    gallery: [
      { workshopId: 'portraitOverview', evidenceType: 'fabrication' },
      { workshopId: 'portraitSurface', evidenceType: 'fabrication' },
    ],
    relatedPaths: ['/process/#workshop-records', '/custom-sculpture/', '/insights/large-stainless-steel-sculpture-fabrication-checklist/'],
  },
  {
    id: 'public', path: '/landscape-public-art/',
    metaTitle: 'Landscape Sculpture & Public Art | WEIERYANG',
    metaDescription: 'Plan sculpture for civic plazas, parks and public landscapes. Review verified construction records, site exposure, structural coordination and installation responsibilities.',
    gallery: [
      { key: 'bird', file: 'middle-east-stainless-steel-landmark-installation.webp', width: 2000, height: 1398, evidenceType: 'construction' },
      { key: 'assembly', file: 'large-sculpture-structural-assembly.webp', width: 2000, height: 1219, evidenceType: 'construction' },
    ],
    relatedPaths: ['/sculptures/bird-landmark-sculpture/', '/sculptures/tree-canopy-sculpture/', '/insights/middle-east-stainless-steel-landmark-sculpture/'],
  },
];

export const applicationUi = {
  en: {
    nav: 'Applications', eyebrow: 'Sculpture for your project', indexTitle: 'Start with the space you are shaping.',
    indexIntro: 'Explore four project settings. Choose your application, review the image evidence and discuss the requirements of your own site.',
    explore: 'Explore this application', allApplications: 'All applications', buyerHeading: 'Start with your project', scopeHeading: 'Agree the scope', galleryHeading: 'Images and evidence', relatedHeading: 'Continue your project review', faqHeading: 'Before you commission',
    briefHeading: 'Tell us about your space.', briefBody: 'Share the project location, intended placement, drawings or dimensions, artwork and installation requirements. The proposal will define the design, fabrication and delivery scope.', briefAction: 'Share your project brief', otherApplications: 'Explore other applications', referenceLabel: 'Authorized visual reference', fabricationLabel: 'WEIERYANG fabrication record', constructionLabel: 'Verified construction record',
  },
  zh: {
    nav: '应用场景', eyebrow: '从您的项目出发', indexTitle: '先找到您的空间，再讨论雕塑。',
    indexIntro: '四类项目入口。选择应用场景、查看图片证据，再讨论您自己场地的具体要求。',
    explore: '查看这一应用场景', allApplications: '全部应用场景', buyerHeading: '从项目需求开始', scopeHeading: '明确项目范围', galleryHeading: '图片与证据', relatedHeading: '继续了解项目准备', faqHeading: '委托前的问题',
    briefHeading: '告诉我们您的空间。', briefBody: '提供项目地点、摆放位置、图纸或尺寸、主题图稿及安装要求。设计、制作与交付范围将在方案中确认。', briefAction: '发送项目简报', otherApplications: '查看其他应用场景', referenceLabel: '获授权的视觉参考', fabricationLabel: '威尔阳实际制作记录', constructionLabel: '已核实的施工记录',
  },
  ar: {
    nav: 'مجالات الاستخدام', eyebrow: 'منحوتات لمشروعك', indexTitle: 'ابدأ بالمساحة التي تعمل على تشكيلها.',
    indexIntro: 'استكشف أربعة أنواع من المشاريع. اختر الاستخدام وراجع أدلة الصور ثم ناقش متطلبات موقعك.',
    explore: 'استكشف هذا الاستخدام', allApplications: 'جميع مجالات الاستخدام', buyerHeading: 'ابدأ بمتطلبات مشروعك', scopeHeading: 'اتفقوا على النطاق', galleryHeading: 'الصور والأدلة', relatedHeading: 'تابع مراجعة مشروعك', faqHeading: 'قبل بدء المشروع',
    briefHeading: 'أخبرنا عن مساحتك.', briefBody: 'شارك موقع المشروع وموضع المنحوتة والرسومات أو الأبعاد والعمل الفني ومتطلبات التركيب. يحدد العرض نطاق التصميم والتصنيع والتسليم.', briefAction: 'أرسل موجز مشروعك', otherApplications: 'استكشف استخدامات أخرى', referenceLabel: 'مرجع بصري مصرح بعرضه', fabricationLabel: 'سجل تصنيع WEIERYANG', constructionLabel: 'سجل تنفيذ موثق',
  },
  fr: {
    nav: 'Applications', eyebrow: 'Une sculpture pour votre projet', indexTitle: 'Commencez par le lieu que vous façonnez.',
    indexIntro: 'Découvrez quatre contextes de projet. Choisissez votre application, examinez les images et leurs statuts, puis précisez les besoins de votre site.',
    explore: 'Explorer cette application', allApplications: 'Toutes les applications', buyerHeading: 'Partir de votre projet', scopeHeading: 'Définir le périmètre', galleryHeading: 'Images et éléments documentés', relatedHeading: 'Poursuivre votre étude', faqHeading: 'Avant de commander',
    briefHeading: 'Parlez-nous de votre espace.', briefBody: 'Partagez le lieu, l’emplacement prévu, les plans ou dimensions, le visuel et les exigences de pose. La proposition précisera le périmètre de conception, fabrication et livraison.', briefAction: 'Envoyer votre cahier des charges', otherApplications: 'Découvrir d’autres applications', referenceLabel: 'Référence visuelle autorisée', fabricationLabel: 'Suivi de fabrication WEIERYANG', constructionLabel: 'Suivi de chantier vérifié',
  },
  es: {
    nav: 'Aplicaciones', eyebrow: 'Esculturas para su proyecto', indexTitle: 'Empiece por el espacio que está creando.',
    indexIntro: 'Explore cuatro contextos de proyecto. Elija su aplicación, revise las imágenes y su procedencia, y plantee las necesidades de su ubicación.',
    explore: 'Explorar esta aplicación', allApplications: 'Todas las aplicaciones', buyerHeading: 'Partir de su proyecto', scopeHeading: 'Acordar el alcance', galleryHeading: 'Imágenes y evidencias', relatedHeading: 'Continuar la revisión', faqHeading: 'Antes de encargar',
    briefHeading: 'Háblenos de su espacio.', briefBody: 'Comparta la ubicación, el emplazamiento previsto, planos o dimensiones, el diseño y los requisitos de instalación. La propuesta definirá el alcance del diseño, fabricación y entrega.', briefAction: 'Enviar su resumen de proyecto', otherApplications: 'Explorar otras aplicaciones', referenceLabel: 'Referencia visual autorizada', fabricationLabel: 'Registro de fabricación WEIERYANG', constructionLabel: 'Registro de construcción verificado',
  },
  de: {
    nav: 'Einsatzbereiche', eyebrow: 'Skulpturen für Ihr Projekt', indexTitle: 'Beginnen Sie mit dem Raum, den Sie gestalten.',
    indexIntro: 'Entdecken Sie vier Projektkontexte. Wählen Sie den Einsatzbereich, prüfen Sie die Bildnachweise und besprechen Sie die Anforderungen Ihres Standorts.',
    explore: 'Diesen Einsatzbereich ansehen', allApplications: 'Alle Einsatzbereiche', buyerHeading: 'Mit Ihrem Projekt beginnen', scopeHeading: 'Den Umfang vereinbaren', galleryHeading: 'Bilder und Nachweise', relatedHeading: 'Projektprüfung fortsetzen', faqHeading: 'Vor der Beauftragung',
    briefHeading: 'Erzählen Sie uns von Ihrem Raum.', briefBody: 'Teilen Sie Standort, Aufstellort, Pläne oder Maße, Motiv und Montageanforderungen. Das Angebot definiert den Umfang von Entwurf, Fertigung und Lieferung.', briefAction: 'Projektbeschreibung senden', otherApplications: 'Weitere Einsatzbereiche', referenceLabel: 'Freigegebene visuelle Referenz', fabricationLabel: 'WEIERYANG Fertigungsnachweis', constructionLabel: 'Verifizierter Baunachweis',
  },
};

const copy = {
  en: [
    {
      name: 'Hotels & Commercial Spaces', intro: 'Custom sculpture for hotel lobbies, resort arrivals, atriums, offices and shared commercial areas. Begin with the architecture, visitor routes and the team responsible for approvals.',
      buyerNeeds: ['Hotel owners, developers and interior design teams.', 'Lobby focal points, atrium compositions and arrival landscapes.', 'The whole-building setting, rather than an individual retail unit.'],
      scope: ['Review plans, sightlines, pedestrian clearances and service access before selecting the form.', 'Agree materials, lighting, sample approvals, building interfaces and maintenance access.', 'Define structural review, export packing, freight and local installation responsibilities in the proposal.'],
      evidenceNote: 'The images below are authorized commercial-space references. They support discussion of a new project; they are not presented as completed WEIERYANG hotel commissions.',
      relatedLabels: ['Lobby sculpture direction', 'Atrium sculpture direction', 'Arrival site brief'],
      faq: [['Does a shopping-centre atrium belong here?', 'Yes. A shared atrium or entrance belongs to the building-wide commercial project. A sculpture inside one tenant’s shop belongs under Retail & Dining Spaces.'], ['What should our hotel team send first?', 'Share the intended location, plans or dimensions in feet/inches or metric, site photographs, design direction, destination and access or opening constraints. Approvals and delivery scope are confirmed for the project.']],
    },
    {
      name: 'Retail & Dining Spaces', intro: 'Custom sculpture for restaurants, cafes, bars, retail stores and brand flagships. Develop a recognisable focal point around the venue’s identity, customer circulation and daily operations.',
      buyerNeeds: ['Restaurant operators, retail brands and store designers.', 'Storefront features, interior sculpture and display-zone focal points.', 'A single venue or tenant space, including shops inside larger developments.'],
      scope: ['Provide brand artwork, floor plans, frontage views and customer or staff routes.', 'Review occupied footprint, edges, touch zones, cleaning and any proposed lighting interfaces.', 'Agree finish samples, fixing points, delivery access, local installation and any future relocation requirements.'],
      evidenceNote: 'These are WEIERYANG fabrication-stage photographs. They illustrate form, assembly and surface work; no restaurant installation, retail client or completed venue is asserted.',
      relatedLabels: ['Actual fabrication records', 'Prepare an RFQ scope', 'Compare material considerations'],
      faq: [['Can a mascot or character be made for our store?', 'A character-based project can be reviewed using original artwork or artwork you are authorised to commission. Confirm the permitted use, approved views, colours and fabrication scope before production.'], ['Can you work from an existing shop design?', 'Share the drawings, proposed placement, access dimensions and brand requirements. The new sculpture’s form, material, fixings and finish need project-specific review; a reference photograph is not a fixed specification.']],
    },
    {
      name: 'Tourism & Themed Art Installations', intro: 'Custom sculpture for visitor destinations, cultural streets, themed attractions and character-led spaces. Develop a coherent visual theme alongside visitor routes, viewing distances and the site team’s requirements.',
      buyerNeeds: ['Destination operators, attraction developers and brand project teams.', 'Themed focal points, character forms and related sculpture groups.', 'Projects whose main brief centres on a theme, story or visitor experience.'],
      scope: ['Supply the approved theme, original or properly licensed artwork, views and colour references.', 'Discuss viewing routes, visitor contact, accessibility, clearances and whether the work is decorative or intended for interaction.', 'Record finish approvals, fabrication checkpoints, outdoor exposure and the responsibilities for site works and installation.'],
      evidenceNote: 'The painted portrait images document WEIERYANG fabrication and surface detailing. They are not presented as completed attraction projects or evidence of rights to reproduce a character.',
      relatedLabels: ['Painted fabrication details', 'Custom sculpture process', 'Fabrication review checkpoints'],
      faq: [['How does an IP-themed project differ from a venue category?', 'The primary category follows the project brief. A restaurant mascot stays under Retail & Dining; a destination-wide theme or character-led visitor installation belongs here. Character themes can also be used as cross-category tags.'], ['Does a character sculpture automatically include play or climbing use?', 'No. Decorative display and interactive use have different design requirements. Describe the intended visitor contact before review, and agree the relevant engineering, local safety review and site responsibilities separately.']],
    },
    {
      name: 'Landscape & Public Art', intro: 'Custom sculpture for civic plazas, parks, community spaces and public landmarks. Review the relationship to the site, long views, weather exposure and structural coordination before defining the work.',
      buyerNeeds: ['Public-space teams, landscape architects and project contractors.', 'Civic focal points, park sculpture and landscape landmarks.', 'Public settings; a hotel garden or attraction remains with its own project category.'],
      scope: ['Provide the site plan, intended scale, ground levels, main views and nearby pedestrian or vehicle routes.', 'Identify exposure, drainage, foundations, structural review and local approval responsibilities.', 'Plan transport segments, unloading, lifting, assembly access and future inspection or maintenance requirements.'],
      evidenceNote: 'The verified Middle East photographs below show construction-stage assembly and installation of a flying-bird landmark. They do not document a completed hotel commission or a U.S. project.',
      relatedLabels: ['Bird landmark direction', 'Tree and canopy direction', 'Middle East construction record'],
      faq: [['Should every outdoor sculpture be placed in this category?', 'No. Classify by the commissioned project: a hotel courtyard stays with Hotels & Commercial Spaces, while a sculpture inside a themed destination stays with Tourism & Themed Art Installations.'], ['Does the sculpture proposal include foundations and local installation?', 'The proposal must specify inclusions and responsibilities. Foundation design, local engineering, cranes, site works and installers are not assumed included. WEIERYANG’s overseas installation guidance is agreed separately from local contracting.']],
    },
  ],
  zh: [
    {
      name: '酒店与商业空间', intro: '面向酒店大堂、度假村入口、中庭、办公楼与商业公共区域的定制雕塑。从建筑空间、访客动线和项目审批团队出发，确定合适的艺术节点。',
      buyerNeeds: ['酒店业主、开发商与室内设计团队。', '大堂焦点、中庭装置与入口景观。', '以整体建筑及公共区域为范围的项目。'],
      scope: ['选定造型前，先看平面、视线、通行净空与检修通道。', '确认材料、照明、样板审批、建筑接口与维护条件。', '在方案中明确结构审核、出口包装、运输和当地安装责任。'],
      evidenceNote: '下方为获授权展示的商业空间参考图，用于讨论新项目，并非威尔阳已完工酒店案例。',
      relatedLabels: ['大堂雕塑方向', '中庭雕塑方向', '入口场地简报'],
      faq: [['商场中庭应该归在这一类吗？', '商场公共中庭或入口属于整体商业空间项目；单个商户店内的雕塑则归“门店与餐饮空间”。'], ['酒店项目开始时需要提供什么？', '请提供摆放位置、图纸或尺寸（英尺英寸或公制）、现场照片、设计方向、目的地，以及通行或开业限制。审批与交付范围按具体项目确认。']],
    },
    {
      name: '门店与餐饮空间', intro: '面向餐厅、咖啡馆、酒吧、零售门店和品牌旗舰店的定制雕塑。结合品牌识别、顾客动线与日常运营，讨论门口形象、室内焦点和陈列区域。',
      buyerNeeds: ['餐饮经营者、零售品牌与门店设计师。', '门口形象、室内雕塑与陈列区域焦点。', '单个门店或商户空间，包括大型商业体内部的店铺。'],
      scope: ['提供品牌图稿、平面、门面视角以及顾客和员工动线。', '讨论占地、边缘、触碰区域、清洁条件及计划中的照明接口。', '约定饰面样板、固定位置、进场通道、当地安装和未来移位要求。'],
      evidenceNote: '下方照片为威尔阳实际制作阶段记录，展示形体、组装与表面处理，不据此声称餐厅安装、零售客户或门店竣工。',
      relatedLabels: ['实际制作记录', '准备询价范围', '比较材料选择'],
      faq: [['能为我们的门店制作吉祥物或角色雕塑吗？', '可以基于原创图稿或您有权委托制作的图稿评估角色项目。制作前需确认使用权限、审批视图、颜色和制作范围。'], ['能配合现有门店设计吗？', '请提供设计图、拟摆放位置、进场尺寸与品牌要求。新雕塑的造型、材料、固定和饰面需要单独评估，参考图片不代表固定规格。']],
    },
    {
      name: '文旅与IP艺术装置', intro: '面向景区、文旅街区、主题游览项目和角色主题空间的定制雕塑。结合主题叙事、游览动线、观看距离与场地要求，讨论单体或系列艺术节点。',
      buyerNeeds: ['文旅运营方、景区开发商与品牌项目团队。', '主题焦点、角色造型与关联雕塑组。', '以主题故事或游客体验为主要采购需求的项目。'],
      scope: ['提供获批主题、原创或合法授权图稿、多角度视图与颜色参考。', '讨论游览路线、游客接触、无障碍、净空，以及纯观赏或互动用途。', '记录饰面审批、制作检查点、户外环境与现场施工安装责任。'],
      evidenceNote: '彩色人物图片记录威尔阳实际制作与涂饰细节，并非文旅项目竣工证明，也不代表任何角色的复制授权。',
      relatedLabels: ['彩绘制作细节', '定制雕塑流程', '制作检查节点'],
      faq: [['IP主题项目与门店等场景怎么区分？', '按主要项目需求归类。餐厅吉祥物归门店餐饮；以景区整体主题或角色游览体验为核心的装置归这里。IP或角色同时可以作为跨分类标签。'], ['角色雕塑默认可以攀爬或游玩吗？', '不默认包含。纯观赏与互动使用的设计要求不同，请先说明游客接触方式，再单独确认工程设计、当地安全审核及现场责任。']],
    },
    {
      name: '城市景观与公共艺术', intro: '面向城市广场、公园、社区公共空间和公共地标的定制雕塑。先评估场地关系、远近视线、环境暴露与结构配合，再明确作品和交付范围。',
      buyerNeeds: ['公共空间项目团队、景观设计师与项目承包商。', '广场焦点、公园雕塑与景观地标。', '公共场地项目；酒店庭院或景区项目仍归各自场景。'],
      scope: ['提供场地平面、意向尺度、标高、主要视角与周边人车动线。', '明确环境、排水、基础、结构审核与当地审批责任。', '提前规划运输分段、卸货吊装、组装通道和后期检查维护。'],
      evidenceNote: '下方已核实的中东飞鸟照片呈现施工阶段的组装与现场安装，并非已完工酒店或美国项目。',
      relatedLabels: ['飞鸟地标方向', '树形与树冠方向', '中东施工记录'],
      faq: [['所有户外雕塑都归这一类吗？', '按委托项目归类。酒店庭院归酒店商业空间；主题景区内部的雕塑归文旅与IP艺术装置。'], ['雕塑方案包含基础和当地安装吗？', '需要在方案中逐项明确。基础设计、当地工程审核、吊机、现场施工和安装人员不默认包含；海外安装指导与当地施工承包分别约定。']],
    },
  ],
  ar: [
    {
      name: 'الفنادق والمساحات التجارية', intro: 'منحوتات مخصصة لردهات الفنادق ومداخل المنتجعات والأفنية الداخلية والمكاتب والمساحات التجارية المشتركة. ابدأ بالعمارة ومسارات الزوار وفريق اعتماد المشروع.',
      buyerNeeds: ['مُلّاك الفنادق والمطوّرون وفرق التصميم الداخلي.', 'عناصر محورية للبهو والأتريوم ومشهد الوصول.', 'مشاريع المبنى ومساحاته العامة المشتركة.'],
      scope: ['راجع المخططات وخطوط الرؤية ومسافات المرور ووصول الصيانة قبل اختيار الشكل.', 'اتفقوا على المواد والإضاءة والعينات وواجهات المبنى وإمكانية الصيانة.', 'حدّدوا المراجعة الإنشائية والتغليف والشحن ومسؤوليات التركيب المحلي في العرض.'],
      evidenceNote: 'الصور أدناه مراجع تجارية مصرح بعرضها لمناقشة مشروع جديد، وليست مشاريع فنادق مكتملة تنسب إلى WEIERYANG.',
      relatedLabels: ['اتجاه نحت للبهو', 'اتجاه نحت للأتريوم', 'موجز موقع المدخل'],
      faq: [['هل يندرج أتريوم مركز التسوق هنا؟', 'نعم، الأتريوم أو المدخل المشترك جزء من مشروع المبنى التجاري. أما المنحوتة داخل متجر مستأجر فتندرج ضمن المتاجر والمطاعم.'], ['ما المعلومات الأولية المطلوبة للفندق؟', 'شارك الموضع والمخططات أو الأبعاد بالنظام المتري أو بالقدم والبوصة وصور الموقع والاتجاه الفني والوجهة وقيود الوصول أو الافتتاح. تُتفق الاعتمادات ونطاق التسليم لكل مشروع.']],
    },
    {
      name: 'المتاجر والمطاعم', intro: 'منحوتات مخصصة للمطاعم والمقاهي والحانات والمتاجر وفروع العلامات الرئيسية. طوّر عنصراً مميزاً مع هوية المكان وحركة العملاء والتشغيل اليومي.',
      buyerNeeds: ['مشغّلو المطاعم والعلامات التجارية ومصممو المتاجر.', 'عناصر للواجهة ومنحوتات داخلية ونقاط عرض محورية.', 'المحل الفردي بما في ذلك المتاجر داخل المجمعات الكبيرة.'],
      scope: ['قدّم رسومات العلامة والمخططات ومناظر الواجهة ومسارات العملاء والعاملين.', 'راجع المساحة المشغولة والحواف ومناطق اللمس والتنظيف وواجهات الإضاءة المقترحة.', 'اتفقوا على عينات التشطيب والتثبيت والوصول والتركيب المحلي ومتطلبات النقل مستقبلاً.'],
      evidenceNote: 'هذه صور مرحلة تصنيع لدى WEIERYANG تبيّن الشكل والتجميع والسطح. لا يُدّعى أنها توثّق تركيباً في مطعم أو عميلاً تجارياً أو مكاناً مكتملاً.',
      relatedLabels: ['سجلات التصنيع الفعلية', 'إعداد نطاق طلب عرض', 'مقارنة اعتبارات المواد'],
      faq: [['هل يمكن تصنيع شخصية لمتجرنا؟', 'يمكن مراجعة المشروع باستخدام رسومات أصلية أو رسومات يحق لكم تكليف تصنيعها. أكّدوا حقوق الاستخدام والمناظر والألوان المعتمدة ونطاق التصنيع قبل الإنتاج.'], ['هل يمكن العمل وفق تصميم متجر قائم؟', 'شارك الرسومات والموضع وأبعاد الوصول ومتطلبات العلامة. يجب مراجعة الشكل والمواد والتثبيت والتشطيب لكل مشروع؛ الصورة المرجعية ليست مواصفات ثابتة.']],
    },
    {
      name: 'الوجهات والمنشآت الفنية الموضوعية', intro: 'منحوتات مخصصة للوجهات السياحية والشوارع الثقافية والمعالم الترفيهية والمساحات القائمة على الشخصيات. طوّر الموضوع مع مسارات الزوار ومسافات الرؤية ومتطلبات الموقع.',
      buyerNeeds: ['مشغّلو الوجهات ومطوّرو المعالم وفرق العلامات التجارية.', 'عناصر موضوعية وشخصيات ومجموعات منحوتات مترابطة.', 'مشاريع يتركز موجزها على قصة أو موضوع أو تجربة زائر.'],
      scope: ['قدّم الموضوع المعتمد ورسومات أصلية أو مرخّصة حسب الأصول والمناظر ومراجع الألوان.', 'ناقش المسارات والتلامس وإمكانية الوصول والمسافات وما إذا كان الاستخدام زخرفياً أو تفاعلياً.', 'سجّل اعتماد التشطيب ونقاط فحص التصنيع والتعرض الخارجي ومسؤوليات أعمال الموقع والتركيب.'],
      evidenceNote: 'صور الوجه الملوّن توثّق تصنيع WEIERYANG وتفاصيل السطح. لا تمثل مشروع جذب مكتمل أو دليلاً على حقوق إعادة إنتاج شخصية.',
      relatedLabels: ['تفاصيل التصنيع الملوّنة', 'عملية النحت المخصص', 'نقاط مراجعة التصنيع'],
      faq: [['كيف نصنّف مشروعاً بشخصية أو ملكية فكرية؟', 'اتبع موجز المشروع: شخصية مطعم تندرج ضمن المتاجر والمطاعم؛ موضوع متكامل لوجهة أو تجربة زوار قائمة على الشخصيات يندرج هنا. يمكن أيضاً استخدام الشخصية كوسم عبر الفئات.'], ['هل تشمل المنحوتة اللعب أو التسلق تلقائياً؟', 'لا. للعرض الزخرفي والاستخدام التفاعلي متطلبات مختلفة. وضّح التلامس المتوقع واتفقوا منفصلاً على الهندسة ومراجعة السلامة المحلية ومسؤوليات الموقع.']],
    },
    {
      name: 'المناظر الطبيعية والفن العام', intro: 'منحوتات مخصصة للساحات والحدائق والمساحات المجتمعية والمعالم العامة. راجع الموقع والمناظر البعيدة والتعرض للطقس والتنسيق الإنشائي قبل تحديد العمل.',
      buyerNeeds: ['فرق المساحات العامة ومعماريو المناظر ومقاولو المشاريع.', 'عناصر محورية للساحات ومنحوتات الحدائق والمعالم.', 'المواقع العامة؛ حديقة الفندق أو المعلم السياحي تبقى ضمن فئة مشروعها.'],
      scope: ['قدّم مخطط الموقع والحجم المقترح والمناسيب والمناظر الرئيسية ومسارات المشاة والمركبات.', 'حدّد التعرض والتصريف والأساسات والمراجعة الإنشائية ومسؤوليات الموافقات المحلية.', 'خطّط لأجزاء النقل والتفريغ والرفع والوصول للتجميع والفحص والصيانة مستقبلاً.'],
      evidenceNote: 'صور الطائر الموثّقة من الشرق الأوسط تبيّن التجميع والتركيب أثناء التنفيذ، وليست توثيقاً لفندق مكتمل أو مشروع أمريكي.',
      relatedLabels: ['اتجاه معلم على شكل طائر', 'اتجاه الأشجار والمظلات', 'سجل التنفيذ في الشرق الأوسط'],
      faq: [['هل كل منحوتة خارجية تندرج هنا؟', 'لا. التصنيف حسب المشروع المكلّف: فناء الفندق ضمن الفنادق والمساحات التجارية، ومنحوتة الوجهة الترفيهية ضمن الوجهات والمنشآت الموضوعية.'], ['هل يشمل العرض الأساسات والتركيب المحلي؟', 'يجب تحديد المسؤوليات والمشمولات في العرض. لا تفترض شمول الأساسات والهندسة المحلية والرافعات وأعمال الموقع والمركّبين. إرشادات WEIERYANG للتركيب منفصلة عن التعاقد المحلي.']],
    },
  ],
  fr: [
    {
      name: 'Hôtels et espaces commerciaux', intro: 'Sculptures sur mesure pour halls d’hôtel, entrées de resorts, atriums, bureaux et espaces commerciaux communs. Partez de l’architecture, des parcours visiteurs et de l’équipe chargée des validations.',
      buyerNeeds: ['Propriétaires hôteliers, promoteurs et architectes d’intérieur.', 'Points focaux de hall, compositions d’atrium et paysages d’entrée.', 'Un projet à l’échelle du bâtiment et de ses espaces communs.'],
      scope: ['Étudiez plans, vues, dégagements piétons et accès d’entretien avant de choisir la forme.', 'Convenez des matériaux, de l’éclairage, des échantillons, des interfaces et de la maintenance.', 'Précisez étude structurelle, emballage export, transport et responsabilités de pose locale.'],
      evidenceNote: 'Les images ci-dessous sont des références commerciales autorisées pour discuter d’un nouveau projet. Elles ne sont pas présentées comme des réalisations hôtelières achevées de WEIERYANG.',
      relatedLabels: ['Orientation pour un hall', 'Orientation pour un atrium', 'Cahier des charges du site d’entrée'],
      faq: [['Un atrium de centre commercial appartient-il à cette catégorie ?', 'Oui, l’atrium ou l’entrée partagés relèvent du projet commercial global. Une sculpture dans un magasin individuel relève des Boutiques et restaurants.'], ['Quelles informations transmettre pour un hôtel ?', 'Partagez l’emplacement, les plans ou dimensions métriques ou impériales, les photos, l’orientation artistique, la destination et les contraintes d’accès ou d’ouverture. Les validations et la livraison sont définies par projet.']],
    },
    {
      name: 'Boutiques et restaurants', intro: 'Sculptures sur mesure pour restaurants, cafés, bars, boutiques et magasins phares. Développez un point focal adapté à l’identité du lieu, aux parcours clients et au fonctionnement quotidien.',
      buyerNeeds: ['Restaurateurs, enseignes et concepteurs de magasins.', 'Éléments de façade, sculptures intérieures et zones de présentation.', 'Un établissement ou local individuel, y compris dans un grand ensemble.'],
      scope: ['Fournissez visuels de marque, plans, vues de façade et parcours clients ou personnel.', 'Étudiez emprise, arêtes, zones de contact, nettoyage et interfaces d’éclairage prévues.', 'Convenez des échantillons, fixations, accès, pose locale et éventuels déplacements futurs.'],
      evidenceNote: 'Ces photos documentent la fabrication WEIERYANG : forme, assemblage et surface. Elles n’affirment ni installation en restaurant, ni client commercial, ni établissement achevé.',
      relatedLabels: ['Suivi de fabrication réel', 'Préparer le périmètre du devis', 'Comparer les matériaux'],
      faq: [['Peut-on réaliser une mascotte pour notre boutique ?', 'Le projet peut être étudié à partir d’un visuel original ou dont vous êtes autorisé à commander la fabrication. Confirmez droits d’utilisation, vues, couleurs et périmètre avant production.'], ['Pouvez-vous suivre un aménagement de magasin existant ?', 'Partagez plans, emplacement, dimensions d’accès et contraintes de marque. Forme, matériau, fixations et finition sont à étudier pour chaque projet ; une photo de référence n’est pas une spécification fixe.']],
    },
    {
      name: 'Destinations et installations thématiques', intro: 'Sculptures sur mesure pour destinations touristiques, rues culturelles, attractions et espaces centrés sur des personnages. Coordonnez le thème avec les parcours visiteurs, les distances de vue et le site.',
      buyerNeeds: ['Exploitants de destinations, développeurs d’attractions et équipes de marque.', 'Points focaux thématiques, personnages et ensembles de sculptures.', 'Projets dont le brief porte sur un thème, un récit ou l’expérience visiteur.'],
      scope: ['Fournissez thème validé, visuels originaux ou dûment licenciés, vues et couleurs.', 'Précisez parcours, contacts visiteurs, accessibilité, dégagements et usage décoratif ou interactif.', 'Consignez validations des finitions, contrôles de fabrication, exposition et responsabilités de chantier et de pose.'],
      evidenceNote: 'Les portraits peints documentent la fabrication et le détail de surface chez WEIERYANG. Ils ne prouvent ni attraction achevée ni droits de reproduction d’un personnage.',
      relatedLabels: ['Détails de fabrication peinte', 'Processus sur mesure', 'Points de contrôle de fabrication'],
      faq: [['Comment classer un projet autour d’un personnage ?', 'Suivez le brief principal : une mascotte de restaurant reste dans Boutiques et restaurants ; un thème de destination ou une expérience de visite centrée sur un personnage relève d’ici. Le personnage peut aussi servir de filtre transversal.'], ['La sculpture est-elle automatiquement destinée au jeu ou à l’escalade ?', 'Non. Présentation décorative et usage interactif demandent des études différentes. Décrivez les contacts envisagés et convenez séparément de l’ingénierie, de la sécurité locale et des responsabilités du site.']],
    },
    {
      name: 'Paysage et art public', intro: 'Sculptures sur mesure pour places, parcs, espaces collectifs et repères publics. Étudiez le site, les vues lointaines, les intempéries et la coordination structurelle avant de définir l’œuvre.',
      buyerNeeds: ['Équipes d’espace public, paysagistes et entreprises de projet.', 'Points focaux de places, sculptures de parc et repères paysagers.', 'Espaces publics ; un jardin d’hôtel ou une attraction reste dans sa catégorie.'],
      scope: ['Fournissez plan, échelle envisagée, niveaux, vues principales et parcours piétons ou véhicules.', 'Définissez exposition, drainage, fondations, étude structurelle et autorisations locales.', 'Planifiez segments de transport, déchargement, levage, assemblage et futurs contrôles ou entretien.'],
      evidenceNote: 'Les photos vérifiées du Moyen-Orient montrent l’assemblage et la pose du repère en forme d’oiseau en chantier, pas un hôtel achevé ni un projet américain.',
      relatedLabels: ['Orientation du repère oiseau', 'Orientation arbre et canopée', 'Chantier au Moyen-Orient'],
      faq: [['Toute sculpture extérieure appartient-elle à cette catégorie ?', 'Non. Classez selon le projet commandé : une cour d’hôtel reste dans Hôtels et espaces commerciaux, une sculpture dans une attraction reste dans Destinations et installations thématiques.'], ['Le devis inclut-il les fondations et la pose locale ?', 'Le devis doit préciser les inclusions et responsabilités. Fondations, ingénierie locale, grues, chantier et poseurs ne sont pas présumés inclus. Les conseils de pose WEIERYANG sont distincts d’un marché de travaux local.']],
    },
  ],
  es: [
    {
      name: 'Hoteles y espacios comerciales', intro: 'Esculturas a medida para vestíbulos, accesos de resorts, atrios, oficinas y zonas comerciales comunes. Parta de la arquitectura, los recorridos y el equipo responsable de aprobaciones.',
      buyerNeeds: ['Propietarios hoteleros, promotores y equipos de interiorismo.', 'Puntos focales de vestíbulos, atrios y paisajes de acceso.', 'Proyectos del edificio y sus espacios comunes.'],
      scope: ['Revise planos, vistas, pasos peatonales y acceso de mantenimiento antes de elegir la forma.', 'Acuerde materiales, iluminación, muestras, interfaces del edificio y mantenimiento.', 'Defina revisión estructural, embalaje de exportación, transporte y responsabilidades de instalación local.'],
      evidenceNote: 'Las imágenes son referencias comerciales autorizadas para estudiar un proyecto nuevo. No se presentan como encargos hoteleros terminados de WEIERYANG.',
      relatedLabels: ['Propuesta para vestíbulos', 'Propuesta para atrios', 'Resumen del acceso'],
      faq: [['¿Un atrio de centro comercial pertenece aquí?', 'Sí. El atrio o acceso común forma parte del proyecto comercial global. Una escultura dentro de una tienda individual corresponde a Tiendas y restaurantes.'], ['¿Qué debe enviar primero el equipo del hotel?', 'Comparta ubicación, planos o medidas métricas o imperiales, fotografías, orientación artística, destino y restricciones de acceso o apertura. Las aprobaciones y la entrega se acuerdan para cada proyecto.']],
    },
    {
      name: 'Tiendas y restaurantes', intro: 'Esculturas a medida para restaurantes, cafeterías, bares, tiendas y establecimientos insignia. Desarrolle un punto focal acorde con la identidad, la circulación y el funcionamiento diario del local.',
      buyerNeeds: ['Operadores de restaurantes, marcas y diseñadores de tiendas.', 'Elementos de fachada, esculturas interiores y zonas de exposición.', 'Un local individual, incluidas tiendas dentro de grandes complejos.'],
      scope: ['Aporte diseños de marca, planos, vistas de fachada y recorridos de clientes y personal.', 'Revise espacio ocupado, bordes, zonas de contacto, limpieza e interfaces de iluminación previstas.', 'Acuerde muestras, fijaciones, accesos, instalación local y posibles traslados futuros.'],
      evidenceNote: 'Estas fotografías documentan forma, montaje y superficie durante la fabricación de WEIERYANG. No acreditan una instalación en restaurante, cliente comercial o local terminado.',
      relatedLabels: ['Fabricación documentada', 'Preparar el alcance de la cotización', 'Comparar materiales'],
      faq: [['¿Pueden fabricar una mascota para nuestra tienda?', 'Puede revisarse el proyecto con ilustraciones originales o que esté autorizado a encargar. Confirme derechos de uso, vistas, colores y alcance antes de producir.'], ['¿Pueden trabajar con un diseño de tienda existente?', 'Comparta planos, emplazamiento, dimensiones de acceso y requisitos de marca. Forma, material, fijaciones y acabado requieren revisión específica; una foto de referencia no constituye una especificación fija.']],
    },
    {
      name: 'Destinos e instalaciones temáticas', intro: 'Esculturas a medida para destinos turísticos, calles culturales, atracciones y espacios centrados en personajes. Coordine el tema con recorridos, distancias de observación y necesidades del lugar.',
      buyerNeeds: ['Operadores turísticos, promotores de atracciones y equipos de marca.', 'Puntos temáticos, personajes y conjuntos de esculturas.', 'Proyectos cuyo encargo gira en torno a una historia, tema o experiencia de visita.'],
      scope: ['Aporte tema aprobado, diseños originales o con licencia válida, vistas y referencias de color.', 'Explique recorridos, contacto, accesibilidad, espacios libres y uso decorativo o interactivo.', 'Registre aprobación de acabados, controles de fabricación, exposición y responsabilidades de obra e instalación.'],
      evidenceNote: 'Los retratos pintados documentan fabricación y detalles de superficie de WEIERYANG. No prueban atracciones terminadas ni derechos para reproducir personajes.',
      relatedLabels: ['Detalles de fabricación pintada', 'Proceso a medida', 'Controles de fabricación'],
      faq: [['¿Cómo se clasifica un proyecto de personajes?', 'Siga el encargo principal: una mascota de restaurante pertenece a Tiendas y restaurantes; un tema integral de destino o experiencia centrada en personajes pertenece aquí. Los personajes también pueden ser etiquetas transversales.'], ['¿La escultura incluye uso de juego o escalada?', 'No de forma automática. Exhibición decorativa e interacción requieren estudios diferentes. Describa el contacto previsto y acuerde ingeniería, revisión de seguridad local y responsabilidades del lugar por separado.']],
    },
    {
      name: 'Paisajismo y arte público', intro: 'Esculturas a medida para plazas, parques, espacios comunitarios e hitos públicos. Revise la relación con el lugar, las vistas, la intemperie y la coordinación estructural antes de definir la obra.',
      buyerNeeds: ['Equipos de espacio público, paisajistas y contratistas.', 'Puntos focales, esculturas de parque e hitos paisajísticos.', 'Espacios públicos; un jardín de hotel o atracción conserva su categoría de proyecto.'],
      scope: ['Aporte plano, escala prevista, niveles, vistas principales y recorridos peatonales o de vehículos.', 'Defina exposición, drenaje, cimentación, revisión estructural y permisos locales.', 'Planifique segmentos de transporte, descarga, elevación, montaje e inspección y mantenimiento futuros.'],
      evidenceNote: 'Las fotografías verificadas de Oriente Medio muestran montaje e instalación del hito con forma de ave durante la obra, no un hotel terminado ni un proyecto estadounidense.',
      relatedLabels: ['Propuesta de hito con forma de ave', 'Propuesta de árbol y dosel', 'Obra en Oriente Medio'],
      faq: [['¿Toda escultura exterior pertenece aquí?', 'No. Clasifique por el proyecto encargado: un patio de hotel pertenece a Hoteles y espacios comerciales y una escultura de atracción a Destinos e instalaciones temáticas.'], ['¿La propuesta incluye cimentación e instalación local?', 'La propuesta debe detallar inclusiones y responsabilidades. No se presupone incluir cimentaciones, ingeniería local, grúas, obra ni instaladores. La orientación de WEIERYANG se acuerda aparte de la contratación local.']],
    },
  ],
  de: [
    {
      name: 'Hotels und Gewerberäume', intro: 'Individuelle Skulpturen für Hotellobbys, Resort-Eingänge, Atrien, Büros und gemeinsame Gewerbeflächen. Ausgangspunkt sind Architektur, Besucherwege und das zuständige Freigabeteam.',
      buyerNeeds: ['Hotelbetreiber, Entwickler und Innenarchitekturteams.', 'Blickfänge für Lobby, Atrium und Ankunftslandschaft.', 'Projekte für das gesamte Gebäude und seine Gemeinschaftsbereiche.'],
      scope: ['Prüfen Sie Pläne, Sichtachsen, Durchgänge und Wartungszugänge vor der Formwahl.', 'Vereinbaren Sie Material, Beleuchtung, Muster, Gebäudeschnittstellen und Pflegezugang.', 'Definieren Sie Statikprüfung, Exportverpackung, Transport und örtliche Montageverantwortung.'],
      evidenceNote: 'Die Bilder sind freigegebene Gewerberaumreferenzen für die Diskussion eines neuen Projekts. Sie werden nicht als abgeschlossene WEIERYANG Hotelaufträge dargestellt.',
      relatedLabels: ['Skulpturenrichtung für die Lobby', 'Skulpturenrichtung für das Atrium', 'Standortbriefing für den Eingang'],
      faq: [['Gehört das Atrium eines Einkaufszentrums hierher?', 'Ja. Gemeinsames Atrium oder Eingang gehören zum Gebäudeprojekt. Eine Skulptur im einzelnen Geschäft gehört zu Einzelhandel und Gastronomie.'], ['Welche Angaben benötigt ein Hotelprojekt zuerst?', 'Teilen Sie Aufstellort, Pläne oder metrische beziehungsweise imperiale Maße, Fotos, Gestaltungsrichtung, Zielort und Zugangs- oder Eröffnungsvorgaben. Freigaben und Lieferumfang werden projektbezogen vereinbart.']],
    },
    {
      name: 'Einzelhandel und Gastronomie', intro: 'Individuelle Skulpturen für Restaurants, Cafés, Bars, Geschäfte und Flagship-Stores. Entwickeln Sie einen Blickfang passend zu Markenidentität, Kundenwegen und täglichem Betrieb.',
      buyerNeeds: ['Gastronomiebetreiber, Handelsmarken und Ladengestalter.', 'Fassadenelemente, Innenskulpturen und Präsentationszonen.', 'Einzelne Geschäftseinheiten, auch innerhalb größerer Anlagen.'],
      scope: ['Stellen Sie Markenvorlagen, Grundrisse, Fassadenansichten und Kunden- oder Personalwege bereit.', 'Prüfen Sie Stellfläche, Kanten, Kontaktzonen, Reinigung und geplante Beleuchtungsschnittstellen.', 'Vereinbaren Sie Muster, Befestigungen, Zugang, örtliche Montage und spätere Versetzbarkeit.'],
      evidenceNote: 'Die Bilder dokumentieren WEIERYANG Fertigung, Form, Montage und Oberfläche. Sie belegen weder einen Gastronomieeinbau noch einen Handelskunden oder ein fertiggestelltes Geschäft.',
      relatedLabels: ['Tatsächliche Fertigungsnachweise', 'Angebotsumfang vorbereiten', 'Materialfragen vergleichen'],
      faq: [['Kann eine Figur für unser Geschäft gefertigt werden?', 'Das Projekt kann anhand eigener oder zur Fertigung freigegebener Vorlagen geprüft werden. Bestätigen Sie Nutzungsrechte, freigegebene Ansichten, Farben und Umfang vor der Produktion.'], ['Können Sie mit einer bestehenden Ladenplanung arbeiten?', 'Teilen Sie Pläne, Aufstellort, Zugangsmaße und Markenvorgaben. Form, Material, Befestigungen und Oberfläche benötigen eine eigene Prüfung; ein Referenzfoto ist keine feste Spezifikation.']],
    },
    {
      name: 'Erlebnisorte und Themeninstallationen', intro: 'Individuelle Skulpturen für Besucherziele, Kulturstraßen, Attraktionen und charakterbezogene Räume. Stimmen Sie das Thema mit Besucherwegen, Sichtabständen und Standortanforderungen ab.',
      buyerNeeds: ['Betreiber von Besucherzielen, Attraktionsentwickler und Markenteams.', 'Thematische Blickfänge, Figuren und zusammengehörige Skulpturengruppen.', 'Projekte mit Thema, Geschichte oder Besuchererlebnis als zentralem Auftrag.'],
      scope: ['Liefern Sie freigegebenes Thema, eigene oder ordnungsgemäß lizenzierte Vorlagen, Ansichten und Farbreferenzen.', 'Beschreiben Sie Wege, Besucherkontakt, Barrierefreiheit, Freiräume und dekorative oder interaktive Nutzung.', 'Dokumentieren Sie Oberflächenfreigaben, Fertigungsprüfungen, Bewitterung und Zuständigkeiten für Baustelle und Montage.'],
      evidenceNote: 'Die bemalten Porträts dokumentieren WEIERYANG Fertigung und Oberflächendetails. Sie belegen weder eine fertige Attraktion noch Rechte zur Vervielfältigung einer Figur.',
      relatedLabels: ['Details bemalter Fertigung', 'Individueller Skulpturenprozess', 'Prüfpunkte der Fertigung'],
      faq: [['Wie wird ein Figurenprojekt eingeordnet?', 'Der Hauptauftrag entscheidet: Ein Restaurantmaskottchen gehört zu Einzelhandel und Gastronomie; ein umfassendes Besucherthema oder eine figurenzentrierte Attraktion gehört hierher. Figuren können zusätzlich übergreifende Schlagwörter sein.'], ['Ist die Skulptur automatisch zum Spielen oder Klettern geeignet?', 'Nein. Dekoration und interaktive Nutzung verlangen unterschiedliche Auslegung. Beschreiben Sie den vorgesehenen Kontakt und vereinbaren Sie Ingenieurleistungen, örtliche Sicherheitsprüfung und Standortverantwortung gesondert.']],
    },
    {
      name: 'Landschaft und Kunst im öffentlichen Raum', intro: 'Individuelle Skulpturen für Plätze, Parks, Gemeinschaftsflächen und öffentliche Landmarken. Prüfen Sie Standortbezug, Fernsicht, Bewitterung und strukturelle Abstimmung vor der Festlegung.',
      buyerNeeds: ['Teams für öffentliche Räume, Landschaftsarchitekten und Projektunternehmen.', 'Blickfänge für Plätze, Parkskulpturen und Landschaftsmarken.', 'Öffentliche Orte; Hotelgarten und Attraktion bleiben ihrer Projektkategorie zugeordnet.'],
      scope: ['Stellen Sie Lageplan, Größenrichtung, Höhen, Hauptansichten und Fuß- oder Fahrzeugwege bereit.', 'Definieren Sie Exposition, Entwässerung, Fundamente, Statikprüfung und örtliche Freigaben.', 'Planen Sie Transportsegmente, Entladung, Hebevorgänge, Montagezugang und spätere Inspektion oder Pflege.'],
      evidenceNote: 'Die verifizierten Nahostbilder zeigen Montage und Aufstellung der Vogel-Landmarke während der Bauphase, kein abgeschlossenes Hotel oder US-Projekt.',
      relatedLabels: ['Vogel-Landmarke als Richtung', 'Baum- und Kronenrichtung', 'Baunachweis aus dem Nahen Osten'],
      faq: [['Gehört jede Außenskulptur in diese Kategorie?', 'Nein. Entscheidend ist der Auftrag: Ein Hotelhof gehört zu Hotels und Gewerberäume, eine Skulptur in einer Themenattraktion zu Erlebnisorte und Themeninstallationen.'], ['Sind Fundamente und örtliche Montage enthalten?', 'Das Angebot muss Leistungen und Zuständigkeiten nennen. Fundamente, örtliche Ingenieure, Kräne, Baustellenleistungen und Monteure sind nicht automatisch enthalten. WEIERYANG Montageberatung wird getrennt von örtlicher Ausführung vereinbart.']],
    },
  ],
};

const imageCopy = {
  en: {
    lobby: ['Reflective whale-form sculpture in a commercial interior with a water basin', 'Authorized commercial-space reference: sculpture, water edge and visitor circulation.'],
    atrium: ['Vertical sculpture reference within a multi-level commercial atrium', 'Authorized commercial-atrium reference: vertical composition and cross-floor views.'],
    bird: ['Flying-bird landmark sculpture during installation at a Middle East public site', 'Verified Middle East construction record: installation in progress.'],
    assembly: ['Segmented structural assembly of the bird landmark during construction', 'Verified construction-phase record: segmented structural assembly.'],
  },
  zh: {
    lobby: ['商业室内水池旁的反光鲸鱼造型雕塑', '获授权的商业空间参考：雕塑、水边与访客通行关系。'],
    atrium: ['多层商业中庭中的竖向雕塑参考', '获授权的商业中庭参考：竖向组合与跨层观看关系。'],
    bird: ['中东公共场地安装中的飞鸟地标雕塑', '已核实的中东施工记录：现场安装进行中。'],
    assembly: ['施工阶段飞鸟地标雕塑的分段结构组装', '已核实的施工阶段记录：分段结构组装。'],
  },
  ar: {
    lobby: ['منحوتة حوت عاكسة قرب حوض ماء داخل مساحة تجارية', 'مرجع تجاري مصرح بعرضه: علاقة المنحوتة بحافة الماء وحركة الزوار.'],
    atrium: ['مرجع لمنحوتة عمودية داخل أتريوم تجاري متعدد الطوابق', 'مرجع أتريوم مصرح بعرضه: التكوين العمودي والرؤية بين الطوابق.'],
    bird: ['معلم على شكل طائر أثناء التركيب بموقع عام في الشرق الأوسط', 'سجل تنفيذ موثق في الشرق الأوسط: التركيب جارٍ.'],
    assembly: ['تجميع الهيكل المقسّم لمعلم الطائر أثناء التنفيذ', 'سجل موثق لمرحلة التنفيذ: تجميع الهيكل المقسّم.'],
  },
  fr: {
    lobby: ['Sculpture réfléchissante en forme de baleine près d’un bassin intérieur commercial', 'Référence commerciale autorisée : sculpture, bord d’eau et circulation des visiteurs.'],
    atrium: ['Référence de sculpture verticale dans un atrium commercial à plusieurs niveaux', 'Référence d’atrium autorisée : composition verticale et vues entre étages.'],
    bird: ['Repère en forme d’oiseau pendant la pose dans un espace public au Moyen-Orient', 'Chantier vérifié au Moyen-Orient : pose en cours.'],
    assembly: ['Assemblage structurel segmenté du repère oiseau en chantier', 'Suivi de chantier vérifié : assemblage de la structure segmentée.'],
  },
  es: {
    lobby: ['Escultura reflectante de ballena junto a un estanque en un interior comercial', 'Referencia comercial autorizada: escultura, borde del agua y circulación.'],
    atrium: ['Referencia de escultura vertical en un atrio comercial de varios niveles', 'Referencia de atrio autorizada: composición vertical y vistas entre plantas.'],
    bird: ['Hito con forma de ave durante su instalación en un espacio público de Oriente Medio', 'Obra verificada en Oriente Medio: instalación en curso.'],
    assembly: ['Montaje de la estructura segmentada del hito de ave durante la obra', 'Registro de construcción verificado: montaje estructural por segmentos.'],
  },
  de: {
    lobby: ['Reflektierende Walskulptur an einem Wasserbecken im Gewerbeinnenraum', 'Freigegebene Gewerberaumreferenz: Skulptur, Wasserrand und Besucherwege.'],
    atrium: ['Referenz einer vertikalen Skulptur in einem mehrgeschossigen Gewerbeatrium', 'Freigegebene Atriumreferenz: vertikale Komposition und geschossübergreifende Ansichten.'],
    bird: ['Vogel-Landmarke während der Montage an einem öffentlichen Ort im Nahen Osten', 'Verifizierter Baunachweis aus dem Nahen Osten: Montage läuft.'],
    assembly: ['Segmentierte Tragwerksmontage der Vogel-Landmarke während der Bauphase', 'Verifizierter Bauphasennachweis: segmentierte Tragwerksmontage.'],
  },
};

function localizeCategory(category, index, language) {
  const lang = copy[language] ? language : 'en';
  const text = copy[lang][index];
  const ui = applicationUi[lang];
  const gallery = category.gallery.map(image => {
    const label = image.evidenceType === 'fabrication' ? ui.fabricationLabel : image.evidenceType === 'construction' ? ui.constructionLabel : ui.referenceLabel;
    if (image.workshopId) return { ...getWorkshopImage(image.workshopId, lang), evidenceType: image.evidenceType, label };
    const [alt, caption] = imageCopy[lang][image.key];
    return { ...image, src: `/seo-media/${image.file}`, alt, caption, label };
  });
  const related = category.relatedPaths.map((path, i) => [text.relatedLabels[i], path]);
  if (category.id === 'public') {
    const specialistLabels = {
      en: ['Public-art service and engineering considerations', 'Garden sculpture and planting context'],
      zh: ['公共艺术服务与工程配合', '园林雕塑与植物环境'],
      ar: ['خدمة الفن العام والتنسيق الهندسي', 'منحوتات الحدائق وعلاقتها بالنباتات'],
      fr: ['Art public et coordination technique', 'Sculpture de jardin et plantations'],
      es: ['Arte público y coordinación técnica', 'Escultura de jardín y vegetación'],
      de: ['Kunst im öffentlichen Raum und Technik', 'Gartenskulpturen und Bepflanzung'],
    }[lang];
    related.push([specialistLabels[0], '/public-art/'], [specialistLabels[1], '/garden-sculpture/']);
  }
  return { ...category, ...text, gallery, related };
}

export const applicationCategories = categoryDefinitions.map((category, index) => localizeCategory(category, index, 'en'));
export function getApplicationCategories(language = 'en') {
  return categoryDefinitions.map((category, index) => localizeCategory(category, index, language));
}
export function getApplication(path, language = 'en') {
  return getApplicationCategories(language).find(category => category.path === path);
}
export const applicationRoutes = categoryDefinitions.slice(1).map(category => category.path.replace(/^\/+|\/+$/g, ''));
