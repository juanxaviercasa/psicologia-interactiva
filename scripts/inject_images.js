const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'js', 'books');
const files = fs.readdirSync(baseDir);

let modifiedCount = 0;

for (const f of files) {
    if (f.endsWith('_data.js') || f.endsWith('_content.js')) {
        const filePath = path.join(baseDir, f);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        const randomCoverNum = Math.floor(Math.random() * 10) + 1;
        const imgTag = `<img src=\\"../../assets/img/covers/cover_${randomCoverNum}.webp\\" alt=\\"Portada\\" class=\\"w-full h-full object-cover absolute inset-0 z-0 opacity-60 mix-blend-luminosity hover:opacity-100 transition-opacity duration-500\\"><div class=\\"z-10 bg-slate-900/80 px-3 py-1 rounded backdrop-blur-md shadow border border-indigo-500/30\\"><span class=\\"text-xs text-indigo-300 font-bold uppercase tracking-wider\\">Portada Visual</span></div>`;
        
        // Match the exact string including literal \n and escaped quotes
        const placeholderRegex = /<i class=\\"fa-solid fa-image text-4xl text-slate-600 mb-2\\"><\/i>\\n\s*<span class=\\"text-sm text-slate-500 font-semibold uppercase tracking-wider\\">Portada<\/span>/g;
        
        if (placeholderRegex.test(content)) {
            content = content.replace(placeholderRegex, imgTag);
            fs.writeFileSync(filePath, content, 'utf-8');
            modifiedCount++;
        }
    }
}

console.log(`[+] Se han inyectado imágenes maestras en ${modifiedCount} archivos.`);
