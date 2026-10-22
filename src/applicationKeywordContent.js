// Buyer wording selected from the operator's keyword research.
// Research demand figures are not project specifications or evidence of an installation.
const paths = {
  gold: '/projects/gold-abstract-sculpture-fabrication/',
  fish: '/projects/suspended-fish-art-installation/',
  petal: '/projects/petal-form-sculpture-display/',
  warm: '/projects/warm-abstract-sculpture-plinth/',
  portrait: '/projects/illuminated-portrait-sculpture-fabrication/',
  leaf: '/projects/leaf-face-sculpture-fabrication/',
  layeredHorse: '/projects/layered-horse-sculpture-fabrication/',
  reflectiveHorse: '/projects/reflective-horse-sculpture/',
};

const content = {
  en: {
    hospitality: {
      intro: 'For hotel and commercial sculpture procurement, start with client-supplied drawings or a jointly developed design. If stainless steel is proposed, confirm its specification and finish approval within the OEM scope, alongside building and delivery interfaces.',
      faq: [['How should we compare commercial stainless steel sculpture manufacturers for a hotel project?', 'Give each manufacturer the same drawing revision, dimensions, proposed material specification, finish reference and required approval records. Compare design development, fabrication, packing, delivery point and exclusions as separate scope items. Identify who reviews the building connection and local engineering. Production photographs can support the discussion, while the approved specification defines the new order.']],
      evidenceLinks: [['Gold-coloured abstract form: finish review', paths.gold], ['Suspended fish forms: ceiling interfaces', paths.fish]],
    },
    retail: {
      intro: 'Briefs for restaurant and cafe sculpture should reflect how staff and guests use the space. Retail display sculpture may also need repeated display changes, relocation or storage. Agree the OEM appearance reference, plinth and site-specific fixing scope around those operating needs.',
      faq: [['What changes when a sculpture is for a restaurant or cafe rather than a retail display?', 'Define the actual operating pattern. In a restaurant or cafe, review serving routes, table clearances, likely guest contact and cleaning access. For a changing retail display, add relocation frequency, removable or permanent fixings, storage and repeat assembly. Confirm the plinth and who approves the proposed footprint; either setting may need both sets of checks.']],
      evidenceLinks: [['Petal form: edges and display plinth', paths.petal], ['Warm abstract form: surface and plinth', paths.warm]],
    },
    themed: {
      intro: 'For custom theme park sculptures, connect original or properly authorised artwork to a site and visitor-use brief. A standalone themed art installation and a multi-piece programme need different approval schedules; agree the OEM fabrication and lighting interfaces for each.',
      faq: [['How does a theme park sculpture programme differ from a standalone themed art installation?', 'A single installation can be briefed around one work, its approved views and its location. For a theme park sculpture programme, add an artwork-and-location schedule, repeated and variant details, permitted visitor contact and any lighting interfaces. Name who approves the shared theme and who releases each item for fabrication.']],
      evidenceLinks: [['Illuminated portrait: artwork and light interfaces', paths.portrait], ['Leaf-face form: texture and detail', paths.leaf]],
    },
    public: {
      intro: 'For a landscape architecture project, sculpture design starts with approach views, ground levels, planting and exposure. A brief for outdoor landscape sculptures should then define the approved form, model development, fabrication interfaces and the responsibilities retained by the site team.',
      faq: [['How should landscape sculpture design be separated from fabrication in the proposal?', 'Ask the proposal to identify site analysis, concept views and model development separately from fabrication to approved drawings. Record the design revision, materials, finish, base interface and the point at which approval permits production. Name the parties responsible for local structural review, foundations and installation, and show which design or site tasks are included, excluded or still to be confirmed.']],
      evidenceLinks: [['Layered horse: profile and base review', paths.layeredHorse], ['Reflective horse: form and site review', paths.reflectiveHorse]],
    },
  },
  zh: {
    hospitality: {
      intro: '酒店与商业空间雕塑采购，应从客户图纸或共同开发的设计开始。若方案采用不锈钢，应在 OEM 范围中确认材料规格、饰面审批，以及建筑连接和交付接口。',
      faq: [['酒店项目比较商业不锈钢雕塑制造商时，怎样统一比较口径？', '向各制造商提供相同的图纸版本、尺寸、拟用材料规格、饰面参考和审批记录要求。将设计开发、制作、包装、交货点和排除项目分项比较，并明确建筑连接和当地工程审核由谁负责。制作照片可辅助沟通，新订单则以获批规格为准。']],
      evidenceLinks: [['金色抽象形体：饰面审阅', paths.gold], ['悬挂鱼形：吊顶接口', paths.fish]],
    },
    retail: {
      intro: '餐厅雕塑和咖啡店雕塑的简报，应反映员工与顾客如何使用空间。零售陈列雕塑还可能涉及换展、搬移或收纳。围绕这些运营需求，确认 OEM 外观参照、底座及各门店的固定范围。',
      faq: [['餐厅、咖啡店雕塑和零售陈列雕塑，采购要求有什么不同？', '先明确实际运营方式。餐厅或咖啡店需要审阅服务动线、桌椅间距、顾客可能接触的位置和清洁通道。经常换展的零售陈列，还应说明搬移频率、可拆或永久固定方式、收纳及重复组装要求。确认底座和拟占地的审批人；两类空间也可能同时需要这些检查。']],
      evidenceLinks: [['花瓣形体：边缘与陈列底座', paths.petal], ['暖色抽象形体：表面与底座', paths.warm]],
    },
    themed: {
      intro: '定制主题公园雕塑，应将原创或适当获授权的图稿与场地、游客使用简报对应起来。单件主题艺术装置与多件作品计划需要不同的审批排期，各自的 OEM 制作和灯光接口也要确认。',
      faq: [['主题公园系列雕塑和单件主题艺术装置，简报应怎样区分？', '单件装置可围绕一件作品、获批视图和摆放位置形成简报。主题公园系列雕塑则需要增加图稿与点位清单，区分重复和变化的细节，说明允许的游客接触及灯光接口。明确共同主题由谁审批，以及每件作品由谁批准进入制作。']],
      evidenceLinks: [['发光人物：图稿与灯光接口', paths.portrait], ['叶片人脸形体：纹理与细节', paths.leaf]],
    },
    public: {
      intro: '景观建筑项目中的雕塑设计，应先考虑来向视线、地面标高、植物和环境暴露条件。户外景观雕塑简报随后应明确获批形体、模型开发、制作接口，以及场地团队继续承担的责任。',
      faq: [['景观雕塑设计与制作，应该在方案中怎样分开？', '要求方案将场地分析、概念视图和模型开发，与按获批图纸制作分别列明。记录设计版本、材料、饰面、基座接口及批准进入制作的节点。明确当地结构审核、基础和安装责任人，并标注设计或场地工作哪些已包含、未包含或仍待确认。']],
      evidenceLinks: [['分层马：轮廓与基座审阅', paths.layeredHorse], ['反光马：形体与场地审阅', paths.reflectiveHorse]],
    },
  },
  ar: {
    hospitality: {
      intro: 'تبدأ مشتريات منحوتات الفنادق والمساحات التجارية برسومات العميل أو تصميم يُطوّر بالتعاون معه. إذا اقتُرح الفولاذ المقاوم للصدأ، فأكّدوا مواصفاته واعتماد التشطيب ضمن نطاق تصنيع OEM، إلى جانب واجهات المبنى والتسليم.',
      faq: [['كيف نقارن مصنّعي منحوتات الفولاذ المقاوم للصدأ التجارية لمشروع فندقي؟', 'قدّموا لكل مصنّع إصدار الرسم نفسه والأبعاد ومواصفات المادة المقترحة ومرجع التشطيب وسجلات الاعتماد المطلوبة. قارنوا تطوير التصميم والتصنيع والتغليف ونقطة التسليم والاستثناءات كبنود منفصلة. حدّدوا مسؤول مراجعة الاتصال بالمبنى والهندسة المحلية. تساعد صور التصنيع في النقاش، لكن المواصفات المعتمدة هي أساس الطلب الجديد.']],
      evidenceLinks: [['شكل تجريدي ذهبي اللون: مراجعة التشطيب', paths.gold], ['أشكال أسماك معلّقة: واجهات السقف', paths.fish]],
    },
    retail: {
      intro: 'ينبغي أن يعكس موجز منحوتات المطعم أو المقهى طريقة استخدام الموظفين والضيوف للمساحة. وقد تحتاج منحوتات العرض التجاري أيضاً إلى تبديل العرض أو النقل أو التخزين. اتفقوا على مرجع المظهر والقاعدة ونطاق التثبيت لكل موقع ضمن تصنيع OEM.',
      faq: [['ما الذي يختلف بين منحوتة لمطعم أو مقهى ومنحوتة لعرض تجاري؟', 'حدّدوا أسلوب التشغيل الفعلي. في المطعم أو المقهى، راجعوا مسارات الخدمة والمسافات حول الطاولات وتلامس الضيوف المحتمل ووصول التنظيف. وللعرض التجاري المتغيّر، أضيفوا تكرار النقل والتثبيت القابل للفك أو الدائم والتخزين وإعادة التجميع. أكّدوا القاعدة ومسؤول اعتماد المساحة المشغولة المقترحة؛ فقد يحتاج أيّ من الموقعين إلى مجموعتي المراجعات.']],
      evidenceLinks: [['شكل بتلات: الحواف وقاعدة العرض', paths.petal], ['شكل تجريدي دافئ اللون: السطح والقاعدة', paths.warm]],
    },
    themed: {
      intro: 'للمنحوتات المخصّصة للمنتزهات ذات الطابع الخاص، اربطوا الرسومات الأصلية أو المصرّح بها بموجز الموقع واستخدام الزوار. تختلف جداول اعتماد تركيب فني ذي طابع خاص منفرد عن برنامج متعدد الأعمال؛ اتفقوا على واجهات تصنيع OEM والإضاءة لكل منها.',
      faq: [['كيف يختلف برنامج منحوتات منتزه ذي طابع خاص عن تركيب فني ذي طابع خاص منفرد؟', 'يمكن إعداد موجز التركيب المنفرد حول عمل واحد ومناظره المعتمدة وموضعه. أما برنامج منحوتات المنتزه فيحتاج إلى جدول للرسومات والمواقع، والتفاصيل المتكررة والمتغيّرة، والتلامس المسموح للزوار وواجهات الإضاءة. حدّدوا مسؤول اعتماد الموضوع المشترك ومن يأذن بتصنيع كل قطعة.']],
      evidenceLinks: [['شخصية مضيئة: الرسومات وواجهات الضوء', paths.portrait], ['وجه وأوراق: الملمس والتفاصيل', paths.leaf]],
    },
    public: {
      intro: 'في مشروع تنسيق المواقع، يبدأ تصميم المنحوتة بدراسة مناظر الاقتراب ومناسيب الأرض والزراعة والتعرّض البيئي. ثم يحدّد موجز المنحوتات الخارجية الشكل المعتمد وتطوير النموذج وواجهات التصنيع والمسؤوليات التي يحتفظ بها فريق الموقع.',
      faq: [['كيف نفصل تصميم منحوتة الموقع عن تصنيعها في العرض؟', 'اطلبوا فصل تحليل الموقع والمناظر التصورية وتطوير النموذج عن التصنيع بالرسومات المعتمدة. سجّلوا إصدار التصميم والمواد والتشطيب وواجهة القاعدة ونقطة الاعتماد التي تسمح بالإنتاج. حدّدوا المسؤولين عن المراجعة الإنشائية المحلية والأساسات والتركيب، وبيّنوا أعمال التصميم أو الموقع المشمولة والمستثناة والتي ما زالت بحاجة إلى تأكيد.']],
      evidenceLinks: [['حصان بطبقات: مراجعة الملامح والقاعدة', paths.layeredHorse], ['حصان عاكس: مراجعة الشكل والموقع', paths.reflectiveHorse]],
    },
  },
  fr: {
    hospitality: {
      intro: 'Pour l’achat de sculptures hôtelières et commerciales, partez des plans du client ou d’un projet développé ensemble. Si l’acier inoxydable est proposé, confirmez sa spécification et la validation de finition dans le périmètre OEM, avec les interfaces du bâtiment et de la livraison.',
      faq: [['Comment comparer les fabricants de sculptures commerciales en acier inoxydable pour un hôtel ?', 'Remettez à chaque fabricant la même révision des plans, les dimensions, la matière proposée, la référence de finition et les validations demandées. Comparez séparément développement du dessin, fabrication, emballage, point de livraison et exclusions. Désignez les responsables de la liaison au bâtiment et de la revue technique locale. Les photos alimentent l’échange ; la spécification approuvée définit la nouvelle commande.']],
      evidenceLinks: [['Forme abstraite dorée : revue de finition', paths.gold], ['Formes de poissons suspendus : interfaces du plafond', paths.fish]],
    },
    retail: {
      intro: 'Le brief d’une sculpture de restaurant ou de café doit refléter l’usage du lieu par le personnel et les clients. Une sculpture de présentation commerciale peut aussi nécessiter des changements d’exposition, un déplacement ou du stockage. Convenez de la référence d’aspect OEM, du socle et des fixations propres à chaque site.',
      faq: [['Qu’est-ce qui change entre une sculpture de restaurant ou de café et une présentation commerciale ?', 'Définissez le fonctionnement réel. Pour un restaurant ou un café, examinez les parcours de service, les dégagements autour des tables, le contact possible du public et l’accès au nettoyage. Pour une présentation évolutive, ajoutez la fréquence des déplacements, les fixations démontables ou permanentes, le stockage et les remontages. Confirmez le socle et le valideur de l’emprise proposée ; les deux lieux peuvent nécessiter l’ensemble de ces vérifications.']],
      evidenceLinks: [['Forme de pétales : bords et socle de présentation', paths.petal], ['Forme abstraite aux tons chauds : surface et socle', paths.warm]],
    },
    themed: {
      intro: 'Pour des sculptures sur mesure de parc à thème, reliez des dessins originaux ou dûment autorisés au brief du site et de l’usage des visiteurs. Une installation artistique thématique isolée et un programme de plusieurs œuvres demandent des calendriers de validation différents ; précisez les interfaces de fabrication OEM et d’éclairage de chacun.',
      faq: [['En quoi un programme de sculptures de parc à thème diffère-t-il d’une installation thématique isolée ?', 'Une installation isolée peut être définie autour d’une œuvre, de ses vues approuvées et de son emplacement. Un programme de parc à thème demande aussi un tableau des dessins et des emplacements, les détails répétés ou variables, le contact autorisé des visiteurs et les interfaces d’éclairage. Désignez qui valide le thème commun et qui autorise la fabrication de chaque pièce.']],
      evidenceLinks: [['Portrait lumineux : dessin et interfaces d’éclairage', paths.portrait], ['Visage et feuilles : texture et détails', paths.leaf]],
    },
    public: {
      intro: 'Dans un projet d’architecture paysagère, la conception d’une sculpture part des vues d’approche, niveaux du terrain, plantations et conditions d’exposition. Le brief de sculptures paysagères extérieures précise ensuite forme approuvée, développement du modèle, interfaces de fabrication et responsabilités conservées par l’équipe du site.',
      faq: [['Comment séparer conception d’une sculpture paysagère et fabrication dans la proposition ?', 'Demandez de distinguer analyse du site, vues conceptuelles et développement du modèle de la fabrication sur plans approuvés. Consignez révision du dessin, matériaux, finition, interface du socle et validation autorisant la production. Nommez les responsables de la revue structurelle locale, des fondations et de la pose, puis précisez les tâches de conception ou de chantier incluses, exclues ou encore à confirmer.']],
      evidenceLinks: [['Cheval en couches : revue du profil et de la base', paths.layeredHorse], ['Cheval réfléchissant : revue de la forme et du site', paths.reflectiveHorse]],
    },
  },
  es: {
    hospitality: {
      intro: 'Para adquirir esculturas para hoteles y espacios comerciales, parta de planos del cliente o de un diseño desarrollado en conjunto. Si se propone acero inoxidable, confirme su especificación y la aprobación del acabado dentro del alcance OEM, junto con las interfaces del edificio y la entrega.',
      faq: [['¿Cómo comparar fabricantes de esculturas comerciales de acero inoxidable para un hotel?', 'Entregue a cada fabricante la misma revisión del plano, dimensiones, material propuesto, referencia de acabado y registros de aprobación solicitados. Compare por separado desarrollo del diseño, fabricación, embalaje, punto de entrega y exclusiones. Identifique quién revisa la conexión al edificio y la ingeniería local. Las fotografías apoyan la conversación; la especificación aprobada define el nuevo pedido.']],
      evidenceLinks: [['Forma abstracta dorada: revisión del acabado', paths.gold], ['Formas de peces suspendidos: interfaces del techo', paths.fish]],
    },
    retail: {
      intro: 'El resumen de una escultura para restaurante o cafetería debe reflejar el uso del espacio por personal y clientes. Una escultura de exposición comercial también puede requerir cambios de presentación, traslado o almacenamiento. Acuerde la referencia de apariencia OEM, el pedestal y las fijaciones específicas de cada local.',
      faq: [['¿Qué cambia entre una escultura para restaurante o cafetería y una exposición comercial?', 'Defina el funcionamiento real. En un restaurante o cafetería, revise rutas de servicio, espacios alrededor de mesas, posible contacto de clientes y acceso de limpieza. Para una exposición cambiante, añada frecuencia de traslado, fijaciones desmontables o permanentes, almacenamiento y montaje repetido. Confirme el pedestal y quién aprueba la ocupación prevista; ambos entornos pueden necesitar todas estas revisiones.']],
      evidenceLinks: [['Forma de pétalos: bordes y pedestal de exposición', paths.petal], ['Forma abstracta cálida: superficie y pedestal', paths.warm]],
    },
    themed: {
      intro: 'Para esculturas personalizadas de parques temáticos, conecte diseños originales o debidamente autorizados con el resumen del lugar y del uso de visitantes. Una instalación artística temática individual y un programa de varias obras requieren calendarios de aprobación distintos; acuerde las interfaces de fabricación OEM e iluminación de cada uno.',
      faq: [['¿En qué difiere un programa de esculturas para parque temático de una instalación temática individual?', 'Una instalación individual puede definirse en torno a una obra, sus vistas aprobadas y su ubicación. Para un programa de parque temático, añada una relación de diseños y emplazamientos, detalles repetidos y variables, contacto permitido de visitantes e interfaces de iluminación. Nombre a quien aprueba el tema común y a quien autoriza la fabricación de cada pieza.']],
      evidenceLinks: [['Retrato iluminado: diseño e interfaces de luz', paths.portrait], ['Rostro y hojas: textura y detalles', paths.leaf]],
    },
    public: {
      intro: 'En un proyecto de arquitectura paisajística, el diseño escultórico parte de las vistas de aproximación, niveles del suelo, plantaciones y exposición ambiental. El resumen de esculturas paisajísticas exteriores debe definir después la forma aprobada, desarrollo del modelo, interfaces de fabricación y responsabilidades del equipo del lugar.',
      faq: [['¿Cómo separar el diseño de escultura paisajística y la fabricación en la propuesta?', 'Pida que el análisis del lugar, las vistas conceptuales y el desarrollo del modelo se distingan de la fabricación según planos aprobados. Registre revisión del diseño, materiales, acabado, interfaz de la base y aprobación que permite producir. Identifique a los responsables de revisión estructural local, cimentaciones e instalación, y especifique qué tareas de diseño u obra están incluidas, excluidas o pendientes de confirmación.']],
      evidenceLinks: [['Caballo por capas: revisión del perfil y la base', paths.layeredHorse], ['Caballo reflectante: revisión de la forma y el lugar', paths.reflectiveHorse]],
    },
  },
  de: {
    hospitality: {
      intro: 'Beginnen Sie bei Hotel- und Gewerbeskulpturen mit Kundenzeichnungen oder einem gemeinsam entwickelten Entwurf. Wird Edelstahl vorgeschlagen, bestätigen Sie Spezifikation und Oberflächenfreigabe im OEM-Umfang zusammen mit Gebäude- und Lieferschnittstellen.',
      faq: [['Wie vergleichen wir Hersteller gewerblicher Edelstahlskulpturen für ein Hotelprojekt?', 'Geben Sie jedem Hersteller denselben Zeichnungsstand, dieselben Maße, vorgeschlagene Materialspezifikation, Oberflächenreferenz und geforderten Freigabenachweise. Vergleichen Sie Entwurfsentwicklung, Fertigung, Verpackung, Lieferpunkt und Ausschlüsse getrennt. Benennen Sie die Prüfer für Gebäudeanschluss und lokale technische Planung. Fertigungsfotos unterstützen das Gespräch; die freigegebene Spezifikation bestimmt den neuen Auftrag.']],
      evidenceLinks: [['Goldfarbene abstrakte Form: Oberflächenprüfung', paths.gold], ['Hängende Fischformen: Deckenschnittstellen', paths.fish]],
    },
    retail: {
      intro: 'Das Briefing für Restaurant- oder Caféskulpturen sollte die Raumnutzung durch Personal und Gäste abbilden. Eine Skulptur für die Warenpräsentation kann auch wechselnde Aufstellungen, Standortwechsel oder Lagerung erfordern. Vereinbaren Sie dafür im Rahmen der OEM-Fertigung ein Referenzmuster für das Erscheinungsbild, den Sockel und den standortbezogenen Befestigungsumfang.',
      faq: [['Was unterscheidet eine Restaurant- oder Caféskulptur von einer wechselnden Warenpräsentation?', 'Definieren Sie den tatsächlichen Betrieb. Prüfen Sie in Restaurant oder Café Servicewege, Abstände an Tischen, möglichen Gästekontakt und Reinigungszugang. Ergänzen Sie bei wechselnden Präsentationen Umstellhäufigkeit, lösbare oder dauerhafte Befestigungen, Lagerung und wiederholte Montage. Bestätigen Sie den Sockel und die Freigabe der geplanten Stellfläche; beide Einsatzorte können alle diese Prüfungen benötigen.']],
      evidenceLinks: [['Blütenblattform: Kanten und Präsentationssockel', paths.petal], ['Warmfarbene abstrakte Form: Oberfläche und Sockel', paths.warm]],
    },
    themed: {
      intro: 'Verbinden Sie bei individuellen Themenpark-Skulpturen originale oder ordnungsgemäß freigegebene Vorlagen mit Standort und geplanter Besuchernutzung. Eine einzelne thematische Kunstinstallation und ein Programm mit mehreren Werken brauchen unterschiedliche Freigabepläne; vereinbaren Sie jeweils OEM-Fertigungs- und Beleuchtungsschnittstellen.',
      faq: [['Wie unterscheidet sich ein Themenpark-Skulpturenprogramm von einer einzelnen thematischen Kunstinstallation?', 'Eine einzelne Installation lässt sich über ein Werk, seine freigegebenen Ansichten und seinen Standort beschreiben. Ergänzen Sie bei einem Themenpark-Programm eine Werk- und Standortliste, wiederkehrende und abweichende Details, erlaubten Besucherkontakt und Beleuchtungsschnittstellen. Benennen Sie, wer das gemeinsame Thema freigibt und wer jedes Einzelstück zur Fertigung freigibt.']],
      evidenceLinks: [['Beleuchtetes Porträt: Vorlage und Lichtanschlüsse', paths.portrait], ['Blattgesicht: Struktur und Details', paths.leaf]],
    },
    public: {
      intro: 'Bei einem landschaftsarchitektonischen Projekt beginnt der Skulpturenentwurf mit Annäherungsansichten, Geländehöhen, Bepflanzung und Umwelteinflüssen. Das Briefing für Landschaftsskulpturen im Außenraum definiert anschließend freigegebene Form, Modellentwicklung, Fertigungsschnittstellen und verbleibende Aufgaben des Standortteams.',
      faq: [['Wie trennen wir Landschaftsskulpturenentwurf und Fertigung im Angebot?', 'Lassen Sie Standortanalyse, Konzeptansichten und Modellentwicklung von der Fertigung nach freigegebenen Zeichnungen unterscheiden. Dokumentieren Sie Entwurfsstand, Materialien, Oberfläche, Sockelschnittstelle und die Freigabe zur Produktion. Benennen Sie die Verantwortlichen für lokale Tragwerksprüfung, Fundamente und Montage sowie enthaltene, ausgeschlossene oder noch zu bestätigende Entwurfs- und Standortleistungen.']],
      evidenceLinks: [['Geschichtetes Pferd: Profil- und Sockelprüfung', paths.layeredHorse], ['Reflektierendes Pferd: Form- und Standortprüfung', paths.reflectiveHorse]],
    },
  },
};

export function getApplicationKeywordContent(id, language = 'en') {
  return (content[language] || content.en)[id] || null;
}
