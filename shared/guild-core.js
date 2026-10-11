/* 도살장 길드 공통 데이터·계산 규칙 — 세 페이지 공통 원본
 * 설치 위치: dosalja/shared/guild-core.js (절대 경로 /dosalja/shared/guild-core.js)
 * 향후 격추/지역/최소점수/별칭/공통 계산 규칙 변경: 이 파일만 수정하고 도살자 저장소에 배포.
 * 과거 완료 회차/보상/처치 기록은 절대 소급 변경하지 않는다.
 * 2026-10-10 최초 전환; 기본격추 돗돔 182.9%.
 * 2026-10-10 바포메트→항정살 (구 닉네임은 aliases/formerNames에 유지).
 * 2026-10-10 아메리칸컬 기본81.5%·늑대8%·음식6%; 차돌 기본128.8%.
 * 2026-10-11 벨제붑 기본격추 42%→45%; 다른 설정 유지.
 * 2026-10-11 돗돔→안창살; 이전 닉네임은 과거 기록 보존 및 현재 집계 연결용 별칭.
 * 2026-10-11 승부왕→지리산; 기본235%, 일반 4지역33%, 은하·상층0%, 최소점수0.
 */
(function(global){
  "use strict";
  const members = {
  // minScore는 격전지 전투 1회 최종 스코어에 딱 한 번 가산되는 개인 고정값이다.
  "안창살":     {base:182.9, z1r:0, z2r:5, z3r:0, minScore:5000, field:{wolf:23,pirate:22,cat:22,food:22,galaxy:0}},
  "매콤갈비":   {base:165.2, z1r:5, z2r:5, z3r:0, minScore:0,    field:{wolf:8,pirate:8,cat:8,food:8,galaxy:0}},
  "도살장":     {base:138.5, z1r:0, z2r:5, z3r:0, minScore:0,    field:{wolf:23,pirate:23,cat:23,food:23,galaxy:0}},
  "잎새주":     {base:107.9, z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:23,pirate:6,cat:6,food:6,galaxy:0}},
  "차돌":       {base:128.8, z1r:0, z2r:5, z3r:0, minScore:3000, field:{wolf:24,pirate:22,cat:22,food:22,galaxy:0}},
  "애기다라":   {base:100,   z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "채끝살":     {base:89,    z1r:0, z2r:5, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "대창":       {base:72,    z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "진니":       {base:69.2,  z1r:0, z2r:5, z3r:0, minScore:0,    field:{wolf:7,pirate:6,cat:6,food:6,galaxy:0}},
  "아메리칸컬": {base:81.5,  z1r:0, z2r:0, z3r:0, minScore:2500, field:{wolf:8,pirate:0,cat:0,food:6,galaxy:0}},
  "지리산":     {base:235,   z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:33,pirate:33,cat:33,food:33,galaxy:0}},
  "토시살":     {base:81,    z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "페르시안":   {base:57,    z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "생갈비":     {base:45,    z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "벨제붑":     {base:45,    z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}},
  "항정살":   {base:35.5,  z1r:0, z2r:0, z3r:0, minScore:0,    field:{wolf:0,pirate:0,cat:0,food:0,galaxy:0}}
  };
  const aliases = {
  "돗돔":"안창살","돚돔":"안창살","돋돔":"안창살","돝돔":"안창살","돕돔":"안창살",
  "매콤":"매콤갈비","갈비":"매콤갈비","메콤":"매콤갈비",
  "사마엘":"도살장","사마앨":"도살장","사무엘":"도살장","사므엘":"도살장","샤뮤엘":"도살장","사마":"도살장","마엘":"도살장",
  "혀녕":"차돌","혀넝":"차돌","허녕":"차돌","허넝":"차돌",
  "XIGN":"채끝살","xign":"채끝살","사인":"채끝살","싸인":"채끝살",
  "뱅수띠":"대창","벵수띠":"대창","뱅수디":"대창","벵수디":"대창","뱅수":"대창","벵수":"대창","뱅수씨":"대창","벵수씨":"대창",
  "토시":"토시살","토살":"토시살",
  "페르":"페르시안","패르시안":"페르시안","패르":"페르시안","시안":"페르시안",
  "승부왕":"지리산","승부":"지리산","ㅅㅂ왕":"지리산","슴부왕":"지리산","슝브왕":"지리산",
  "데이다라":"애기다라","데이":"애기다라","다라":"애기다라","대이":"애기다라","대이다라":"애기다라",
  "바포메트":"항정살","바포":"항정살","메트":"항정살","바포매트":"항정살","바메":"항정살",
  "하니엘":"생갈비","하니":"생갈비","니엘":"생갈비",
  "벨제":"벨제붑","제붑":"벨제붑","밸제":"벨제붑","밸재붑":"벨제붑","밸제붑":"벨제붑","벨재붑":"벨제붑"
  };
  const bosses = {
  "루이": [[15,325000],[16,330000],[17,335000],[18,340000],[19,345000],[20,350000]],
  "루니": [[25,375000],[26,380000],[27,385000],[28,390000],[29,395000],[30,400000]],
  "루나": [[35,425000],[36,430000],[37,435000],[38,440000],[39,445000],[40,450000]],
  "바나냥": [[45,475000],[46,480000],[47,485000],[48,490000],[49,495000],[50,500000]]
  };
  const formerNames = {"사마엘":"도살장","혀녕":"차돌","XIGN":"채끝살","뱅수띠":"대창","데이다라":"애기다라","하니엘":"생갈비","바포메트":"항정살","돗돔":"안창살","승부왕":"지리산"};
  const rules = {wavesPerSecond:63/60,scorePerWave:1000,safeSeconds:1,serverOptions:[0,1,2,3,4,6]};
  const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
  const canonical=n=>{const key=String(n??'').trim();return own(members,key)?key:(aliases[key]||formerNames[key]||key);};
  function memberOrder(){return Object.keys(members).sort((a,b)=>members[b].base-members[a].base||a.localeCompare(b,'ko-KR'));}
  function zoneTotal(name,server,zone){const m=members[canonical(name)];return m?m.base+Number(server)+(m[{z1:'z1r',z2:'z2r',z3:'z3r'}[zone]]||0):null;}
  function regionTotal(name,server,region){const m=members[canonical(name)];return m&&m.field&&m.field[region]!=null?m.base+Number(server)+Number(m.field[region]):null;}
  function sustainedDpsFromG(G){return rules.wavesPerSecond*rules.scorePerWave*(1+Number(G)/100);}
  function scoreAtCompletedWaves(name,G,waves){const m=members[canonical(name)];return Math.round(Number(waves)*rules.scorePerWave*(1+Number(G)/100)+(m?m.minScore||0:0));}
  function safeSecRange(sec){const c=Math.max(0,Math.round(sec));return {center:c,low:Math.max(0,c-rules.safeSeconds),high:c+rules.safeSeconds};}
  function largestRemainder(raws,target,tieGs){
    const floors=raws.map(Math.floor);
    const remaining=Math.max(0,target-floors.reduce((a,b)=>a+b,0));
    const ranked=raws.map((r,i)=>({i,frac:r-Math.floor(r),G:Number(tieGs[i])||0}))
      .sort((a,b)=>(b.frac-a.frac)||(b.G-a.G)||(a.i-b.i));
    const out=floors.slice();for(let i=0;i<remaining;i++)out[ranked[i%ranked.length].i]++;
    return {out,ranked,remaining};
  }
  function allocateHpExact(hp,items){
    const S=items.reduce((a,x)=>a+x.P,0);
    const raws=items.map(x=>S?hp*x.P/S:0);
    const alloc=largestRemainder(raws,hp,items.map(x=>x.G));
    return {raws,out:alloc.out,totalMin:0,remain:hp,S};
  }
  const core=Object.freeze({
    schemaVersion:1,version:'2026.10.11-197-jirisan',members,aliases,formerNames,bosses,rules,
    canonical,memberOrder,zoneTotal,regionTotal,sustainedDpsFromG,
    scoreAtCompletedWaves,safeSecRange,largestRemainder,allocateHpExact
  });
  global.DosaljaShared=core;
})(window);
