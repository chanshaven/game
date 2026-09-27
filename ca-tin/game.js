/* ============================================================================
   CẢ TIN — logic trò chơi
   Dữ liệu màn chơi nằm ở levels.js (biến LEVELS và OUTRO).
   ========================================================================== */
(function () {
  'use strict';

  const CVAR = { 'lam': 'var(--lam)', 'đỏ': 'var(--do)', 'vàng': 'var(--vang)' };
  // màu chữ số đặt trong lòng hình, chọn riêng từng màu cho đủ tương phản
  const CINK = { 'lam': '#EAF4FC', 'đỏ': '#FFF0EC', 'vàng': '#2E2106' };

  const STREAK_TO_WIN = 3;   // số lần đúng liên tiếp để qua màn
  const HINT_AT = 0.5;       // nút gợi ý mở ở nửa giới hạn, để còn kịp dùng
  const FLASH_MS = 620;      // thời gian giữ dấu ĐÚNG/SAI trước khi đổi bàn
  const KEY = 'ca-tin-v2';

  const S = { seed: '', level: 0, streak: 0, tries: 0, log: [], ranks: [],
              locked: false, prevTile: null, trusted: [], misses: 0 };
  let idleT = null, crossT = null;   // đồng hồ của màn nghịch lý
  let LEVELS = [];   // sinh ra từ mã ván, xem levels.js
  let board = [];

  const el = id => document.getElementById(id);

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
    S.trusted = [];
    S.level = (typeof level === 'number' && level >= 0 && level < LEVELS.length) ? level : 0;
    S.ranks = Array.isArray(ranks) ? ranks.slice(0, LEVELS.length) : [];
    save();
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
      ' font-family="Cousine, ui-monospace, monospace" font-size="' + (num > 9 ? 12.5 : 15) +
      '" font-weight="700">' + num + '</text>' +
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

  /* Xếp hạng theo số lần SAI, không theo tổng số lần thử. Dò tìm nhiều mà
     dò đúng hướng thì không phải là chơi dở. */
  const rankOf = n => n <= 3 ? 'vàng' : (n <= 8 ? 'bạc' : 'đồng');

  /* Giới hạn đếm số lần SAI; chọn đúng thì miễn phí. Nhờ vậy ba lần chứng
     minh cuối không tốn gì, và người suy luận chắc tay được thưởng thật. */
  function drawTries() {
    const left = LEVELS[S.level].limit - S.misses;
    const e = el('tries');
    e.textContent = 'còn ' + left + ' lần sai';
    e.classList.toggle('low', left <= 3);
  }

  /* ---------- vòng chơi ---------- */
  /* Bàn chơi dựng theo luật THẬT của màn, và theo cả ô vừa chọn — vì có kiểu
     luật nhắc tới nước đi liền trước. makeBoard nằm trong levels.js. */
  function newRound() {
    board = makeBoard(LEVELS[S.level].test, S.prevTile) || randomBoard();
    drawBoard();
    S.locked = false;
  }

  /* ---------- màn nghịch lý ----------
     Không ô nào đúng. Qua màn bằng cách ngừng chạm vào bàn: sau 3,5 giây yên
     lặng, một nét gạch bắt đầu kéo ngang dòng chữ đang nói dối, mất 7 giây để
     đi hết. Chạm vào bất cứ đâu là nét gạch tan và phải làm lại từ đầu.
     Làm hiện ra như thế để người chơi THẤY việc không làm gì cũng là một nước
     đi — chứ đợi mù trong ba mươi giây thì chỉ thành bực. */
  function clearIdle() {
    clearTimeout(idleT); clearTimeout(crossT);
    idleT = crossT = null;
  }
  function resetCross() {
    const c = el('ruleCross');
    c.style.transition = 'width .22s ease-out';
    c.style.width = '0%';
  }
  function armIdle() {
    clearIdle(); resetCross();
    idleT = setTimeout(() => {
      const c = el('ruleCross');
      c.style.transition = 'width 7s linear';
      c.style.width = '100%';
      crossT = setTimeout(() => { clearIdle(); clearLevel(); }, 7050);
    }, 3500);
  }

  function startLevel() {
    const L = LEVELS[S.level];
    clearIdle(); resetCross();
    S.streak = 0; S.tries = 0; S.misses = 0; S.log = []; S.prevTile = null;
    el('lvlNum').textContent = S.level + 1;
    el('lvlAll').textContent = LEVELS.length;
    el('lvlTag').textContent = 'Ván ' + S.seed;
    el('ruleText').textContent = L.shown;
    drawTries();
    el('hintBtn').hidden = true;
    el('hintText').hidden = true;
    el('hintText').textContent = '';
    drawPips(); drawLog(); newRound();
    if (L.isParadox) armIdle();
  }

  function onPick(i) {
    if (S.locked) return;
    const L = LEVELS[S.level], t = board[i], ok = !!L.test(t, i, S.prevTile);

    /* Nước đi ĐẦU TIÊN của mỗi màn: người chơi có làm đúng y như bảng luật
       bảo không? Đó là lúc họ còn tin, và là con số cuối ván đáng đếm. */
    if (S.tries === 0) S.trusted[S.level] = !!(L.shownTest && L.shownTest(t, i, S.prevTile));

    if (L.isParadox) armIdle();

    S.locked = true;
    S.tries++;
    if (!ok) S.misses++;
    S.log.unshift({ t: t, ok: ok });
    S.streak = ok ? S.streak + 1 : 0;
    S.prevTile = t;          // nước đi này thành mốc cho nước sau

    AU.sfx[ok ? 'hit' : 'miss']();

    const node = el('board').querySelector('[data-i="' + i + '"]');
    if (node) {
      node.classList.add(ok ? 'hit' : 'miss');
      node.querySelector('.mark').textContent = ok ? 'ĐÚNG' : 'SAI';
    }
    Array.prototype.forEach.call(el('board').children, c => { c.disabled = true; });

    drawTries();
    drawPips(); drawLog();

    if (L.isParadox) {
      let msg = '';
      L.nudges.forEach(n => { if (S.misses >= n[0]) msg = n[1]; });
      if (msg) { el('hintText').textContent = msg; el('hintText').hidden = false; }
    } else if (S.misses >= Math.round(L.limit * HINT_AT) && el('hintBtn').hidden && el('hintText').hidden) {
      el('hintBtn').hidden = false;
    }

    setTimeout(() => {
      if (S.streak >= STREAK_TO_WIN) clearLevel();
      else if (S.misses >= L.limit) loseLevel();
      else newRound();
    }, FLASH_MS);
  }

  function clearLevel() {
    clearIdle();
    const L = LEVELS[S.level];
    S.ranks[S.level] = { misses: S.misses, rank: rankOf(S.misses) };
    save();
    el('revealTitle').textContent = 'Màn ' + (S.level + 1) + ' — đã qua';
    el('revLie').textContent = L.shown;
    el('revTruth').textContent = L.truth;
    el('revTries').textContent = S.tries;
    el('revRank').textContent = rankOf(S.tries);
    el('revVoice').innerHTML = '<span>Người dẫn đường</span>' + L.voice;
    el('nextBtn').textContent = (S.level === LEVELS.length - 1) ? 'Kết thúc' : 'Màn tiếp theo';
    AU.sfx.level();
    el('reveal').hidden = false;
    el('nextBtn').focus();
  }

  /* Hết lần thử là thua cả ván. Lộ luôn luật thật — đó là phần thưởng cho
     việc đã thua, và là thứ người chơi mang sang ván sau. */
  function loseLevel() {
    clearIdle();
    AU.sfx.lose();
    AU.musicStop();
    const L = LEVELS[S.level];
    el('loseLie').textContent = L.shown;
    el('loseTruth').textContent = L.truth;
    el('loseAt').textContent = 'Màn ' + (S.level + 1);
    el('loseTries').textContent = S.misses;
    el('loseSeed').textContent = S.seed;
    const v = L.loseVoice || LOSE_VOICES[Math.floor(Math.random() * LOSE_VOICES.length)];
    el('loseVoice').innerHTML = '<span>Người dẫn đường</span>' + v;
    el('loseScreen').hidden = false;
    el('loseAgainBtn').focus();
    try { localStorage.removeItem(KEY); } catch (e) { }   // ván này hỏng rồi
  }

  function showEnd() {
    const body = el('scoreBody');
    body.innerHTML = '';
    let total = 0;
    S.ranks.forEach((r, i) => {
      if (!r) return;
      total += r.misses;
      const tr = document.createElement('tr');
      tr.innerHTML = '<td>Màn ' + (i + 1) + '</td><td>' + r.misses + ' sai · ' + r.rank + '</td>';
      body.appendChild(tr);
    });
    const trust = S.trusted.filter(Boolean).length;
    el('endTotal').textContent = total;
    el('endTrust').textContent = trust + '/' + LEVELS.length;
    el('endSeed').textContent = S.seed;
    const o = OUTROS.find(x => trust >= x.min) || OUTROS[OUTROS.length - 1];
    el('endVoice').innerHTML = '<span>Người dẫn đường</span>' + o.text;
    AU.sfx.done();
    el('endScreen').hidden = false;
    el('againBtn').focus();
  }

  /* Ván mới = một mã ván MỚI, tức một bộ luật khác hẳn. */
  function reset() {
    AU.sfx.click();
    clearIdle();
    closeAllOverlays();
    if (AU.isOn()) AU.musicStart();     // thua thì nhạc đã tắt, bật lại
    openRun(newSeedCode(), 0, []);
    startLevel();
  }

  function closeAllOverlays() {
    el('startScreen').hidden = true;
    el('reveal').hidden = true;
    el('endScreen').hidden = true;
    el('loseScreen').hidden = true;
  }

  /* ---------- màn hình mở đầu ---------- */
  function showStart() {
    AU.musicStop();
    clearIdle();
    el('reveal').hidden = true;
    el('endScreen').hidden = true;
    el('loseScreen').hidden = true;
    const d = loadSaved();
    const canResume = !!(d && d.level > 0);
    el('resumeBtn').hidden = !canResume;
    if (canResume) el('resumeBtn').textContent = 'Chơi tiếp màn ' + (d.level + 1);
    el('startScreen').hidden = false;
    el('playBtn').focus();
  }

  /* Mọi lối vào ván đều đi qua đây: nhạc chỉ được phép bắt đầu sau một cú
     chạm của người chơi, trình duyệt nào cũng chặn tự phát. */
  function enterGame(seed, level, ranks) {
    AU.init();
    if (AU.isOn()) AU.musicStart();
    closeAllOverlays();
    openRun(seed, level, ranks);
    startLevel();
  }

  /* ---------- nút âm thanh ---------- */
  const ICON_ON = '<path d="M4 9v6h4l5 5V4L8 9zM16.5 12a3.5 3.5 0 0 0-2-3.16v6.32A3.5 3.5 0 0 0 16.5 12z' +
                  'M14.5 3.23v2.06A6.5 6.5 0 0 1 14.5 18.7v2.06A8.5 8.5 0 0 0 14.5 3.23z"/>';
  const ICON_OFF = '<path d="M4 9v6h4l5 5V4L8 9zM21 9.41 19.59 8l-2.3 2.29L15 8v2.83l.88.88L15 12.6v2.82' +
                   'l2.29-2.29L19.59 16 21 14.59l-2.29-2.3z"/>';
  function paintSound() {
    const onNow = AU.isOn();
    el('icSound').innerHTML = onNow ? ICON_ON : ICON_OFF;
    el('btnSound').setAttribute('aria-pressed', onNow ? 'true' : 'false');
    el('btnSound').title = onNow ? 'Tắt âm thanh' : 'Bật âm thanh';
    el('lblSound').textContent = onNow ? 'Tiếng' : 'Tắt';
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
  el('loseAgainBtn').addEventListener('click', reset);
  el('loseHomeBtn').addEventListener('click', () => { window.location.href = '../'; });
  el('homeBtn').addEventListener('click', () => { window.location.href = '../'; });

  el('exitBtn').addEventListener('click', () => { AU.sfx.click(); showStart(); });
  /* Ô mã ván có gì thì chơi đúng ván đó, để trống thì bốc ngẫu nhiên. */
  el('playBtn').addEventListener('click', () => {
    const raw = el('seedInput').value.trim();
    if (!raw) { enterGame(newSeedCode(), 0, []); AU.sfx.click(); return; }
    const c = normSeedCode(raw);
    if (!c) {
      el('seedInput').value = '';
      el('seedInput').placeholder = 'Mã 4 ký tự';
      el('seedInput').focus();
      return;
    }
    enterGame(c, 0, []);
    AU.sfx.click();
  });
  el('resumeBtn').addEventListener('click', () => {
    const d = loadSaved();
    if (d) enterGame(normSeedCode(d.seed), d.level, d.ranks);
    else enterGame(newSeedCode(), 0, []);
    AU.sfx.click();
  });
  el('seedInput').addEventListener('keydown', e => { if (e.key === 'Enter') el('playBtn').click(); });

  el('btnSound').addEventListener('click', () => {
    AU.init();
    AU.setOn(!AU.isOn());
    paintSound();
    if (AU.isOn()) AU.sfx.click();
  });

  (function boot() {
    paintSound();
    /* Dựng sẵn bàn chơi phía sau để trang lúc nghỉ không phải là một ô trống,
       rồi mới phủ màn hình mở đầu lên. */
    const urlSeed = seedFromUrl();
    const d = loadSaved();
    if (urlSeed) openRun(urlSeed, 0, []);
    else if (d) openRun(normSeedCode(d.seed), d.level, d.ranks);
    else openRun(newSeedCode(), 0, []);
    startLevel();
    if (urlSeed) el('seedInput').value = urlSeed;
    showStart();
  })();
})();
