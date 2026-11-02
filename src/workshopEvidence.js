// The operator confirmed these three groups as WEIERYANG fabrication work.
// This establishes the maker's role, not original design authorship, reproduction
// rights, ownership of the premises, material grade, certification or completion.
// Dimensions are the actual orientation-corrected WebP dimensions in
// qa/2026-10-08-images/workshop-media-manifest.json. No source was enlarged.
const imageGeometry = [
  { id: "whaleOverview", file: "workshop-metal-whale-overview.webp", width: 1080, height: 1439 },
  { id: "whaleSurface", file: "workshop-metal-whale-surface.webp", width: 1080, height: 1439 },
  { id: "handsAssembly", file: "workshop-metal-hands-assembly.webp", width: 1080, height: 1439 },
  { id: "handsOverview", file: "workshop-metal-hands-overview.webp", width: 1080, height: 1439 },
  { id: "portraitOverview", file: "workshop-painted-portrait-overview.webp", width: 1200, height: 1600 },
  { id: "portraitSurface", file: "workshop-painted-portrait-surface.webp", width: 1200, height: 1600 },
];

const groupImageIds = [["whaleOverview", "whaleSurface"], ["handsAssembly", "handsOverview"], ["portraitOverview", "portraitSurface"]];

export const workshopEvidenceCopy = {
  en: {
    eyebrow: "WEIERYANG / FABRICATION RECORDS",
    title: "Look closely at form, assembly and surface.",
    body: "These photographs record WEIERYANG fabrication work: curved reflective surfaces, hand-form assembly and painted portrait detailing.",
    note: "These photographs show fabrication-stage work. Drawings, materials, finish and delivery scope are agreed for each new commission.",
    label: "WEIERYANG fabrication record", action: "Share your project brief", compactAction: "Explore the fabrication records",
    compactTitle: "From overall form to the smallest detail.",
    compactBody: "Three fabrication records, seen at different scales. Review reflective surfaces, sculptural assembly and painted detail before discussing your own project.",
    groups: [
      { title: "Reflective curves, seen from two distances.", body: "Use the overall form and a closer surface view to discuss reflected lines, changing curvature and visible surface junctions." },
      { title: "Assembly around a complex form.", body: "Read the relationship between hand-shaped components and visible assembly areas before defining a new design or installation approach." },
      { title: "Painted details on a portrait form.", body: "Compare the overall portrait with its surface detailing to discuss colour areas, transitions and the relationship between paint and form." },
    ],
    images: [
      { alt: "Reflective whale-form sculpture during WEIERYANG fabrication", caption: "WEIERYANG fabrication record: overall whale form and curved reflective surfaces." },
      { alt: "Close view of curved reflective surfaces on a whale-form sculpture during WEIERYANG fabrication", caption: "WEIERYANG fabrication detail: reflections and adjoining curved surfaces." },
      { alt: "Hand-shaped sculptural components positioned together during WEIERYANG assembly", caption: "WEIERYANG fabrication record: hand forms and visible assembly junctions." },
      { alt: "Overall arrangement of hand-shaped sculptural forms during WEIERYANG fabrication", caption: "WEIERYANG fabrication record: an overall view of the hand-form arrangement." },
      { alt: "Painted portrait sculpture during WEIERYANG fabrication", caption: "WEIERYANG fabrication record: portrait form and painted colour areas." },
      { alt: "Close view of painted surface details on a portrait sculpture during WEIERYANG fabrication", caption: "WEIERYANG fabrication detail: painted colour transitions and surface detailing." },
    ],
  },
  zh: {
    eyebrow: "WEIERYANG / 实际制作记录",
    title: "从形体、组装到表面细节。",
    body: "这组照片记录威尔阳的实际制作过程，展示弧形反光曲面、双手造型组装与彩色人物涂饰细节。",
    note: "照片呈现制作阶段的工作。新项目的图纸、材料、饰面与交付范围均按委托确认。",
    label: "威尔阳实际制作记录", action: "发送项目简报", compactAction: "查看完整制作记录",
    compactTitle: "从整体形态，看到制作细节。",
    compactBody: "三组制作记录，呈现不同尺度的观察。先看反光曲面、造型组装与涂饰细节，再讨论您的项目。",
    groups: [
      { title: "从整体与近处观察反光曲面。", body: "结合整体形态与表面近照，讨论反射线条、曲率变化以及相邻曲面的衔接。" },
      { title: "复杂造型中的组装关系。", body: "观察双手造型构件之间的关系与可见组装部位，再明确新设计与安装方式。" },
      { title: "人物造型上的彩色涂饰。", body: "对照人物整体与表面细节，讨论色块、过渡及涂饰与形体的关系。" },
    ],
    images: [
      { alt: "威尔阳制作中的反光鲸鱼造型雕塑", caption: "威尔阳实际制作记录：鲸鱼整体形态与弧形反光曲面。" },
      { alt: "威尔阳制作中鲸鱼造型雕塑弧形反光曲面的近照", caption: "威尔阳制作细节：曲面反射与相邻表面的衔接。" },
      { alt: "威尔阳制作中双手造型雕塑构件的组装", caption: "威尔阳实际制作记录：双手造型与可见组装连接部位。" },
      { alt: "威尔阳制作中双手造型雕塑的整体组合", caption: "威尔阳实际制作记录：双手造型组合的整体视图。" },
      { alt: "威尔阳制作中的彩色人物肖像雕塑", caption: "威尔阳实际制作记录：人物造型与彩色涂饰区域。" },
      { alt: "威尔阳制作中人物肖像雕塑涂饰细节近照", caption: "威尔阳制作细节：色彩过渡与表面涂饰。" },
    ],
  },
  ar: {
    eyebrow: "WEIERYANG / سجلات التصنيع",
    title: "تأمّل الشكل والتجميع وتفاصيل السطح.",
    body: "توثّق هذه الصور أعمال تصنيع WEIERYANG: أسطحاً منحنية عاكسة، وتجميع أشكال اليدين، وتفاصيل طلاء تمثال شخصي.",
    note: "تُظهر هذه الصور أعمالاً في مرحلة التصنيع. تُتفق الرسومات والمواد والتشطيبات ونطاق التسليم لكل مشروع جديد.",
    label: "سجل تصنيع WEIERYANG", action: "أرسل موجز مشروعك", compactAction: "استكشف سجلات التصنيع",
    compactTitle: "من الشكل العام إلى أدق التفاصيل.",
    compactBody: "ثلاثة سجلات تصنيع بمقاييس مشاهدة مختلفة. راجع الأسطح العاكسة والتجميع وتفاصيل الطلاء قبل مناقشة مشروعك.",
    groups: [
      { title: "منحنيات عاكسة من مسافتين.", body: "قارن الشكل العام بصورة قريبة للسطح لمناقشة خطوط الانعكاس وتغيّر الانحناء والتقاء الأسطح المتجاورة." },
      { title: "تجميع حول شكل معقّد.", body: "راجع العلاقة بين المكونات على شكل يد ومناطق التجميع الظاهرة قبل تحديد تصميم جديد أو طريقة تركيب." },
      { title: "تفاصيل الطلاء على تمثال شخصي.", body: "قارن الشكل العام بتفاصيل سطحه لمناقشة المساحات اللونية والانتقالات والعلاقة بين الطلاء والشكل." },
    ],
    images: [
      { alt: "منحوتة عاكسة على شكل حوت أثناء تصنيع WEIERYANG", caption: "سجل تصنيع WEIERYANG: شكل الحوت العام والأسطح المنحنية العاكسة." },
      { alt: "صورة قريبة لأسطح منحنية عاكسة على منحوتة حوت أثناء تصنيع WEIERYANG", caption: "تفصيل تصنيع WEIERYANG: الانعكاسات والتقاء الأسطح المنحنية." },
      { alt: "مكونات نحتية على شكل يدين موضوعة معاً أثناء تجميع WEIERYANG", caption: "سجل تصنيع WEIERYANG: أشكال اليدين ووصلات التجميع الظاهرة." },
      { alt: "منظر عام لترتيب أشكال يدين نحتية أثناء تصنيع WEIERYANG", caption: "سجل تصنيع WEIERYANG: منظر عام لترتيب أشكال اليدين." },
      { alt: "تمثال شخصي مطلي أثناء تصنيع WEIERYANG", caption: "سجل تصنيع WEIERYANG: الشكل الشخصي والمساحات اللونية المطلية." },
      { alt: "صورة قريبة لتفاصيل سطح مطلي على تمثال شخصي أثناء تصنيع WEIERYANG", caption: "تفصيل تصنيع WEIERYANG: انتقالات الألوان وتفاصيل الطلاء على السطح." },
    ],
  },
  fr: {
    eyebrow: "WEIERYANG / DOCUMENTATION DE FABRICATION",
    title: "Observer la forme, l’assemblage et la surface.",
    body: "Ces photographies documentent la fabrication WEIERYANG : surfaces courbes réfléchissantes, assemblage de formes de mains et détails peints d’un portrait sculpté.",
    note: "Ces photographies montrent le travail en cours de fabrication. Plans, matériaux, finition et périmètre de livraison sont convenus pour chaque nouvelle commande.",
    label: "Fabrication WEIERYANG documentée", action: "Envoyer votre cahier des charges", compactAction: "Voir la documentation de fabrication",
    compactTitle: "De la forme d’ensemble au plus petit détail.",
    compactBody: "Trois dossiers de fabrication à différentes échelles. Examinez les surfaces réfléchissantes, l’assemblage et la peinture avant de discuter de votre projet.",
    groups: [
      { title: "Des courbes réfléchissantes, de loin et de près.", body: "Rapprochez la vue d’ensemble du détail de surface pour discuter des lignes réfléchies, des changements de courbure et des jonctions visibles." },
      { title: "Assembler une forme complexe.", body: "Observez les rapports entre les éléments en forme de mains et les zones d’assemblage avant de définir un nouveau dessin ou une méthode de pose." },
      { title: "La peinture sur un portrait sculpté.", body: "Comparez le portrait d’ensemble à ses détails pour discuter des zones colorées, des transitions et du rapport entre peinture et volume." },
    ],
    images: [
      { alt: "Sculpture réfléchissante en forme de baleine pendant la fabrication WEIERYANG", caption: "Fabrication WEIERYANG : forme générale de la baleine et surfaces courbes réfléchissantes." },
      { alt: "Détail des surfaces courbes réfléchissantes d’une sculpture de baleine pendant la fabrication WEIERYANG", caption: "Détail de fabrication WEIERYANG : reflets et jonctions des surfaces courbes." },
      { alt: "Éléments sculptés en forme de mains réunis pendant l’assemblage WEIERYANG", caption: "Fabrication WEIERYANG : formes de mains et jonctions d’assemblage visibles." },
      { alt: "Vue d’ensemble de formes sculptées de mains pendant la fabrication WEIERYANG", caption: "Fabrication WEIERYANG : vue générale de la composition des mains." },
      { alt: "Portrait sculpté et peint pendant la fabrication WEIERYANG", caption: "Fabrication WEIERYANG : portrait sculpté et zones colorées peintes." },
      { alt: "Détail de la surface peinte d’un portrait sculpté pendant la fabrication WEIERYANG", caption: "Détail de fabrication WEIERYANG : transitions de couleur et détails de peinture." },
    ],
  },
  es: {
    eyebrow: "WEIERYANG / REGISTROS DE FABRICACIÓN",
    title: "Observe la forma, el montaje y la superficie.",
    body: "Estas fotografías documentan trabajos de fabricación de WEIERYANG: superficies curvas reflectantes, montaje de formas de manos y detalles pintados de un retrato escultórico.",
    note: "Estas fotografías muestran trabajos en fase de fabricación. Los planos, materiales, acabados y alcance de entrega se acuerdan para cada nuevo encargo.",
    label: "Registro de fabricación WEIERYANG", action: "Enviar el resumen de su proyecto", compactAction: "Ver los registros de fabricación",
    compactTitle: "De la forma general al detalle más pequeño.",
    compactBody: "Tres registros de fabricación a distintas escalas. Revise superficies reflectantes, montaje escultórico y pintura antes de hablar de su proyecto.",
    groups: [
      { title: "Curvas reflectantes desde dos distancias.", body: "Compare la forma general y el detalle de superficie para estudiar líneas reflejadas, cambios de curvatura y uniones visibles." },
      { title: "Montaje de una forma compleja.", body: "Observe la relación entre los componentes con forma de mano y las zonas de montaje antes de definir un nuevo diseño o método de instalación." },
      { title: "Detalles pintados de un retrato escultórico.", body: "Compare el retrato completo con su superficie para estudiar zonas de color, transiciones y la relación entre pintura y forma." },
    ],
    images: [
      { alt: "Escultura reflectante con forma de ballena durante la fabricación de WEIERYANG", caption: "Registro de fabricación WEIERYANG: forma general de ballena y superficies curvas reflectantes." },
      { alt: "Detalle de superficies curvas reflectantes de una escultura de ballena durante la fabricación de WEIERYANG", caption: "Detalle de fabricación WEIERYANG: reflejos y uniones entre superficies curvas." },
      { alt: "Componentes escultóricos con forma de manos reunidos durante el montaje de WEIERYANG", caption: "Registro de fabricación WEIERYANG: formas de manos y uniones de montaje visibles." },
      { alt: "Vista general de formas escultóricas de manos durante la fabricación de WEIERYANG", caption: "Registro de fabricación WEIERYANG: vista general de la composición de manos." },
      { alt: "Retrato escultórico pintado durante la fabricación de WEIERYANG", caption: "Registro de fabricación WEIERYANG: retrato y zonas de color pintadas." },
      { alt: "Detalle de la superficie pintada de un retrato escultórico durante la fabricación de WEIERYANG", caption: "Detalle de fabricación WEIERYANG: transiciones de color y detalles de pintura." },
    ],
  },
  de: {
    eyebrow: "WEIERYANG / FERTIGUNGSDOKUMENTATION",
    title: "Form, Montage und Oberfläche genau betrachten.",
    body: "Diese Fotos dokumentieren WEIERYANG-Fertigungsarbeiten: gewölbte reflektierende Oberflächen, die Montage von Handformen und bemalte Details einer Porträtskulptur.",
    note: "Diese Fotos zeigen Arbeiten während der Fertigung. Zeichnungen, Materialien, Oberfläche und Lieferumfang werden für jeden neuen Auftrag vereinbart.",
    label: "WEIERYANG-Fertigungsdokumentation", action: "Projektbeschreibung senden", compactAction: "Fertigungsdokumentation ansehen",
    compactTitle: "Von der Gesamtform bis zum kleinsten Detail.",
    compactBody: "Drei Fertigungsdokumentationen in unterschiedlichen Maßstäben. Prüfen Sie reflektierende Oberflächen, Montage und Bemalung, bevor Sie Ihr Projekt besprechen.",
    groups: [
      { title: "Reflektierende Wölbungen aus zwei Entfernungen.", body: "Vergleichen Sie Gesamtform und Oberflächendetail, um Reflexionslinien, wechselnde Krümmungen und sichtbare Übergänge zu besprechen." },
      { title: "Montage einer komplexen Form.", body: "Betrachten Sie das Verhältnis der handförmigen Bauteile und die sichtbaren Montagebereiche, bevor Sie einen neuen Entwurf oder Montageablauf festlegen." },
      { title: "Bemalte Details einer Porträtskulptur.", body: "Vergleichen Sie das gesamte Porträt mit seinen Oberflächendetails, um Farbfelder, Übergänge und das Verhältnis von Bemalung und Form zu besprechen." },
    ],
    images: [
      { alt: "Reflektierende walförmige Skulptur während der WEIERYANG-Fertigung", caption: "WEIERYANG-Fertigungsdokumentation: gesamte Walform und gewölbte reflektierende Oberflächen." },
      { alt: "Nahaufnahme gewölbter reflektierender Oberflächen einer Walskulptur während der WEIERYANG-Fertigung", caption: "WEIERYANG-Fertigungsdetail: Reflexionen und Übergänge gewölbter Oberflächen." },
      { alt: "Handförmige Skulpturenteile während der WEIERYANG-Montage zusammengefügt", caption: "WEIERYANG-Fertigungsdokumentation: Handformen und sichtbare Montageverbindungen." },
      { alt: "Gesamtanordnung handförmiger Skulpturen während der WEIERYANG-Fertigung", caption: "WEIERYANG-Fertigungsdokumentation: Gesamtansicht der Handanordnung." },
      { alt: "Bemalte Porträtskulptur während der WEIERYANG-Fertigung", caption: "WEIERYANG-Fertigungsdokumentation: Porträtform und bemalte Farbfelder." },
      { alt: "Nahaufnahme bemalter Oberflächendetails einer Porträtskulptur während der WEIERYANG-Fertigung", caption: "WEIERYANG-Fertigungsdetail: Farbübergänge und Details der Bemalung." },
    ],
  },
};

