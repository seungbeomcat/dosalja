(function(){
  "use strict";
  const records=[
    {id:"rift-20261003",type:"균열",title:"균열의 격전지",period:"2026.10.03 ~ 10.05",sort:"2026-10-05T2",rank:"1위",items:[
      {name:"신화 동료 외형 소환권",qty:1,recipients:["페르시안"]}
    ]},
    {id:"occupation-20260924",type:"점령전",title:"점령전",period:"2026.09.24 ~ 10.05",sort:"2026-10-05T1",rank:"2위",items:[
      {name:"럭키펀치 장갑",qty:2,recipients:[]},
      {name:"럭키펀치 모자",qty:2,recipients:[]},
      {name:"럭키펀치 목도리",qty:2,recipients:[]},
      {name:"럭키펀치 신발",qty:2,recipients:[]},
      {name:"길드 점령전 구슬",qty:1200,status:"unallocated",recipients:[]},
      {name:"영웅 장비 제작법 소환권 조각",qty:3,status:"unallocated",recipients:[]}
    ]},
    {id:"galaxy-20260926",type:"은하",title:"은하 격전지",period:"2026.09.26 ~ 09.28",sort:"2026-09-28",rank:"1위",items:[
      {name:"하늘빛 상의",qty:2,recipients:["돗돔","혀녕"]},
      {name:"하늘빛 하의",qty:2,recipients:["승부왕","페르시안"]}
    ]},
    {id:"rift-20260919",type:"균열",title:"균열의 격전지",period:"2026.09.19 ~ 09.21",sort:"2026-09-21T2",rank:"1위",items:[
      {name:"신화 동료 외형 소환권",qty:1,recipients:["토시살"]}
    ]},
    {id:"brawl-20260916",type:"난투전",title:"길드 난투전",period:"2026.09.16 ~ 09.21",sort:"2026-09-21T1",rank:"1위",items:[
      {name:"레드스컬",qty:10,recipients:["사마엘"]},
      {name:"길드난투전 코인",qty:105,recipients:["사마엘"]}
    ]},
    {id:"rift-20260912",type:"균열",title:"균열의 격전지",period:"2026.09.12 ~ 09.14",sort:"2026-09-14",rank:"2위",items:[
      {name:"전설 동료 외형 소환권",qty:3,recipients:["매콤갈비","승부왕","뱅수띠"]}
    ]}
  ].sort((a,b)=>b.sort.localeCompare(a.sort));

  const page=document.getElementById('rewardHistoryPage');
  const openBtn=document.getElementById('rewardHistoryOpenBtn');
  const backBtn=document.getElementById('rewardHistoryBackBtn');
  const list=document.getElementById('rewardHistoryList');
  const filters=[...document.querySelectorAll('[data-reward-filter]')];
  const subtitle=document.getElementById('rewardHistorySubtitle');
  const detailOverlay=document.getElementById('rewardDetailOverlay');
  const detailClose=document.getElementById('rewardDetailCloseBtn');
  const detailRank=document.getElementById('rewardDetailRank');
  const detailTitle=document.getElementById('rewardDetailTitle');
  const detailPeriod=document.getElementById('rewardDetailPeriod');
  const detailItems=document.getElementById('rewardDetailItems');
  let activeFilter=null;
  let returnScrollY=0;
  const REWARD_THEMES={
    "균열":{filterBg:"#7C3AED",filterBorder:"#5B21B6",filterText:"#FFFFFF",filterActiveBg:"#5B21B6",filterActiveBorder:"#F2C94C",filterActiveText:"#FFFFFF",cardBg:"#FCFAFF",cardBorder:"#7C3AED",cardText:"#3B1768",rankBg:"#7C3AED",rankBorder:"#5B21B6",rankText:"#FFFFFF",titleText:"#5B21B6",periodText:"#6D5A80",miniBg:"#FFFFFF",miniBorder:"#B79AEF",miniText:"#4A2869",arrowColor:"#7C3AED",detailBorder:"#7C3AED",detailRankBg:"#7C3AED",detailRankText:"#FFFFFF",detailTitleText:"#5B21B6",detailPeriodText:"#6D5A80",detailItemBg:"#F8F3FF",detailItemBorder:"#C8B2F3",detailItemText:"#43205E",chipBg:"#EEE4FF",chipBorder:"#C8A9F4",chipText:"#53288A"},
    "은하":{filterBg:"#2563EB",filterBorder:"#1D4ED8",filterText:"#FFFFFF",filterActiveBg:"#1D4ED8",filterActiveBorder:"#F2C94C",filterActiveText:"#FFFFFF",cardBg:"#F8FAFF",cardBorder:"#2563EB",cardText:"#173A7A",rankBg:"#2563EB",rankBorder:"#1D4ED8",rankText:"#FFFFFF",titleText:"#1D4ED8",periodText:"#5B6E91",miniBg:"#FFFFFF",miniBorder:"#9EBBF6",miniText:"#274B84",arrowColor:"#2563EB",detailBorder:"#2563EB",detailRankBg:"#2563EB",detailRankText:"#FFFFFF",detailTitleText:"#1D4ED8",detailPeriodText:"#5B6E91",detailItemBg:"#F1F5FF",detailItemBorder:"#B7CAF7",detailItemText:"#24467B",chipBg:"#E3ECFF",chipBorder:"#AEC3F6",chipText:"#244C93"},
    "점령전":{filterBg:"#059669",filterBorder:"#047857",filterText:"#FFFFFF",filterActiveBg:"#047857",filterActiveBorder:"#F2C94C",filterActiveText:"#FFFFFF",cardBg:"#F7FCFA",cardBorder:"#059669",cardText:"#145B46",rankBg:"#059669",rankBorder:"#047857",rankText:"#FFFFFF",titleText:"#047857",periodText:"#59786F",miniBg:"#FFFFFF",miniBorder:"#8DD6BD",miniText:"#285D4C",arrowColor:"#059669",detailBorder:"#059669",detailRankBg:"#059669",detailRankText:"#FFFFFF",detailTitleText:"#047857",detailPeriodText:"#59786F",detailItemBg:"#EFFAF6",detailItemBorder:"#A5DEC9",detailItemText:"#28594A",chipBg:"#DDF5EC",chipBorder:"#9EDBC5",chipText:"#176047"},
    "난투전":{filterBg:"#EA580C",filterBorder:"#C2410C",filterText:"#FFFFFF",filterActiveBg:"#C2410C",filterActiveBorder:"#F2C94C",filterActiveText:"#FFFFFF",cardBg:"#FFF9F5",cardBorder:"#EA580C",cardText:"#7B3212",rankBg:"#EA580C",rankBorder:"#C2410C",rankText:"#FFFFFF",titleText:"#C2410C",periodText:"#80665B",miniBg:"#FFFFFF",miniBorder:"#F2AD88",miniText:"#7A3C22",arrowColor:"#EA580C",detailBorder:"#EA580C",detailRankBg:"#EA580C",detailRankText:"#FFFFFF",detailTitleText:"#C2410C",detailPeriodText:"#80665B",detailItemBg:"#FFF2EB",detailItemBorder:"#F3B99A",detailItemText:"#763A22",chipBg:"#FFE7DA",chipBorder:"#F0B395",chipText:"#8A3E1C"}
  };
  const REWARD_IMAGE_MAP={
    "신화 동료 외형 소환권":"./assets/rewards/display/myth-companion-ticket-display.webp",
    "전설 동료 외형 소환권":"./assets/rewards/display/legendary-companion-ticket-display.webp",
    "하늘빛 상의":"./assets/rewards/display/skyblue-top-display.webp",
    "하늘빛 하의":"./assets/rewards/display/skyblue-bottom-display.webp",
    "레드스컬":"./assets/rewards/display/red-skull-display.webp",
    "길드난투전 코인":"./assets/rewards/display/guild-brawl-coin-display.webp",
    "럭키펀치 장갑":"./assets/rewards/display/lucky-punch-gloves-display.webp",
    "럭키펀치 모자":"./assets/rewards/display/lucky-punch-hat-display.webp",
    "럭키펀치 목도리":"./assets/rewards/display/lucky-punch-scarf-display.webp",
    "럭키펀치 신발":"./assets/rewards/display/lucky-punch-shoes-display.webp",
    "길드 점령전 구슬":"./assets/rewards/display/guild-occupation-orb-display.webp",
    "영웅 장비 제작법 소환권 조각":"./assets/rewards/display/hero-equipment-recipe-fragment-display.webp"
  };

  function getTheme(type){return REWARD_THEMES[type]||REWARD_THEMES["균열"]}
  function resolveRewardImg(item){return REWARD_IMAGE_MAP[item.name]||""}
  function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,function(ch){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];});}
  function themeVars(type){
    const t=getTheme(type);
    return `--card-bg:${t.cardBg};--card-border:${t.cardBorder};--card-text:${t.cardText};--rank-bg:${t.rankBg};--rank-border:${t.rankBorder};--rank-text:${t.rankText};--title-text:${t.titleText};--period-text:${t.periodText};--mini-bg:${t.miniBg};--mini-border:${t.miniBorder};--mini-text:${t.miniText};--arrow-color:${t.arrowColor};--detail-border:${t.detailBorder};--detail-rank-bg:${t.detailRankBg};--detail-rank-text:${t.detailRankText};--detail-title-text:${t.detailTitleText};--detail-period-text:${t.detailPeriodText};--detail-item-bg:${t.detailItemBg};--detail-item-border:${t.detailItemBorder};--detail-item-text:${t.detailItemText};--chip-bg:${t.chipBg};--chip-border:${t.chipBorder};--chip-text:${t.chipText};`;
  }
  filters.forEach(btn=>{
    const t=getTheme(btn.dataset.rewardFilter);
    btn.style.setProperty('--filter-bg',t.filterBg);
    btn.style.setProperty('--filter-border',t.filterBorder);
    btn.style.setProperty('--filter-text',t.filterText);
    btn.style.setProperty('--filter-active-bg',t.filterActiveBg);
    btn.style.setProperty('--filter-active-border',t.filterActiveBorder);
    btn.style.setProperty('--filter-active-text',t.filterActiveText);
  });

  function qtyText(item){
    if(item.qty===null||item.qty===undefined)return item.name;
    return `${item.name} ×${Number(item.qty).toLocaleString('ko-KR')}`;
  }
  function miniItem(item,type){
    const imgSrc=resolveRewardImg(item);
    return `<span class="reward-item-mini" style="${themeVars(type)}">${imgSrc?`<span class="reward-icon-frame"><img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.closest('.reward-icon-frame').remove();"></span>`:''}<span>${qtyText(item)}</span></span>`;
  }
  function render(){
    const visible=activeFilter?records.filter(r=>r.type===activeFilter):records;
    subtitle.textContent=activeFilter?`${activeFilter} · 최근 기간순`:'전체 회차 · 최근 기간순';
    filters.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.rewardFilter===activeFilter)));
    if(!visible.length){list.innerHTML='<div class="reward-history-empty">등록된 기록이 없습니다.</div>';return;}
    list.innerHTML=visible.map(r=>`<div class="reward-history-card" style="${themeVars(r.type)}" data-reward-id="${r.id}" aria-label="${r.title} ${r.period} 보상 분배 기록">
      <span class="reward-card-rank" data-reward-open="true" role="button" tabindex="0" aria-label="${r.title} 상세 보기">${r.rank}</span>
      <div class="reward-card-main">
        <div class="reward-card-head" data-reward-open="true" role="button" tabindex="0"><span class="reward-card-title">${r.title}</span><span class="reward-card-period">${r.period}</span></div>
        <div class="reward-card-scroll" tabindex="0" aria-label="${r.title} 보상 목록, 좌우로 스크롤">
          <div class="reward-card-track">${r.items.map(item=>miniItem(item,r.type)).join('')}</div>
        </div>
      </div>
      <button class="reward-card-arrow" type="button" data-reward-open="true" aria-label="${r.title} 상세 보기">›</button>
    </div>`).join('');
  }
  function openPage(){
    returnScrollY=window.scrollY||0;
    page.hidden=false;page.setAttribute('aria-hidden','false');openBtn.setAttribute('aria-expanded','true');
    document.body.classList.add('reward-page-open');document.body.style.overflow='hidden';
    page.scrollTop=0;render();
  }
  function closePage(){
    closeDetail();page.hidden=true;page.setAttribute('aria-hidden','true');openBtn.setAttribute('aria-expanded','false');
    document.body.classList.remove('reward-page-open');document.body.style.overflow='';
    window.v181RestoreMainHome(openBtn);
  }
  function openDetail(record){
    const theme=getTheme(record.type);
    const modal=detailOverlay.querySelector('.reward-detail-modal');
    if(modal){modal.setAttribute('style',themeVars(record.type));}
    detailRank.textContent=record.rank;
    detailTitle.textContent=record.title;
    detailPeriod.textContent=record.period;
    detailItems.innerHTML=record.items.map(item=>{
      const imgSrc=resolveRewardImg(item);
      let chips='';
      if(item.recipients&&item.recipients.length){chips=item.recipients.map(n=>`<span class="reward-recipient-chip">${n}</span>`).join('');}
      else if(item.status==='unallocated'){chips='<span class="reward-recipient-chip unallocated">미분배</span>';}
      else{chips='<span class="reward-recipient-chip pending">수령자 미입력</span>';}
      return `<div class="reward-detail-item${imgSrc?'':' no-image'}" style="${themeVars(record.type)}">${imgSrc?`<span class="reward-detail-icon-frame"><img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy" decoding="async" fetchpriority="low" onerror="this.closest('.reward-detail-icon-frame').remove();"></span>`:''}<div class="reward-detail-item-main"><div class="reward-detail-item-title">${qtyText(item)}</div><div class="reward-detail-item-recipients">${chips}</div></div></div>`;
    }).join('');
    detailOverlay.hidden=false;detailOverlay.setAttribute('aria-hidden','false');
  }
  function closeDetail(){if(!detailOverlay)return;detailOverlay.hidden=true;detailOverlay.setAttribute('aria-hidden','true');}

  backBtn.addEventListener('click',closePage);
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const f=btn.dataset.rewardFilter;activeFilter=activeFilter===f?null:f;render();
  }));
  list.addEventListener('click',e=>{
    if(e.target.closest('.reward-card-scroll'))return;
    const opener=e.target.closest('[data-reward-open="true"]');if(!opener)return;
    const card=opener.closest('[data-reward-id]');if(!card)return;
    const r=records.find(x=>x.id===card.dataset.rewardId);if(r)openDetail(r);
  });
  list.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    if(e.target.closest('.reward-card-scroll'))return;
    const opener=e.target.closest('[data-reward-open="true"]');if(!opener)return;
    const card=opener.closest('[data-reward-id]');if(!card)return;
    e.preventDefault();const r=records.find(x=>x.id===card.dataset.rewardId);if(r)openDetail(r);
  });
  // V1.8.4: iPhone Safari can let the fixed vertical page consume a nested horizontal swipe.
  // Handle horizontal intent explicitly and drive scrollLeft while leaving vertical gestures native.
  let rewardTouchDrag=null;
  list.addEventListener('touchstart',e=>{
    const viewport=e.target.closest('.reward-card-scroll');
    if(!viewport||!e.touches||!e.touches.length)return;
    const t=e.touches[0];
    rewardTouchDrag={viewport,startX:t.clientX,startY:t.clientY,startScrollLeft:viewport.scrollLeft,axis:null,moved:false};
  },{passive:true});
  list.addEventListener('touchmove',e=>{
    const s=rewardTouchDrag;if(!s||!e.touches||!e.touches.length)return;
    const t=e.touches[0],dx=t.clientX-s.startX,dy=t.clientY-s.startY;
    if(!s.axis){
      if(Math.abs(dx)<5&&Math.abs(dy)<5)return;
      s.axis=(Math.abs(dx)>Math.abs(dy)*1.05)?'x':'y';
    }
    if(s.axis!=='x')return;
    e.preventDefault();
    s.moved=true;
    s.viewport.classList.add('is-horizontal-dragging');
    s.viewport.scrollLeft=s.startScrollLeft-dx;
  },{passive:false});
  const endRewardTouchDrag=()=>{
    if(rewardTouchDrag&&rewardTouchDrag.viewport)rewardTouchDrag.viewport.classList.remove('is-horizontal-dragging');
    rewardTouchDrag=null;
  };
  list.addEventListener('touchend',endRewardTouchDrag,{passive:true});
  list.addEventListener('touchcancel',endRewardTouchDrag,{passive:true});
  // Desktop/trackpad fallback: Shift+wheel or dominant horizontal wheel moves the same viewport.
  list.addEventListener('wheel',e=>{
    const viewport=e.target.closest('.reward-card-scroll');if(!viewport)return;
    const delta=Math.abs(e.deltaX)>=Math.abs(e.deltaY)?e.deltaX:(e.shiftKey?e.deltaY:0);
    if(!delta)return;
    viewport.scrollLeft+=delta;
    e.preventDefault();
  },{passive:false});

  detailClose.addEventListener('click',closeDetail);
  detailOverlay.addEventListener('pointerdown',e=>{if(e.target===detailOverlay)closeDetail();});
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    if(!detailOverlay.hidden){closeDetail();return;}
    if(!page.hidden)closePage();
  });
  window.DOSALJA_REWARDS={open:openPage,close:closePage,render:render};
})();
