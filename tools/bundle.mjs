// 17個のESモジュールを1つのHTMLファイルに固める。
//
//   node tools/bundle.mjs                 → shiba-run-standalone.html
//   ARTIFACT=path node tools/bundle.mjs   → 外側のタグを省いた形も書き出す
//
// なぜ要るか: ESモジュールはサーバ経由でないと動かない。ファイルを直接開いても、
// 1枚のHTMLとしてどこかに貼っても動かない。固めた版があれば、その2つができる。
//
// 固め方: main.js から深さ優先で辿り、帰りがけに並べる。これはESモジュールの
// 評価順そのものなので、読み込み時の副作用（save.js の loadSave、ui.js の
// buildStageList）が元と同じ順で起きる。順が変わると初期状態が変わりうる。
//
// import 文は消す。名前付き import は、その名前が固めた後のトップレベルに
// そのまま居るので消すだけでよい。default import だけは名前が輸入側で決まるので、
// モジュールごとに機械的な名前を振って別名を張る。
//
// **同じ名前がトップレベルで2度出たら、黙って壊れる前に止める。**
// モジュールの中に隠れていた名前が、固めると隣同士になるため。
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {dirname,join,relative,resolve} from 'node:path';

const ROOT=fileURLToPath(new URL('..',import.meta.url));
const ENTRY=join(ROOT,'src/main.js');

const defName=f=>'__def_'+relative(join(ROOT,'src'),f).replace(/[\\/.-]/g,'_');

const seen=new Set(),order=[];
async function walk(file){
  if(seen.has(file))return; seen.add(file);
  const src=await readFile(file,'utf8');
  const deps=[...src.matchAll(/^import\s+(?:[\s\S]*?)\s+from\s*['"]([^'"]+)['"];?\s*$/gm)]
    .map(m=>resolve(dirname(file),m[1]));
  for(const d of deps)await walk(d);
  order.push({file,src});
}
await walk(ENTRY);

const chunks=[];
// default import の別名。同じモジュールを同じ名前で読んでいる箇所が複数あるとき、
// 別名を2度書くと const の重複になる。中身は同一なので2度目は省く
const alias=new Map();
for(const {file,src} of order){
  let out=src;
  // default import: 輸入側の名前を、輸出側に振った機械的な名前へ張り直す
  out=out.replace(/^import\s+([A-Za-z_$][\w$]*)\s+from\s*['"]([^'"]+)['"];?\s*$/gm,
    (_,local,spec)=>{
      const target=defName(resolve(dirname(file),spec));
      const prev=alias.get(local);
      if(prev===target)return '';                 // 同じものを同じ名前で読んでいる。2度目は省く
      if(prev){console.error(`default import の名前が別のモジュールとぶつかっている: ${local}`);process.exit(1);}
      alias.set(local,target);
      return `const ${local}=${target};`;
    });
  // 名前付き import は消すだけ。その名前は固めた後のトップレベルに居る
  out=out.replace(/^import\s+\{[\s\S]*?\}\s+from\s*['"][^'"]+['"];?\s*$/gm,'');
  out=out.replace(/^import\s*['"][^'"]+['"];?\s*$/gm,'');
  // export default → 名前つきの const にする
  out=out.replace(/^export\s+default\s+/m,`const ${defName(file)}=`);
  // それ以外の export は語を落とすだけ
  out=out.replace(/^export\s+(const|let|var|function|class)\b/gm,'$1');
  if(/^\s*export\b/m.test(out)){console.error('扱えない export 文がある: '+file);process.exit(1);}
  chunks.push(`// ===== ${relative(ROOT,file)} =====\n`+out.trim());
}

const code=chunks.join('\n\n');

// 名前がぶつかっていないかは、正規表現ではなくJSエンジンに判定させる。
// このコードベースは関数の中も字下げしない書き方なので、行頭の const を数えると
// 関数の中の変数まで拾ってしまう。同じスコープでの const の重複は構文エラーなので、
// 一度コンパイルさせれば確実に分かる。検証ツールの inline 経路と同じ new Function を使う
try{new Function(code);}
catch(e){console.error('固めた結果がコンパイルできない: '+e.message);
console.error('モジュールの中で隠れていた名前が、固めるとぶつかっている可能性がある');process.exit(1);}
const html=await readFile(join(ROOT,'index.html'),'utf8');
const SCRIPT_TAG=/<script[^>]*\bsrc=["']src\/main\.js["'][^>]*><\/script>/;
if(!SCRIPT_TAG.test(html)){console.error('index.html に src/main.js の script タグが見つからない');process.exit(1);}

// 固めた版は module ではなく素の script にする。module にすると読み込みが遅延し、
// かつ検証ツールのインライン経路（new Function）が使えなくなる
const standalone=html.replace(SCRIPT_TAG,'<script>\n'+code+'\n</script>');
const OUT=join(ROOT,'shiba-run-standalone.html');
await writeFile(OUT,standalone);
console.log(`${relative(ROOT,OUT)} を書いた（${order.length}モジュール, ${Math.round(standalone.length/1024)}KB）`);

// Artifact 用。外側の doctype/html/head/body を省いた形
if(process.env.ARTIFACT){
  const style=html.match(/<style>[\s\S]*?<\/style>/)[0];
  const body=html.match(/<body>([\s\S]*?)<script/)[1];
  await writeFile(process.env.ARTIFACT,
    '<title>柴犬ラン</title>\n'+style+'\n'+body+'<script>\n'+code+'\n</script>\n');
  console.log(`${process.env.ARTIFACT} を書いた`);
}
