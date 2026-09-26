/* ============================================================================
   Ô CHỮ BÍ MẬT — TOÀN BỘ LOGIC TRÒ CHƠI
   Bộ đề nằm ở questions.js, không sửa gì trong file này cũng thêm đề được.
   ========================================================================== */

/* ---------- đọc ngân hàng đề & chuẩn hoá ---------- */
const DE = (window.DEBANK || []).map(d => ({
  topic: d.topic,
  keyword: d.keyword,
  rows: d.rows.map(r => Array.isArray(r) ? { a:r[0], k:r[1], q:r[2] } : r)
}));

/* ---------- tiện ích ---------- */
const $  = s => document.querySelector(s);
const letters = s => Array.from(s.normalize('NFC')).filter(c => c !== ' ');
const norm = s => Array.from((s||'').toUpperCase().normalize('NFD'))
                    .filter(c => !(c >= '̀' && c <= 'ͯ')).join('')
                    .replace(/Đ/g,'D').replace(/[^A-Z0-9]/g,'');
// giữ nguyên dấu, chỉ bỏ khoảng trắng và dấu câu
const normV = s => (s||'').toUpperCase().normalize('NFC')
                    .replace(/[\s.,!?;:'"\u00ab\u00bb()\[\]\-\u2013\u2014_\/\\]/g,'');
/* ---------- tự dò vị trí cột từ khoá khi bộ đề ghi k = null ---------- */
DE.forEach((d,di)=>{
  const kl = letters(d.keyword);
  d.rows.forEach((r,i)=>{
    if(typeof r.k === 'number' && r.k >= 0) return;
    const L = letters(r.a), want = norm(kl[i]||'');
    const hits = L.map((c,j)=> norm(c)===want ? j : -1).filter(j=>j>=0);
    r.k = hits.length ? hits[0] : 0;
    if(!hits.length)
      console.error(`[Ô chữ] Bộ đề ${di+1} hàng ${i+1} ("${r.a}"): không có chữ "${kl[i]}" của từ khoá trong đáp án.`);
    else if(hits.length > 1)
      console.warn(`[Ô chữ] Bộ đề ${di+1} hàng ${i+1} ("${r.a}"): chữ "${kl[i]}" xuất hiện ${hits.length} lần (vị trí ${hits.join(', ')}), đang dùng ${r.k}. Muốn chỗ khác thì ghi rõ số k.`);
  });
});

let strictAccent = true;                       // mặc định: bắt buộc gõ dấu
const same     = (a,b) => strictAccent ? normV(a)===normV(b) : norm(a)===norm(b);
const nearMiss = (a,b) => strictAccent && normV(a)!==normV(b) && norm(a)===norm(b) && norm(a)!=='';

/* ============================================================================
   ÂM THANH — tất cả sinh ra bằng Web Audio, không dùng file mp3 nào
   ----------------------------------------------------------------------------
   Đường tín hiệu:  nhạc nền  ┐
                              ├─> master ─> bộ nén ─> loa
                    hiệu ứng  ┘
   Bộ nén để tiếng thắng cuộc (cả chục nốt chồng nhau) không chói tai.
   ========================================================================== */
const A = { ctx:null, master:null, musicGain:null, sfxGain:null, noise:null,
            timer:null, step:0, next:0, duck:false };
let soundOn = true;      // hiệu ứng
let musicOn = true;      // nhạc nền
const MUSIC_VOL = 0.34;  // to nhỏ của nhạc nền, chỉnh ở đây
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

function audioInit(){
  if(A.ctx){ if(A.ctx.state==='suspended') A.ctx.resume(); return true; }
  try{
    const C = window.AudioContext || window.webkitAudioContext;
    if(!C) return false;
    A.ctx = new C();
    if(A.ctx.state==='suspended' && A.ctx.resume) A.ctx.resume();
    A.master = A.ctx.createGain(); A.master.gain.value = 0.9;
    let out = A.ctx.destination;
    try{
      const comp = A.ctx.createDynamicsCompressor();
      comp.threshold.value=-8; comp.knee.value=18; comp.ratio.value=4;
      comp.attack.value=0.005; comp.release.value=0.25;
      comp.connect(A.ctx.destination); out = comp;
    }catch(e){}
    A.master.connect(out);
    A.musicGain = A.ctx.createGain(); A.musicGain.gain.value = 0; A.musicGain.connect(A.master);
    A.sfxGain   = A.ctx.createGain(); A.sfxGain.gain.value   = 0.75; A.sfxGain.connect(A.master);
    const len = A.ctx.sampleRate * 1.2, buf = A.ctx.createBuffer(1,len,A.ctx.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
    A.noise = buf;
    return true;
  }catch(e){ return false; }
}
function tone(freq, t0, dur, type, gain, dest){
  if(!A.ctx) return;
  const o=A.ctx.createOscillator(), g=A.ctx.createGain();
  o.type=type||'triangle'; o.frequency.setValueAtTime(freq,t0);
  g.gain.setValueAtTime(0.0001,t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002,gain), t0+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
  o.connect(g); g.connect(dest||A.sfxGain);
  o.start(t0); o.stop(t0+dur+0.06);
}
function noiseHit(t0, dur, gain, hp, dest){
  if(!A.ctx||!A.noise) return;
  const s=A.ctx.createBufferSource(); s.buffer=A.noise;
  const f=A.ctx.createBiquadFilter(); f.type='highpass'; f.frequency.value=hp||2000;
  const g=A.ctx.createGain();
  g.gain.setValueAtTime(gain,t0); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  s.connect(f); f.connect(g); g.connect(dest||A.sfxGain);
  s.start(t0); s.stop(t0+dur+0.02);
}
const now = () => A.ctx ? A.ctx.currentTime : 0;

/* ---------- hiệu ứng ---------- */
function beep(freq, dur=.14, type='sine', vol=.18, delay=0){
  if(!soundOn || !audioInit()) return;
  tone(freq, now()+delay, dur, type, vol);
}
const sGood = ()=>{ if(!soundOn||!audioInit())return; const t=now();
  [523,659,784,1046].forEach((f,i)=>tone(f,t+i*0.07,0.22,'triangle',0.16)); };
const sBad  = ()=>{ if(!soundOn||!audioInit())return; const t=now();
  tone(233,t,0.22,'sawtooth',0.12); tone(165,t+0.13,0.34,'sawtooth',0.12); };
const sWin  = ()=>{ if(!soundOn||!audioInit())return; const t=now();
  [523,659,784,1046,1318].forEach((f,i)=>tone(f,t+i*0.11,0.42,'triangle',0.17));
  [0,0.11,0.22].forEach(d=>noiseHit(t+d,0.18,0.05,3000)); };
const sTick = ()=>beep(880,.05,'square',.07);
const sOpen = ()=>beep(660,.09,'sine',.1);

/* ============================================================================
   NHẠC NỀN — vòng lặp 8 ô nhịp, hợp âm Am – F – C – G, giai điệu hộp nhạc.
   Chậm và êm vì đây là game phải suy nghĩ, không phải game gấp gáp.
   Muốn đổi nhạc thì sửa CHORDS (hợp âm) và MEL (giai điệu) bên dưới.
   Số trong MEL là cao độ MIDI, 0 = nghỉ. 69 = nốt La giữa.
   ========================================================================== */
const CHORDS = [[57,60,64],[53,57,60],[52,55,60],[55,59,62],
                [57,60,64],[53,57,60],[52,55,60],[55,59,62]];
const MEL = [
  [69, 0,72, 0,76, 0,74, 0],
  [72, 0,69, 0,72, 0, 0, 0],
  [76, 0,74, 0,72, 0,69, 0],
  [67, 0,71, 0,74, 0, 0, 0],
  [81, 0,79, 0,76, 0,74, 0],
  [72,74,76, 0,74, 0, 0, 0],
  [79, 0,76, 0,72, 0,74, 0],
  [71, 0,74, 0,69, 0, 0, 0]
];
const BPM = 84, STEP = (60/BPM)/4;

function scheduleStep(st, t){
  const bar = Math.floor(st/16) % 8, p = st % 16, ch = CHORDS[bar];
  if(p===0){                                   // nền dày, ngân dài cả ô nhịp
    ch.forEach(m => tone(mtof(m), t, 2.5, 'sine', 0.035, A.musicGain));
    tone(mtof(ch[0]-24), t, 0.7, 'sine', 0.18, A.musicGain);   // bè trầm
  }
  if(p===8) tone(mtof(ch[0]-24), t, 0.5, 'sine', 0.12, A.musicGain);
  if(p%2===0){                                 // giai điệu hộp nhạc
    const m = MEL[bar][p/2];
    if(m) tone(mtof(m), t, 0.5, 'triangle', 0.10, A.musicGain);
  }
  if(p%4===2) tone(mtof(ch[((p-2)/4)%3]+12), t, 0.16, 'sine', 0.022, A.musicGain);
  if(p%4===0) noiseHit(t, 0.025, 0.012, 7000, A.musicGain);    // hi-hat khẽ
  if(p===8)   noiseHit(t, 0.09, 0.022, 1600, A.musicGain);
}
function musicStart(){
  if(!A.ctx || A.timer) return;
  A.next = A.ctx.currentTime + 0.1;
  A.timer = setInterval(()=>{
    if(!A.ctx) return;
    while(A.next < A.ctx.currentTime + 0.2){ scheduleStep(A.step, A.next); A.step++; A.next += STEP; }
  }, 30);
}
function musicStop(){ if(A.timer){ clearInterval(A.timer); A.timer=null; } }
function musicLevel(){ return musicOn ? (A.duck ? MUSIC_VOL*0.4 : MUSIC_VOL) : 0.0001; }
function applyMusicGain(ms=600){
  if(!A.ctx) return;
  const g=A.musicGain.gain, t=A.ctx.currentTime;
  g.cancelScheduledValues(t); g.setValueAtTime(Math.max(0.0001,g.value), t);
  g.linearRampToValueAtTime(musicLevel(), t + ms/1000);
}
function setMusic(on){
  musicOn = on;
  const b=$('#btnMusic');
  if(b){ b.classList.toggle('off',!on); b.querySelector('span').textContent = on ? 'Nhạc nền' : 'Tắt nhạc'; }
  if(!audioInit()) return;
  try{ if(A.ctx.state==='suspended') A.ctx.resume(); }catch(e){}
  applyMusicGain();
  if(on) musicStart(); else setTimeout(musicStop, 700);
}
/* hạ nhạc xuống khi đang đọc câu hỏi để còn nghe người dẫn nói */
function duck(on){ A.duck = on; applyMusicGain(250); }

/* Trình duyệt không cho phát tiếng trước khi người dùng chạm vào trang,
   nên nhạc chỉ thật sự bắt đầu ở cú bấm phím / chạm đầu tiên. */
let audioArmed = false;
function armAudio(){
  if(audioArmed) return; audioArmed = true;
  if(audioInit() && musicOn) setMusic(true);
}
['pointerdown','keydown','touchend'].forEach(ev =>
  document.addEventListener(ev, armAudio, {once:false, passive:true}));
document.addEventListener('visibilitychange', ()=>{
  if(!A.ctx) return;
  if(document.hidden) musicStop();
  else if(musicOn){ try{A.ctx.resume();}catch(e){} musicStart(); }
});

/* ============================================================================
   TRẠNG THÁI
   ----------------------------------------------------------------------------
   HINT_STEP  gợi ý thứ nhất trừ 5đ, thứ hai 10đ, thứ ba 15đ... tăng dần.
              Mỗi lần mở thêm một chữ cái, luôn chừa lại ít nhất một chữ.
   ========================================================================== */
const HINT_STEP = 5;
const hintCost  = n => HINT_STEP * (n + 1);      // n = số gợi ý đã dùng ở hàng đó
/* Ô nằm trên cột từ khoá KHÔNG bao giờ được gợi ý — đó là phần cốt lõi của trò chơi. */
const hintable  = r => r.L.map((_,j)=>j).filter(j => j !== r.k);
/* Nhiều nhất là một phần ba số chữ, và luôn chừa lại ít nhất một chữ để đoán. */
const maxHints  = r => Math.min(Math.ceil(r.L.length/3), Math.max(0, hintable(r).length - 1));

let D, S;
let TOTAL = 0, ROUND = 0;          // điểm cộng dồn qua nhiều ván
let curIdx = -1;                   // bộ đề đang chơi

/* --- túi bốc đề: xáo hết 73 bộ rồi rút dần, hết mới xáo lại --- */
let bag = [];
function refillBag(){
  bag = DE.map((_,i)=>i);
  for(let i=bag.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [bag[i],bag[j]]=[bag[j],bag[i]]; }
  if(bag.length>1 && bag[bag.length-1]===curIdx) [bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]];
}
function drawIdx(){
  if(!bag.length) refillBag();
  return bag.pop();
}
/* ô chọn chủ đề đang để "Ngẫu nhiên" hay đang ghim một bộ cụ thể? */
function pickedIdx(){
  const v = $('#topicPick') ? $('#topicPick').value : '';
  return v === '' ? null : +v;
}

function newGame(idx){
  if(idx === undefined || idx === null) idx = pickedIdx();
  if(idx === undefined || idx === null) idx = drawIdx();
  curIdx = idx;
  D = DE[idx];
  const kl = letters(D.keyword);
  S = {
    key: kl,
    rows: D.rows.map(r => ({...r, L:letters(r.a), state:'idle', hints:[]})),
    score:0, lives:3, used:0, over:false, cur:-1,
    timerOn:TIME>0, timeLeft:0, tick:null
  };
  buildBoard(); render();
}

/* ---------- dựng bảng ---------- */
function buildBoard(){
  const b = $('#board');
  const maxK = Math.max(...S.rows.map(r=>r.k));
  const total = maxK + Math.max(...S.rows.map(r=>r.L.length - r.k));
  b.style.setProperty('--maxk', maxK);
  b.innerHTML = '<div class="keyband"></div>';
  S.rows.forEach((r,i)=>{
    const row = document.createElement('div'); row.className='row'; row.dataset.i=i;
    const lab = document.createElement('div'); lab.className='rlabel'; lab.textContent='('+(i+1)+')';
    const cells = document.createElement('div'); cells.className='cells';
    cells.style.gridTemplateColumns = `repeat(${total}, var(--cell))`;
    const start = maxK - r.k;
    r.L.forEach((ch,j)=>{
      const c = document.createElement('div');
      c.className = 'cell' + (j===r.k ? ' key' : '');
      c.style.gridColumnStart = start + j + 1;
      const f=document.createElement('div'); f.className='face'; f.dataset.ch=ch;
      c.appendChild(f);
      cells.appendChild(c);
    });
    row.append(lab, cells);
    row.addEventListener('click', ()=>openQ(i));
    b.appendChild(row);
  });
  // ô từ khoá hàng dọc
  const kc = $('#keyCells'); kc.innerHTML='';
  const raw = Array.from(D.keyword.normalize('NFC'));
  let n=0;
  raw.forEach(ch=>{
    const d=document.createElement('div');
    if(ch===' '){ d.className='kc gap'; }
    else { d.className='kc'; d.dataset.n=n++; d.dataset.ch=ch; }
    kc.appendChild(d);
  });
  $('#kLen').textContent = S.key.length;
  paintSub();
}

function paintSub(){
  let t = 'Chủ đề: ' + D.topic;
  if(ROUND>0) t += ' · Ván ' + (ROUND+1) + ' · Tổng ' + TOTAL + 'đ';
  $('#topicName').textContent = t;
}

/* ---------- vẽ lại ---------- */
function bonusNow(){ return Math.max(30, 100 - S.used*10); }
function render(){
  $('#sScore').textContent = S.score;
  const done = S.rows.filter(r=>r.state==='open').length;
  $('#sRows').textContent = done + '/' + S.rows.length;
  $('#sLives').textContent = '★'.repeat(S.lives) + '☆'.repeat(3-S.lives) || '—';
  $('#sBonus').textContent = S.over ? '—' : bonusNow();
  S.rows.forEach((r,i)=>{
    const el = document.querySelector('.row[data-i="'+i+'"]');
    el.classList.toggle('open',   r.state==='open');
    el.classList.toggle('failed', r.state==='failed');
    el.classList.toggle('done',   r.state!=='idle');
    const show = r.state==='open' || S.over;
    el.querySelectorAll('.face').forEach(f=>{
      if(f.classList.contains('peeked')) return;
      f.textContent = show ? f.dataset.ch : '';
    });
    const kcEl = document.querySelector('.kc[data-n="'+i+'"]');
    if(kcEl){
      const on = r.state==='open' || S.over;
      kcEl.classList.toggle('on', on);
      kcEl.textContent = on ? kcEl.dataset.ch : '';
    }
  });
  $('#btnGuess').disabled = S.over || S.lives<=0;
  $('#btnNext').disabled  = S.over || S.rows.every(r=>r.state!=='idle');
}

/* ---------- toast ---------- */
let toT;
function toast(msg, kind='info'){
  const t=$('#toast'); t.className='toast '+kind+' show'; t.innerHTML=msg;
  clearTimeout(toT); toT=setTimeout(()=>t.classList.remove('show'), 2400);
}

/* ---------- câu hỏi ---------- */
function openQ(i){
  if(S.over) return;
  const r = S.rows[i];
  if(r.state!=='idle'){ toast(r.state==='open'?'Hàng này đã mở rồi 😄':'Hàng này đã bị khoá 🔒','info'); return; }
  S.cur = i; sOpen();
  $('#qNum').textContent = i+1;
  $('#qText').textContent = r.q;
  $('#qLen').textContent = r.L.length + ' chữ cái';
  paintHintBtn();
  $('#qInput').value=''; 
  $('#ovQ').classList.add('show'); duck(true);
  setTimeout(()=>$('#qInput').focus(), 80);
  startTimer();
}
function closeQ(){
  stopTimer(); $('#ovQ').classList.remove('show'); duck(false);
  document.querySelectorAll('.cell.peek').forEach(c=>{
    c.classList.remove('peek');
    const f=c.querySelector('.face'); f.classList.remove('peeked');
    if(!c.closest('.row').classList.contains('open')) f.textContent='';
  });
  S.cur=-1;
}
let TIME=40;                     // giây cho mỗi hàng ngang, đổi bằng nút ⏱️ trên thanh công cụ
function startTimer(){
  stopTimer();
  if(!S.timerOn){ $('#qTimer').style.display='none'; return; }
  $('#qTimer').style.display='';
  S.timeLeft = TIME; paintTimer();
  S.tick = setInterval(()=>{
    S.timeLeft--; paintTimer();
    if(S.timeLeft<=5 && S.timeLeft>0) sTick();
    if(S.timeLeft<=0){ stopTimer(); answer(true); }
  },1000);
}
function paintTimer(){
  const e=$('#qTimer'); e.textContent=S.timeLeft;
  e.classList.toggle('warn', S.timeLeft<=5);
}
function stopTimer(){ if(S.tick){clearInterval(S.tick); S.tick=null;} }

function answer(timeout=false){
  const i=S.cur; if(i<0) return;
  const r=S.rows[i];
  const val=$('#qInput').value;
  if(!timeout && nearMiss(val,r.a)){          // đúng chữ, sai/thiếu dấu -> cho gõ lại
    shake('#qInput'); beep(330,.16,'square',.1);
    toast('Gần đúng rồi! Kiểm tra lại <b>dấu tiếng Việt</b> nhé ✍️','info');
    return;
  }
  const ok = !timeout && same(val, r.a);
  if(ok){
    r.state='open'; S.used++;
    const pts = 10;
    S.score += pts;
    closeQ(); render(); sGood();
    flip(i);
    toast('Chính xác! <b>'+r.a+'</b> &nbsp;+'+pts+'đ','good');
  }else{
    r.state='failed'; S.used++;
    closeQ(); render(); sBad();
    toast(timeout ? '⏰ Hết giờ! Hàng '+(i+1)+' bị khoá.' : '❌ Chưa đúng! Hàng '+(i+1)+' bị khoá.','bad');
  }
  checkEnd();
}
function flip(i){
  const cells=document.querySelectorAll('.row[data-i="'+i+'"] .cell .face');
  cells.forEach((f,j)=>{ f.style.transitionDelay=(j*55)+'ms';
    setTimeout(()=>f.style.transitionDelay='', 700+j*55); });
}
function paintHintBtn(){
  const r=S.rows[S.cur], b=$('#qHint'); if(!r||!b) return;
  const used=r.hints.length, max=maxHints(r);
  if(used>=max){ b.disabled=true; b.innerHTML='💡 Hết gợi ý'; return; }
  b.disabled=false;
  b.innerHTML='💡 Gợi ý <span class="hintchip">−'+hintCost(used)+'đ</span>'+
              (max>1 ? ' <span class="hintchip">'+used+'/'+max+'</span>' : '');
}
function hint(){
  const r=S.rows[S.cur]; if(!r) return;
  const used=r.hints.length;
  if(used >= maxHints(r)){ toast('Hàng này hết gợi ý rồi — chỉ còn một chữ thôi 😄','info'); return; }
  const j = hintable(r).find(k => !r.hints.includes(k));  // mở lần lượt từ trái sang
  if(j===undefined) return;
  const cost = hintCost(used);
  r.hints.push(j);
  S.score = Math.max(0, S.score - cost);
  const cell=document.querySelectorAll('.row[data-i="'+S.cur+'"] .cell')[j];
  cell.classList.add('peek');
  const f=cell.querySelector('.face'); f.classList.add('peeked'); f.textContent=f.dataset.ch;
  render(); paintHintBtn(); beep(700+used*60,.12,'sine',.12);
  toast('Chữ thứ '+(j+1)+': <b>'+r.L[j]+'</b> &nbsp;(−'+cost+'đ)','info');
}

function shake(sel){
  const el=$(sel); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  setTimeout(()=>el.classList.remove('shake'),480); el.focus();
}

/* ---------- thanh gõ dấu nhanh (cho máy không cài bộ gõ) ---------- */
const ACC = ['Ă','Â','Đ','Ê','Ô','Ơ','Ư','À','Á','Ả','Ã','Ạ'];
function buildAccBar(){
  const bar=$('#accBar'); bar.innerHTML='';
  ACC.forEach(ch=>{
    const b=document.createElement('button'); b.type='button'; b.textContent=ch;
    b.onmousedown=e=>e.preventDefault();
    b.onclick=()=>{ const inp=$('#qInput');
      const a=inp.selectionStart??inp.value.length, z=inp.selectionEnd??a;
      inp.value=inp.value.slice(0,a)+ch+inp.value.slice(z);
      inp.focus(); inp.setSelectionRange(a+1,a+1); };
    bar.appendChild(b);
  });
}
function paintAccentUI(){
  const on=strictAccent;
  $('#btnAccent').classList.toggle('off',!on);
  $('#btnAccent').querySelector('span').textContent = on ? 'Bắt buộc gõ dấu' : 'Không cần dấu';
  $('#qNote').innerHTML = on
    ? 'Phải gõ <b>đúng dấu tiếng Việt</b>. Sai dấu chỉ bị nhắc, không mất lượt.'
    : 'Không cần gõ dấu — "nhiet do" vẫn tính đúng.';
  $('#accBar').style.display = on ? '' : 'none';
}

/* ---------- từ khoá ---------- */
function openK(){
  if(S.over||S.lives<=0) return;
  $('#kMeta').innerHTML='Đúng: <b>+'+bonusNow()+'đ</b> • Sai: −15đ • Còn '+S.lives+' lượt';
  $('#kInput').value=''; $('#ovK').classList.add('show'); duck(true);
  setTimeout(()=>$('#kInput').focus(),80); sOpen();
}
function guessK(){
  const v=$('#kInput').value;
  if(nearMiss(v, D.keyword)){
    shake('#kInput'); beep(330,.16,'square',.1);
    toast('Gần đúng rồi! Kiểm tra lại <b>dấu tiếng Việt</b> nhé ✍️','info');
    return;
  }
  if(same(v, D.keyword)){
    S.score += bonusNow();
    $('#ovK').classList.remove('show'); duck(false);
    finish(true);
  }else{
    S.lives--; S.score=Math.max(0,S.score-15);
    $('#ovK').classList.remove('show'); duck(false); render(); sBad();
    toast(S.lives>0 ? '❌ Chưa đúng rồi! Còn '+S.lives+' lượt đoán (−15đ)' : '❌ Hết lượt đoán từ khoá!','bad');
    checkEnd();
  }
}
function checkEnd(){
  if(S.over) return;
  const allDone = S.rows.every(r=>r.state!=='idle');
  if(S.lives<=0 || (allDone && S.rows.every(r=>r.state==='failed'))) finish(false);
  else if(allDone) toast('Đã xong '+S.rows.length+' hàng ngang — đoán từ khoá thôi! 🔑','info');
}

/* ---------- kết thúc ---------- */
function finish(win){
  S.over=true; stopTimer();
  ROUND++; TOTAL += S.score;
  document.querySelectorAll('.row').forEach((el,i)=>{
    if(S.rows[i].state==='failed'){ el.classList.add('reveal-final'); }
  });
  document.querySelectorAll('.kc').forEach(k=>k.classList.add('on'));
  render();
  $('#rEmoji').textContent = win ? (S.score>=140?'🏆':'🎉') : '💡';
  $('#rTitle').textContent = win ? 'Chính xác!' : 'Kết thúc rồi!';
  $('#rSub').textContent   = win ? 'Bạn đã tìm ra từ khoá' : 'Từ khoá là';
  $('#rKey').textContent   = D.keyword;
  $('#rScore').textContent = S.score;
  $('#rTotal').textContent  = TOTAL;
  $('#rRounds').textContent = ROUND;
  $('#rTotalBar').style.display = ROUND>1 ? '' : 'none';
  $('#rNext').style.display = DE.length>1 ? '' : 'none';
  $('#rNext').innerHTML = pickedIdx()===null
      ? '▶️ Ô chữ tiếp theo <span class="hintchip">còn '+(bag.length||DE.length)+'</span>'
      : '▶️ Chơi lại chủ đề này';
  const rank = S.score>=150?'🌟 Xuất sắc!':S.score>=110?'😃 Giỏi lắm!':S.score>=70?'🙂 Khá rồi!':'💪 Lần sau cố lên nhé!';
  $('#rRank').textContent = rank;
  $('#rList').innerHTML = S.rows.map((r,i)=>{
    const ic = r.state==='open' ? '✔' : r.state==='failed' ? '✘' : '○';
    const cl = r.state==='open' ? 'ok' : r.state==='failed' ? 'no' : '';
    const pt = r.state==='open' ? '+10đ' : r.state==='failed' ? '0đ' : 'chưa mở';
    return `<div><span class="${cl}">${ic} (${i+1})</span> <span>${r.a}</span><b>${pt}</b></div>`;
  }).join('');
  duck(true);
  setTimeout(()=>$('#ovR').classList.add('show'), 600);
  if(win){ sWin(); confetti(); } else beep(200,.5,'sine',.12);
}

/* ---------- confetti ---------- */
function confetti(){
  const cv=$('#confetti'), ctx=cv.getContext('2d');
  cv.width=innerWidth; cv.height=innerHeight;
  const cols=['#f9b23c','#22c08a','#ff7a88','#7cc4ff','#ffe08a','#fff'];
  const P=[]; for(let i=0;i<160;i++)P.push({
    x:Math.random()*cv.width, y:-20-Math.random()*cv.height*.6,
    w:5+Math.random()*7, h:8+Math.random()*10,
    vy:2+Math.random()*4, vx:-1.5+Math.random()*3,
    a:Math.random()*6, va:-.2+Math.random()*.4, c:cols[i%cols.length]
  });
  let n=0;
  (function loop(){
    ctx.clearRect(0,0,cv.width,cv.height);
    P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.a+=p.va;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a);
      ctx.fillStyle=p.c; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore(); });
    if(++n<340) requestAnimationFrame(loop); else ctx.clearRect(0,0,cv.width,cv.height);
  })();
}

