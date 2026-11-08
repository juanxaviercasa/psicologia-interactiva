const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const c=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('js/coleccion_data.js','utf8'),c);
vm.runInContext(fs.readFileSync('js/course_manifest.js','utf8'),c);
const catalog=vm.runInContext('COLECCION_DATA',c),manifest=vm.runInContext('COURSE_MANIFEST',c);
test('Manifiesto cubre rutas interactivas existentes y separa las cinco obras sin curso',()=>{
  assert.equal(catalog.books.length,94);
  assert.equal(catalog.audiobooks.length,20);
  assert.equal(manifest.ids.length,89);
  const ids=new Set(manifest.ids);
  assert.equal(ids.size,manifest.ids.length);
  const missing=catalog.books.filter(x=>!manifest.has(x.id));
  assert.equal(missing.length,5);
  for(const id of ids){
    assert.ok(fs.existsSync('js/books/'+id+'_data.js'),id+' missing data');
    assert.ok(fs.existsSync('js/books/'+id+'_content.js'),id+' missing content');
  }
});
test('La portada ofrece filtros accesibles, links a la biblioteca y audiolibros',()=>{
  const src=fs.readFileSync('index.html','utf8');
  assert.match(src,/id="catalogSearch"/);assert.match(src,/id="catalogCategoryFilter"/);
  assert.match(src,/id="catalogFormatFilter"/);
  assert.match(src,/app\.html\?library=/);assert.match(src,/app\.html\?view=audiolibros/);
  assert.match(src,/loading="lazy"/);
});
