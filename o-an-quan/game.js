/* ============================================================================
   Ô ĂN QUAN — giao diện

   engine.js giữ luật, ai.js giữ máy đấu, file này chỉ lo vẽ và chạy hoạt ảnh.
   Mỗi nước đi engine trả về một danh sách sự kiện (bốc, rải, ăn, rải lại...),
   ở đây phát lần lượt từng cái cho người chơi nhìn thấy sỏi chạy tới đâu.
   ========================================================================== */
(function () {
  'use strict';

  const E = OAQ, AI = OAQ_AI;
  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ===================== cài đặt lưu lại ============================== */
  const KEY = 'o-an-quan';
  const CF = {
    mode: 'may', level: 'thuong', first: '0',
    dir: 'lock', non: '5', qv: '10', speed: 'vua', vol: 60
  };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const old = JSON.parse(raw);
      if (old.sound === false && old.vol == null) old.vol = 0;   // bản cũ chỉ có bật/tắt
      delete old.sound;
      Object.assign(CF, old);
    }
  } catch (e) { }
  CF.vol = Math.max(0, Math.min(100, +CF.vol || 0));
  function save() { try { localStorage.setItem(KEY, JSON.stringify(CF)); } catch (e) { } }

  const SPEED = { cham: 300, vua: 165, nhanh: 85 };

  /* ===================== âm thanh ===================================== */
  const SFX = (function () {
    let ctx = null, gain = null;
    const level = () => (CF.vol / 100) * 0.7;
    function init() {
      if (ctx) { if (ctx.state === 'suspended' && ctx.resume) ctx.resume(); return true; }
      try {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return false;
        ctx = new C();
        if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
        gain = ctx.createGain(); gain.gain.value = level();
        let out = ctx.destination;
        try {
          const comp = ctx.createDynamicsCompressor();
          comp.threshold.value = -10; comp.ratio.value = 4; comp.connect(ctx.destination); out = comp;
        } catch (e) { }
        gain.connect(out);
        return true;
      } catch (e) { return false; }
    }
    function tone(f, t0, dur, type, vol) {
      if (!ctx) return;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type || 'triangle';
      o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(gain);
      o.start(t0); o.stop(t0 + dur + 0.05);
    }
    /* tiếng sỏi: một hạt nhiễu ngắn lọc băng hẹp, nghe như đá chạm đất */
    function click(pitch, vol) {
      if (!init() || CF.vol <= 0) return;
      const t0 = ctx.currentTime;
      const n = ctx.createBufferSource();
      const len = Math.floor(ctx.sampleRate * 0.05);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      n.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = pitch || 1500; f.Q.value = 2.2;
      const g = ctx.createGain(); g.gain.value = vol == null ? 0.5 : vol;
      n.connect(f); f.connect(g); g.connect(gain);
      n.start(t0);
    }
    return {
      unlock: init,
      setVol(v) { CF.vol = v; if (gain) gain.gain.value = level(); },
      sow(i) { click(1250 + ((i * 137) % 700), 0.34); },
      pick() { click(820, 0.5); },
      eat() {
        if (!init() || CF.vol <= 0) return;
        const t = ctx.currentTime;
        [523, 659, 784].forEach((f, k) => tone(f, t + k * 0.06, 0.22, 'triangle', 0.16));
      },
      quan() {
        if (!init() || CF.vol <= 0) return;
        const t = ctx.currentTime;
        [523, 659, 784, 1047, 1319].forEach((f, k) => tone(f, t + k * 0.07, 0.4, 'triangle', 0.2));
      },
      nope() {
        if (!init() || CF.vol <= 0) return;
        const t = ctx.currentTime;
        tone(300, t, 0.13, 'sawtooth', 0.14); tone(220, t + 0.1, 0.2, 'sawtooth', 0.12);
      },
      win() {
        if (!init() || CF.vol <= 0) return;
        const t = ctx.currentTime;
        [523, 659, 784, 1047, 1319, 1568].forEach((f, k) => tone(f, t + k * 0.1, 0.55, 'triangle', 0.2));
      },
      lose() {
        if (!init() || CF.vol <= 0) return;
        const t = ctx.currentTime;
        [523, 466, 392, 311].forEach((f, k) => tone(f, t + k * 0.14, 0.5, 'sine', 0.17));
      }
    };
  })();

  /* ===================== trạng thái màn hình ========================== */
  let S = null;          // ván thật, engine đã đi xong tới nước mới nhất
  let V = null;          /* thế cờ đang VẼ. engine sửa state ngay lập tức, nên nếu
                            cứ thế vẽ theo S thì ô nào bị bốc lại trong chuỗi ăn
                            liên hoàn sẽ hiện 0 từ trước khi sỏi rơi vào. V là bản
                            sao chép chạy lại từng bước theo nhịp hoạt ảnh. */
  let cellEls = [];
  let busy = false;      // đang chạy hoạt ảnh, chặn bấm
  let names = ['Bạn', 'Máy'];
  let record = { w: 0, l: 0, d: 0 };
  try { const r = localStorage.getItem(KEY + '-rec'); if (r) record = JSON.parse(r); } catch (e) { }

  const isAI = p => CF.mode === 'may' && p === 1;

  /* ===================== nhóm nút chọn ================================ */
  /* Tốc độ rải chỉnh được ở hai chỗ — bảng tuỳ chỉnh trước ván và bảng tuỳ chọn
     trong ván — nên một khoá phải kéo theo nhiều nhóm nút cùng sáng. */
  const GROUPS = {};
  function paintGroup(key) {
    for (const box of GROUPS[key] || []) {
      Array.from(box.children).forEach(b =>
        b.setAttribute('aria-checked', String(b.dataset.v === String(CF[key]))));
    }
  }
  function group(elId, key, onChange) {
    const box = $(elId);
    if (!box) return;
    (GROUPS[key] = GROUPS[key] || []).push(box);
    box.setAttribute('role', 'radiogroup');
    box.addEventListener('click', ev => {
      const b = ev.target.closest('.chip'); if (!b) return;
      CF[key] = b.dataset.v; save(); paintGroup(key);
      SFX.unlock();
      if (onChange) onChange(b.dataset.v);
    });
    paintGroup(key);
  }

  /* ===================== dựng bàn ===================================== */
  /* Với bàn hai người: ô 0 là quan trái, ô 1..5 là hàng dưới (người 0) chạy
     từ trái sang phải, ô 6 là quan phải, ô 7..11 là hàng trên (người 1) chạy
     từ phải sang trái. Xếp vậy thì đi vòng quanh đúng một đường khép kín. */
  function gridSpot(i, perSide, vert) {
    if (vert) {
      /* Bàn đứng: quan trên cùng và dưới cùng chiếm cả hai cột. Phần người 0
         chạy xuôi xuống cột phải, phần người 1 chạy ngược lên cột trái. */
      const rows = perSide + 2;
      if (i === 0) return { c: 1, r: 1, rs: 1, cs: 2 };
      if (i === perSide + 1) return { c: 1, r: rows, rs: 1, cs: 2 };
      if (i <= perSide) return { c: 2, r: 1 + i, rs: 1, cs: 1 };
      const k = i - perSide - 2;                    // 0..4 chạy ngược lên
      return { c: 1, r: rows - 1 - k, rs: 1, cs: 1 };
    }
    const cols = perSide + 2;                       // 5 ô + 2 quan
    if (i === 0) return { c: 1, r: 1, rs: 2, cs: 1 };
    if (i === perSide + 1) return { c: cols, r: 1, rs: 2, cs: 1 };
    if (i <= perSide) return { c: 1 + i, r: 2, rs: 1, cs: 1 };
    const k = i - perSide - 2;                      // 0..4 chạy ngược
    return { c: cols - 1 - k, r: 1, rs: 1, cs: 1 };
  }

  /* Bàn nằm ngang đẹp trên máy tính, nhưng trên điện thoại dọc thì ô hẹp quá.
     Đứng hay nằm là tuỳ khung hình, không phải tuỳ mỗi chiều rộng. */
  function wantVertical() {
    return window.innerWidth < 640 && window.innerHeight > window.innerWidth * 1.15;
  }

  let vertNow = null;
  function layoutBoard() {
    const vert = wantVertical();
    const board = $('board');
    board.classList.toggle('vert', vert);
    if (vert !== vertNow) {
      vertNow = vert;
      for (let i = 0; i < cellEls.length; i++) {
        const sp = gridSpot(i, S.perSide, vert), el = cellEls[i];
        el.style.gridColumn = sp.c + ' / span ' + sp.cs;
        el.style.gridRow = sp.r + ' / span ' + sp.rs;
      }
    }
    measure();
  }

  /* Đo ô một lần rồi nhớ lại: lúc rải sỏi vẽ lại liên tục, hỏi kích thước
     từng viên một thì trình duyệt phải tính lại bố cục mỗi khung hình. */
  function measure() {
    for (const el of cellEls) {
      const r = el.getBoundingClientRect();
      el._w = r.width * 0.86;
      el._h = r.height * 0.86;
      el._min = Math.min(el._w, el._h);
    }
  }

  function buildBoard() {
    const board = $('board');
    board.innerHTML = '';
    cellEls = [];
    for (let i = 0; i < S.cells.length; i++) {
      const c = S.cells[i];
      const el = document.createElement('div');
      el.className = 'cell' + (c.kind === 'quan' ? ' quan' : ' mine' + c.side);
      el.dataset.i = i;
      el.innerHTML = (c.kind === 'quan' ? '<b class="qtag">quan</b>' : '') +
        '<div class="stones"></div><div class="cnt">0</div>';
      el._box = el.querySelector('.stones');
      el._cnt = el.querySelector('.cnt');
      el._n = -1;
      el.addEventListener('click', () => onCellClick(i));
      board.appendChild(el);
      cellEls.push(el);
    }
    vertNow = null;
    layoutBoard();
  }

  /* Sỏi rải theo xoắn ốc hạt hướng dương: viên thứ k luôn nằm đúng một chỗ,
     thêm viên mới không làm mấy viên cũ nhảy lung tung. */
  const GA = 2.39996323;

  /* Mỗi mức số sỏi có một "sức chứa" riêng, sỏi rải theo xoắn ốc hạt hướng
     dương cho kín ô. Trong cùng một mức thì viên thứ k luôn nằm nguyên chỗ,
     thêm viên mới không làm mấy viên cũ nhảy chỗ. */
  function bucket(total) {
    if (total <= 4) return { cap: 6, f: 0.27 };
    if (total <= 8) return { cap: 10, f: 0.235 };
    if (total <= 14) return { cap: 16, f: 0.195 };
    if (total <= 22) return { cap: 24, f: 0.163 };
    if (total <= 34) return { cap: 36, f: 0.135 };
    return { cap: 52, f: 0.112 };
  }

  function drawCell(i, pop) {
    const c = V.cells[i], el = cellEls[i];
    const box = el._box, cnt = el._cnt;
    const total = c.dan + c.quan;
    const prev = el._n;
    const min = el._min || 40, bw = el._w || 40, bh = el._h || 40;
    const bk = bucket(total);

    const danPx = Math.max(5, min * bk.f);
    const quanPx = Math.max(11, min * 0.40);

    /* bán kính tính bằng phần trăm, chừa đủ chỗ để viên sỏi không lòi ra */
    const rx = Math.max(4, 50 - (danPx / bw) * 52);
    const ry = Math.max(4, 50 - (danPx / bh) * 52);

    let html = '', k = 0;
    for (let q = 0; q < c.quan; q++, k++) {
      html += '<i class="st big" style="--rot:' + ((i * 23) % 40 - 20) + 'deg;left:50%;top:50%;width:' +
        quanPx.toFixed(1) + 'px;height:' + quanPx.toFixed(1) + 'px"></i>';
    }
    const shift = c.quan > 0 ? 3 : 0;          // né viên quan ngồi giữa
    const seed = i * 1.7137;                   // mỗi ô xoay một kiểu, đỡ giống hệt nhau
    for (let d = 0; d < c.dan; d++, k++) {
      const j = d + shift;
      const rr = Math.sqrt((j + 0.6) / (bk.cap + shift));
      const x = 50 + Math.cos(j * GA + seed) * rr * rx;
      const y = 50 + Math.sin(j * GA + seed) * rr * ry;
      const isNew = pop && prev >= 0 && k >= prev;
      const shape = (i * 3 + d * 7) % 5;             // dáng và tông đá, cố định theo chỗ ngồi
      const rot = ((i * 37 + d * 53) % 90) - 45;
      html += '<i class="st v' + shape + (isNew ? ' new' : '') + '" style="--rot:' + rot + 'deg;left:' +
        x.toFixed(1) + '%;top:' + y.toFixed(1) + '%;width:' + danPx.toFixed(1) +
        'px;height:' + danPx.toFixed(1) + 'px"></i>';
    }
    box.innerHTML = html;
    cnt.textContent = total;
    cnt.className = 'cnt' + (total === 0 ? ' zero' : '');
    el._n = total;
  }

  function drawAll(pop) { for (let i = 0; i < V.cells.length; i++) drawCell(i, pop); }

  /* ===================== bảng điểm ==================================== */
  function drawScores() {
    for (let p = 0; p < 2; p++) {
      $('nm' + p).textContent = names[p];
      $('pt' + p).textContent = E.score(V, p);
      $('bk' + p).textContent = V.captured[p].dan + ' dân · ' + V.captured[p].quan + ' quan';
      $('sc' + p).classList.toggle('turn', !S.over && S.turn === p);
    }
  }

  /* ===================== thông báo ==================================== */
  let toastT = null;
  function toast(msg, ms) {
    const t = $('toast');
    t.textContent = msg; t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), ms || 1700);
  }
  function status(html) { $('status').innerHTML = html; }

  /* ===================== hoạt ảnh ===================================== */
  function centerOf(el) {
    const a = el.getBoundingClientRect(), b = $('board').parentElement.getBoundingClientRect();
    return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
  }
  function moveHand(i, n) {
    const h = $('hand'), el = cellEls[i], p = centerOf(el);
    /* nhấc lên khỏi mặt ô một chút, đè lên đám sỏi thì nhìn không ra */
    const lift = Math.min(el.getBoundingClientRect().height * 0.42, 34);
    h.style.left = p.x + 'px';
    h.style.top = (p.y - lift) + 'px';
    h.textContent = '✋ ' + n;
    h.classList.add('on');
  }
  function hideHand() { $('hand').classList.remove('on'); }

  function flyTo(fromCell, player, text) {
    const wrap = $('board').parentElement;
    const a = centerOf(cellEls[fromCell]);
    const f = document.createElement('div');
    f.className = 'fly'; f.textContent = text;
    f.style.left = a.x + 'px'; f.style.top = a.y + 'px';
    wrap.appendChild(f);
    const target = $('sc' + player).getBoundingClientRect();
    const b = wrap.getBoundingClientRect();
    requestAnimationFrame(() => {
      f.style.left = (target.left - b.left + target.width / 2) + 'px';
      f.style.top = (target.top - b.top + target.height / 2) + 'px';
      f.style.opacity = '0';
    });
    setTimeout(() => f.remove(), 700);
  }

  /* Chạy một sự kiện lên thế cờ đang vẽ. Sai sót có bị lọt thì cuối nước đi
     V được gán lại bằng S nên bàn cờ tự khớp lại, không trôi dần. */
  function stepView(e) {
    const c = e.cell != null ? V.cells[e.cell] : null;
    switch (e.t) {
      case 'pick': c.dan = 0; break;
      case 'sow': c.dan++; break;
      case 'eat':
        V.captured[e.player].dan += e.dan;
        V.captured[e.player].quan += e.quan;
        c.dan = 0; c.quan = 0;
        break;
      case 'refill':
        for (const pl of e.placed) { V.cells[pl.cell].dan++; V.captured[pl.from].dan--; }
        break;
      case 'sweep':
        for (const g of e.got) {
          V.captured[e.player].dan += g.dan;
          V.captured[e.player].quan += g.quan;
          V.cells[g.cell].dan = 0; V.cells[g.cell].quan = 0;
        }
        break;
      case 'splitQuan': {
        const half = Math.floor(e.dan / 2);
        V.captured[e.to[0]].dan += half;
        V.captured[e.to[1]].dan += e.dan - half;
        V.captured[e.to[1]].quan += e.quan;
        c.dan = 0; c.quan = 0;
        break;
      }
      case 'settle':
        V.captured[e.from].dan -= e.dan;
        V.captured[e.to].dan += e.dan;
        break;
    }
  }

  async function playEvents(events) {
    const ms = SPEED[CF.speed] || 165;
    for (const e of events) {
      switch (e.t) {

        case 'pick':
          cellEls[e.cell].classList.add('active');
          stepView(e);
          drawCell(e.cell, false);
          moveHand(e.cell, e.count);
          SFX.pick();
          await sleep(e.chain ? ms * 1.5 : ms * 1.8);
          cellEls[e.cell].classList.remove('active');
          break;

        case 'sow':
          moveHand(e.cell, e.left);
          stepView(e);
          drawCell(e.cell, true);
          cellEls[e.cell].classList.add('drop');
          SFX.sow(e.cell);
          setTimeout(() => cellEls[e.cell].classList.remove('drop'), 300);
          await sleep(ms);
          break;

        case 'eat': {
          hideHand();
          const el = cellEls[e.cell];
          el.classList.add('eaten');
          const pts = e.dan + e.quan * S.opts.quanValue;
          flyTo(e.cell, e.player, '+' + pts);
          stepView(e);
          drawCell(e.cell, false);
          if (e.quan > 0) { SFX.quan(); toast(names[e.player] + ' ăn được QUAN! +' + pts + ' điểm', 2200); }
          else SFX.eat();
          drawScores();
          await sleep(e.quan > 0 ? 780 : 460);
          el.classList.remove('eaten');
          break;
        }

        case 'quanNon':
          hideHand();
          cellEls[e.cell].classList.add('nono');
          SFX.nope();
          toast('Quan mới có ' + e.have + ' dân, còn non — chưa ăn được, mất lượt.', 2400);
          await sleep(700);
          cellEls[e.cell].classList.remove('nono');
          break;

        case 'stopQuan':
          hideHand();
          cellEls[e.cell].classList.add('nono');
          SFX.nope();
          toast('Viên cuối dừng ngay trước ô quan — mất lượt.', 1900);
          await sleep(600);
          cellEls[e.cell].classList.remove('nono');
          break;

        case 'stopEmpty':
          hideHand();
          await sleep(220);
          break;

        case 'refill':
          hideHand();
          toast(names[e.player] + ' hết sỏi, phải rải lại mỗi ô một viên.', 2100);
          for (const pl of e.placed) {
            V.cells[pl.cell].dan++; V.captured[pl.from].dan--;
            drawCell(pl.cell, true);
            drawScores();                 // cho thấy chỗ sỏi đã ăn vơi dần đi
            cellEls[pl.cell].classList.add('drop');
            SFX.sow(pl.cell);
            setTimeout(() => cellEls[pl.cell].classList.remove('drop'), 300);
            await sleep(Math.max(70, ms * 0.7));
          }
          drawScores();
          break;

        case 'sweep':
          stepView(e);
          for (const g of e.got) {
            drawCell(g.cell, false);
            flyTo(g.cell, e.player, '+' + (g.dan + g.quan * S.opts.quanValue));
          }
          drawScores();
          await sleep(320);
          break;

        case 'splitQuan':
          stepView(e);
          drawCell(e.cell, false);
          drawScores();
          await sleep(260);
          break;

        case 'settle':
          stepView(e);
          drawScores();
          break;

        case 'stall':
          toast('Nước đi này chạy vòng mãi không dứt — engine phải cắt ngang.', 2600);
          break;
      }
    }
    hideHand();
    V = S;                     // khớp lại với thế thật, xoá mọi sai lệch nếu có
    drawAll(false);
    drawScores();
  }

  /* ===================== lượt đi ====================================== */
  function clearPick() {
    cellEls.forEach(el => { el.classList.remove('pick', 'hintbest'); const d = el.querySelector('.dirpick'); if (d) d.remove(); });
  }

  function markPick() {
    clearPick();
    if (S.over || busy) return;
    if (isAI(S.turn)) return;
    for (const mv of E.legalMoves(S)) cellEls[mv.cell].classList.add('pick');
  }

  function onCellClick(i) {
    if (busy || S.over || isAI(S.turn)) return;
    const moves = E.legalMoves(S).filter(m => m.cell === i);
    if (!moves.length) return;
    SFX.unlock();
    if (moves.length === 1) { go(moves[0]); return; }

    /* được chọn chiều: hiện hai mũi tên ngay trên ô vừa chạm */
    clearPick();
    const el = cellEls[i];
    const box = document.createElement('div');
    box.className = 'dirpick';
    for (const mv of moves.sort((a, b) => a.dir - b.dir)) {
      const b = document.createElement('button');
      b.textContent = mv.dir > 0 ? '▶' : '◀';
      b.title = mv.dir > 0 ? 'Rải xuôi' : 'Rải ngược';
      b.addEventListener('click', ev => { ev.stopPropagation(); go(mv); });
      box.appendChild(b);
    }
    el.appendChild(box);
    status('Chọn chiều rải. Chạm chỗ khác để bỏ.');
    setTimeout(() => {
      const off = ev => {
        if (!el.contains(ev.target)) { clearPick(); markPick(); updateStatus(); document.removeEventListener('click', off); }
      };
      document.addEventListener('click', off);
    }, 0);
  }

  async function go(mv) {
    busy = true;
    clearPick();
    status('<b>' + names[S.turn] + '</b> đang rải sỏi…');
    V = E.clone(S);                       // giữ thế cờ TRƯỚC nước đi để vẽ dần
    const events = E.applyMove(S, mv);
    await playEvents(events);
    busy = false;
    after();
  }

  function after() {
    if (S.over) { showOver(); return; }
    drawScores();
    updateStatus();
    if (isAI(S.turn)) {
      busy = true;
      setTimeout(() => {
        const mv = AI.pick(S, CF.level);
        busy = false;
        if (mv) go(mv); else { S.over = true; showOver(); }
      }, 380);
    } else {
      markPick();
    }
  }

  function updateStatus() {
    if (S.over) return;
    const who = S.turn === 0 ? names[0] : names[1];
    if (isAI(S.turn)) { status('<b>' + who + '</b> đang nghĩ…'); return; }
    const extra = CF.dir === 'free' ? ' rồi chọn chiều' : '';
    status('Lượt <b>' + who + '</b> — chạm một ô sáng' + extra + '.');
  }

  /* ===================== mách nước ==================================== */
  function hint() {
    if (busy || S.over || isAI(S.turn)) return;
    const mv = AI.pick(S, 'kho');
    if (!mv) return;
    clearPick(); markPick();
    cellEls[mv.cell].classList.add('hintbest');
    if (CF.dir === 'free') toast('Thử ô này, rải ' + (mv.dir > 0 ? 'xuôi ▶' : 'ngược ◀'), 2000);
    else toast('Thử ô này xem', 1500);
  }

  /* ===================== bắt đầu / kết thúc =========================== */
  /* Màn thiết lập trên điện thoại dài hơn một màn hình, bấm Bắt đầu ở cuối
     trang xong mà không kéo lên thì vào ván vẫn đang đứng ở lưng chừng. */
  function toTop() { try { window.scrollTo(0, 0); } catch (e) { } }

  function startGame() {
    names = CF.mode === 'may'
      ? ['Bạn', 'Máy ' + (AI.LEVELS[CF.level] || AI.LEVELS.thuong).name.toLowerCase()]
      : ['Người 1', 'Người 2'];

    S = E.newGame({
      players: 2,
      lockDirection: CF.dir === 'lock',
      quanNon: parseInt(CF.non, 10),
      quanValue: parseInt(CF.qv, 10)
    });
    S.turn = parseInt(CF.first, 10) === 1 ? 1 : 0;
    V = S;

    buildBoard();
    requestAnimationFrame(() => { layoutBoard(); drawAll(false); });
    drawAll(false);
    drawScores();
    $('setup').classList.remove('on');
    $('play').classList.add('on');
    $('mOver').classList.remove('on');
    toTop();
    busy = false;
    $('btnHint').hidden = (CF.mode !== 'may');
    updateStatus();
    if (isAI(S.turn)) after(); else markPick();
  }

  function showOver() {
    clearPick();
    drawScores();
    const a = E.score(S, 0), b = E.score(S, 1);
    const big = $('ovBig');
    $('ovA').textContent = a; $('ovB').textContent = b;
    $('ovAL').textContent = names[0]; $('ovBL').textContent = names[1];

    let note = '';
    if (a === b) {
      big.textContent = 'HOÀ'; big.className = 'big draw';
      record.d++; SFX.eat();
      note = 'Đúng bằng nhau, không ai chịu ai.';
    } else if (CF.mode === 'may') {
      const win = a > b;
      big.textContent = win ? 'BẠN THẮNG' : 'MÁY THẮNG';
      big.className = 'big ' + (win ? 'win' : 'lose');
      win ? record.w++ : record.l++;
      win ? SFX.win() : SFX.lose();
      note = 'Đối đầu với máy: thắng ' + record.w + ' · thua ' + record.l + ' · hoà ' + record.d + '.';
    } else {
      const win = a > b;
      big.textContent = (win ? names[0] : names[1]).toUpperCase() + ' THẮNG';
      big.className = 'big ' + (win ? 'win' : 'lose');
      SFX.win();
      note = 'Cách nhau ' + Math.abs(a - b) + ' điểm.';
    }
    try { localStorage.setItem(KEY + '-rec', JSON.stringify(record)); } catch (e) { }
    $('ovNote').textContent = note;
    status('Ván đã xong.');
    setTimeout(() => $('mOver').classList.add('on'), 550);
  }

  /* ===================== nối dây ====================================== */
  function refreshSetupVisibility() {
    $('fLevel').hidden = (CF.mode !== 'may');
    const f = $('optFirst').children;
    f[0].textContent = CF.mode === 'may' ? 'Bạn' : 'Người 1';
    f[1].textContent = CF.mode === 'may' ? 'Máy' : 'Người 2';
  }

  group('optMode', 'mode', refreshSetupVisibility);
  group('optLevel', 'level');
  group('optFirst', 'first');
  group('optDir', 'dir');
  group('optNon', 'non');
  group('optQV', 'qv');
  group('optSpeed', 'speed');
  group('optSpeed2', 'speed');
  refreshSetupVisibility();

  $('btnStart').addEventListener('click', () => { SFX.unlock(); startGame(); });
  $('btnBack').addEventListener('click', () => {
    $('play').classList.remove('on'); $('setup').classList.add('on'); $('mOver').classList.remove('on');
    toTop();
  });
  $('btnHint').addEventListener('click', hint);
  $('btnRules1').addEventListener('click', () => $('mRules').classList.add('on'));
  $('btnRules2').addEventListener('click', () => $('mRules').classList.add('on'));
  $('btnCloseRules').addEventListener('click', () => $('mRules').classList.remove('on'));
  $('mRules').addEventListener('click', ev => { if (ev.target === $('mRules')) $('mRules').classList.remove('on'); });

  /* --- bảng tuỳ chỉnh luật (chỉ mở được trước ván) --- */
  $('btnSettings').addEventListener('click', () => { SFX.unlock(); $('mSettings').classList.add('on'); });
  $('btnCloseSettings').addEventListener('click', () => $('mSettings').classList.remove('on'));

  /* --- bảng tuỳ chọn trong ván: âm lượng và tốc độ, không đụng tới luật --- */
  const vol = $('vol'), volVal = $('volVal');
  function paintVol() {
    vol.value = CF.vol;
    vol.style.setProperty('--fill', CF.vol + '%');
    volVal.textContent = CF.vol === 0 ? 'Tắt' : CF.vol + '%';
  }
  vol.addEventListener('input', () => {
    CF.vol = +vol.value; save(); paintVol();
    SFX.unlock(); SFX.setVol(CF.vol);
  });
  /* nghe thử một tiếng sỏi khi thả tay, để biết to nhỏ cỡ nào */
  vol.addEventListener('change', () => { if (CF.vol > 0) SFX.sow(3); });
  paintVol();

  $('btnOpts').addEventListener('click', () => { SFX.unlock(); $('mOptions').classList.add('on'); });
  $('btnCloseOptions').addEventListener('click', () => $('mOptions').classList.remove('on'));

  for (const id of ['mSettings', 'mOptions']) {
    $(id).addEventListener('click', ev => { if (ev.target === $(id)) $(id).classList.remove('on'); });
  }

  $('btnAgain').addEventListener('click', () => {
    /* đổi người đi trước cho công bằng: đi trước có lợi thật */
    CF.first = CF.first === '0' ? '1' : '0'; save();
    paintGroup('first');
    startGame();
  });
  $('btnMenu').addEventListener('click', () => {
    $('mOver').classList.remove('on');
    $('play').classList.remove('on'); $('setup').classList.add('on');
    toTop();
  });

  let rzT = null;
  window.addEventListener('resize', () => {
    if (!S) return;
    clearTimeout(rzT);
    rzT = setTimeout(() => { layoutBoard(); drawAll(false); }, 120);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) SFX.unlock(); });
})();
