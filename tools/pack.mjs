// itch.io へ上げる zip を作る。
//
// itch.io の HTML5 は「zip の中の index.html を起点に動かす」ので、
// index.html を zip の**直下**に置く必要がある。フォルダで包むと動かない。
//
//   node tools/pack.mjs        → shiba-run-itch.zip ができる
//
// 入れるのは実際に動かすのに要るものだけ。plans/ や product/ や tools/ は入れない。
// 中身が増えたら FILES に足すこと。入れ忘れると、ローカルでは動くのに
// アップロードしたものだけ白画面になる（読み込みは相対パスなので気づきにくい）。
import {execFileSync} from 'node:child_process';
import {existsSync,rmSync} from 'node:fs';

const OUT='shiba-run-itch.zip';
const FILES=['index.html','src'];

for(const f of FILES){
  if(!existsSync(f)){console.error('見つからない: '+f);process.exit(1);}
}
if(existsSync(OUT))rmSync(OUT);
execFileSync('zip',['-r','-q',OUT,...FILES,'-x','*.DS_Store'],{stdio:'inherit'});

const size=execFileSync('du',['-h',OUT]).toString().split('\t')[0];
const list=execFileSync('unzip',['-l',OUT]).toString().trim().split('\n');
console.log(OUT+' を作った（'+size+'）');
console.log('  ファイル数: '+(list.length-5));
// index.html が直下にあることを確かめる。ここを間違えると itch.io で動かない。
// unzip -l の行末はファイル名。直下なら「空白 + index.html」で終わり、
// フォルダ入りだと「/index.html」で終わるので前が空白の行だけを直下とみなす
if(!list.some(l=>/\sindex\.html$/.test(l))){
  console.error('index.html が zip の直下にない。itch.io で動かない');process.exit(1);}
console.log('  index.html は直下にある');