// The operator identified these photographs as their factory records on 2026-11-02.
// They document the visible workshop and work in progress; no area, capacity,
// equipment specification, material grade, inspection result or completion is inferred.
const factoryImageGeometry = [
  {
    "id": "factoryOverview",
    "file": "factory-workshop-overview.webp",
    "width": 1600,
    "height": 1200
  },
  {
    "id": "sheetMetalWorkstation",
    "file": "factory-sheet-metal-workstation.webp",
    "width": 1600,
    "height": 1200
  },
  {
    "id": "curvedComponents",
    "file": "factory-curved-metal-components.webp",
    "width": 1600,
    "height": 1200
  },
  {
    "id": "reflectiveForm",
    "file": "factory-reflective-form-detail.webp",
    "width": 1600,
    "height": 900
  }
];
const factoryGroupImageIds = [["factoryOverview", "sheetMetalWorkstation"], ["curvedComponents", "reflectiveForm"]];
const factoryGroupIds = ["factory-workshop", "factory-metalwork"];
const allImageGeometry = [...imageGeometry, ...factoryImageGeometry];
const factoryEvidenceCopy = {
  "en": {
    "title": "Inside the workshop: space, metalwork and sculptural detail.",
    "body": "These photographs show the WEIERYANG workshop, sheet-metal workstations, curved components and a reflective form in progress. The fabrication records below continue with sculptural assembly and painted detail.",
    "compactTitle": "A closer look inside our workshop.",
    "compactBody": "View the workshop, curved metal components and a reflective form in progress. Bring your drawings, finish direction and project scope into the discussion.",
    "compactAction": "Explore the workshop and fabrication records",
    "groups": [
      {
        "title": "Inside the workshop.",
        "body": "The overall view and sheet-metal workstation photograph show the workshop layout, material handling and work surfaces."
      },
      {
        "title": "Curved components and reflective form.",
        "body": "Compare the rows of curved components with the reflective abstract form to discuss shape, openings and visible surface transitions for a new commission."
      }
    ],
    "images": [
      {
        "alt": "Overview of the WEIERYANG workshop with worktables, sheet metal and equipment",
        "caption": "WEIERYANG workshop record: worktables, sheet metal and equipment along the workshop aisle."
      },
      {
        "alt": "Sheet-metal workstations and a worker handling a metal sheet in the WEIERYANG workshop",
        "caption": "WEIERYANG workshop record: sheet-metal workstations and material handling."
      },
      {
        "alt": "Rows of curved metal components on worktables in the WEIERYANG workshop",
        "caption": "WEIERYANG fabrication record: curved metal components arranged on worktables."
      },
      {
        "alt": "Reflective abstract form with curved openings during WEIERYANG fabrication",
        "caption": "WEIERYANG fabrication record: reflective surfaces and openings on an abstract form in progress."
      }
    ]
  },
  "zh": {
    "title": "走进车间，看加工与造型细节。",
    "body": "这些照片展示威尔阳车间、板材加工工位、弧形构件与制作中的反光造型。下方既有制作记录继续呈现雕塑组装和涂饰细节。",
    "compactTitle": "走进我们的制作车间。",
    "compactBody": "从车间环境，看到弧形金属构件与制作中的反光造型。结合您的图纸、饰面方向和项目范围展开讨论。",
    "compactAction": "查看车间与制作记录",
    "groups": [
      {
        "title": "车间内部的工作场景。",
        "body": "车间全景与板材工位照片展示工作区布局、材料搬放和操作台面。"
      },
      {
        "title": "弧形构件与反光造型。",
        "body": "对照成排弧形构件与反光抽象造型，讨论新项目的形体、孔洞和可见表面过渡。"
      }
    ],
    "images": [
      {
        "alt": "威尔阳车间全景，可见操作台、金属板材与设备",
        "caption": "威尔阳车间记录：通道两侧的操作台、金属板材与设备。"
      },
      {
        "alt": "威尔阳车间的板材加工工位，工作人员正在搬放金属板材",
        "caption": "威尔阳车间记录：板材加工工位与材料搬放。"
      },
      {
        "alt": "威尔阳车间操作台上成排放置的弧形金属构件",
        "caption": "威尔阳实际制作记录：操作台上排列的弧形金属构件。"
      },
      {
        "alt": "威尔阳制作中的反光抽象造型，可见弧形孔洞与曲面",
        "caption": "威尔阳实际制作记录：制作中抽象造型的反光曲面与孔洞。"
      }
    ]
  },
  "ar": {
    "title": "داخل الورشة: مساحة العمل والمكونات المعدنية وتفاصيل النحت.",
    "body": "تُظهر هذه الصور ورشة WEIERYANG ومحطات العمل على الصفائح المعدنية ومكونات منحنية وشكلاً عاكساً قيد التصنيع. وتستكمل سجلات التصنيع أدناه عرض التجميع النحتي وتفاصيل الطلاء.",
    "compactTitle": "نظرة أقرب داخل ورشتنا.",
    "compactBody": "شاهد الورشة والمكونات المعدنية المنحنية وشكلاً عاكساً قيد التصنيع. ناقش رسوماتك واتجاه التشطيب ونطاق مشروعك بالاستناد إلى هذه السجلات.",
    "compactAction": "استكشف الورشة وسجلات التصنيع",
    "groups": [
      {
        "title": "داخل الورشة.",
        "body": "تُظهر الصورة العامة وصورة محطات الصفائح المعدنية توزيع مساحة العمل ومناولة المواد وأسطح العمل."
      },
      {
        "title": "مكونات منحنية وشكل عاكس.",
        "body": "قارن صفوف المكونات المنحنية بالشكل التجريدي العاكس لمناقشة الشكل والفتحات وانتقالات السطح الظاهرة لمشروع جديد."
      }
    ],
    "images": [
      {
        "alt": "منظر عام لورشة WEIERYANG مع طاولات عمل وصفائح معدنية ومعدات",
        "caption": "سجل ورشة WEIERYANG: طاولات العمل والصفائح المعدنية والمعدات على جانبي ممر الورشة."
      },
      {
        "alt": "محطات عمل للصفائح المعدنية وعامل يناول صفيحة معدنية في ورشة WEIERYANG",
        "caption": "سجل ورشة WEIERYANG: محطات عمل الصفائح المعدنية ومناولة المواد."
      },
      {
        "alt": "صفوف من المكونات المعدنية المنحنية على طاولات العمل في ورشة WEIERYANG",
        "caption": "سجل تصنيع WEIERYANG: مكونات معدنية منحنية مرتبة على طاولات العمل."
      },
      {
        "alt": "شكل تجريدي عاكس ذو فتحات منحنية أثناء تصنيع WEIERYANG",
        "caption": "سجل تصنيع WEIERYANG: أسطح عاكسة وفتحات في شكل تجريدي قيد التصنيع."
      }
    ]
  },
  "fr": {
    "title": "Dans l’atelier : espace de travail, métal et détails sculptés.",
    "body": "Ces photographies montrent l’atelier WEIERYANG, les postes de travail de la tôle, des éléments courbes et une forme réfléchissante en cours de fabrication. Les dossiers ci-dessous présentent ensuite l’assemblage sculptural et les détails peints.",
    "compactTitle": "Un regard au cœur de notre atelier.",
    "compactBody": "Découvrez l’atelier, des éléments métalliques courbes et une forme réfléchissante en cours de fabrication. Appuyez-vous sur ces images pour discuter de vos plans, de la finition et du périmètre de votre projet.",
    "compactAction": "Voir l’atelier et les dossiers de fabrication",
    "groups": [
      {
        "title": "À l’intérieur de l’atelier.",
        "body": "La vue d’ensemble et la photographie des postes de travail de la tôle montrent l’organisation de l’atelier, la manutention et les surfaces de travail."
      },
      {
        "title": "Éléments courbes et forme réfléchissante.",
        "body": "Comparez les rangées d’éléments courbes à la forme abstraite réfléchissante pour discuter du volume, des ouvertures et des transitions de surface visibles pour une nouvelle commande."
      }
    ],
    "images": [
      {
        "alt": "Vue d’ensemble de l’atelier WEIERYANG avec tables de travail, tôles et équipements",
        "caption": "Atelier WEIERYANG documenté : tables de travail, tôles et équipements le long de l’allée."
      },
      {
        "alt": "Postes de travail de la tôle et opérateur manipulant une tôle dans l’atelier WEIERYANG",
        "caption": "Atelier WEIERYANG documenté : postes de travail de la tôle et manutention des matériaux."
      },
      {
        "alt": "Rangées d’éléments métalliques courbes sur des tables dans l’atelier WEIERYANG",
        "caption": "Fabrication WEIERYANG : éléments métalliques courbes disposés sur les tables de travail."
      },
      {
        "alt": "Forme abstraite réfléchissante aux ouvertures courbes pendant la fabrication WEIERYANG",
        "caption": "Fabrication WEIERYANG : surfaces réfléchissantes et ouvertures d’une forme abstraite en cours de réalisation."
      }
    ]
  },
  "es": {
    "title": "Dentro del taller: espacio de trabajo, metal y detalle escultórico.",
    "body": "Estas fotografías muestran el taller de WEIERYANG, puestos de trabajo de chapa, componentes curvos y una forma reflectante en fabricación. Los registros siguientes continúan con el montaje escultórico y los detalles pintados.",
    "compactTitle": "Una mirada al interior de nuestro taller.",
    "compactBody": "Observe el taller, los componentes metálicos curvos y una forma reflectante en fabricación. Utilice estos registros para hablar de sus planos, el acabado y el alcance de su proyecto.",
    "compactAction": "Ver el taller y los registros de fabricación",
    "groups": [
      {
        "title": "En el interior del taller.",
        "body": "La vista general y la fotografía de los puestos de chapa muestran la distribución del taller, la manipulación de materiales y las superficies de trabajo."
      },
      {
        "title": "Componentes curvos y forma reflectante.",
        "body": "Compare las filas de componentes curvos con la forma abstracta reflectante para hablar del volumen, las aberturas y las transiciones de superficie visibles en un nuevo encargo."
      }
    ],
    "images": [
      {
        "alt": "Vista general del taller de WEIERYANG con mesas de trabajo, chapa y equipos",
        "caption": "Registro del taller WEIERYANG: mesas de trabajo, chapa y equipos a lo largo del pasillo."
      },
      {
        "alt": "Puestos de trabajo de chapa y un trabajador manipulando una lámina metálica en el taller de WEIERYANG",
        "caption": "Registro del taller WEIERYANG: puestos de chapa y manipulación de materiales."
      },
      {
        "alt": "Filas de componentes metálicos curvos sobre mesas de trabajo en el taller de WEIERYANG",
        "caption": "Registro de fabricación WEIERYANG: componentes metálicos curvos dispuestos sobre mesas de trabajo."
      },
      {
        "alt": "Forma abstracta reflectante con aberturas curvas durante la fabricación de WEIERYANG",
        "caption": "Registro de fabricación WEIERYANG: superficies reflectantes y aberturas de una forma abstracta en fabricación."
      }
    ]
  },
  "de": {
    "title": "Einblick in die Werkstatt: Arbeitsplätze, Metallteile und skulpturale Details.",
    "body": "Diese Fotos zeigen die WEIERYANG-Werkstatt, Arbeitsplätze für Metallbleche, gebogene Bauteile und eine reflektierende Form während der Fertigung. Die folgenden Aufnahmen dokumentieren anschließend die Montage skulpturaler Formen und bemalte Details.",
    "compactTitle": "Ein näherer Blick in unsere Werkstatt.",
    "compactBody": "Sehen Sie die Werkstatt, gebogene Metallteile und eine reflektierende Form während der Fertigung. Nutzen Sie die Aufnahmen, um Ihre Zeichnungen, Oberflächenvorstellungen und den Projektumfang zu besprechen.",
    "compactAction": "Werkstatt und Fertigungsdokumentation ansehen",
    "groups": [
      {
        "title": "Im Inneren der Werkstatt.",
        "body": "Die Gesamtansicht und das Foto der Blecharbeitsplätze zeigen die Werkstattaufteilung, den Materialumschlag und die Arbeitsflächen."
      },
      {
        "title": "Gebogene Bauteile und reflektierende Form.",
        "body": "Vergleichen Sie die Reihen gebogener Bauteile mit der reflektierenden abstrakten Form, um Form, Öffnungen und sichtbare Oberflächenübergänge für einen neuen Auftrag zu besprechen."
      }
    ],
    "images": [
      {
        "alt": "Gesamtansicht der WEIERYANG-Werkstatt mit Arbeitstischen, Metallblechen und Geräten",
        "caption": "WEIERYANG-Werkstattaufnahme: Arbeitstische, Metallbleche und Geräte entlang des Werkstattgangs."
      },
      {
        "alt": "Arbeitsplätze für Metallbleche und eine Person mit einem Blech in der WEIERYANG-Werkstatt",
        "caption": "WEIERYANG-Werkstattaufnahme: Blecharbeitsplätze und Materialhandhabung."
      },
      {
        "alt": "Reihen gebogener Metallteile auf Arbeitstischen in der WEIERYANG-Werkstatt",
        "caption": "WEIERYANG-Fertigungsdokumentation: auf Arbeitstischen angeordnete gebogene Metallteile."
      },
      {
        "alt": "Reflektierende abstrakte Form mit geschwungenen Öffnungen während der WEIERYANG-Fertigung",
        "caption": "WEIERYANG-Fertigungsdokumentation: reflektierende Flächen und Öffnungen einer abstrakten Form während der Fertigung."
      }
    ]
  }
};

