import { workArticleContentA } from './workArticleContentA.js';
import { workArticleContentB } from './workArticleContentB.js';
import { getApplicationMedia } from './applicationMedia.js';

// Editorial production studies, not claims of a completed venue or design ownership.
const definitions = [
  ['gold-abstract-sculpture-fabrication', 'hospitality', 'application-gold-abstract-workshop.webp'],
  ['suspended-fish-art-installation', 'hospitality', 'application-suspended-fish-forms.webp'],
  ['petal-form-sculpture-display', 'retail', 'application-petal-form-display.webp'],
  ['warm-abstract-sculpture-plinth', 'retail', 'application-warm-abstract-plinth.webp'],
  ['illuminated-portrait-sculpture-fabrication', 'themed', 'application-illuminated-portrait-workshop.webp'],
  ['leaf-face-sculpture-fabrication', 'themed', 'application-leaf-face-workshop.webp'],
  ['layered-horse-sculpture-fabrication', 'public', 'application-layered-horse-workshop.webp'],
  ['reflective-horse-sculpture', 'public', 'application-reflective-horse-outdoors.webp'],
].map(([slug, categoryId, imageFile]) => ({ slug, categoryId, imageFile, path: `/projects/${slug}/`, publishedOn: '2026-10-22' }));

const content = { ...workArticleContentA, ...workArticleContentB };
export const workArticleRoutes = definitions.map(item => item.path.slice(1,-1));
export const workArticleUi = {
  en: {home:'Home',applications:'Applications',record:'Production study',read:'Read the production study',briefHeading:'Prepare a brief for your own project',faqHeading:'Questions before fabrication',relatedHeading:'Continue your project review',backToCategory:'Back to application',oemGuide:'Review the OEM approval checklist',preparation:'Use the RFQ scope template',briefAction:'Discuss your project',otherWorks:'Another work in this application',publishedLabel:'Article published',scopeNote:'The article records what the supplied photograph shows and what to review for a new commission. Material specifications, dimensions, artwork rights and delivery scope must be agreed for your project.'},
  zh: {home:'首页',applications:'应用场景',record:'制作解析',read:'查看制作解析',briefHeading:'为您自己的项目准备简报',faqHeading:'制作前的常见问题',relatedHeading:'继续准备您的项目',backToCategory:'返回所属分类',oemGuide:'查看 OEM 审批清单',preparation:'使用询价范围模板',briefAction:'讨论您的项目',otherWorks:'同类中的另一件作品',publishedLabel:'文章发布日期',scopeNote:'本文区分照片可见内容与新委托需要核实的事项。材料规格、尺寸、图稿使用权和交付范围均须按您的项目确认。'},
  ar: {home:'الرئيسية',applications:'مجالات الاستخدام',record:'دراسة تصنيع',read:'اقرأ دراسة التصنيع',briefHeading:'حضّر موجزاً لمشروعك',faqHeading:'أسئلة قبل التصنيع',relatedHeading:'تابع مراجعة مشروعك',backToCategory:'العودة إلى مجال الاستخدام',oemGuide:'راجع قائمة اعتماد تصنيع OEM',preparation:'استخدم نموذج نطاق طلب السعر',briefAction:'ناقش مشروعك',otherWorks:'عمل آخر في هذا المجال',publishedLabel:'تاريخ نشر المقال',scopeNote:'يميّز المقال بين ما تظهره الصورة وما يلزم مراجعته لتكليف جديد. يجب الاتفاق على مواصفات المواد والأبعاد وحقوق العمل الفني ونطاق التسليم لمشروعك.'},
  fr: {home:'Accueil',applications:'Applications',record:'Étude de fabrication',read:'Lire l’étude de fabrication',briefHeading:'Préparer le cahier des charges de votre projet',faqHeading:'Questions avant fabrication',relatedHeading:'Poursuivre votre étude',backToCategory:'Revenir à l’application',oemGuide:'Voir la liste des validations OEM',preparation:'Utiliser le modèle de demande de devis',briefAction:'Discuter de votre projet',otherWorks:'Une autre œuvre dans cette application',publishedLabel:'Article publié le',scopeNote:'Cet article distingue ce que montre la photographie des points à examiner pour une nouvelle commande. Spécifications, dimensions, droits sur le visuel et périmètre de livraison sont à convenir pour votre projet.'},
  es: {home:'Inicio',applications:'Aplicaciones',record:'Estudio de fabricación',read:'Leer el estudio de fabricación',briefHeading:'Preparar el resumen de su proyecto',faqHeading:'Preguntas antes de fabricar',relatedHeading:'Continuar la revisión del proyecto',backToCategory:'Volver a la aplicación',oemGuide:'Ver la lista de aprobaciones OEM',preparation:'Usar la plantilla de alcance',briefAction:'Comentar su proyecto',otherWorks:'Otra obra de esta aplicación',publishedLabel:'Artículo publicado el',scopeNote:'El artículo distingue lo visible en la fotografía de las revisiones necesarias para un nuevo encargo. Materiales, dimensiones, derechos del diseño y alcance de entrega deben acordarse para su proyecto.'},
  de: {home:'Startseite',applications:'Einsatzbereiche',record:'Fertigungsbetrachtung',read:'Fertigungsbetrachtung lesen',briefHeading:'Ein Briefing für Ihr eigenes Projekt vorbereiten',faqHeading:'Fragen vor der Fertigung',relatedHeading:'Projektprüfung fortsetzen',backToCategory:'Zurück zum Einsatzbereich',oemGuide:'OEM-Freigabecheckliste ansehen',preparation:'Vorlage für den Angebotsumfang nutzen',briefAction:'Ihr Projekt besprechen',otherWorks:'Ein weiteres Werk dieses Einsatzbereichs',publishedLabel:'Artikel veröffentlicht am',scopeNote:'Der Artikel trennt sichtbare Bildmerkmale von Prüfpunkten für einen neuen Auftrag. Materialspezifikation, Maße, Vorlagenrechte und Lieferumfang müssen für Ihr Projekt vereinbart werden.'},
};

export function getWorkArticle(slug, language='en') {
  const key = String(slug).replace(/^\/?projects\//,'').replace(/\/$/,'');
  const definition = definitions.find(item => item.slug === key);
  if (!definition) return null;
  const translations = content[definition.slug];
  const text = translations?.[language] || translations?.en;
  if (!text) return null;
  const image = getApplicationMedia(definition.categoryId, language).find(item => item.file === definition.imageFile);
  return { ...definition, ...text, images: [image] };
}
export function getWorkArticles(language='en') {
  return definitions.map(item => getWorkArticle(item.slug,language)).filter(Boolean);
}
export function getWorkArticleForImage(file,language='en') {
  const definition = definitions.find(item => item.imageFile === file);
  return definition ? getWorkArticle(definition.slug,language) : null;
}
