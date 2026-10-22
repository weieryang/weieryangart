// Editorial fabrication notes: observed photographs and proposed-project checks are distinct.
// Image-display or maker confirmation does not grant reproduction rights or verify specifications.
const entry = (title, standfirst, sections, brief, faq) => ({
  title, standfirst, sections: sections.map(([heading, body]) => ({ heading, body })), brief, faq,
});

export const workArticleContentA = {
  'gold-abstract-sculpture-fabrication': {
    en: entry(
      'Gold-Coloured Abstract Sculpture: Curves & Finish',
      'A workshop photograph of a gold-coloured abstract form offers a starting point for reviewing reflections, viewing angles and support requirements.',
      [
        ['Read the reflective curves', 'The photograph shows an irregular gold-coloured form with loops, projecting curves and workshop supports. Reflected lines change across its surfaces. These visible features help describe the work; they do not establish its physical dimensions, material grade, coating system or installation destination.'],
        ['Approve the finish under project lighting', 'For a new commission, compare the main viewing angles and reflected lines under the intended lighting. Agree a finish sample and the appearance views to be approved. A gold-coloured photograph is a visual reference, not a specification for a particular metal or surface treatment.'],
        ['Coordinate support and transport', 'The workshop supports are visible, but the image does not explain a permanent fixing system. Request the approved orientation, base interfaces and handling arrangement for the proposed piece. Projecting areas need a packing and access review before transport scope is agreed.'],
      ],
      ['Approved views, overall dimensions and clearly labelled units.', 'Finish reference, lighting context and the person approving appearance.', 'Proposed base, destination access and handling responsibilities.'],
      [['Is the gold colour proof of a particular material?', 'No. The image records colour and reflections. Material, coating, finish sample and acceptance reference must be specified and approved for the commissioned work.'], ['Can we request this type of form for a hotel?', 'A hotel application can be reviewed using your site plans and approved design direction. The workshop photograph does not establish an installed hotel project or permission to reproduce an existing design.']],
    ),
    zh: entry(
      '金色抽象雕塑：曲面、反射与饰面审批',
      '从金色抽象造型的车间实拍出发，讨论曲面反射、观看角度及新项目的支承要求。',
      [
        ['观察反光曲面的变化', '照片中可见带环状结构、外伸曲面和临时支承的金色抽象造型，反射线随表面变化。这些是可观察的形态信息，不能据此确认作品实际尺寸、材料牌号、涂层体系或安装目的地。'],
        ['在项目光线下确认饰面', '新委托应结合主要视角和计划中的照明，比较反射线与整体外观。约定饰面样板及需要审批的视图。金色照片提供视觉参考，不等于某种金属或表面处理的技术规格。'],
        ['协调支承和运输', '图中可见车间支承，但看不出永久固定系统。新作品需提供获批方向、底座接口和搬运安排；突出部位应在确定运输范围前评估包装及进场条件。'],
      ],
      ['获批视图、整体尺寸与明确标注的单位。', '饰面参考、照明环境和外观审批人。', '拟用底座、目的地通道与搬运责任。'],
      [['金色外观能证明具体材料吗？', '不能。照片记录颜色与反射；委托作品的材料、涂层、饰面样板和验收参考需要单独确定并审批。'], ['这类造型可以用于酒店吗？', '可结合酒店场地平面和获批设计方向评估。车间照片不代表已有酒店安装案例，也不能据此确认复制既有设计的权限。']],
    ),
    ar: entry(
      'منحوتة تجريدية ذهبية اللون: المنحنيات والتشطيب',
      'صورة ورشة لشكل تجريدي ذهبي اللون تساعد في مناقشة الانعكاسات وزوايا الرؤية ومتطلبات الإسناد لمشروع جديد.',
      [
        ['قراءة المنحنيات العاكسة', 'تُظهر الصورة شكلاً غير منتظم ذهبي اللون بحلقات ومنحنيات بارزة ودعامات في الورشة. تتغير خطوط الانعكاس عبر السطح. هذه ملاحظات بصرية لا تحدد الأبعاد الفعلية أو درجة المادة أو نظام الطلاء أو وجهة التركيب.'],
        ['اعتماد التشطيب تحت إضاءة المشروع', 'لمشروع جديد، قارن الزوايا الرئيسية وخطوط الانعكاس تحت الإضاءة المقترحة. اتفق على عينة التشطيب ومناظر المظهر المطلوبة للاعتماد. الصورة الذهبية مرجع بصري وليست مواصفة لمعدن أو معالجة سطحية بعينها.'],
        ['تنسيق الإسناد والنقل', 'تظهر دعامات الورشة، لكن الصورة لا تشرح تثبيتاً دائماً. اطلب الاتجاه المعتمد وواجهات القاعدة وترتيب المناولة للعمل المقترح. تحتاج المناطق البارزة إلى مراجعة التغليف والوصول قبل الاتفاق على نطاق النقل.'],
      ],
      ['مناظر معتمدة وأبعاد كلية ووحدات واضحة.', 'مرجع التشطيب والإضاءة ومسؤول اعتماد المظهر.', 'القاعدة المقترحة ووصول الوجهة ومسؤوليات المناولة.'],
      [['هل اللون الذهبي يثبت مادة محددة؟', 'لا. تسجّل الصورة اللون والانعكاسات. يجب تحديد واعتماد المادة والطلاء وعينة التشطيب ومرجع القبول للعمل المطلوب.'], ['هل يمكن طلب شكل مماثل لفندق؟', 'يمكن مراجعة الاستخدام مع مخططات موقعك واتجاه تصميم معتمد. صورة الورشة لا تثبت مشروع فندق مركّباً أو حق استنساخ تصميم قائم.']],
    ),
    fr: entry(
      'Sculpture abstraite dorée : courbes et finition',
      'Une photo d’atelier d’une forme abstraite dorée permet d’aborder les reflets, les vues et les besoins de support d’un nouveau projet.',
      [
        ['Lire les courbes réfléchissantes', 'La photo montre une forme irrégulière dorée, avec boucles, courbes saillantes et supports d’atelier. Les lignes réfléchies varient sur les surfaces. Ces observations ne déterminent ni dimensions réelles, ni nuance de matériau, ni revêtement, ni lieu d’installation.'],
        ['Valider sous l’éclairage du projet', 'Pour une nouvelle commande, comparez vues principales et reflets avec l’éclairage prévu. Convenez d’un échantillon de finition et des vues à valider. La couleur dorée photographiée est une référence visuelle, pas une spécification de métal ou de traitement.'],
        ['Coordonner support et transport', 'Les supports d’atelier sont visibles sans expliquer une fixation permanente. Demandez orientation approuvée, interfaces du socle et manutention prévues. Les saillies nécessitent une étude de l’emballage et des accès avant de définir le transport.'],
      ],
      ['Vues approuvées, dimensions générales et unités indiquées.', 'Référence de finition, éclairage et valideur de l’apparence.', 'Socle prévu, accès à destination et responsabilités de manutention.'],
      [['La couleur dorée prouve-t-elle un matériau précis ?', 'Non. La photo documente couleur et reflets. Matériau, revêtement, échantillon et référence de réception doivent être définis pour la commande.'], ['Peut-on envisager cette forme pour un hôtel ?', 'L’application peut être étudiée avec les plans du site et une orientation approuvée. La photo d’atelier ne prouve ni installation hôtelière ni droit de reproduire un dessin existant.']],
    ),
    es: entry(
      'Escultura abstracta dorada: curvas y acabado',
      'Una foto de taller de una forma abstracta dorada permite revisar reflejos, ángulos y necesidades de apoyo para un nuevo proyecto.',
      [
        ['Leer las curvas reflectantes', 'La foto muestra una forma irregular dorada con bucles, curvas salientes y apoyos de taller. Las líneas reflejadas cambian sobre las superficies. Lo visible no determina dimensiones físicas, grado del material, recubrimiento ni destino de instalación.'],
        ['Aprobar bajo la iluminación del proyecto', 'Para un encargo nuevo, compare vistas principales y reflejos con la iluminación prevista. Acuerde muestra de acabado y vistas de aprobación. Una foto dorada es una referencia visual, no la especificación de un metal o tratamiento.'],
        ['Coordinar apoyo y transporte', 'Los apoyos del taller son visibles, pero no explican una fijación permanente. Solicite orientación aprobada, interfaces de base y manipulación prevista. Las zonas salientes requieren revisar embalaje y accesos antes de acordar el transporte.'],
      ],
      ['Vistas aprobadas, dimensiones generales y unidades indicadas.', 'Referencia de acabado, iluminación y aprobador de apariencia.', 'Base prevista, acceso al destino y responsables de manipulación.'],
      [['¿El color dorado demuestra un material concreto?', 'No. La imagen registra color y reflejos. Material, recubrimiento, muestra y referencia de aceptación deben especificarse y aprobarse para el encargo.'], ['¿Podemos solicitar este tipo de forma para un hotel?', 'Puede evaluarse con planos del lugar y un diseño aprobado. La foto del taller no acredita un hotel instalado ni permiso para reproducir un diseño existente.']],
    ),
    de: entry(
      'Goldfarbene abstrakte Skulptur: Kurven und Oberfläche',
      'Ein Werkstattfoto der goldfarbenen Form bietet einen Einstieg in Reflexionen, Blickwinkel und Auflagerfragen eines neuen Projekts.',
      [
        ['Reflektierende Kurven lesen', 'Das Foto zeigt eine unregelmäßige goldfarbene Form mit Schleifen, auskragenden Kurven und Werkstattauflagen. Spiegelungslinien verändern sich über die Oberflächen. Dies belegt weder tatsächliche Maße, Materialgüte, Beschichtungssystem noch Montageort.'],
        ['Oberfläche unter Projektlicht freigeben', 'Vergleichen Sie für einen neuen Auftrag Hauptansichten und Spiegelungen unter geplanter Beleuchtung. Vereinbaren Sie Oberflächenmuster und Freigabeansichten. Ein goldfarbenes Foto ist eine visuelle Referenz, keine Metall- oder Behandlungsspezifikation.'],
        ['Auflager und Transport abstimmen', 'Werkstattauflagen sind sichtbar, eine dauerhafte Befestigung wird nicht erklärt. Fordern Sie freigegebene Ausrichtung, Sockelschnittstellen und Handhabung an. Vorsprünge benötigen Verpackungs- und Zugangsprüfung, bevor Transportleistungen vereinbart werden.'],
      ],
      ['Freigegebene Ansichten, Gesamtmaße und klare Einheiten.', 'Oberflächenreferenz, Beleuchtung und Erscheinungsfreigeber.', 'Geplanter Sockel, Zielzugang und Handhabungsverantwortung.'],
      [['Beweist die Goldfarbe ein bestimmtes Material?', 'Nein. Das Foto dokumentiert Farbe und Reflexion. Material, Beschichtung, Muster und Abnahmereferenz müssen für den Auftrag festgelegt werden.'], ['Ist eine solche Form für ein Hotel möglich?', 'Die Anwendung kann anhand von Lageplänen und freigegebener Gestaltung geprüft werden. Das Werkstattfoto belegt weder Hotelmontage noch ein Recht zur Nachbildung eines bestehenden Entwurfs.']],
    ),
  },
  'suspended-fish-art-installation': {
    en: entry(
      'Suspended Fish Art: Light, Spacing & Ceiling Interfaces',
      'A view of suspended fish-shaped forms shows illuminated outlines, hanging elements and wires to review against a new site’s ceiling plan.',
      [
        ['Separate outline, hanging elements and light', 'The photograph shows fish-shaped outlines with illuminated edges, suspended loop-like elements and visible wires. Read these as distinct layers of the composition. The image does not identify the material, electrical specification, support loads or the building in which the work is shown.'],
        ['Review ceiling and electrical interfaces', 'For a proposed installation, provide ceiling levels, available clear heights, services and maintenance access. Identify the parties reviewing suspension and electrical connections. Decorative appearance in a photograph does not establish a certified hanging system or an installation method for another building.'],
        ['Approve the grouped arrangement', 'Use a reflected ceiling plan or coordinated drawing to confirm the number, orientation, spacing and relative levels of the forms. Agree the visual approval reference and assembly information. Local engineering, power provision, access equipment and site responsibilities require a written scope.'],
      ],
      ['Ceiling plan, levels, clear heights and maintenance access.', 'Proposed arrangement, light reference and artwork approval views.', 'Suspension, power and local installation responsibilities.'],
      [['Does the photograph establish a safe suspension design for our building?', 'No. The visible wires document appearance only. The new building’s support points, loads, connections, approvals and access arrangements require project-specific review by the responsible parties.'], ['Can the spacing or number of forms be changed?', 'A new arrangement can be reviewed from your ceiling plan and design brief. Confirm viewing distances, clearances and approval drawings rather than scaling a photograph into a fabrication plan.']],
    ),
    zh: entry(
      '鱼形悬挂艺术：灯光、间距与吊顶接口',
      '鱼形悬挂造型实拍呈现发光轮廓、垂挂元素与吊线，可结合新场地吊顶平面讨论。',
      [
        ['分清轮廓、垂挂元素与光', '图中可见发光鱼形外轮廓、垂挂的环状元素及吊线，可分别观察各层关系。照片本身不说明材料、电气规格、支承荷载或所在建筑身份。'],
        ['核对吊顶和电气接口', '新项目应提供吊顶标高、可用净空、设备管线和维护通道，并指定吊挂与电气连接的审核方。照片中的装饰外观不代表已有认证吊挂系统，也不直接适用于另一栋建筑。'],
        ['审批成组排布', '用吊顶平面或协调图确认造型数量、方向、间距和相对标高，约定外观审批参考与组装资料。当地工程、供电、作业设备和现场责任需写入范围。'],
      ],
      ['吊顶平面、标高、净空和维护通道。', '拟用排布、灯光参考与图稿审批视图。', '吊挂、供电和当地安装责任。'],
      [['照片能证明适用于我们建筑的安全吊挂设计吗？', '不能。可见吊线只记录外观。新建筑的支点、荷载、连接、审批与作业条件需要由责任方按项目审核。'], ['可以调整数量和间距吗？', '可根据吊顶平面和设计简报评估新排布。应确认观看距离、净空及审批图，而不是按照片比例直接制作。']],
    ),
    ar: entry(
      'فن الأسماك المعلق: الضوء والتباعد وواجهات السقف',
      'تُظهر أشكال الأسماك المعلقة حواف مضيئة وعناصر متدلية وأسلاكاً لمراجعتها مع مخطط سقف موقع جديد.',
      [
        ['فصل الشكل والعناصر المتدلية والضوء', 'تظهر في الصورة أشكال أسماك بحواف مضيئة وعناصر حلقية متدلية وأسلاك ظاهرة. اقرأها كطبقات مستقلة للتكوين. لا تحدد الصورة المادة أو المواصفات الكهربائية أو أحمال الإسناد أو هوية المبنى.'],
        ['مراجعة السقف والواجهات الكهربائية', 'لتركيب مقترح، قدّم مناسيب السقف والخلوص والخدمات ووصول الصيانة. حدّد مراجعي التعليق والتوصيلات الكهربائية. المظهر الزخرفي لا يثبت نظام تعليق معتمداً أو طريقة مناسبة لمبنى آخر.'],
        ['اعتماد الترتيب الجماعي', 'استخدم مخطط سقف أو رسماً منسقاً لتأكيد العدد والاتجاه والتباعد والمناسيب النسبية. اتفق على مرجع المظهر ومعلومات التجميع. تتطلب الهندسة المحلية والطاقة ومعدات الوصول والمسؤوليات نطاقاً مكتوباً.'],
      ],
      ['مخطط السقف والمناسيب والخلوص ووصول الصيانة.', 'الترتيب المقترح ومرجع الضوء ومناظر اعتماد الرسومات.', 'مسؤوليات التعليق والطاقة والتركيب المحلي.'],
      [['هل تثبت الصورة تصميماً آمناً للتعليق في مبنانا؟', 'لا. الأسلاك الظاهرة توثق المظهر فقط. تحتاج نقاط الإسناد والأحمال والتوصيلات والاعتمادات والوصول لمراجعة خاصة بالمشروع من الأطراف المسؤولة.'], ['هل يمكن تغيير التباعد أو العدد؟', 'يمكن مراجعة ترتيب جديد بمخطط السقف وموجز التصميم. أكّد مسافات الرؤية والخلوص ورسومات الاعتماد بدلاً من تحويل أبعاد صورة إلى مخطط تصنيع.']],
    ),
    fr: entry(
      'Poissons suspendus : lumière, espacement et plafond',
      'Des formes de poissons suspendues montrent contours lumineux, éléments pendants et câbles à comparer au plan d’un nouveau plafond.',
      [
        ['Distinguer forme, éléments pendants et lumière', 'La photo montre des contours de poissons lumineux, des éléments en boucles et des câbles visibles. Lisez ces couches séparément. L’image n’identifie ni matériau, spécification électrique, charges de support ni bâtiment.'],
        ['Étudier plafond et interfaces électriques', 'Pour une nouvelle installation, fournissez niveaux, hauteurs libres, réseaux et accès d’entretien. Identifiez les responsables de la suspension et des raccordements électriques. L’aspect décoratif ne prouve pas un système certifié ou adapté à un autre bâtiment.'],
        ['Valider la composition groupée', 'Un plan de plafond ou dessin coordonné doit fixer nombre, orientations, espacements et niveaux relatifs. Convenez de la référence visuelle et du montage. Ingénierie locale, alimentation, moyens d’accès et responsabilités exigent un périmètre écrit.'],
      ],
      ['Plan du plafond, niveaux, dégagements et accès d’entretien.', 'Composition prévue, lumière de référence et vues à valider.', 'Responsabilités de suspension, alimentation et pose locale.'],
      [['La photo prouve-t-elle une suspension sûre pour notre bâtiment ?', 'Non. Les câbles visibles documentent seulement l’apparence. Supports, charges, raccords, validations et accès du nouveau bâtiment nécessitent une étude par les responsables.'], ['Peut-on modifier nombre et espacement ?', 'Une nouvelle composition peut être étudiée avec votre plan de plafond. Confirmez distances, dégagements et dessins validés ; ne transformez pas une photo en plan coté de fabrication.']],
    ),
    es: entry(
      'Peces suspendidos: luz, separación y techo',
      'Una vista de peces suspendidos muestra contornos iluminados, elementos colgantes y cables para revisar con el plano del nuevo techo.',
      [
        ['Separar contorno, elementos colgantes y luz', 'La fotografía muestra contornos de peces iluminados, elementos en forma de bucle y cables visibles. Léalo como capas distintas. No identifica material, especificaciones eléctricas, cargas de apoyo ni edificio.'],
        ['Revisar techo e interfaces eléctricas', 'Para una instalación nueva, aporte niveles, alturas libres, instalaciones y acceso de mantenimiento. Identifique revisores de suspensión y conexiones. El aspecto decorativo no acredita un sistema certificado ni un método válido para otro edificio.'],
        ['Aprobar la composición del conjunto', 'Use un plano de techo o dibujo coordinado para confirmar número, orientación, separación y niveles relativos. Acuerde referencia visual e información de montaje. Ingeniería local, alimentación, equipos de acceso y responsabilidades requieren alcance escrito.'],
      ],
      ['Plano de techo, niveles, alturas libres y mantenimiento.', 'Disposición propuesta, luz y vistas de aprobación.', 'Responsables de suspensión, alimentación e instalación local.'],
      [['¿La imagen demuestra una suspensión segura para nuestro edificio?', 'No. Los cables visibles solo documentan apariencia. Apoyos, cargas, conexiones, aprobaciones y acceso del nuevo edificio requieren revisión específica de los responsables.'], ['¿Podemos cambiar cantidad o separación?', 'Puede revisarse una nueva disposición con su plano y resumen. Confirme distancias, espacios y dibujos aprobados; no convierta la escala de una foto en plano de fabricación.']],
    ),
    de: entry(
      'Hängende Fischformen: Licht, Abstand und Decke',
      'Die Ansicht hängender Fischformen zeigt beleuchtete Konturen, Hängeelemente und Drähte zur Prüfung mit einem neuen Deckenplan.',
      [
        ['Kontur, Hängeelemente und Licht unterscheiden', 'Das Foto zeigt Fischkonturen mit Leuchtkanten, hängenden Schlaufen und sichtbaren Drähten. Betrachten Sie diese als getrennte Gestaltungsebenen. Material, Elektrospezifikation, Auflagerlasten und Gebäudeidentität werden nicht belegt.'],
        ['Decke und Elektroschnittstellen prüfen', 'Liefern Sie für ein neues Projekt Deckenhöhen, Freiräume, Leitungen und Wartungszugang. Benennen Sie Prüfer für Aufhängung und Elektrik. Dekoratives Erscheinungsbild belegt kein zertifiziertes oder für andere Gebäude geeignetes Hängesystem.'],
        ['Gruppenanordnung freigeben', 'Bestätigen Sie Anzahl, Ausrichtung, Abstände und Höhen mit Deckenplan oder abgestimmter Zeichnung. Vereinbaren Sie Erscheinungsreferenz und Montageinformationen. Örtliche Ingenieurleistungen, Stromversorgung, Zugangsmittel und Zuständigkeiten benötigen einen schriftlichen Umfang.'],
      ],
      ['Deckenplan, Höhen, Freiräume und Wartungszugang.', 'Geplante Anordnung, Lichtreferenz und Freigabeansichten.', 'Verantwortung für Aufhängung, Strom und örtliche Montage.'],
      [['Belegt das Foto eine sichere Aufhängung für unser Gebäude?', 'Nein. Die Drähte dokumentieren nur das Erscheinungsbild. Auflager, Lasten, Anschlüsse, Freigaben und Zugänge im neuen Gebäude müssen durch Verantwortliche geprüft werden.'], ['Sind andere Abstände oder Anzahlen möglich?', 'Eine neue Anordnung kann anhand Ihres Deckenplans geprüft werden. Bestätigen Sie Betrachtungsabstände, Freiräume und Zeichnungen, statt ein Foto zum Fertigungsplan zu skalieren.']],
    ),
  },
  'petal-form-sculpture-display': {
    en: entry(
      'Petal-Form Sculpture: Edges, Perforations & Plinth',
      'A silver-coloured petal form and black display plinth show how edges, openings and the base can be reviewed together for a new venue.',
      [
        ['Read the petal edges and perforations', 'The photograph presents overlapping petal-like curves, small visible openings and a silver-coloured surface. Review the overall outline and the relationship between solid areas and perforations. The image does not establish a metal grade, fabrication method, light source or physical size.'],
        ['Review the sculpture-to-plinth relationship', 'A black rectangular plinth is visible below the form. For another site, confirm whether the plinth is included, how the sculpture connects to it and how the combined footprint relates to circulation. Do not infer permanent fixing details from the display photograph.'],
        ['Define customer-facing approval views', 'For a retail or dining brief, request front, side and close-view references alongside the placement plan. Discuss touch zones, accessible circulation, cleaning and the required finish sample. These are proposed-project checks; the photograph does not identify a completed restaurant or retail commission.'],
      ],
      ['Approved petal profile, opening pattern and overall dimensions.', 'Plinth size, finish, inclusion in scope and connection requirements.', 'Customer routes, contact areas and appearance approval views.'],
      [['Is the black plinth automatically part of a new order?', 'No. Specify whether the quotation includes the plinth, its finish, connection, packing and site positioning. The photographed arrangement is not a fixed supply package.'], ['Do the visible openings establish a lighting function?', 'No. Openings are visible, but a photograph does not specify lighting performance or electrical components. Describe any intended lighting and agree its design and supply scope separately.']],
    ),
    zh: entry(
      '花瓣造型雕塑：边缘、开孔与陈列底座',
      '银色花瓣造型与黑色底座的整体实拍，帮助新场地共同评估边缘、开孔与底座关系。',
      [
        ['观察花瓣边缘与开孔', '照片呈现交叠的花瓣状曲面、小开孔和银色表面，可观察整体轮廓及实面与孔洞的关系。照片不能确认金属牌号、制作方法、光源或作品实际尺寸。'],
        ['核对雕塑与底座关系', '造型下方可见黑色矩形底座。新场地应确认底座是否包含、雕塑如何与之连接，以及总占地与通行的关系；不能根据陈列照片推断永久固定细节。'],
        ['明确顾客视角审批', '门店或餐饮简报应结合摆放平面，提供正面、侧面和近看参考，讨论触碰区域、无障碍通行、清洁及饰面样板。这些是新项目评估事项，照片不证明餐厅或零售委托已完工。'],
      ],
      ['获批花瓣轮廓、开孔图案与整体尺寸。', '底座尺寸、饰面、供货范围和连接要求。', '顾客动线、接触区域与外观审批视图。'],
      [['新订单默认包含黑色底座吗？', '不默认包含。需写明报价是否包含底座及其饰面、连接、包装和现场定位；照片中的组合不等于固定供货包。'], ['开孔能证明有灯光功能吗？', '不能。照片可见开孔，但不说明照明性能或电气构件。若需要灯光，应单独说明并约定设计与供货范围。']],
    ),
    ar: entry(
      'منحوتة البتلات: الحواف والفتحات وقاعدة العرض',
      'يوضح شكل بتلات فضي اللون مع قاعدة سوداء كيفية مراجعة الحواف والفتحات والقاعدة معاً لمكان جديد.',
      [
        ['قراءة الحواف والفتحات', 'تُظهر الصورة منحنيات بتلات متداخلة وفتحات صغيرة وسطحاً فضي اللون. راجع المحيط والعلاقة بين الأجزاء المصمتة والفتحات. لا تثبت الصورة درجة معدن أو أسلوب تصنيع أو مصدر ضوء أو حجماً فعلياً.'],
        ['مراجعة علاقة المنحوتة بالقاعدة', 'تظهر قاعدة سوداء مستطيلة أسفل الشكل. لموقع آخر، أكّد شمول القاعدة ووصلة المنحوتة والمساحة الكلية وعلاقتها بالحركة. لا تستنتج تفاصيل التثبيت الدائم من صورة العرض.'],
        ['تحديد مناظر اعتماد مواجهة للزبائن', 'لمتجر أو مطعم، اطلب مناظر أمامية وجانبية وقريبة مع مخطط الموضع. ناقش اللمس والحركة الميسرة والتنظيف وعينة التشطيب. هذه متطلبات مشروع مقترح؛ الصورة لا تحدد مطعماً أو متجراً مكتملاً.'],
      ],
      ['مقطع بتلات ونمط فتحات وأبعاد معتمدة.', 'أبعاد القاعدة وتشطيبها وشمولها ومتطلبات وصلتها.', 'مسارات الزبائن ومناطق التلامس ومناظر الاعتماد.'],
      [['هل القاعدة السوداء مشمولة تلقائياً؟', 'لا. حدّد شمول القاعدة وتشطيبها ووصلة التثبيت والتغليف والتموضع. الترتيب المصوّر ليس حزمة توريد ثابتة.'], ['هل الفتحات تثبت وجود إضاءة؟', 'لا. الفتحات ظاهرة لكن الصورة لا تحدد أداء إضاءة أو مكونات كهربائية. صف الإضاءة المطلوبة واتفق على تصميمها وتوريدها منفصلاً.']],
    ),
    fr: entry(
      'Sculpture en pétales : arêtes, ouvertures et socle',
      'Une forme argentée en pétales et son socle noir permettent d’étudier ensemble arêtes, ouvertures et base pour un nouveau lieu.',
      [
        ['Lire les arêtes et les ouvertures', 'La photo présente des courbes de pétales superposées, de petites ouvertures et une surface argentée. Examinez le contour et la relation entre pleins et perforations. L’image n’établit ni nuance métallique, procédé, source lumineuse ni dimensions réelles.'],
        ['Étudier la relation au socle', 'Un socle rectangulaire noir apparaît sous la forme. Pour un autre site, confirmez son inclusion, le raccord à la sculpture et l’emprise totale par rapport à la circulation. La photo ne décrit pas les fixations permanentes.'],
        ['Définir les vues côté public', 'Pour une boutique ou un restaurant, demandez vues avant, latérales et rapprochées avec le plan d’implantation. Étudiez contact, accessibilité, nettoyage et échantillon. Ce sont des contrôles du nouveau projet ; la photo ne prouve pas un établissement achevé.'],
      ],
      ['Profil de pétales, perforations et dimensions approuvés.', 'Dimensions, finition, inclusion et raccords du socle.', 'Parcours clients, zones de contact et vues à valider.'],
      [['Le socle noir est-il automatiquement inclus ?', 'Non. Précisez socle, finition, liaison, emballage et positionnement dans le devis. La combinaison photographiée n’est pas une fourniture forfaitaire.'], ['Les ouvertures prouvent-elles une fonction lumineuse ?', 'Non. Elles sont visibles sans préciser performance ou équipement électrique. Décrivez tout éclairage souhaité et convenez séparément de sa conception et fourniture.']],
    ),
    es: entry(
      'Escultura de pétalos: bordes, perforaciones y pedestal',
      'Una forma plateada de pétalos con pedestal negro permite estudiar conjuntamente bordes, aperturas y base para un nuevo local.',
      [
        ['Leer bordes y perforaciones', 'La fotografía muestra curvas de pétalos superpuestas, pequeñas aperturas y superficie plateada. Revise silueta y relación entre zonas sólidas y perforadas. No acredita grado metálico, método, fuente de luz ni tamaño físico.'],
        ['Revisar la relación con el pedestal', 'Se ve un pedestal negro rectangular bajo la forma. Para otro lugar, confirme su inclusión, conexión y huella conjunta respecto a los recorridos. La foto no define fijaciones permanentes.'],
        ['Definir las vistas hacia el cliente', 'Para tienda o restaurante, solicite vistas frontales, laterales y cercanas junto al plano. Revise contacto, accesibilidad, limpieza y muestra. Son comprobaciones del nuevo proyecto; la foto no identifica un local terminado.'],
      ],
      ['Perfil de pétalos, perforaciones y dimensiones aprobados.', 'Dimensiones, acabado, inclusión y conexión del pedestal.', 'Recorridos, zonas de contacto y vistas de aprobación.'],
      [['¿El pedido incluye automáticamente el pedestal negro?', 'No. Especifique pedestal, acabado, conexión, embalaje y posición en la cotización. La combinación fotografiada no es un paquete fijo.'], ['¿Las aperturas acreditan una función de iluminación?', 'No. Son visibles, pero no definen rendimiento lumínico ni componentes eléctricos. Describa cualquier iluminación y acuerde diseño y suministro por separado.']],
    ),
    de: entry(
      'Blütenform-Skulptur: Kanten, Öffnungen und Sockel',
      'Silberfarbene Blütenform und schwarzer Sockel zeigen, wie Kanten, Öffnungen und Basis gemeinsam für einen neuen Ort geprüft werden können.',
      [
        ['Kanten und Öffnungen lesen', 'Das Foto zeigt überlagerte Blütenkurven, kleine Öffnungen und eine silberfarbene Oberfläche. Prüfen Sie Kontur und das Verhältnis von geschlossenen und perforierten Flächen. Metallgüte, Verfahren, Lichtquelle oder tatsächliche Größe werden nicht belegt.'],
        ['Beziehung zum Sockel prüfen', 'Unter der Form ist ein schwarzer rechteckiger Sockel sichtbar. Klären Sie für einen anderen Ort dessen Lieferumfang, Anschluss und Gesamtstellfläche im Verhältnis zu Wegen. Das Foto erklärt keine dauerhafte Befestigung.'],
        ['Kundenbezogene Freigabeansichten festlegen', 'Fordern Sie für Handel oder Gastronomie Vorder-, Seiten- und Nahansichten zum Lageplan an. Besprechen Sie Kontaktzonen, barrierefreie Wege, Reinigung und Muster. Dies betrifft den neuen Auftrag; das Foto belegt keinen fertigen Gastronomie- oder Handelsauftrag.'],
      ],
      ['Freigegebenes Profil, Öffnungsmuster und Gesamtmaße.', 'Sockelmaße, Oberfläche, Lieferumfang und Verbindung.', 'Kundenwege, Kontaktzonen und Freigabeansichten.'],
      [['Ist der schwarze Sockel automatisch enthalten?', 'Nein. Benennen Sie Sockel, Oberfläche, Verbindung, Verpackung und Positionierung im Angebot. Die gezeigte Kombination ist kein festes Lieferpaket.'], ['Belegen die Öffnungen eine Lichtfunktion?', 'Nein. Sie zeigen keine Lichtleistung oder Elektroteile. Beschreiben Sie gewünschtes Licht und vereinbaren Sie Entwurf und Lieferung gesondert.']],
    ),
  },
  'warm-abstract-sculpture-plinth': {
    en: entry(
      'Warm Abstract Sculpture: Surface & Plinth Review',
      'A warm-coloured curved form on a textured plinth provides a reference for reviewing surface appearance, orientation and a new display’s base interface.',
      [
        ['Review curvature and surface appearance', 'The photograph shows a warm-coloured curved form with visible depressions and changes in reflected light. A plain background helps separate its outline from the base. Colour and apparent texture are observations; they do not establish bronze, a patina recipe or a confirmed material composition.'],
        ['Approve the textured plinth interface', 'The form is presented on a dark textured rectangular plinth. A new commission needs agreed orientation, overall proportions, support details and the interface between the two elements. Ask for the relevant drawings rather than treating the photographed contact area as an engineered fixing detail.'],
        ['Document the reference for repeat displays', 'If several displays are proposed, identify the approved views, finish reference and sample or first-article record to compare. List location differences, base requirements and receiving conditions. This is a review process for a new order, not evidence of an existing repeat-production programme.'],
      ],
      ['Approved outline, orientation and dimensions of both elements.', 'Finish sample and agreed views for appearance comparison.', 'Quantity by location, base responsibility and delivery conditions.'],
      [['Does the warm colour mean the sculpture is bronze?', 'No. The photograph does not verify material composition or a patina system. Agree the proposed material and finish through the project specification and approved sample.'], ['Can the same appearance be requested for several venues?', 'A multi-location brief can be reviewed with a recorded approval reference and a site matrix. Quantities, consistency criteria, plinth requirements and installation differences must be agreed for the order.']],
    ),
    zh: entry(
      '暖色抽象雕塑：表面外观与底座配合',
      '纹理底座上的暖色曲面造型，为新陈列项目讨论表面外观、方向和底座接口提供参考。',
      [
        ['观察曲率与表面外观', '照片中暖色曲面可见凹陷及光线反射变化，素色背景有助于区分造型与底座。颜色和表观纹理属于可见信息，不能据此确认铜材、做旧配方或材料组成。'],
        ['审批纹理底座接口', '造型置于深色纹理矩形底座上。新委托需确认方向、整体比例、支承细节及两部分接口；应查看相应图纸，不能把照片中的接触部位当成已审核固定详图。'],
        ['为重复陈列留档参考', '若计划多件陈列，应确定用于比较的获批视图、饰面参考及样板或首件记录，并列出各地点差异、底座要求和收货条件。这是新订单的评估流程，不代表已有批量生产项目。'],
      ],
      ['两部分的获批轮廓、方向和尺寸。', '饰面样板及约定用于外观比较的视图。', '各地点数量、底座责任与交付条件。'],
      [['暖色外观说明是铜雕吗？', '不能据此确认。照片不验证材料成分或做旧体系；拟用材料和饰面应通过项目规格及获批样板确定。'], ['多家场所可以要求相同外观吗？', '可结合留档审批参考和场地条件表评估。数量、一致性标准、底座需求与安装差异需按订单确认。']],
    ),
    ar: entry(
      'منحوتة تجريدية دافئة اللون: السطح والقاعدة',
      'شكل منحني دافئ اللون على قاعدة ذات ملمس يوفر مرجعاً لمراجعة السطح والاتجاه ووصلة قاعدة عرض جديد.',
      [
        ['مراجعة الانحناء والمظهر', 'تُظهر الصورة شكلاً دافئ اللون مع تجاويف وتغيرات في الضوء المنعكس. تفصل الخلفية البسيطة المحيط عن القاعدة. اللون والملمس الظاهر لا يثبتان البرونز أو وصفة تعتيق أو تركيباً مادياً مؤكداً.'],
        ['اعتماد وصلة القاعدة', 'يُعرض الشكل على قاعدة مستطيلة داكنة ذات ملمس. يحتاج العمل الجديد لاتجاه ونسب وإسناد وواجهة معتمدة بين العنصرين. اطلب الرسومات بدلاً من اعتبار التلامس المصوّر تفصيلاً هندسياً معتمداً للتثبيت.'],
        ['توثيق مرجع للعروض المتكررة', 'عند اقتراح عدة قطع، حدّد المناظر والتشطيب وسجل العينة أو القطعة الأولى للمقارنة. سجّل اختلافات المواقع والقواعد والاستلام. هذه مراجعة لطلب جديد وليست إثباتاً لبرنامج إنتاج متكرر قائم.'],
      ],
      ['المحيط والاتجاه والأبعاد المعتمدة للعنصرين.', 'عينة تشطيب ومناظر متفق عليها للمقارنة.', 'الكميات حسب الموقع ومسؤولية القاعدة والتسليم.'],
      [['هل اللون الدافئ يعني البرونز؟', 'لا. الصورة لا تتحقق من التركيب أو نظام التعتيق. اتفقوا على المادة والتشطيب عبر المواصفات والعينة المعتمدة.'], ['هل يمكن طلب مظهر واحد لعدة أماكن؟', 'يمكن مراجعة الطلب بمرجع اعتماد مسجل وجدول مواقع. يجب الاتفاق على الكمية ومعايير الاتساق والقواعد واختلافات التركيب.']],
    ),
    fr: entry(
      'Sculpture abstraite aux tons chauds : surface et socle',
      'Une forme courbe aux tons chauds sur un socle texturé sert à examiner surface, orientation et interface d’une nouvelle présentation.',
      [
        ['Examiner courbure et surface', 'La photo montre une forme chaude avec creux et variations de reflets. Le fond uni distingue contour et socle. Couleur et texture apparentes ne prouvent ni bronze, recette de patine ni composition du matériau.'],
        ['Valider l’interface du socle texturé', 'La forme repose sur un socle rectangulaire sombre et texturé. Une commande exige orientation, proportions, supports et interface convenus. Demandez les plans ; le contact photographié n’est pas un détail de fixation validé par ingénierie.'],
        ['Documenter la référence de répétition', 'Pour plusieurs présentations, définissez vues, finition et échantillon ou première pièce de comparaison. Listez variantes de site, socles et réception. Cette démarche concerne une nouvelle commande, sans prouver un programme de série existant.'],
      ],
      ['Contour, orientation et dimensions approuvés des deux éléments.', 'Échantillon et vues convenues pour comparer l’apparence.', 'Quantité par site, socle et conditions de livraison.'],
      [['Les tons chauds signifient-ils que l’œuvre est en bronze ?', 'Non. La photo ne vérifie ni composition ni patine. Convenez des matériaux et de la finition par spécification et échantillon approuvé.'], ['Peut-on demander la même apparence pour plusieurs lieux ?', 'Un projet multisite peut être étudié avec référence enregistrée et tableau des sites. Quantités, critères d’aspect, socles et différences de pose doivent être convenus.']],
    ),
    es: entry(
      'Escultura abstracta cálida: superficie y pedestal',
      'Una forma curva cálida sobre base texturada permite revisar apariencia, orientación y conexión para una nueva presentación.',
      [
        ['Revisar curvatura y apariencia', 'La foto muestra una forma cálida con depresiones y variaciones de luz reflejada. El fondo liso separa silueta y pedestal. Color y textura aparente no acreditan bronce, fórmula de pátina ni composición material.'],
        ['Aprobar la interfaz del pedestal', 'La forma se presenta en un pedestal oscuro rectangular texturado. El nuevo encargo necesita orientación, proporciones, apoyo y conexión acordados. Solicite planos: el contacto visible no es un detalle de fijación aprobado por ingeniería.'],
        ['Documentar la referencia para repetir', 'Para varias presentaciones, identifique vistas, acabado y muestra o primera pieza de comparación. Enumere diferencias de sitio, bases y recepción. Es una revisión para un pedido nuevo, no evidencia de un programa de producción repetida existente.'],
      ],
      ['Silueta, orientación y dimensiones aprobadas de ambos elementos.', 'Muestra y vistas para comparar apariencia.', 'Cantidad por lugar, responsabilidad de base y entrega.'],
      [['¿El color cálido significa que es bronce?', 'No. La foto no verifica composición ni pátina. Material y acabado se acuerdan mediante especificación y muestra aprobada.'], ['¿Puede pedirse la misma apariencia para varios locales?', 'Puede revisarse con referencia registrada y tabla de sitios. Deben acordarse cantidades, criterios de consistencia, pedestales y diferencias de instalación.']],
    ),
    de: entry(
      'Warme abstrakte Skulptur: Oberfläche und Sockel',
      'Eine warmfarbene Kurvenform auf strukturiertem Sockel unterstützt die Prüfung von Oberfläche, Ausrichtung und einer neuen Sockelschnittstelle.',
      [
        ['Krümmung und Erscheinung prüfen', 'Das Foto zeigt eine warme Form mit Vertiefungen und wechselnden Reflexionen. Ein neutraler Hintergrund trennt Kontur und Sockel. Farbe und sichtbare Textur belegen weder Bronze, Patinarezept noch bestätigte Materialzusammensetzung.'],
        ['Strukturierte Sockelschnittstelle freigeben', 'Die Form steht auf einem dunklen strukturierten Rechtecksockel. Ein neuer Auftrag benötigt vereinbarte Ausrichtung, Proportionen, Auflager und Verbindung. Fordern Sie Zeichnungen an; die fotografierte Kontaktfläche ist kein statisch freigegebenes Befestigungsdetail.'],
        ['Vergleich für wiederholte Aufstellungen dokumentieren', 'Definieren Sie bei mehreren Präsentationen Ansichten, Oberfläche und Muster oder Erststück zum Vergleich. Listen Sie Standortunterschiede, Sockel und Annahmebedingungen auf. Dies ist eine Prüfung für neue Aufträge, kein Beleg vorhandener Serienproduktion.'],
      ],
      ['Freigegebene Kontur, Ausrichtung und Maße beider Elemente.', 'Muster und vereinbarte Erscheinungsvergleichsansichten.', 'Mengen je Ort, Sockelzuständigkeit und Lieferbedingungen.'],
      [['Bedeutet die warme Farbe Bronze?', 'Nein. Das Foto bestätigt keine Materialzusammensetzung oder Patina. Vereinbaren Sie Material und Oberfläche anhand von Spezifikation und Muster.'], ['Kann für mehrere Orte dieselbe Erscheinung angefragt werden?', 'Dies kann mit dokumentierter Referenz und Standortliste geprüft werden. Mengen, Vergleichskriterien, Sockel und Montageunterschiede müssen vereinbart werden.']],
    ),
  },
  'illuminated-portrait-sculpture-fabrication': {
    en: entry(
      'Illuminated Portrait Sculpture: Form & Light',
      'A workshop view of a decorative portrait shows gold-coloured ornament and illuminated details to discuss alongside approved artwork and electrical scope.',
      [
        ['Read portrait, ornament and illuminated details', 'The photograph shows a decorative portrait with a gold-coloured headdress, light elements and visible workshop surroundings. Observe how the face, ornament and lights form separate visual areas. The image does not identify a named character, project client, material grade or completed venue.'],
        ['Freeze the approved artwork and colour areas', 'For a new piece, provide approved front, side and rear views with the pose, proportions and colour references. Identify the person approving the sculptural interpretation. Original or properly authorised artwork is required; the photograph alone does not grant reproduction rights.'],
        ['Separate sculpture and electrical scope', 'The visible lights make electrical interfaces part of the project discussion, but they do not prove a certified lighting system. Agree the supplied components, connection responsibilities, access for maintenance and the sample or first-article review required before release.'],
      ],
      ['Authorised artwork, approved views, pose and controlling dimensions.', 'Colour and finish references with a named appearance approver.', 'Lighting scope, connection responsibility and maintenance access.'],
      [['Does the photograph identify a licensed character?', 'No named character or licence is asserted. Confirm the right to commission the requested artwork and agree the approved sculptural views before production.'], ['Does the portrait price automatically include a complete lighting installation?', 'No. The quotation must specify decorative light components, power interfaces, local electrical work and maintenance access. Do not infer the complete supply scope or approvals from the illuminated photograph.']],
    ),
    zh: entry(
      '发光人物雕塑：形体、装饰与灯光配合',
      '装饰人物的车间实拍呈现金色装饰与发光细节，可结合获批图稿和电气范围一起讨论。',
      [
        ['分清人物、装饰与发光细节', '照片中可见带金色头饰、灯光元素的装饰人物及车间环境，可分别观察面部、装饰和灯光区域。照片不确认具体角色名称、项目客户、材料牌号或场所已完工。'],
        ['固定获批图稿与色彩区域', '新作品应提供获批正、侧、背视图，以及姿态、比例和颜色参考，并指定实体造型审批人。图稿须原创或具有相应授权，照片本身不授予复制权限。'],
        ['分别明确雕塑和电气范围', '可见灯光提示新项目应讨论电气接口，但不能证明灯光系统已认证。需约定供货构件、接线责任、维护空间及放行前要求的样板或首件审核。'],
      ],
      ['有权使用的图稿、获批视图、姿态和控制尺寸。', '颜色与饰面参考，以及指定外观审批人。', '灯光范围、连接责任和维护通道。'],
      [['照片能确认这是已授权角色吗？', '本页不声称具体角色或许可。生产前应确认有权委托该图稿，并约定获批实体造型视图。'], ['人物报价默认包含完整灯光安装吗？', '不默认包含。装饰灯构件、供电接口、当地电气工作和维护空间需逐项列明，不能从发光照片推断完整供货范围或审批情况。']],
    ),
    ar: entry(
      'منحوتة شخصية مضيئة: الشكل والزخرفة والضوء',
      'منظر ورشة لشخصية زخرفية يظهر عناصر ذهبية اللون وتفاصيل مضيئة لمناقشتها مع الرسومات المعتمدة والنطاق الكهربائي.',
      [
        ['قراءة الوجه والزخرفة والإضاءة', 'تُظهر الصورة شخصية زخرفية بغطاء رأس ذهبي اللون وعناصر مضيئة داخل الورشة. لاحظ الوجه والزخرفة والضوء كمناطق بصرية مستقلة. لا تحدد الصورة شخصية مسماة أو عميلاً أو درجة مادة أو مكاناً مكتملاً.'],
        ['تثبيت الرسومات والألوان المعتمدة', 'للعمل الجديد، قدّم مناظر أمامية وجانبية وخلفية معتمدة مع الوضعية والنسب والألوان ومسؤول اعتماد التفسير المجسّم. تُطلب رسومات أصلية أو مصرح بها؛ الصورة وحدها لا تمنح حقوق إعادة الإنتاج.'],
        ['فصل النحت والنطاق الكهربائي', 'الإضاءة الظاهرة تجعل الواجهات الكهربائية موضوعاً للنقاش، لكنها لا تثبت نظاماً معتمداً. اتفقوا على المكونات الموردة والتوصيل ووصول الصيانة والعينة أو القطعة الأولى المطلوبة قبل السماح بالمتابعة.'],
      ],
      ['رسومات مصرح بها ومناظر ووضعية وأبعاد معتمدة.', 'مراجع ألوان وتشطيب ومسؤول اعتماد المظهر.', 'نطاق الضوء والتوصيل ووصول الصيانة.'],
      [['هل تحدد الصورة شخصية مرخّصة؟', 'لا ندّعي شخصية مسماة أو ترخيصاً. أكّد حق تكليف العمل واتفق على مناظر النحت المعتمدة قبل الإنتاج.'], ['هل يشمل السعر تركيب إضاءة كاملاً تلقائياً؟', 'لا. يجب تحديد مكونات الضوء وواجهات الطاقة والعمل الكهربائي المحلي والصيانة. لا تستنتج نطاق التوريد أو الاعتمادات من الصورة المضيئة.']],
    ),
    fr: entry(
      'Portrait sculpté lumineux : forme et lumière',
      'Une vue d’atelier montre portrait décoratif, ornement doré et lumière à étudier avec le visuel approuvé et le périmètre électrique.',
      [
        ['Lire portrait, ornement et lumière', 'La photo montre un portrait décoratif avec coiffe dorée, éléments lumineux et environnement d’atelier. Distinguez visage, ornement et lumière. L’image n’identifie ni personnage nommé, client, nuance de matériau ni lieu achevé.'],
        ['Figer le visuel et les couleurs approuvés', 'Pour une nouvelle pièce, fournissez vues avant, latérales et arrière avec pose, proportions et couleurs. Identifiez le valideur de l’interprétation sculptée. Des visuels originaux ou autorisés sont nécessaires ; la photo ne donne aucun droit de reproduction.'],
        ['Distinguer sculpture et électricité', 'Les lumières visibles invitent à préciser les interfaces électriques, sans prouver un système certifié. Convenez des composants, raccordements, accès d’entretien et échantillon ou première pièce à examiner avant lancement.'],
      ],
      ['Visuel autorisé, vues, pose et dimensions de référence.', 'Couleurs, finition et valideur de l’apparence.', 'Périmètre lumineux, raccordements et accès d’entretien.'],
      [['La photo identifie-t-elle un personnage sous licence ?', 'Aucun personnage nommé ni licence n’est revendiqué. Confirmez le droit de commander le visuel et les vues approuvées avant production.'], ['Le prix comprend-il automatiquement toute l’installation lumineuse ?', 'Non. Le devis doit préciser composants décoratifs, interfaces d’alimentation, électricité locale et maintenance. Une photo éclairée ne définit ni fourniture complète ni validation.']],
    ),
    es: entry(
      'Retrato escultórico iluminado: forma y luz',
      'Una vista de taller muestra retrato decorativo, adorno dorado y detalles luminosos para revisar con el diseño aprobado y el alcance eléctrico.',
      [
        ['Leer retrato, adorno y detalles luminosos', 'La foto muestra un retrato decorativo con tocado dorado, luces y entorno de taller. Distinga cara, adorno y luz como áreas visuales. No identifica personaje, cliente, grado de material ni local terminado.'],
        ['Fijar diseño y colores aprobados', 'Para una pieza nueva, aporte vistas frontales, laterales y traseras con postura, proporciones y colores. Nombre al aprobador de la interpretación escultórica. Se exige diseño original o autorizado; la foto no concede derechos de reproducción.'],
        ['Separar escultura y electricidad', 'Las luces visibles requieren discutir interfaces, pero no demuestran un sistema certificado. Acuerde componentes suministrados, conexiones, acceso de mantenimiento y revisión de muestra o primera pieza antes de autorizar.'],
      ],
      ['Diseño autorizado, vistas, postura y dimensiones de referencia.', 'Colores, acabado y aprobador de apariencia.', 'Alcance de iluminación, conexión y mantenimiento.'],
      [['¿La foto identifica un personaje con licencia?', 'No se afirma nombre ni licencia. Confirme el derecho a encargar el diseño y las vistas escultóricas aprobadas antes de producir.'], ['¿El precio incluye automáticamente la instalación luminosa completa?', 'No. La cotización debe indicar componentes, interfaces de alimentación, electricidad local y mantenimiento. La imagen iluminada no acredita suministro completo ni aprobaciones.']],
    ),
    de: entry(
      'Beleuchtete Porträtskulptur: Form und Licht',
      'Ein Werkstattbild zeigt dekoratives Porträt, goldfarbene Ornamente und Lichtdetails zur Abstimmung mit Vorlage und Elektroleistungsumfang.',
      [
        ['Porträt, Ornament und Licht lesen', 'Das Foto zeigt ein dekoratives Porträt mit goldfarbenem Kopfschmuck, Leuchtelementen und Werkstattumgebung. Betrachten Sie Gesicht, Ornament und Licht getrennt. Benannte Figur, Kunde, Materialgüte oder fertiggestellter Ort werden nicht belegt.'],
        ['Freigegebene Vorlage und Farben festlegen', 'Liefern Sie für ein neues Werk Vorder-, Seiten- und Rückansichten mit Pose, Proportionen und Farbreferenzen. Benennen Sie den Erscheinungsfreigeber. Eigene oder autorisierte Vorlagen sind erforderlich; ein Foto erteilt kein Vervielfältigungsrecht.'],
        ['Skulptur und Elektrik trennen', 'Sichtbares Licht verlangt Abstimmung der Elektroschnittstellen, beweist aber kein zertifiziertes System. Vereinbaren Sie Bauteile, Anschlüsse, Wartungszugang und Muster- oder Erststückprüfung vor Freigabe.'],
      ],
      ['Autorisierte Vorlage, Ansichten, Pose und Bezugsmaße.', 'Farb- und Oberflächenreferenzen sowie Freigeber.', 'Lichtumfang, Anschlussverantwortung und Wartungszugang.'],
      [['Belegt das Bild eine lizenzierte Figur?', 'Es wird keine benannte Figur oder Lizenz behauptet. Bestätigen Sie das Beauftragungsrecht und die freigegebenen Ansichten vor Produktion.'], ['Enthält der Preis automatisch die vollständige Lichtmontage?', 'Nein. Dekorative Leuchten, Stromschnittstellen, örtliche Elektrik und Wartung müssen im Angebot stehen. Das beleuchtete Foto belegt weder Gesamtlieferumfang noch Freigaben.']],
    ),
  },
  'leaf-face-sculpture-fabrication': {
    en: entry(
      'Leaf-Face Sculpture: Texture, Colour & Detail',
      'A workshop photograph of a face with leaf-like forms and butterflies offers a close view of painted texture, colour boundaries and projecting detail.',
      [
        ['Inspect leaf-like forms and butterfly details', 'The photograph shows a face in profile surrounded by projecting leaf-like forms, butterfly details and green and grey surface areas. Workshop surroundings remain visible. These observations describe the pictured work without identifying a material composition, named character, client or finished project location.'],
        ['Agree texture and close-view appearance', 'For a new interpretation, approve motif drawings and the relationship between face, leaves and butterflies. Use close views to define texture and colour boundaries, then agree a sample and approver. A textured surface in a photograph does not establish how it was made or how it will weather.'],
        ['Review base, handling and visitor contact', 'The base and projecting details should be considered together when planning another commission. Request the intended fixing interface, packing protection and cleaning access. State whether visitors may touch the work; decorative appearance does not establish suitability for climbing or other interactive use.'],
      ],
      ['Authorised motif drawings, profile views and overall dimensions.', 'Texture and colour references with close-view approval criteria.', 'Base interface, packing protection and intended visitor contact.'],
      [['Can the photograph verify the sculpture’s material?', 'No. Surface texture and colour do not confirm composition or grade. Request a proposed material specification and sample for the new project.'], ['Can the leaf and butterfly arrangement be changed?', 'A new design can be reviewed using original or authorised artwork. Agree proportions, projections, colour areas and the approval reference, rather than assuming the photograph grants permission to reproduce the work.']],
    ),
    zh: entry(
      '叶片人脸雕塑：纹理、颜色与细节审批',
      '带叶片与蝴蝶造型的人脸车间实拍，为近看涂饰纹理、色彩边界和突出细节提供参考。',
      [
        ['观察叶片造型与蝴蝶细节', '照片可见人脸侧面、周围外伸的叶片状造型、蝴蝶细节及绿色和灰色表面，车间环境仍清晰可见。这些描述不确认材料成分、具体角色、客户或竣工地点。'],
        ['约定纹理与近看外观', '新方案应审批主题图稿及人脸、叶片和蝴蝶的关系，用近照明确纹理与颜色边界，再约定样板和审批人。照片中的纹理表面不能证明制作方法或未来耐候表现。'],
        ['评估底座、搬运和游客接触', '规划新委托时，底座与外伸细节应一起评估，索取固定接口、包装保护和清洁通道资料。需要说明游客能否触碰；装饰外观不等于适合攀爬或其他互动用途。'],
      ],
      ['有权使用的主题图稿、侧面视图与整体尺寸。', '纹理、颜色参考及近看审批标准。', '底座接口、包装保护和游客接触方式。'],
      [['照片可以验证雕塑材料吗？', '不能。表面纹理和颜色不能确认成分或牌号；新项目需索取拟用材料规格和样板。'], ['可以调整叶片与蝴蝶的排布吗？', '可基于原创或有相应授权的图稿评估新设计，确认比例、外伸部位、色彩区域和审批参考；不能默认照片授予复制权限。']],
    ),
    ar: entry(
      'منحوتة وجه وأوراق: الملمس واللون والتفاصيل',
      'تقدم صورة الورشة لوجه محاط بأشكال أوراق وفراشات مرجعاً للملمس المطلي وحدود اللون والتفاصيل البارزة.',
      [
        ['فحص الأوراق وتفاصيل الفراشات', 'تُظهر الصورة وجهاً جانبياً تحيط به أشكال بارزة شبيهة بالأوراق وفراشات ومساحات خضراء ورمادية، مع ظهور الورشة. تصف هذه الملاحظات العمل دون تحديد التركيب المادي أو شخصية مسماة أو عميل أو موقع مكتمل.'],
        ['الاتفاق على الملمس والمظهر القريب', 'لعمل جديد، اعتمد الرسومات والعلاقة بين الوجه والأوراق والفراشات. استخدم المناظر القريبة لتحديد الملمس وحدود اللون ثم العينة والمعتمد. الملمس المصوّر لا يثبت طريقة صنعه أو أداءه أمام الطقس.'],
        ['مراجعة القاعدة والمناولة والتلامس', 'يجب النظر إلى القاعدة والتفاصيل البارزة معاً للمشروع الجديد. اطلب واجهة التثبيت وحماية التغليف ووصول التنظيف. وضّح السماح بلمس الزوار؛ الشكل الزخرفي لا يثبت ملاءمة التسلق أو التفاعل.'],
      ],
      ['رسومات زخرفية مصرح بها ومناظر جانبية وأبعاد كلية.', 'مراجع ملمس ولون ومعايير اعتماد من قرب.', 'وصلة القاعدة وحماية التغليف وتلامس الزوار المقصود.'],
      [['هل يمكن التحقق من المادة بالصورة؟', 'لا. الملمس واللون لا يؤكدان التركيب أو الدرجة. اطلب مواصفة المادة المقترحة وعينة للمشروع الجديد.'], ['هل يمكن تغيير ترتيب الأوراق والفراشات؟', 'يمكن مراجعة تصميم جديد برسومات أصلية أو مصرح بها. اتفق على النسب والبروز والألوان والمرجع، ولا تفترض أن الصورة تمنح حق النسخ.']],
    ),
    fr: entry(
      'Visage et feuilles sculptés : texture, couleur et détail',
      'Une photo d’atelier du visage entouré de feuilles et papillons permet d’examiner texture peinte, limites de couleur et saillies.',
      [
        ['Examiner feuilles et papillons', 'La photo montre un visage de profil entouré de formes en feuilles saillantes, de papillons et de zones vertes et grises, avec l’atelier visible. Ces observations n’identifient ni composition, personnage nommé, client ni lieu achevé.'],
        ['Convenir de la texture et de la vue proche', 'Pour une nouvelle interprétation, validez motifs et relations entre visage, feuilles et papillons. Les vues rapprochées définissent texture et limites de couleur avant échantillon et approbateur. La texture photographiée ne prouve ni procédé ni tenue aux intempéries.'],
        ['Étudier base, manutention et contact', 'Considérez ensemble base et saillies pour une nouvelle commande. Demandez raccord de fixation, protection d’emballage et accès de nettoyage. Précisez le contact des visiteurs ; l’aspect décoratif ne prouve pas une aptitude à l’escalade ou à l’interaction.'],
      ],
      ['Motifs autorisés, profils et dimensions générales.', 'Références de texture, couleur et critères de vue proche.', 'Interface de base, emballage et contact visiteur prévu.'],
      [['La photo permet-elle de vérifier le matériau ?', 'Non. Texture et couleur ne confirment ni composition ni nuance. Demandez spécification proposée et échantillon pour le nouveau projet.'], ['Peut-on modifier feuilles et papillons ?', 'Un projet peut être étudié avec des visuels originaux ou autorisés. Convenez des proportions, saillies, couleurs et référence ; la photo ne donne aucun droit de copie.']],
    ),
    es: entry(
      'Rostro y hojas: textura, color y detalle escultórico',
      'Una foto de taller de un rostro con hojas y mariposas permite examinar textura pintada, límites de color y detalles salientes.',
      [
        ['Inspeccionar hojas y mariposas', 'La foto muestra un rostro de perfil con formas salientes de hojas, mariposas y superficies verdes y grises, con taller visible. Estas observaciones no identifican composición, personaje, cliente ni lugar terminado.'],
        ['Acordar textura y apariencia cercana', 'Para una interpretación nueva, apruebe motivos y relación entre rostro, hojas y mariposas. Use vistas cercanas para textura y límites de color, luego muestra y aprobador. La textura fotografiada no acredita método ni resistencia futura al clima.'],
        ['Revisar base, manipulación y contacto', 'Considere base y salientes juntos para un nuevo encargo. Solicite fijaciones, protección y acceso de limpieza. Especifique contacto de visitantes: el aspecto decorativo no acredita uso para escalar u otras interacciones.'],
      ],
      ['Motivos autorizados, perfiles y dimensiones generales.', 'Textura, colores y criterios de aprobación cercana.', 'Interfaz de base, embalaje y contacto previsto.'],
      [['¿Puede verificarse el material en la foto?', 'No. Textura y color no confirman composición ni grado. Solicite especificación propuesta y muestra para el proyecto nuevo.'], ['¿Pueden cambiarse las hojas y mariposas?', 'Puede revisarse un diseño original o autorizado. Acuerde proporciones, salientes, colores y referencia; no suponga que la foto concede permiso de copia.']],
    ),
    de: entry(
      'Blattgesicht-Skulptur: Textur, Farbe und Detail',
      'Ein Werkstattfoto des Gesichts mit Blattformen und Schmetterlingen zeigt bemalte Textur, Farbgrenzen und vorstehende Details.',
      [
        ['Blattformen und Schmetterlinge betrachten', 'Das Foto zeigt ein Gesichtsprofil mit vorstehenden Blattformen, Schmetterlingen sowie grünen und grauen Flächen in sichtbarer Werkstattumgebung. Die Beobachtungen belegen weder Materialzusammensetzung, benannte Figur, Kunde noch fertiggestellten Standort.'],
        ['Textur und Nahansicht vereinbaren', 'Geben Sie für neue Interpretationen Motivzeichnungen und das Verhältnis von Gesicht, Blättern und Schmetterlingen frei. Nahansichten bestimmen Textur und Farbgrenzen vor Musterfreigabe. Fotografierte Textur belegt weder Herstellungsverfahren noch künftige Witterungsbeständigkeit.'],
        ['Basis, Handhabung und Besucherkontakt prüfen', 'Betrachten Sie Basis und Vorsprünge beim neuen Auftrag gemeinsam. Fordern Sie Befestigungsschnittstelle, Verpackungsschutz und Reinigungszugang an. Definieren Sie Besucherkontakt; dekoratives Aussehen belegt keine Eignung zum Klettern oder für andere Interaktion.'],
      ],
      ['Autorisierte Motive, Profilansichten und Gesamtmaße.', 'Textur, Farben und Kriterien für die Nahansicht.', 'Basisschnittstelle, Verpackungsschutz und geplanter Kontakt.'],
      [['Lässt sich das Material am Foto überprüfen?', 'Nein. Textur und Farbe bestätigen weder Zusammensetzung noch Güte. Fordern Sie Materialspezifikation und Muster für das neue Projekt an.'], ['Können Blätter und Schmetterlinge anders angeordnet werden?', 'Neue Gestaltung kann mit eigenen oder autorisierten Vorlagen geprüft werden. Vereinbaren Sie Proportionen, Vorsprünge, Farben und Referenz; das Foto erteilt kein Kopierrecht.']],
    ),
  },
};