/* ---------- sự kiện ---------- */
$('#qSubmit').onclick = ()=>answer(false);
$('#qClose').onclick  = closeQ;
$('#qHint').onclick   = hint;
$('#qInput').addEventListener('keydown', e=>{ if(e.key==='Enter') answer(false); });
$('#kSubmit').onclick = guessK;
$('#kClose').onclick  = ()=>{ $('#ovK').classList.remove('show'); duck(false); };
$('#kInput').addEventListener('keydown', e=>{ if(e.key==='Enter') guessK(); });
$('#btnGuess').onclick = openK;
$('#btnNext').onclick  = ()=>{ const i=S.rows.findIndex(r=>r.state==='idle'); if(i>=0) openQ(i); };
$('#btnReset').onclick = ()=>{ $('#ovR').classList.remove('show'); duck(false); newGame(curIdx); toast('Bắt đầu lại ô chữ này 🌱','info'); };
$('#rAgain').onclick   = ()=>{ $('#ovR').classList.remove('show'); duck(false); newGame(curIdx); };
$('#rNext').onclick    = ()=>{
  $('#ovR').classList.remove('show'); duck(false);
  const pinned = pickedIdx();
  newGame(pinned===null ? drawIdx() : pinned);
  toast('Ô chữ mới: <b>'+D.topic+'</b> 🔑','info');
};
$('#btnSound').onclick = e=>{ soundOn=!soundOn; e.currentTarget.classList.toggle('off',!soundOn);
  e.currentTarget.querySelector('span').textContent = soundOn?'Âm thanh':'Tắt tiếng'; if(soundOn) sOpen(); };
