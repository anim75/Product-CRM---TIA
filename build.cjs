'use strict';
const fs=require('node:fs/promises');
const assets=['index.html','app.css','workspace.css','experience.css','profile.css','metrics.js','lifecycle.js','app.js','growth.js','meeting-format.js','meeting-email.js','workspace.js','local-auth.js','experience.js','google-workspace.js','profile.js','exports.js','polish.js','polish.css','assets/imtial-product-manager.jpeg','assets/imtial-product-manager-cutout.png'];
async function build(){await fs.mkdir('public',{recursive:true});await Promise.all(assets.map(async file=>{await fs.mkdir(require('node:path').dirname('public/'+file),{recursive:true});await fs.copyFile(file,'public/'+file);}));console.log('Prepared '+assets.length+' public assets.');}
if(require.main===module)build().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={assets,build};