export const workshopEvidenceImages = allImageGeometry.map((image, index) => ({
  ...image, src: `/seo-media/${image.file}`,
  ...(index < imageGeometry.length ? workshopEvidenceCopy.en.images[index] : factoryEvidenceCopy.en.images[index - imageGeometry.length]),
}));

export function getWorkshopImage(id, language = "en") {
  const index = allImageGeometry.findIndex(image => image.id === id);
  if (index < 0) return undefined;
  const copy = workshopEvidenceCopy[language] || workshopEvidenceCopy.en;
  const factoryCopy = factoryEvidenceCopy[language] || factoryEvidenceCopy.en;
  const localCopy = index < imageGeometry.length ? copy.images[index] : factoryCopy.images[index - imageGeometry.length];
  return { ...workshopEvidenceImages[index], ...localCopy };
}

export function getWorkshopEvidence(language = "en") {
  const copy = workshopEvidenceCopy[language] || workshopEvidenceCopy.en;
  const factoryCopy = factoryEvidenceCopy[language] || factoryEvidenceCopy.en;
  const images = allImageGeometry.map(image => getWorkshopImage(image.id, language));
  return {
    ...copy, id: "workshop-records", images,
    title: factoryCopy.title, body: factoryCopy.body,
    compactTitle: factoryCopy.compactTitle, compactBody: factoryCopy.compactBody, compactAction: factoryCopy.compactAction,
    groups: [
      ...factoryGroupImageIds.map((ids, index) => ({ ...factoryCopy.groups[index], id: factoryGroupIds[index], images: ids.map(id => getWorkshopImage(id, language)) })),
      ...groupImageIds.map((ids, index) => ({ ...copy.groups[index], id: `workshop-group-${index + 1}`, images: ids.map(id => getWorkshopImage(id, language)) })),
    ],
    compactImages: ["factoryOverview", "curvedComponents", "reflectiveForm"].map(id => getWorkshopImage(id, language)),
    actionHref: "/commission/?route=process", compactHref: "/process/#factory-workshop",
  };
}

export function workshopImageSrcSet(image) {
  if (!image) return "";
  return [...[640, 960].filter(width => width < image.width).map(width => `${image.src.replace(/\.webp$/, `-${width}w.webp`)} ${width}w`), `${image.src} ${image.width}w`].join(", ");
}
