// 描画の下請け。entities配下からもrender.jsからも使う。
// ここをrender.jsに置くと entities → render → entities の循環参照になるため独立させている。
import {ctx} from './canvas.js';

export function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
export function roundRectOn(c2,x,y,w,h,rad){c2.beginPath();c2.moveTo(x+rad,y);c2.arcTo(x+w,y,x+w,y+h,rad);c2.arcTo(x+w,y+h,x,y+h,rad);c2.arcTo(x,y+h,x,y,rad);c2.arcTo(x,y,x+w,y,rad);c2.closePath();}
export function roundRect(x,y,w,h,rad){roundRectOn(ctx,x,y,w,h,rad);}
export function triangleOn(c2,a,b2,c3,d,e,f){c2.beginPath();c2.moveTo(a,b2);c2.lineTo(c3,d);c2.lineTo(e,f);c2.closePath();c2.fill();}
export function triangle(a,b2,c3,d,e,f){triangleOn(ctx,a,b2,c3,d,e,f);}
