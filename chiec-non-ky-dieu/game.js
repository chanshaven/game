/* Chiếc Nón Kỳ Diệu — game engine */
(function () {
  'use strict';

  /* ---------------- bảng chữ cái tiếng Việt ---------------- */
  const GROUPS = {
    'A': 'AÁÀẢÃẠ', 'Ă': 'ĂẮẰẲẴẶ', 'Â': 'ÂẤẦẨẪẬ',
    'E': 'EÉÈẺẼẸ', 'Ê': 'ÊẾỀỂỄỆ',
    'I': 'IÍÌỈĨỊ',
    'O': 'OÓÒỎÕỌ', 'Ô': 'ÔỐỒỔỖỘ', 'Ơ': 'ƠỚỜỞỠỢ',
    'U': 'UÚÙỦŨỤ', 'Ư': 'ƯỨỪỬỮỰ',
    'Y': 'YÝỲỶỸỴ',
    'Đ': 'Đ'
  };
  const VN_ONLY = ['Ă', 'Â', 'Đ', 'Ê', 'Ô', 'Ơ', 'Ư'];
  const ALPHABET = ['A','Ă','Â','B','C','D','Đ','E','Ê','F','G','H','I','J','K','L','M','N','O','Ô','Ơ','P','Q','R','S','T','U','Ư','V','W','X','Y','Z'];
  const BASE = {};
  for (const k in GROUPS) for (const ch of GROUPS[k]) BASE[ch] = k;
  for (const L of ALPHABET) if (!BASE[L]) BASE[L] = L;
  const baseOf = ch => BASE[ch] || null;

  const FLAT = { 'Ă':'A','Â':'A','Ê':'E','Ô':'O','Ơ':'O','Ư':'U','Đ':'D' };
  function loose(s) {
    let out = '';
    for (const ch of (s || '').toUpperCase()) {
      const b = baseOf(ch);
      if (b) out += (FLAT[b] || b);
      else if (/[A-Z0-9]/.test(ch)) out += ch;
    }
    return out;
  }

  /* ---------------- các ô trên vòng quay ---------------- */
  const SEGS = [
    { t:'pts', v:200 },
    { t:'lose',   l:'MẤT LƯỢT' },
    { t:'pts', v:400 },
    { t:'double', l:'GẤP ĐÔI' },
    { t:'pts', v:300 },
    { t:'lucky',  l:'MAY MẮN' },
    { t:'pts', v:500 },
    { t:'half',   l:'CHIA ĐÔI' },
    { t:'pts', v:200 },
    { t:'life',   l:'THÊM MẠNG' },
    { t:'pts', v:600 },
    { t:'zero',   l:'MẤT ĐIỂM' },
    { t:'pts', v:300 },
    { t:'quiz',   l:'THỬ THÁCH' },
    { t:'pts', v:400 },
    { t:'bet',    l:'CƯỢC ĐÔI' },
    { t:'pts', v:800 },
    { t:'danger', l:'CÚN GẶP NGUY' },
    { t:'pts', v:300 },
    { t:'unlucky', l:'XUI RỒI' },
    { t:'pts', v:500 },
    { t:'life',   l:'CỨU TRỢ' },
    { t:'pts', v:1000 },
    { t:'gift',   l:'CHÚC MỪNG' }
  ];
  const COLORS = {
    lose:   ['#3D1226', '#FFE2B8'],
    double: ['#2FBE9F', '#04271F'],
    half:   ['#2C7E93', '#EAFBFF'],
    life:   ['#5FB94F', '#092C05'],
    lucky:  ['#9B6BFF', '#1B0A3A'],
    quiz:    ['#6E4BD8', '#F2E9FF'],
    unlucky: ['#A8471B', '#FFE8DC'],
    bet:    ['#E06AA6', '#320A20'],
    danger: ['#D62828', '#FFE6E1'],
    zero:   ['#2A2A33', '#D8D8E4'],
    gift:   ['#F5822B', '#311000']
  };
  const PTS_A = ['#8E0E24', '#FFE2B8'];
  const PTS_B = ['#F2B33C', '#42130A'];

  /* ---------------- âm thanh ---------------- */
  const A = { ctx:null, master:null, musicGain:null, sfxGain:null, on:false, timer:null, step:0, next:0, noise:null };
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  function audioInit() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return true; }
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      A.ctx = new C();
      if (A.ctx.state === 'suspended' && A.ctx.resume) A.ctx.resume();
      A.master = A.ctx.createGain(); A.master.gain.value = 0.85; A.master.connect(A.ctx.destination);
      A.musicGain = A.ctx.createGain(); A.musicGain.gain.value = 0; A.musicGain.connect(A.master);
      A.sfxGain = A.ctx.createGain(); A.sfxGain.gain.value = 0.85; A.sfxGain.connect(A.master);
      const len = A.ctx.sampleRate * 1.4, buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A.noise = buf;
      return true;
    } catch (e) { return false; }
  }
  function tone(freq, t0, dur, type, gain, dest) {
    if (!A.ctx) return;
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type || 'triangle'; o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.014);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || A.sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.06);
  }
  function noiseHit(t0, dur, gain, hp, dest) {
    if (!A.ctx || !A.noise) return;
    const s = A.ctx.createBufferSource(); s.buffer = A.noise;
    const f = A.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp || 2000;
    const g = A.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(dest || A.sfxGain);
    s.start(t0); s.stop(t0 + dur + 0.02);
  }
  const now = () => (A.ctx ? A.ctx.currentTime : 0);

  /* iOS hay treo AudioContext khi chuyển tab hoặc khoá màn hình — chạm lại là đánh thức */
  ['touchend', 'pointerup', 'click'].forEach(ev =>
    document.addEventListener(ev, () => {
      try { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) { /* bỏ qua */ }
    }, { passive: true, capture: true })
  );
  document.addEventListener('visibilitychange', () => {
    try { if (!document.hidden && A.on && A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) { /* bỏ qua */ }
  });
  let tensionNodes = null;

  const sfx = {
    tick() { if (A.ctx) tone(1500, now(), 0.035, 'square', 0.09); },
    click() { if (A.ctx) tone(760, now(), 0.07, 'triangle', 0.12); },

    /* 🎡 bấm QUAY — tiếng gió rít quét lên */
    whoosh() {
      if (!A.ctx || !A.noise) return;
      const t = now();
      const s = A.ctx.createBufferSource(); s.buffer = A.noise;
      const f = A.ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(260, t);
      f.frequency.exponentialRampToValueAtTime(3600, t + 0.42);
      f.frequency.exponentialRampToValueAtTime(700, t + 0.85);
      const gg = A.ctx.createGain();
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.17, t + 0.12);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      s.connect(f); f.connect(gg); gg.connect(A.sfxGain);
      s.start(t); s.stop(t + 0.95);
    },

    /* ✨ tiếng lấp lánh */
    sparkle(t0) {
      if (!A.ctx) return; const t = t0 || now();
      [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, t + i * 0.045, 0.45, 'sine', 0.085));
    },

    /* ✅ đoán đúng chữ — ting kèm lấp lánh */
    good() {
      if (!A.ctx) return; const t = now();
      [659, 831, 988].forEach((f, i) => tone(f, t + i * 0.06, 0.24, 'triangle', 0.18));
      sfx.sparkle(t + 0.1);
    },

    /* 🐶 cún kêu ư ử */
    whimper(t0) {
      if (!A.ctx) return; const t = t0 || now();
      const o = A.ctx.createOscillator(), gg = A.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(760, t);
      o.frequency.exponentialRampToValueAtTime(430, t + 0.2);
      o.frequency.exponentialRampToValueAtTime(640, t + 0.3);
      o.frequency.exponentialRampToValueAtTime(320, t + 0.58);
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.12, t + 0.05);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.62);
      o.connect(gg); gg.connect(A.sfxGain); o.start(t); o.stop(t + 0.68);
    },

    /* ❌ đoán sai — còi báo lỗi rồi cún kêu */
    bad() {
      if (!A.ctx) return; const t = now();
      const o = A.ctx.createOscillator(), gg = A.ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(90, t + 0.4);
      gg.gain.setValueAtTime(0.18, t); gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(gg); gg.connect(A.sfxGain); o.start(t); o.stop(t + 0.5);
      sfx.whimper(t + 0.34);
    },

    /* ❤️ mất mạng — hai tiếng bíp cảnh báo */
    alarm() {
      if (!A.ctx) return; const t = now();
      for (let i = 0; i < 2; i++) {
        tone(932, t + i * 0.2, 0.12, 'square', 0.12);
        tone(699, t + i * 0.2 + 0.09, 0.13, 'square', 0.1);
      }
      noiseHit(t, 0.26, 0.05, 180);
    },

    /* 🎯 nhạc căng thẳng khi mở bảng đoán đáp án */
    tensionStart() {
      if (!A.ctx || tensionNodes) return;
      const t = now();
      const o = A.ctx.createOscillator(), gg = A.ctx.createGain();
      const f = A.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 340;
      const lfo = A.ctx.createOscillator(), lg = A.ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = 55;
      lfo.type = 'sine'; lfo.frequency.value = 5.5; lg.gain.value = 7;
      lfo.connect(lg); lg.connect(o.frequency);
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(0.075, t + 0.5);
      o.connect(f); f.connect(gg); gg.connect(A.sfxGain);
      o.start(t); lfo.start(t);
      const iv = setInterval(() => {
        if (!A.ctx) return; const tt = now();
        tone(72, tt, 0.13, 'sine', 0.17);
        tone(58, tt + 0.17, 0.17, 'sine', 0.12);
      }, 780);
      tensionNodes = { o: o, g: gg, lfo: lfo, iv: iv };
    },
    tensionStop() {
      if (!tensionNodes) return;
      const n = tensionNodes; tensionNodes = null;
      clearInterval(n.iv);
      try {
        const t = now();
        n.g.gain.cancelScheduledValues(t);
        n.g.gain.setValueAtTime(n.g.gain.value, t);
        n.g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        n.o.stop(t + 0.34); n.lfo.stop(t + 0.34);
      } catch (e) { /* bỏ qua */ }
    },

    /* 🏆 nhạc chiến thắng */
    victory() {
      if (!A.ctx) return; const t = now();
      [[523, 0], [659, .12], [784, .24], [1047, .36], [784, .52], [1047, .62], [1319, .74]]
        .forEach(function (x) { tone(x[0], t + x[1], 0.45, 'square', 0.095); tone(x[0] * 2, t + x[1], 0.3, 'sine', 0.045); });
      [131, 165, 196, 262].forEach((f, i) => tone(f, t + i * 0.12, 0.5, 'triangle', 0.13));
      sfx.sparkle(t + 0.8);
    },

    /* 💀 thua đau */
    dramaticFail() {
      if (!A.ctx) return; const t = now();
      [392, 370, 349, 330].forEach((f, i) => {
        tone(f, t + i * 0.19, 0.5, 'sawtooth', 0.1);
        tone(f / 2, t + i * 0.19, 0.55, 'triangle', 0.12);
      });
      tone(62, t + 0.78, 1.1, 'sine', 0.22);
      noiseHit(t + 0.78, 0.8, 0.13, 80);
      sfx.whimper(t + 1.1);
    },

    fail() { sfx.dramaticFail(); },
    big() { sfx.victory(); },
    life() { if (!A.ctx) return; const t = now(); [523, 784, 1047].forEach((f, i) => tone(f, t + i * 0.06, 0.25, 'sine', 0.2)); }
  };

  const CHORDS = [[60,64,67],[57,60,64],[53,57,60],[55,59,62],[60,64,67],[57,60,64],[53,57,60],[55,59,62]];
  const MEL = [
    [72,74,76, 0,76,74,72, 0],
    [72,71,69, 0,69,71,72, 0],
    [69,71,72, 0,74, 0,72, 0],
    [71, 0,74, 0,71,69,67, 0],
    [76, 0,79, 0,76,74,72, 0],
    [74, 0,76, 0,74,72,71, 0],
    [72,74,76, 0,77, 0,76, 0],
    [74, 0,71, 0,67, 0, 0, 0]
  ];
  const BPM = 116, STEP = (60 / BPM) / 4;

  function scheduleStep(s, t) {
    const bar = Math.floor(s / 16) % 8, p = s % 16, ch = CHORDS[bar];
    if (p % 2 === 0) {
      const m = MEL[bar][p / 2];
      if (m) tone(mtof(m), t, 0.26, 'triangle', 0.09, A.musicGain);
    }
    if (p === 0 || p === 6 || p === 8) tone(mtof(ch[0] - 24), t, 0.3, 'sine', 0.17, A.musicGain);
    if (p % 4 === 2) tone(mtof(ch[(((p - 2) / 4) % 3)] + 12), t, 0.14, 'square', 0.028, A.musicGain);
    if (p % 2 === 0) noiseHit(t, 0.03, 0.02, 6000, A.musicGain);
    if (p === 4 || p === 12) noiseHit(t, 0.12, 0.05, 1400, A.musicGain);
  }
  function musicStart() {
    if (!A.ctx || A.timer) return;
    A.next = A.ctx.currentTime + 0.1;
    A.timer = setInterval(() => {
      if (!A.ctx) return;
      while (A.next < A.ctx.currentTime + 0.18) { scheduleStep(A.step, A.next); A.step++; A.next += STEP; }
    }, 28);
  }
  function musicStop() { if (A.timer) { clearInterval(A.timer); A.timer = null; } }
  function setMusic(on) {
    A.on = on;
    const btn = $('btnMusic');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.textContent = on ? '♪ Nhạc nền: bật' : '♪ Nhạc nền: tắt';
    if (!audioInit()) return;
    try { if (A.ctx.state === 'suspended' && A.ctx.resume) A.ctx.resume(); } catch (e) { /* bỏ qua */ }
    const g = A.musicGain.gain, t = A.ctx.currentTime;
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(on ? 0.2 : 0.0001, t + 0.6);
    if (on) musicStart(); else setTimeout(musicStop, 700);
  }

  /* ---------------- tiện ích DOM ---------------- */
  const $ = id => document.getElementById(id);
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const fmt = n => n.toLocaleString('vi-VN');

  /* ---------------- trạng thái ---------------- */
  const S = {
    started: false, mode: 'solo', players: [], cur: 0,
    round: 1, maxRounds: Infinity,
    answer: '', cat: '', question: '',
    revealed: [], used: [],
    pending: null, mult: 1, betting: false,
    spinning: false, canSpin: true,
    pool: [], solvedCount: 0, angle: 0
  };
  const MAX_LIVES = 8, START_LIVES = 5;

  /* ---------------- ngân hàng câu hỏi ---------------- */
  function freshPool() {
    const b = (window.QBANK || []).slice();
    for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; }
    return b;
  }
  function nextPuzzle() {
    if (!S.pool.length) S.pool = freshPool();
    const q = S.pool.pop() || ['CHIẾC NÓN KỲ DIỆU', 'Trò chơi', 'Trò chơi bạn đang chơi tên là gì?'];
    S.answer = q[0]; S.cat = q[1]; S.question = q[2];
    S.revealed = []; S.used = []; S.pending = null; S.mult = 1; S.betting = false;
  }

  const shuffleArr = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const gainLives = (p, n) => { p.lives = Math.min(MAX_LIVES, p.lives + n); };

  function revealRandom(n) {
    let c = 0;
    for (let k = 0; k < n; k++) {
      const hid = [...letterSet()].filter(L => S.revealed.indexOf(L) < 0);
      if (!hid.length) break;
      const L = hid[Math.random() * hid.length | 0];
      S.revealed.push(L);
      if (S.used.indexOf(L) < 0) S.used.push(L);
      c++;
    }
    if (c) renderBoard();
    return c;
  }

  /* pháo giấy khi giải được ô chữ */
  function confetti() {
    const cv = $('confetti'); if (!cv || !cv.getContext) return;
    const c = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = window.innerWidth, H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#FFD166', '#FF5B41', '#3ECFAE', '#A981FF', '#FFF4DC', '#5FB0FF'];
    const P = [];
    for (let i = 0; i < 160; i++) P.push({
      x: Math.random() * W, y: -20 - Math.random() * H * 0.5,
      vx: (Math.random() - 0.5) * 2.6, vy: 2 + Math.random() * 3.6,
      w: 5 + Math.random() * 7, h: 8 + Math.random() * 10,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.26,
      col: cols[i % cols.length]
    });
    let last = performance.now();
    (function frame(t) {
      const dt = Math.min(34, t - last); last = t;
      c.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of P) {
        p.x += p.vx * dt / 16; p.y += p.vy * dt / 16; p.r += p.vr; p.vy += 0.022;
        if (p.y < H + 40) alive++;
        c.save(); c.translate(p.x, p.y); c.rotate(p.r);
        c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore();
      }
      if (alive) requestAnimationFrame(frame); else c.clearRect(0, 0, W, H);
    })(last);
  }

  const letterSet = () => {
    const s = new Set();
    for (const ch of S.answer) { const b = baseOf(ch); if (b) s.add(b); }
    return s;
  };
  const hiddenCount = () => {
    let n = 0;
    for (const ch of S.answer) { const b = baseOf(ch); if (b && S.revealed.indexOf(b) < 0) n++; }
    return n;
  };
  const isSolved = () => hiddenCount() === 0;

  /* ---------------- vòng quay ---------------- */
  const cv = $('wheel'), ctx = cv.getContext('2d');
  const R = 400, CX = 420, CY = 420, STEP_ANG = (Math.PI * 2) / SEGS.length;

  function drawWheel(rot) {
    S.angle = rot;
    ctx.clearRect(0, 0, 840, 840);
    ctx.save(); ctx.translate(CX, CY);
    ctx.beginPath(); ctx.arc(0, 0, R + 14, 0, Math.PI * 2);
    ctx.fillStyle = '#4A2A06'; ctx.fill();
    ctx.save(); ctx.rotate(rot);
    let ptsIdx = 0;
    SEGS.forEach((seg, i) => {
      const a0 = i * STEP_ANG, a1 = a0 + STEP_ANG;
      let pair;
      if (seg.t === 'pts') { pair = (ptsIdx % 2 === 0) ? PTS_A : PTS_B; ptsIdx++; }
      else pair = COLORS[seg.t] || PTS_A;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R, a0, a1); ctx.closePath();
      ctx.fillStyle = pair[0]; ctx.fill();
      ctx.strokeStyle = 'rgba(255,225,170,.55)'; ctx.lineWidth = 2.5; ctx.stroke();

      const label = seg.t === 'pts' ? String(seg.v) : seg.l;
      ctx.save(); ctx.rotate(a0 + STEP_ANG / 2);
      ctx.fillStyle = pair[1]; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      let size = seg.t === 'pts' ? 60 : 36;
      ctx.font = size + 'px Anton, Impact, sans-serif';
      while (ctx.measureText(label).width > R - 130 && size > 16) {
        size -= 2; ctx.font = size + 'px Anton, Impact, sans-serif';
      }
      ctx.fillText(label, R - 26, 0);
      ctx.restore();
    });
    ctx.restore();
    // vành ngoài + bóng đèn
    ctx.beginPath(); ctx.arc(0, 0, R + 7, 0, Math.PI * 2);
    ctx.lineWidth = 14; ctx.strokeStyle = '#8E5711'; ctx.stroke();
    for (let i = 0; i < SEGS.length; i++) {
      const a = rot + i * STEP_ANG;
      const x = Math.cos(a) * (R + 7), y = Math.sin(a) * (R + 7);
      ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = (Math.floor(Date.now() / 260) + i) % 2 ? '#FFE9A8' : '#C88A2A';
      ctx.fill();
    }
    ctx.restore();
  }

  let blink = null;
  function startBlink() { if (!blink) blink = setInterval(() => { if (!S.spinning) drawWheel(S.angle); }, 260); }

  function spin() {
    if (S.spinning || !S.canSpin || !S.started) return;
    audioInit(); sfx.whoosh();
    S.spinning = true; S.canSpin = false;
    updateControls();
    setMsg('Nón đang quay...', '');
    $('hubText').innerHTML = '...';

    const idx = Math.random() * SEGS.length | 0;
    const center = (idx + 0.5) * STEP_ANG;
    const jitter = (Math.random() - 0.5) * STEP_ANG * 0.6;
    const target = -Math.PI / 2 - center - jitter;
    const turns = 6 + Math.floor(Math.random() * 3);
    let from = S.angle % (Math.PI * 2);
    let to = target;
    while (to < from + turns * Math.PI * 2) to += Math.PI * 2;

    const dur = 4300, t0 = performance.now();
    let lastSeg = -1;
    (function frame(t) {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      const ang = from + (to - from) * e;
      drawWheel(ang);
      const segNow = Math.floor(((-Math.PI / 2 - ang) / STEP_ANG) % SEGS.length);
      if (segNow !== lastSeg) { lastSeg = segNow; if (p < 0.98) sfx.tick(); }
      if (p < 1) requestAnimationFrame(frame);
      else { S.spinning = false; land(SEGS[idx]); }
    })(t0);
  }

  /* ---------------- kết quả ô quay ---------------- */
  function land(seg) {
    const p = S.players[S.cur];
    const nm = p.name;
    if (seg.t === 'pts') {
      S.pending = seg.v;
      $('hubText').innerHTML = fmt(seg.v);
      setMsg('Quay trúng <b>' + fmt(seg.v) + ' điểm</b> mỗi chữ cái. ' + nm + ' hãy chọn một chữ cái!', 'gold');
      sfx.click(); S.canSpin = false; updateControls(); return;
    }
    $('hubText').innerHTML = seg.l.replace(' ', '<br>');
    switch (seg.t) {
      case 'lose':
        sfx.bad(); loseLives(p, 1); renderAll();
        if (!p.alive) return void setTimeout(() => afterDeath(p), 900);
        setMsg(multi()
          ? '<b>MẤT LƯỢT!</b> Cún của ' + nm + ' mất một mạng, còn ' + p.lives + '. Nhường nón cho người kế tiếp.'
          : '<b>MẤT LƯỢT!</b> Kẻ bắt cún tiến thêm một bước, cún của bạn còn ' + p.lives + ' mạng.', 'bad');
        return void setTimeout(passTurn, 1400);
      case 'double':
        p.score *= 2; sfx.big();
        setMsg('<b>GẤP ĐÔI!</b> Điểm của ' + nm + ' nhân đôi thành ' + fmt(p.score) + '. Quay tiếp nào!', 'good');
        break;
      case 'half':
        p.score = Math.floor(p.score / 2); sfx.bad();
        setMsg('<b>CHIA ĐÔI.</b> Điểm của ' + nm + ' còn ' + fmt(p.score) + '. Vẫn được quay tiếp.', 'bad');
        break;
      case 'life':
        gainLives(p, 1); sfx.life();
        setMsg('<b>THÊM MẠNG!</b> Cún của ' + nm + ' được tiếp sức, hiện còn ' + p.lives + ' mạng.', 'good');
        break;
      case 'lucky':
        sfx.sparkle(); return void boxPick(true);
      case 'quiz':
        sfx.click(); return void openChallenge();
      case 'unlucky':
        sfx.bad(); return void boxPick(false);
      case 'gift':
        p.score += 1000; sfx.big();
        setMsg('<b>CHÚC MỪNG!</b> ' + nm + ' được tặng thẳng 1.000 điểm.', 'good');
        break;
      case 'zero':
        p.score = 0; sfx.bad(); loseLives(p, 1); renderAll();
        if (!p.alive) return void setTimeout(() => afterDeath(p), 900);
        setMsg('<b>MẤT ĐIỂM.</b> Điểm của ' + nm + ' về 0 và cún mất một mạng, còn ' + p.lives + '.' + TL(), 'bad');
        return void setTimeout(passTurn, 1400);
      case 'danger':
        sfx.fail(); loseLives(p, 1);
        if (!p.alive) { renderAll(); return void setTimeout(() => afterDeath(p), 900); }
        setMsg('<b>CÚN GẶP NGUY!</b> Cún của ' + nm + ' mất một mạng, chỉ còn ' + p.lives + '.' + TL(), 'bad');
        renderAll(); return void setTimeout(passTurn, 1400);
      case 'bet':
        S.pending = 400; S.mult = 1; S.betting = false; sfx.click();
        setMsg('<b>CƯỢC ĐÔI!</b> ' + nm + ' chọn đi: nhận cược thì mỗi chữ đúng được <b>1.200 điểm</b> nhưng sai là cún mất <b>2 mạng</b>; bỏ qua thì ăn <b>400 điểm</b> mỗi chữ như thường.' +
          '<span class="minis"><button class="mini yes" type="button" data-bet="yes">NHẬN CƯỢC</button><button class="mini" type="button" data-bet="no">BỎ QUA</button></span>', 'gold');
        S.canSpin = false; renderAll(); return;
    }
    S.canSpin = true; renderAll();
  }

  /* ---------------- đoán chữ cái ---------------- */
  function guess(L) {
    if (S.pending == null || S.spinning) return;
    if (S.used.indexOf(L) >= 0) return;
    const p = S.players[S.cur];
    S.used.push(L);
    const set = letterSet();
    const pts = S.pending, mult = S.mult, wasBet = S.betting;
    S.pending = null; S.mult = 1; S.betting = false;

    if (set.has(L)) {
      S.revealed.push(L);
      let count = 0;
      for (const ch of S.answer) if (baseOf(ch) === L) count++;
      const gain = pts * count * mult;
      p.score += gain;
      sfx.good();
      setMsg('Chính xác! Có <b>' + count + '</b> chữ <b>' + L + '</b> — ' + p.name + ' được <b>' + fmt(gain) + ' điểm</b>.', 'good');
      renderBoard(L); renderAll();
      if (isSolved()) return void setTimeout(() => finishRound(p, 0, 'mở hết chữ cái'), 900);
      S.canSpin = true; updateControls();
    } else {
      const cost = wasBet ? 2 : 1;
      sfx.bad(); loseLives(p, cost);
      renderAll();
      if (!p.alive) {
        setMsg('Không có chữ <b>' + L + '</b> trong ô chữ...', 'bad');
        return void setTimeout(() => afterDeath(p), 1100);
      }
      setMsg('Không có chữ <b>' + L + '</b>. Cún của ' + p.name + ' mất ' + cost + ' mạng, còn ' + p.lives + '.' + TL(), 'bad');
      setTimeout(passTurn, 1500);
    }
  }

  function loseLives(p, n) {
    if (n <= 0) return;
    p.lives = Math.max(0, p.lives - n);
    if (p.lives === 0) p.alive = false;
    shakeScene();
    setTimeout(() => sfx.alarm(), 330);
  }

  function afterDeath(p) {
    sfx.fail();
    setMsg('<b>Chụp lưới rồi!</b> Cún của ' + p.name + ' đã bị bắt, ' + p.name + ' dừng cuộc chơi.', 'bad');
    renderAll();
    setTimeout(passTurn, 1200);
  }

  /* ---------------- hộp quà, hộp phạt, thử thách ---------------- */
  let modalDone = null;

  const GIFTS = [
    { t: 'Thêm 1.500 điểm',            run: p => { p.score += 1500; return 'được thưởng 1.500 điểm'; } },
    { t: 'Thêm 800 điểm',              run: p => { p.score += 800;  return 'được thưởng 800 điểm'; } },
    { t: 'Thêm một trái tim',          run: p => { gainLives(p, 1); return 'được thêm một trái tim'; } },
    { t: 'Đẩy lùi kẻ bắt cún 2 bước',  run: p => { gainLives(p, 2); return 'đẩy lùi kẻ bắt cún hai bước'; } },
    { t: 'Mở miễn phí 2 chữ cái',      run: () => { const n = revealRandom(2); return n ? 'được mở miễn phí ' + n + ' chữ cái' : 'được mở chữ nhưng ô chữ đã lộ hết'; } },
    { t: 'Nhân đôi số điểm',           run: p => { p.score *= 2; return 'được nhân đôi điểm, giờ có ' + fmt(p.score); } },
    { t: 'Mở 1 chữ cái và thêm 600 điểm', run: p => { revealRandom(1); p.score += 600; return 'được mở một chữ cái và thêm 600 điểm'; } }
  ];

  const CURSES = [
    { t: 'Mất một trái tim',      run: p => { loseLives(p, 1); return 'mất một trái tim'; } },
    { t: 'Mất hai trái tim',      run: p => { loseLives(p, 2); return 'mất luôn hai trái tim'; } },
    { t: 'Mất nửa số điểm',       run: p => { p.score = Math.floor(p.score / 2); return 'mất nửa số điểm, còn ' + fmt(p.score); } },
    { t: 'Trừ 1.000 điểm',        run: p => { p.score = Math.max(0, p.score - 1000); return 'bị trừ 1.000 điểm, còn ' + fmt(p.score); } },
    { t: 'Điểm về 0',             run: p => { p.score = 0; return 'mất sạch điểm'; } },
    { t: 'Mất một tim và 500 điểm', run: p => { loseLives(p, 1); p.score = Math.max(0, p.score - 500); return 'mất một trái tim và 500 điểm'; } }
  ];

  function boxPick(lucky) {
    const p = S.players[S.cur];
    const items = shuffleArr((lucky ? GIFTS : CURSES).slice()).slice(0, 3);
    S.canSpin = false; S.pending = null; updateControls();

    openModal(
      '<h3>' + (lucky ? 'MAY MẮN!' : 'XUI RỒI!') + '</h3>' +
      '<p id="bpMsg">' + (lucky ? 'Ba phần quà đang mở ra. ' : 'Ba phần phạt đang mở ra. ') +
      'Nhìn thật kỹ rồi nhớ lấy vị trí nhé!</p>' +
      '<div class="boxrow" id="bpRow"></div>' +
      '<div class="btns" id="bpBtns"></div>'
    );

    const row = $('bpRow');
    const nodes = items.map((it, i) => {
      const d = el('button', 'gbox' + (lucky ? '' : ' curse'));
      d.type = 'button';
      d.style.setProperty('--slot', i);
      d.innerHTML = '<span class="face">' + esc(it.t) + '</span><span class="back">?</span>';
      d.dataset.idx = String(i);
      row.appendChild(d);
      return d;
    });

    let picked = false;
    function onPick(e) {
      if (picked) return;
      picked = true;
      const n = e.currentTarget;
      const it = items[+n.dataset.idx];
      nodes.forEach(x => { x.classList.remove('pickable'); if (x !== n) x.classList.add('dim'); });
      n.classList.remove('down'); n.classList.add('chosen');
      setTimeout(() => nodes.forEach(x => x.classList.remove('down')), 550);

      const what = it.run(p);
      if (lucky) sfx.sparkle(); else sfx.bad();
      renderAll();
      $('bpMsg').innerHTML = '<b>' + esc(p.name) + '</b> ' + what + '.';
      $('bpBtns').innerHTML = '<button class="cta" data-act="done">TIẾP TỤC</button>';

      modalDone = () => {
        renderAll();
        if (!p.alive) return afterDeath(p);
        if (lucky) {
          if (isSolved()) return finishRound(p, 0, 'mở hết chữ cái');
          S.canSpin = true; updateControls();
          setMsg('<b>' + esc(p.name) + '</b> ' + what + '. Quay tiếp nào!', 'good');
        } else {
          setMsg('<b>' + esc(p.name) + '</b> ' + what + '.' + TL(), 'bad');
          setTimeout(passTurn, 800);
        }
      };
    }

    setTimeout(() => {
      if ($('modal').hidden) return;
      nodes.forEach(n => n.classList.add('down'));
      const m = $('bpMsg'); if (m) m.textContent = 'Đang xáo trộn...';
      let step = 0;
      const iv = setInterval(() => {
        if ($('modal').hidden) { clearInterval(iv); return; }
        const perm = shuffleArr([0, 1, 2]);
        nodes.forEach((n, i) => n.style.setProperty('--slot', perm[i]));
        sfx.tick();
        if (++step >= 5) {
          clearInterval(iv);
          const mm = $('bpMsg');
          if (mm) mm.textContent = lucky ? 'Chọn một hộp để nhận quà!' : 'Chọn một hộp — lần này thì không tránh được đâu.';
          nodes.forEach(n => { n.classList.add('pickable'); n.addEventListener('click', onPick); });
        }
      }, 440);
    }, 1800);
  }

  function openChallenge() {
    const p = S.players[S.cur];
    S.canSpin = false; S.pending = null; updateControls();
    const bank = window.QUIZBANK || [];
    const q = bank.length ? bank[Math.random() * bank.length | 0]
                          : ['Một tuần có bao nhiêu ngày?', ['Bảy', 'Sáu', 'Tám']];
    const opts = shuffleArr(q[1].map((t, i) => ({ t: t, ok: i === 0 })));

    openModal(
      '<h3>THỬ THÁCH!</h3>' +
      '<p>Trả lời đúng trong <b>15 giây</b>: được <b>1.000 điểm</b>, mở thêm một chữ cái và được quay tiếp. ' +
      'Sai hoặc hết giờ thì cún mất một trái tim và mất lượt.</p>' +
      '<div class="qbar"><i id="qzBar"></i></div>' +
      '<div class="qq">' + esc(q[0]) + '</div>' +
      '<div class="qopts" id="qzOpts"></div>' +
      '<div class="btns" id="qzBtns"></div>'
    );

    const bar = $('qzBar'), box = $('qzOpts');
    bar.style.transition = 'none'; bar.style.width = '100%';
    requestAnimationFrame(() => {
      bar.style.transition = 'width 15s linear';
      bar.style.width = '0%';
    });

    let done = false;
    const to = setTimeout(() => finish(null, null), 15000);
    sfx.tensionStart();

    const btns = opts.map(o => {
      const b = el('button', 'qopt', o.t);
      b.type = 'button';
      b.addEventListener('click', () => finish(o, b));
      box.appendChild(b);
      return b;
    });

    function finish(o, btn) {
      if (done) return;
      done = true;
      clearTimeout(to);
      sfx.tensionStop();
      bar.style.transition = 'none';
      bar.style.width = getComputedStyle(bar).width;
      btns.forEach((b, i) => { b.disabled = true; if (opts[i].ok) b.classList.add('right'); });
      if (btn && !(o && o.ok)) btn.classList.add('wrong');

      const ok = !!(o && o.ok);
      let msg;
      if (ok) {
        p.score += 1000; revealRandom(1); sfx.victory();
        msg = '<b>Chính xác!</b> ' + esc(p.name) + ' được 1.000 điểm và mở thêm một chữ cái.';
      } else {
        loseLives(p, 1); sfx.bad();
        msg = (o ? '<b>Sai mất rồi.</b>' : '<b>Hết giờ!</b>') + ' Cún của ' + esc(p.name) + ' mất một trái tim.';
      }
      renderAll();
      $('qzBtns').innerHTML = '<button class="cta" data-act="done">TIẾP TỤC</button>';

      modalDone = () => {
        renderAll();
        if (!p.alive) return afterDeath(p);
        if (ok) {
          if (isSolved()) return finishRound(p, 0, 'mở hết chữ cái');
          S.canSpin = true; updateControls();
          setMsg(msg + ' Quay tiếp nào!', 'good');
        } else {
          setMsg(msg + TL(), 'bad');
          setTimeout(passTurn, 800);
        }
      };
    }
  }

  /* ---------------- đoán đáp án ---------------- */
  function openSolve() {
    if (S.spinning || !S.started) return;
    sfx.tensionStart();
    const hid = hiddenCount(), bonus = 300 + hid * 150;
    openModal(
      '<h3>Đoán đáp án</h3>' +
      '<div class="qq">' + esc(S.question) + '</div>' +
      '<p>Ô chữ có <b>' + S.answer.replace(/ /g, '').length + '</b> chữ cái, còn <b>' + hid + '</b> chữ đang ẩn.</p>' +
      '<input class="guessinput" id="solveInput" placeholder="Nhập đáp án..." autocomplete="off" spellcheck="false">' +
      '<div class="warn">Đúng thì được thưởng thêm <b>' + fmt(bonus) + ' điểm</b>. Sai thì cún bị bắt ngay và ' + esc(S.players[S.cur].name) + ' mất hẳn lượt chơi.</div>' +
      '<p style="font-size:12.5px;opacity:.75;margin-bottom:14px">Không cần gõ dấu — nhập không dấu vẫn được tính đúng.</p>' +
      '<div class="btns"><button class="ghost" data-act="close">Quay lại</button><button class="solve" data-act="confirm">CHỐT ĐÁP ÁN</button></div>'
    );
    const inp = $('solveInput');
    inp.focus();
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSolve(inp.value); } });
  }

  function doSolve(text) {
    const p = S.players[S.cur];
    const hid = hiddenCount(), bonus = 300 + hid * 150;
    closeModal();
    if (loose(text) && loose(text) === loose(S.answer)) {
      p.score += bonus;
      S.revealed = [...letterSet()];
      renderBoard(); renderAll();
      finishRound(p, bonus, 'đoán đúng đáp án');
    } else {
      p.lives = 0; p.alive = false;
      sfx.dramaticFail(); renderAll();
      setMsg('<b>Sai rồi!</b> Đáp án đúng là <b>' + esc(S.answer) + '</b>. Cún của ' + p.name + ' bị bắt.', 'bad');
      setTimeout(passTurn, 1500);
    }
  }

  /* ---------------- luân chuyển lượt ---------------- */
  function passTurn() {
    const alive = S.players.filter(p => p.alive);
    if (!alive.length) return void gameOver();
    let i = S.cur;
    for (let k = 0; k < S.players.length; k++) {
      i = (i + 1) % S.players.length;
      if (S.players[i].alive) break;
    }
    S.cur = i;
    S.pending = null; S.mult = 1; S.betting = false; S.canSpin = true;
    $('hubText').innerHTML = 'QUAY<br>ĐI!';
    renderAll();
    if (S.players.length > 1)
      setMsg('Đến lượt <b>' + S.players[S.cur].name + '</b>. Bấm QUAY NÓN hoặc đoán thẳng đáp án.', 'gold');
    else
      setMsg('Bấm <b>QUAY NÓN</b> để quay tiếp, hoặc đoán thẳng đáp án.', '');
  }

  function finishRound(winner, bonus, how) {
    S.solvedCount++;
    sfx.victory(); confetti();
    S.revealed = [...letterSet()]; renderBoard(); renderAll();
    const last = S.round >= S.maxRounds;
    const body =
      '<h3>' + esc(winner.name) + ' giải được ô chữ!</h3>' +
      '<div class="qq">' + esc(S.question) + '</div>' +
      '<div class="reveal">' + esc(S.answer) + '</div>' +
      '<p>' + esc(winner.name) + ' ' + how + (bonus ? ' và nhận thêm <b>' + fmt(bonus) + ' điểm thưởng</b>' : '') +
      '. Tổng điểm hiện tại: <b>' + fmt(winner.score) + '</b>.</p>' +
      '<p style="font-size:12.5px;opacity:.8">Kẻ bắt cún đành bỏ cuộc — cún con an toàn trong ván này.</p>' +
      '<div class="btns"><button class="cta" data-act="' + (last ? 'over' : 'next') + '">' + (last ? 'XEM KẾT QUẢ' : 'VÁN TIẾP THEO') + '</button></div>';
    openModal(body);
  }

  function nextRound() {
    closeModal();
    S.round++;
    S.players.forEach(p => { if (p.alive) p.lives = Math.min(MAX_LIVES, p.lives + 1); });
    nextPuzzle();
    S.canSpin = true;
    $('hubText').innerHTML = 'QUAY<br>ĐI!';
    renderAll(); renderBoard();
    setMsg('<b>Ván ' + S.round + '</b> bắt đầu. Lượt của <b>' + S.players[S.cur].name + '</b>.', 'gold');
  }

  function gameOver() {
    const rank = S.players.slice().sort((a, b) => b.score - a.score);
    let html = '<h3>' + (S.mode === 'solo' ? 'Cún bị bắt mất rồi!' : 'Kết quả chung cuộc') + '</h3>';
    if (S.mode === 'solo') {
      html += '<p>Bạn đã giải được <b>' + S.solvedCount + '</b> ô chữ và ghi được <b>' + fmt(S.players[0].score) + '</b> điểm trước khi cún bị chụp lưới.</p>';
      html += '<div class="qq">' + esc(S.question) + '</div>';
      html += '<div class="reveal">' + esc(S.answer) + '</div>';
      html += '<p style="font-size:13px">Đó là đáp án của ô chữ cuối cùng.</p>';
    } else {
      html += '<div class="rank">' + rank.map((p, i) =>
        '<div class="' + (i === 0 ? 'first' : '') + '"><span class="pos">' + (i + 1) + '</span><span>' + esc(p.name) +
        (p.alive ? '' : ' <small style="opacity:.6">(cún bị bắt)</small>') + '</span><span class="pts">' + fmt(p.score) + '</span></div>'
      ).join('') + '</div>';
      html += '<p><b>' + esc(rank[0].name) + '</b> giành chiến thắng chung cuộc!</p>';
    }
    html += '<div class="btns"><button class="cta" data-act="restart">CHƠI LẠI</button></div>';
    openModal(html);
    if (S.mode === 'solo') sfx.dramaticFail(); else { sfx.victory(); confetti(); }
  }

  /* ---------------- hiển thị ---------------- */
  const multi = () => S.players.length > 1;
  const TL = () => multi() ? ' Mất lượt.' : '';

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function setMsg(html, kind) { const m = $('msg'); m.innerHTML = html; m.className = 'msgline' + (kind ? ' ' + kind : ''); }

  function renderBoard(justLetter) {
    const board = $('board'); board.innerHTML = '';
    S.answer.split(' ').forEach(word => {
      const w = el('div', 'word');
      for (const ch of word) {
        const b = baseOf(ch);
        const t = el('div', 'tile');
        if (!b) { t.textContent = ch; }
        else if (S.revealed.indexOf(b) >= 0) { t.textContent = ch; if (justLetter && b === justLetter) t.classList.add('just'); }
        else { t.classList.add('blank'); t.textContent = '•'; }
        w.appendChild(t);
      }
      board.appendChild(w);
    });
    fitBoard();
    renderQuestion();
    $('chipRound').textContent = S.mode === 'solo' ? 'Ô chữ số ' + S.round : 'Ván ' + S.round + '/' + S.maxRounds;
    $('chipLen').textContent = S.answer.replace(/ /g, '').length + ' chữ cái';
  }

  function fitBoard() {
    const board = $('board');
    const avail = Math.max(180, board.clientWidth - 30);
    const words = S.answer.split(' ');
    const longest = Math.max(1, ...words.map(w => w.length));
    const total = S.answer.replace(/ /g, '').length;
    let t = Math.floor((avail - 5 * (longest - 1)) / longest);
    const rows = Math.ceil(total / Math.max(1, Math.floor(avail / (t + 5))));
    const perRow = Math.max(1, Math.floor(avail / 30));
    if (total > perRow * 4) t = Math.min(t, 26);
    t = Math.max(15, Math.min(rows <= 1 ? 52 : 42, t));
    board.style.setProperty('--t', t + 'px');
  }
  let rzT = null;
  window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => { if (S.started) fitBoard(); }, 150); });

  function renderQuestion() {
    $('qtext').textContent = S.question;
  }

  function renderScene() {
    const p = S.players[S.cur]; if (!p) return;
    $('scene').dataset.danger = String(Math.max(0, Math.min(5, START_LIVES - p.lives)));
    $('hudName').textContent = p.name;
    $('hudScore').textContent = fmt(p.score);

    const hb = $('hudHearts'); hb.innerHTML = '';
    for (let k = 0; k < START_LIVES; k++) hb.appendChild(heart(k >= p.lives));
    if (p.lives > START_LIVES) {
      const s = el('span', 'plus', '+' + (p.lives - START_LIVES));
      hb.appendChild(s);
    }

    const rv = $('hudRivals'); rv.innerHTML = '';
    if (multi()) S.players.forEach((q, i) => {
      if (i === S.cur) return;
      const d = el('div', 'rival' + (q.alive ? '' : ' out'));
      d.appendChild(document.createTextNode(q.name));
      d.appendChild(heart(false));
      d.appendChild(document.createTextNode(String(q.lives)));
      const bb = el('b', null, fmt(q.score));
      d.appendChild(bb);
      rv.appendChild(d);
    });
  }

  function heart(off) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#ic-heart'); s.appendChild(u);
    if (off) s.setAttribute('class', 'off');
    return s;
  }

  function shakeScene() {
    const sc = $('scene');
    sc.classList.remove('hit');
    void sc.offsetWidth;
    sc.classList.add('hit');
    setTimeout(() => sc.classList.remove('hit'), 520);
  }

  function renderKeys() {
    const box = $('keys');
    if (!box.childElementCount) {
      ALPHABET.forEach(L => {
        const b = el('button', 'key', L);
        b.dataset.letter = L; b.type = 'button';
        b.addEventListener('click', () => { audioInit(); guess(L); });
        box.appendChild(b);
      });
    }
    const set = letterSet(), open = S.pending != null && !S.spinning;
    [...box.children].forEach(b => {
      const L = b.dataset.letter;
      const used = S.used.indexOf(L) >= 0;
      const vn = VN_ONLY.indexOf(L) >= 0 ? ' vn' : '';
      b.className = 'key' + vn + (used ? (set.has(L) ? ' hit' : ' miss') : (open ? '' : ' locked'));
      b.disabled = used || !open;
    });
  }

  function updateControls() {
    $('btnSpin').disabled = !S.canSpin || S.spinning || !S.started;
    $('btnSolve').disabled = S.spinning || !S.started;
    $('btnSpin').textContent = S.spinning ? 'ĐANG QUAY...' : (S.pending != null ? 'CHỌN CHỮ CÁI' : 'QUAY NÓN');
    renderKeys();
  }

  function renderAll() { renderScene(); updateControls(); }

  /* ---------------- modal ---------------- */
  function openModal(html) { $('sheet').innerHTML = html; $('modal').hidden = false; }
  function closeModal() { sfx.tensionStop(); $('modal').hidden = true; $('sheet').innerHTML = ''; }

  $('msg').addEventListener('click', e => {
    const b = e.target.closest('[data-bet]');
    if (!b || S.pending == null) return;
    audioInit(); sfx.click();
    if (b.dataset.bet === 'yes') {
      S.mult = 3; S.betting = true;
      setMsg('<b>Đã nhận cược!</b> Mỗi chữ cái đúng được <b>1.200 điểm</b>, nhưng đoán sai là cún mất <b>2 mạng</b>. Chọn chữ cái đi!', 'gold');
    } else {
      S.mult = 1; S.betting = false;
      setMsg('Bỏ qua cược. Mỗi chữ cái đúng được <b>400 điểm</b> — chọn chữ cái nào!', 'gold');
    }
  });

  $('modal').addEventListener('click', e => {
    const act = e.target.closest('[data-act]');
    if (!act) { if (e.target.id === 'modal') { /* giữ modal */ } return; }
    audioInit();
    const a = act.dataset.act;
    if (a === 'close') closeModal();
    else if (a === 'confirm') doSolve(($('solveInput') || {}).value || '');
    else if (a === 'next') nextRound();
    else if (a === 'over') { closeModal(); gameOver(); }
    else if (a === 'restart') { closeModal(); toStart(); }
    else if (a === 'exit') { closeModal(); toStart(); }
    else if (a === 'done') { closeModal(); const f = modalDone; modalDone = null; if (f) f(); }
  });

  const RULES =
    '<h3>Luật chơi</h3>' +
    '<ul>' +
    '<li>Mỗi ván có một <b>câu hỏi hiện sẵn</b> phía trên ô chữ. Đáp án của câu hỏi chính là ô chữ phải mở.</li>' +
    '<li>Quay nón rồi chọn một chữ cái. Mỗi chữ cái xuất hiện trong ô chữ được cộng đúng số điểm vừa quay.</li>' +
    '<li>Bảng chữ cái phân biệt rõ <b>A — Ă — Â</b>, <b>E — Ê</b>, <b>O — Ô — Ơ</b>, <b>U — Ư</b> và <b>D — Đ</b>. Chọn đúng nguyên âm sẽ mở mọi dấu thanh của nguyên âm đó.</li>' +
    '<li>Mỗi người có <b>5 mạng</b>, hiện thành 5 trái tim trên khung cún. Đoán sai chữ cái, hoặc quay vào ô phạt <b>MẤT LƯỢT</b>, <b>MẤT ĐIỂM</b>, <b>CÚN GẶP NGUY</b>, <b>XUI RỒI</b>, <b>THỬ THÁCH</b> hỏng đều mất tim.</li>' +
    '<li>Càng ít mạng thì kẻ bắt cún càng tiến sát và cún càng hoảng sợ. Hết 5 mạng là cún bị chụp lưới.</li>' +
    '<li><b>ĐOÁN ĐÁP ÁN</b> dùng được bất cứ lúc nào. Càng nhiều chữ còn ẩn thì thưởng càng lớn, nhưng sai là cún bị bắt ngay.</li>' +
    '</ul>' +
    '<h3 style="font-size:19px;margin-top:4px">Các ô trên vòng quay</h3>' +
    '<ul>' +
    '<li><b>Điểm</b> — từ 200 đến 1.000 cho mỗi chữ cái đoán đúng.</li>' +
    '<li><b>MẤT LƯỢT</b> — mất một mạng và nhường nón cho người kế tiếp.</li>' +
    '<li><b>GẤP ĐÔI</b> / <b>CHIA ĐÔI</b> — điểm hiện có nhân đôi hoặc chia đôi.</li>' +
    '<li><b>THÊM MẠNG</b> và <b>CỨU TRỢ</b> — được thêm một trái tim, kẻ bắt cún lùi lại một bước.</li>' +
    '<li><b>MAY MẮN</b> — ba phần quà hiện ra cho bạn xem, rồi úp xuống và xáo trộn. Bạn chọn một hộp để nhận quà, xong vẫn được quay tiếp.</li>' +
    '<li><b>XUI RỒI</b> — y hệt MAY MẮN nhưng là ba phần phạt. Chọn xong thì mất lượt.</li>' +
    '<li><b>THỬ THÁCH</b> — một câu đố phụ có ba lựa chọn, giới hạn 15 giây. Đúng thì được 1.000 điểm, mở thêm một chữ cái và quay tiếp; sai hoặc hết giờ thì mất một trái tim và mất lượt.</li>' +
    '<li><b>CHÚC MỪNG</b> — tặng thẳng 1.000 điểm.</li>' +
    '<li><b>MẤT ĐIỂM</b> — điểm về 0, mất một mạng và mất lượt.</li>' +
    '<li><b>CÚN GẶP NGUY</b> — mất ngay một mạng và mất lượt.</li>' +
    '<li><b>CƯỢC ĐÔI</b> — bạn tự chọn: nhận cược thì đúng được gấp ba điểm, sai mất hai mạng; bỏ qua thì ăn điểm như thường.</li>' +
    '</ul>' +
    '<div class="btns"><button class="cta" data-act="close">ĐÃ HIỂU</button></div>';

  /* ---------------- màn hình bắt đầu ---------------- */
  function buildNameFields() {
    const n = S.mode === 'solo' ? 1 : parseInt($('numPlayers').value, 10);
    const box = $('nameFields');
    const old = [...box.querySelectorAll('input')].map(i => i.value);
    box.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const f = el('div', 'field');
      const lab = el('label', null, n === 1 ? 'Tên của bạn' : 'Người chơi ' + (i + 1));
      lab.setAttribute('for', 'pn' + i);
      const inp = el('input');
      inp.id = 'pn' + i; inp.maxLength = 14; inp.autocomplete = 'off';
      inp.placeholder = n === 1 ? 'Bạn' : 'Người chơi ' + (i + 1);
      inp.value = old[i] || '';
      f.append(lab, inp); box.appendChild(f);
    }
  }

  function setMode(m) {
    S.mode = m;
    $('modeSolo').setAttribute('aria-pressed', m === 'solo');
    $('modeParty').setAttribute('aria-pressed', m === 'party');
    $('partyOpts').hidden = m !== 'party';
    buildNameFields();
  }

  function startGame() {
    audioInit();
    const inputs = [...$('nameFields').querySelectorAll('input')];
    S.players = inputs.map((inp, i) => ({
      name: (inp.value || '').trim().slice(0, 14) || (inputs.length === 1 ? 'Bạn' : 'Người chơi ' + (i + 1)),
      score: 0, lives: START_LIVES, alive: true
    }));
    S.maxRounds = S.mode === 'solo' ? Infinity : parseInt($('numRounds').value, 10);
    S.cur = 0; S.round = 1; S.solvedCount = 0; S.pool = freshPool();
    S.started = true; S.canSpin = true;
    nextPuzzle();
    $('screenStart').hidden = true;
    $('screenGame').hidden = false;
    $('btnExit').hidden = false;
    $('hubText').innerHTML = 'QUAY<br>ĐI!';
    renderBoard(); renderAll();
    setMsg(S.players.length > 1
      ? 'Đọc câu hỏi phía trên đi. Lượt đầu tiên thuộc về <b>' + S.players[0].name + '</b>.'
      : 'Đọc câu hỏi phía trên, rồi bấm <b>QUAY NÓN</b> để bắt đầu giải cứu cún con.', 'gold');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toStart() {
    S.started = false;
    modalDone = null;
    sfx.tensionStop();
    $('btnExit').hidden = true;
    $('screenGame').hidden = true;
    $('screenStart').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- gắn sự kiện ---------------- */
  $('modeSolo').addEventListener('click', () => { audioInit(); setMode('solo'); });
  $('modeParty').addEventListener('click', () => { audioInit(); setMode('party'); });
  $('numPlayers').addEventListener('change', buildNameFields);
  $('btnStart').addEventListener('click', startGame);
  $('btnSpin').addEventListener('click', spin);
  $('btnSolve').addEventListener('click', () => { audioInit(); openSolve(); });
  $('btnRules').addEventListener('click', () => { audioInit(); openModal(RULES); });
  $('btnMusic').addEventListener('click', () => setMusic(!A.on));
  $('btnExit').addEventListener('click', () => {
    audioInit(); sfx.click();
    openModal(
      '<h3>Thoát ván đang chơi?</h3>' +
      '<p>Toàn bộ điểm và số tim của ván này sẽ mất, bạn sẽ quay về màn hình chọn cách chơi.</p>' +
      '<div class="btns"><button class="ghost" data-act="close">CHƠI TIẾP</button>' +
      '<button class="cta" data-act="exit">THOÁT RA</button></div>'
    );
  });

  document.addEventListener('keydown', e => {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (!S.started || !$('modal').hidden) return;
    if (e.key === 'Enter' || e.key === ' ') {
      if (!$('btnSpin').disabled) { e.preventDefault(); spin(); }
      return;
    }
    const ch = (e.key || '').toUpperCase();
    if (ch.length !== 1) return;
    const b = baseOf(ch);
    if (b && S.pending != null && S.used.indexOf(b) < 0) { e.preventDefault(); guess(b); }
  });

  /* ---------------- khởi động ---------------- */
  function boot(data) {
    setMode('solo');
    buildNameFields();
    drawWheel(-Math.PI / 2);
    startBlink();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => drawWheel(S.angle));
    try {
      if (data && data.v === 1 && data.S) {
        Object.assign(S, data.S);
        if (S.started) {
          $('screenStart').hidden = true; $('screenGame').hidden = false; $('btnExit').hidden = false;
          S.spinning = false; renderBoard(); renderAll();
          setMsg('Ván chơi được khôi phục. Bấm <b>QUAY NÓN</b> để tiếp tục.', 'gold');
        }
      }
    } catch (err) { /* bắt đầu ván mới */ }
  }
  boot({});
})();