$('#btnMusic').onclick = ()=>setMusic(!musicOn);
$('#btnAccent').onclick = ()=>{
  strictAccent=!strictAccent; paintAccentUI(); sOpen();
  toast(strictAccent ? 'Chế độ <b>bắt buộc gõ dấu</b> ✍️' : 'Chế độ <b>không cần dấu</b>','info');
};
$('#btnTimer').onclick = e=>{
  const opts=[40,60,90,0]; TIME = opts[(opts.indexOf(TIME)+1)%opts.length];
  S.timerOn = TIME>0;
  e.currentTarget.classList.toggle('off', !S.timerOn);
  e.currentTarget.querySelector('span').textContent = S.timerOn ? ('Giờ: '+TIME+'s') : 'Không giờ';
  if(S.cur>=0) startTimer();
};
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeQ(); $('#ovK').classList.remove('show'); duck(false); }});
addEventListener('resize', ()=>{ const cv=$('#confetti'); cv.width=innerWidth; cv.height=innerHeight; });

/* ---------- chọn bộ đề ---------- */
if(DE.length>1){
  const sel=$('#topicPick'); sel.style.display='';
  const rnd=document.createElement('option'); rnd.value=''; rnd.textContent='🎲 Ngẫu nhiên'; sel.appendChild(rnd);
  /* Cố ý KHÔNG ghi từ khoá vào đây, kẻo nhìn danh sách là lộ đáp án. */
  DE.map((d,i)=>({i, label:d.topic+' · '+d.rows.length+' hàng'}))
    .sort((a,b)=>a.label.localeCompare(b.label,'vi'))
    .forEach(({i,label})=>{ const o=document.createElement('option'); o.value=i; o.textContent=label; sel.appendChild(o); });
  sel.value='';                       // mặc định: mỗi lần một đề khác nhau
  sel.onchange = ()=>{ newGame(); toast(sel.value==='' ? 'Chuyển sang chế độ <b>ngẫu nhiên</b> 🎲' : 'Đã ghim chủ đề này 📌','info'); };
}

