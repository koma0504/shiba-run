import {TILE,COLS,ROWS} from './config.js';

export const tileGrid=[];
export let r,i,j;
for(r=0;r<ROWS;r++){tileGrid.push(new Array(COLS).fill('.'));}
function fillTiles(c1,c2,r1,r2){for(let rr=r1;rr<=r2;rr++)for(let cc=c1;cc<=c2;cc++)tileGrid[rr][cc]='#';}
fillTiles(0,18,11,11);fillTiles(22,40,11,11);fillTiles(46,53,11,11);fillTiles(57,100,11,11);fillTiles(107,121,11,11);fillTiles(125,151,11,11);fillTiles(159,180,11,11);fillTiles(184,199,11,11);fillTiles(208,231,11,11);fillTiles(235,259,11,11);
fillTiles(13,15,8,8);fillTiles(32,34,8,8);fillTiles(36,38,6,6);fillTiles(42,44,8,8);
fillTiles(62,62,10,10);fillTiles(63,63,9,10);fillTiles(64,65,8,10);fillTiles(70,72,7,7);
fillTiles(94,97,5,5);
fillTiles(144,146,6,6);fillTiles(149,151,4,4);fillTiles(154,156,8,8);
fillTiles(170,170,10,10);fillTiles(171,171,9,10);fillTiles(172,173,8,10);fillTiles(177,179,6,6);
fillTiles(217,219,4,4);fillTiles(240,243,4,4);
export const BONE_SPOTS=[];
function addBones(c1,c2,rr){for(let cc=c1;cc<=c2;cc++)BONE_SPOTS.push({x:cc*TILE+TILE/2,y:rr*TILE+TILE/2});}
addBones(6,8,10);addBones(13,15,7);addBones(36,38,5);addBones(42,44,7);addBones(54,56,9);addBones(70,72,6);addBones(78,80,10);addBones(84,86,10);
addBones(94,97,4);addBones(122,124,9);addBones(127,131,3);
addBones(144,146,5);addBones(149,151,3);addBones(154,156,7);addBones(172,173,7);addBones(177,179,5);addBones(195,197,10);addBones(217,219,3);addBones(232,234,9);addBones(240,243,3);addBones(246,248,10);
export const TOTAL_BONES=BONE_SPOTS.length;
export const CAT_SPOTS=[26,50,68,82,113,116,162,165,192,222,226];
export const CROW_SPOTS=[[96,100,220,1.3],[115,120,344,1.6],[126,131,240,1.4],[144,151,310,1.4],[188,194,340,1.7],[190,196,250,1.5],[201,207,270,1.5]];
export const TURRET_SPOTS=[75,119,168,228];
export const SPRING_SPOTS=[91,129,141,238];
export const MEAT_SPOTS=[[110*TILE+8,348],[186*TILE+8,348]];
export const CHECKPOINTS=[48*TILE,108*TILE,160*TILE,210*TILE],GOAL_X=254*TILE,ARENA_LEFT=242*TILE,ARENA_RIGHT=258*TILE;
export function isSolid(cc,rr){return rr>=0&&rr<ROWS&&cc>=0&&cc<COLS&&tileGrid[rr][cc]==='#';}
