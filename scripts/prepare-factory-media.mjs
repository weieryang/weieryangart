import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const inputs=path.resolve(process.argv[2]||path.join(root,'qa','2026-11-02-factory-photos','inputs'));
const out=path.join(root,'public','seo-media');
const qa=path.join(root,'qa','2026-11-02-factory-photos');
const selected=[['01.jpg','factory-workshop-overview.webp'],['03.jpg','factory-sheet-metal-workstation.webp'],['05.jpg','factory-curved-metal-components.webp'],['13.jpg','factory-reflective-form-detail.webp']];
const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
const encoding={quality:82,effort:6,smartSubsample:true};
await fs.mkdir(out,{recursive:true});await fs.mkdir(qa,{recursive:true});
const items=[];
for(const [name,file] of selected){
 const input=path.join(inputs,name),original=await fs.readFile(input),metadata=await sharp(input).metadata();
 const results=[];
 for(const width of [1600,640,960]){
  const destFile=width===1600?file:file.replace('.webp',`-${width}w.webp`);
  // Preserve the complete frame; default Sharp output strips private metadata.
  const bytes=await sharp(input).autoOrient().resize({width,withoutEnlargement:true}).webp(encoding).toBuffer();
  const m=await sharp(bytes).metadata();
  if(m.exif||m.xmp||m.iptc||m.orientation||m.width>metadata.width)throw new Error(`Invalid derivative ${destFile}`);
  await fs.writeFile(path.join(out,destFile),bytes);
  results.push({file:destFile,path:`/seo-media/${destFile}`,width:m.width,height:m.height,bytes:bytes.length,sha256:digest(bytes),metadataStripped:true,completeFrame:true});
 }
 if(digest(await fs.readFile(input))!==digest(original))throw new Error(`Source changed: ${name}`);
 items.push({source:{privateCopy:name,bytes:original.length,width:metadata.width,height:metadata.height,sha256:digest(original)},classification:'operator-confirmed-workshop-photograph',base:results[0],derivatives:results.slice(1),sourceUnchanged:true});
}
const manifest={preparedOn:'2026-11-02',operation:'full-frame WebP encoding and responsive derivatives only; no retouching, watermark removal or content synthesis',items};
await fs.writeFile(path.join(qa,'media-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({images:items.length,derivatives:items.length*3,totalBytes:items.flatMap(x=>[x.base,...x.derivatives]).reduce((n,x)=>n+x.bytes,0),geometry:items.map(x=>({file:x.base.file,width:x.base.width,height:x.base.height,bytes:x.base.bytes}))}));
