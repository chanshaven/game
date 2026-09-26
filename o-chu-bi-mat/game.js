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

/* ---------- âm thanh ---------- */
let AC=null, soundOn=true;
function beep(freq, dur=.14, type='sine', vol=.18, delay=0){
  if(!soundOn) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const t = AC.currentTime + delay;
    const o = AC.createOscillator(), g = AC.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(0,t);
    g.gain.linearRampToValueAtTime(vol,t+.01);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t+dur+.02);
  }catch(e){}
}
const sGood = ()=>{[523,659,784,1046].forEach((f,i)=>beep(f,.16,'triangle',.16,i*.07))};
const sBad  = ()=>{beep(220,.22,'sawtooth',.13);beep(155,.32,'sawtooth',.13,.13)};
const sWin  = ()=>{[523,659,784,1046,1318].forEach((f,i)=>beep(f,.3,'triangle',.18,i*.11))};
const sTick = ()=>beep(880,.05,'square',.07);
const sOpen = ()=>beep(660,.09,'sine',.1);

/* ---------- trạng thái ---------- */
let D, S;
function newGame(idx=0){
  D = DE[idx];
  const kl = letters(D.keyword);
  S = {
    key: kl,
    rows: D.rows.map(r => ({...r, L:letters(r.a), state:'idle', hinted:false})),
    score:0, lives:3, used:0, over:false, cur:-1,
    timerOn:true, timeLeft:0, tick:null
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
  $('#topicName').textContent = 'Chủ đề: ' + D.topic;
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
  $('#qHint').disabled = r.hinted;
  $('#qInput').value=''; 
  $('#ovQ').classList.add('show');
  setTimeout(()=>$('#qInput').focus(), 80);
  startTimer();
}
function closeQ(){
  stopTimer(); $('#ovQ').classList.remove('show');
  document.querySelectorAll('.cell.peek').forEach(c=>{
    c.classList.remove('peek');
    const f=c.querySelector('.face'); f.classList.remove('peeked');
    if(!c.closest('.row').classList.contains('open')) f.textContent='';
  });
  S.cur=-1;
}
let TIME=30;
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
    const pts = r.hinted ? 10 : 10;
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
function hint(){
  const r=S.rows[S.cur]; if(!r || r.hinted) return;
  r.hinted=true; S.score=Math.max(0,S.score-5);
  const cell=document.querySelector('.row[data-i="'+S.cur+'"] .cell');
  cell.classList.add('peek');
  const f=cell.querySelector('.face'); f.classList.add('peeked'); f.textContent=f.dataset.ch;
  $('#qHint').disabled=true; render(); beep(760,.12,'sine',.12);
  toast('Chữ cái đầu tiên: <b>'+r.L[0]+'</b> (−5đ)','info');
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
  $('#kInput').value=''; $('#ovK').classList.add('show');
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
    $('#ovK').classList.remove('show');
    finish(true);
  }else{
    S.lives--; S.score=Math.max(0,S.score-15);
    $('#ovK').classList.remove('show'); render(); sBad();
    toast(S.lives>0 ? '❌ Chưa đúng rồi! Còn '+S.lives+' lượt đoán (−15đ)' : '❌ Hết lượt đoán từ khoá!','bad');
    checkEnd();
  }
}
function checkEnd(){
  if(S.over) return;
  const allDone = S.rows.every(r=>r.state!=='idle');
  if(S.lives<=0 || (allDone && S.rows.every(r=>r.state==='failed'))) finish(false);
  else if(allDone) toast('Đã xong 7 hàng ngang — đoán từ khoá thôi! 🔑','info');
}

/* ---------- kết thúc ---------- */
function finish(win){
  S.over=true; stopTimer();
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
  const rank = S.score>=150?'🌟 Xuất sắc!':S.score>=110?'😃 Giỏi lắm!':S.score>=70?'🙂 Khá rồi!':'💪 Lần sau cố lên nhé!';
  $('#rRank').textContent = rank;
  $('#rList').innerHTML = S.rows.map((r,i)=>{
    const ic = r.state==='open' ? '✔' : r.state==='failed' ? '✘' : '○';
    const cl = r.state==='open' ? 'ok' : r.state==='failed' ? 'no' : '';
    const pt = r.state==='open' ? '+10đ' : r.state==='failed' ? '0đ' : 'chưa mở';
    return `<div><span class="${cl}">${ic} (${i+1})</span> <span>${r.a}</span><b>${pt}</b></div>`;
  }).join('');
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
$('#kClose').onclick  = ()=>$('#ovK').classList.remove('show');
$('#kInput').addEventListener('keydown', e=>{ if(e.key==='Enter') guessK(); });
$('#btnGuess').onclick = openK;
$('#btnNext').onclick  = ()=>{ const i=S.rows.findIndex(r=>r.state==='idle'); if(i>=0) openQ(i); };
$('#btnReset').onclick = ()=>{ $('#ovR').classList.remove('show'); newGame(+($('#topicPick').value||0)); toast('Bắt đầu lại nào! 🌱','info'); };
$('#rAgain').onclick   = ()=>{ $('#ovR').classList.remove('show'); newGame(+($('#topicPick').value||0)); };
$('#btnSound').onclick = e=>{ soundOn=!soundOn; e.currentTarget.classList.toggle('off',!soundOn);
  e.currentTarget.querySelector('span').textContent = soundOn?'Âm thanh':'Đã tắt'; if(soundOn) sOpen(); };
$('#btnAccent').onclick = ()=>{
  strictAccent=!strictAccent; paintAccentUI(); sOpen();
  toast(strictAccent ? 'Chế độ <b>bắt buộc gõ dấu</b> ✍️' : 'Chế độ <b>không cần dấu</b>','info');
};
$('#btnTimer').onclick = e=>{
  const opts=[30,45,60,0]; TIME = opts[(opts.indexOf(TIME)+1)%opts.length];
  S.timerOn = TIME>0;
  e.currentTarget.classList.toggle('off', !S.timerOn);
  e.currentTarget.querySelector('span').textContent = S.timerOn ? ('Giờ: '+TIME+'s') : 'Không giờ';
  if(S.cur>=0) startTimer();
};
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeQ(); $('#ovK').classList.remove('show'); }});
addEventListener('resize', ()=>{ const cv=$('#confetti'); cv.width=innerWidth; cv.height=innerHeight; });

/* ---------- chọn bộ đề ---------- */
if(DE.length>1){
  const sel=$('#topicPick'); sel.style.display='';
  DE.forEach((d,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=d.topic; sel.appendChild(o); });
  sel.onchange = ()=>newGame(+sel.value);
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
  newGame(0);
}