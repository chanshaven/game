/* ============================================================================
   CẢ TIN — logic trò chơi
   Dữ liệu màn chơi nằm ở levels.js (biến LEVELS và OUTRO).
   ========================================================================== */
(function () {
  'use strict';

  const COLORS = ['lam', 'đỏ', 'vàng'];
  const SHAPES = ['tròn', 'vuông', 'tam giác'];
  const CVAR = { 'lam': 'var(--lam)', 'đỏ': 'var(--do)', 'vàng': 'var(--vang)' };
  // màu chữ số đặt trong lòng hình, chọn riêng từng màu cho đủ tương phản
  const CINK = { 'lam': '#EAF4FC', 'đỏ': '#FFF0EC', 'vàng': '#2E2106' };

  const STREAK_TO_WIN = 3;   // số lần đúng liên tiếp để qua màn
  const HINT_AFTER = 15;     // số lần thử trước khi nút gợi ý hiện ra
  const FLASH_MS = 620;      // thời gian giữ dấu ĐÚNG/SAI trước khi đổi bàn
  const KEY = 'ca-tin-v2';

  const S = { seed: '', level: 0, streak: 0, tries: 0, log: [], ranks: [], locked: false };
  let LEVELS = [];   // sinh ra từ mã ván, xem levels.js
  let board = [];

  const el = id => document.getElementById(id);
  const rnd = n => Math.floor(Math.random() * n);

  /* ---------- mã ván và lưu tiến độ ----------
     Luật được sinh RA TỪ mã ván, không lưu vào máy. Nhờ vậy mở lại trang giữa
     chừng vẫn gặp đúng bộ luật cũ, và gửi mã cho bạn bè là họ chơi đúng ván đó. */
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ seed: S.seed, level: S.level, ranks: S.ranks })); }
    catch (e) { /* chế độ ẩn danh hoặc bị chặn — bỏ qua */ }
  }
  function loadSaved() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (d && normSeedCode(d.seed)) return d;
    } catch (e) { /* dữ liệu hỏng — chơi ván mới */ }
    return null;
  }
  function seedFromUrl() {
    try {
      const m = /[?&]van=([^&]+)/i.exec(window.location.search);
      return m ? normSeedCode(decodeURIComponent(m[1])) : null;
    } catch (e) { return null; }
  }
  function openRun(seed, level, ranks) {
    S.seed = seed;
    LEVELS = buildRun(seed);
    S.level = (typeof level === 'number' && level >= 0 && level < LEVELS.length) ? level : 0;
    S.ranks = Array.isArray(ranks) ? ranks.slice(0, LEVELS.length) : [];
    el('seedTag').textContent = seed;
    save();
  }

  /* ---------- dựng bàn chơi ----------
     Mỗi bàn luôn có 2–4 ô đúng và không ô nào trùng ô nào, nên không bao giờ
     có bàn bế tắc mà cũng không dễ đoán mò.                                  */
  const randTile = () => ({ color: COLORS[rnd(3)], shape: SHAPES[rnd(3)], num: 1 + rnd(9) });
  const tkey = t => t.color + '|' + t.shape + '|' + t.num;

  function makeBoard(test) {
    const want = 2 + rnd(3);
    const good = [], bad = [], seen = Object.create(null);
    let guard = 0;
    while ((good.length < want || bad.length < 9 - want) && guard++ < 40000) {
      const t = randTile(), k = tkey(t);
      if (seen[k]) continue;
      if (test(t)) { if (good.length < want) { seen[k] = 1; good.push(t); } }
      else { if (bad.length < 9 - want) { seen[k] = 1; bad.push(t); } }
    }
    const all = good.concat(bad);
    for (let i = all.length - 1; i > 0; i--) { const j = rnd(i + 1); [all[i], all[j]] = [all[j], all[i]]; }
    return all;
  }

  /* Con số nằm trong lòng hình: hình đã nói rõ màu và dáng rồi, không cần
     nhãn chữ bên dưới nữa. Sổ tay vẫn ghi đủ bằng chữ để còn suy luận. */
  function glyph(shape, color, num) {
    const f = CVAR[color], ink = CINK[color];
    let body, ty;
    if (shape === 'tròn') {
      body = '<circle cx="20" cy="20" r="16.5" fill="' + f + '"/>'; ty = 20;
    } else if (shape === 'vuông') {
      body = '<rect x="4" y="4" width="32" height="32" rx="3" fill="' + f + '"/>'; ty = 20;
    } else {
      // tam giác hẹp dần lên đỉnh, nên hạ số xuống chỗ rộng cho cân mắt
      body = '<polygon points="20,2 38,36 2,36" fill="' + f + '"/>'; ty = 26;
    }
    return '<svg viewBox="0 0 40 40" aria-hidden="true">' + body +
      '<text x="20" y="' + ty + '" dy=".35em" text-anchor="middle" fill="' + ink + '"' +
      ' font-family="Cousine, ui-monospace, monospace" font-size="15" font-weight="700">' + num + '</text>' +
      '</svg>';
  }

  /* ---------- vẽ ---------- */
  function drawBoard() {
    const host = el('board');
    host.innerHTML = '';
    board.forEach((t, i) => {
      const b = document.createElement('button');
      b.className = 'tile';
      b.type = 'button';
      b.dataset.i = i;
      b.setAttribute('aria-label', t.color + ', ' + t.shape + ', số ' + t.num);
      b.innerHTML = glyph(t.shape, t.color, t.num) +
        '<span class="mark" aria-hidden="true"></span>';
      host.appendChild(b);
    });
  }

  function drawPips() {
    const p = el('pips');
    p.innerHTML = '';
    for (let i = 0; i < STREAK_TO_WIN; i++) {
      const d = document.createElement('span');
      d.className = 'pip' + (i < S.streak ? ' on' : '');
      p.appendChild(d);
    }
  }

  function drawLog() {
    const ol = el('logList');
    ol.innerHTML = '';
    if (!S.log.length) {
      ol.innerHTML = '<li class="empty">Chưa có lần thử nào.</li>';
      return;
    }
    S.log.slice(0, 40).forEach(r => {
      const li = document.createElement('li');
      li.className = r.ok ? 'ok' : 'no';
      li.innerHTML = '<span class="v">' + (r.ok ? '✓' : '✗') + '</span>' +
        '<span>' + r.t.color + ' · ' + r.t.shape + ' · ' + r.t.num + '</span>';
      ol.appendChild(li);
    });
  }

  const rankOf = n => n < 6 ? 'vàng' : (n < 12 ? 'bạc' : 'đồng');

  /* ---------- vòng chơi ---------- */
  function newRound() {
    board = makeBoard(LEVELS[S.level].test);
    drawBoard();
    S.locked = false;
  }

  function startLevel() {
    const L = LEVELS[S.level];
    S.streak = 0; S.tries = 0; S.log = [];
    el('lvlNum').textContent = S.level + 1;
    el('lvlAll').textContent = LEVELS.length;
    el('lvlTag').textContent = 'Hồ sơ ' + String(S.level + 1).padStart(2, '0');
    el('ruleText').textContent = L.shown;
    el('tries').textContent = '0 lần thử';
    el('hintBtn').hidden = true;
    el('hintText').hidden = true;
    el('hintText').textContent = '';
    drawPips(); drawLog(); newRound();
  }

  function onPick(i) {
    if (S.locked) return;
    const L = LEVELS[S.level], t = board[i], ok = !!L.test(t);

    S.locked = true;
    S.tries++;
    S.log.unshift({ t: t, ok: ok });
    S.streak = ok ? S.streak + 1 : 0;

    const node = el('board').querySelector('[data-i="' + i + '"]');
    if (node) {
      node.classList.add(ok ? 'hit' : 'miss');
      node.querySelector('.mark').textContent = ok ? 'ĐÚNG' : 'SAI';
    }
    Array.prototype.forEach.call(el('board').children, c => { c.disabled = true; });

    el('tries').textContent = S.tries + ' lần thử';
    drawPips(); drawLog();

    if (S.tries >= HINT_AFTER && el('hintBtn').hidden && el('hintText').hidden) {
      el('hintBtn').hidden = false;
    }

    setTimeout(() => { S.streak >= STREAK_TO_WIN ? clearLevel() : newRound(); }, FLASH_MS);
  }

  function clearLevel() {
    const L = LEVELS[S.level];
    S.ranks[S.level] = { tries: S.tries, rank: rankOf(S.tries) };
    save();
    el('revealTitle').textContent = 'Màn ' + (S.level + 1) + ' — đã qua';
    el('revLie').textContent = L.shown;
    el('revTruth').textContent = L.truth;
    el('revTries').textContent = S.tries;
    el('revRank').textContent = rankOf(S.tries);
    el('revVoice').innerHTML = '<span>Người dẫn đường</span>' + L.voice;
    el('nextBtn').textContent = (S.level === LEVELS.length - 1) ? 'Kết thúc' : 'Màn tiếp theo';
    el('reveal').hidden = false;
    el('nextBtn').focus();
  }

  function showEnd() {
    const body = el('scoreBody');
    body.innerHTML = '';
    let total = 0;
    S.ranks.forEach((r, i) => {
      if (!r) return;
      total += r.tries;
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>Màn ' + (i + 1) + '</td><td>' + r.tries + ' lần · ' + r.rank + '</td>';
      body.appendChild(tr);
    });
    el('endTotal').textContent = total;
    el('endSeed').textContent = S.seed;
    el('endVoice').innerHTML = '<span>Người dẫn đường</span>' + OUTRO;
    el('endScreen').hidden = false;
    el('againBtn').focus();
  }

  /* Chơi lại = một mã ván MỚI, tức một bộ sáu bảng luật khác hẳn. */
  function reset() {
    el('reveal').hidden = true;
    el('endScreen').hidden = true;
    openRun(newSeedCode(), 0, []);
    startLevel();
  }

  /* ---------- gắn sự kiện ---------- */
  el('board').addEventListener('click', e => {
    const b = e.target.closest('.tile');
    if (b && !b.disabled) onPick(Number(b.dataset.i));
  });

  el('nextBtn').addEventListener('click', () => {
    el('reveal').hidden = true;
    if (S.level === LEVELS.length - 1) { showEnd(); return; }
    S.level++; save(); startLevel();
  });

  el('hintBtn').addEventListener('click', () => {
    el('hintBtn').hidden = true;
    const h = el('hintText');
    h.textContent = 'Gợi ý: ' + LEVELS[S.level].hint;
    h.hidden = false;
  });

  el('resetBtn').addEventListener('click', reset);
  el('againBtn').addEventListener('click', reset);
  el('homeBtn').addEventListener('click', () => { window.location.href = '../'; });

  (function boot() {
    const urlSeed = seedFromUrl();
    if (urlSeed) { openRun(urlSeed, 0, []); return startLevel(); }
    const d = loadSaved();
    if (d) openRun(normSeedCode(d.seed), d.level, d.ranks);
    else openRun(newSeedCode(), 0, []);
    startLevel();
  })();
})();