/* ---------- kiểm tra dữ liệu, báo lỗi rõ ràng trong Console (F12) ---------- */
DE.forEach((d,di)=>{
  const kl=letters(d.keyword);
  if(kl.length!==d.rows.length)
    console.error(`[Ô chữ] Bộ đề ${di+1} ("${d.topic}"): có ${d.rows.length} hàng ngang nhưng từ khoá "${d.keyword}" dài ${kl.length} chữ. Hai số này phải bằng nhau.`);
  d.rows.forEach((r,i)=>{
    const L=letters(r.a);
    if(r.k >= L.length)
      console.error(`[Ô chữ] Bộ đề ${di+1} hàng ${i+1} ("${r.a}"): k=${r.k} vượt quá độ dài đáp án (${L.length} chữ, vị trí hợp lệ 0–${L.length-1}).`);
    else if(norm(L[r.k]||'')!==norm(kl[i]||''))
      console.error(`[Ô chữ] Bộ đề ${di+1} hàng ${i+1} ("${r.a}"): vị trí k=${r.k} là chữ "${L[r.k]}" nhưng từ khoá cần chữ "${kl[i]}".`);
  });
});

buildAccBar(); paintAccentUI();
if(!DE.length){
  document.querySelector('.boardcard').innerHTML =
    '<p style="text-align:center;padding:30px;font-weight:700;line-height:1.7">Chưa có bộ đề nào.<br>'+
    'Mở file <b>questions.js</b> và thêm ít nhất một bộ đề nhé.</p>';
} else {
  refillBag();
  newGame();
}