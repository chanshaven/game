/* ============================================================================
   CẢ TIN — âm thanh
   Sinh hoàn toàn bằng WebAudio, không dùng file ngoài: bản một file gửi qua
   Zalo và bản chơi thử trên link đều chạy được, không phải tải kèm gì.

   Nhạc nền cố tình KHÔNG có giai điệu. Đây là game phải ngồi nghĩ, một vòng
   lặp có giai điệu nghe đến lần thứ mười là muốn tắt. Thay vào đó là một tầng
   trầm giữ nguyên, thỉnh thoảng điểm một tiếng chuông thưa — đủ để căn phòng
   không chết lặng, không đủ để giành lấy sự chú ý.
   ========================================================================== */
const AU = (function () {
  'use strict';

  const KEY_SND = 'ca-tin-sound';
  const A = { ctx: null, master: null, musicGain: null, sfxGain: null, playing: false, nextBar: 0, timer: null };
  let on = true;
  try { if (localStorage.getItem(KEY_SND) === '0') on = false; } catch (e) { }

  const MUSIC_VOL = 0.09, SFX_VOL = 0.75;

  function init() {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return true; }
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return false;
      A.ctx = new C();
      if (A.ctx.state === 'suspended' && A.ctx.resume) A.ctx.resume();

      A.master = A.ctx.createGain(); A.master.gain.value = 0.9;
      /* Bộ nén cuối đường: tiếng qua màn có mấy nốt chồng lên nhau, không nén
         thì đỉnh sóng vọt lên trên nền nhạc và chói tai. */
      let out = A.ctx.destination;
      try {
        const comp = A.ctx.createDynamicsCompressor();
        comp.threshold.value = -8; comp.knee.value = 18; comp.ratio.value = 4;
        comp.attack.value = 0.005; comp.release.value = 0.25;
        comp.connect(A.ctx.destination); out = comp;
      } catch (e) { out = A.ctx.destination; }
      A.master.connect(out);

      A.musicGain = A.ctx.createGain(); A.musicGain.gain.value = 0.0001; A.musicGain.connect(A.master);
      A.sfxGain = A.ctx.createGain(); A.sfxGain.gain.value = on ? SFX_VOL : 0; A.sfxGain.connect(A.master);
      return true;
    } catch (e) { return false; }
  }

  const now = () => (A.ctx ? A.ctx.currentTime : 0);

  function tone(freq, t0, dur, type, gain, dest) {
    if (!A.ctx) return;
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type || 'triangle';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + 0.016);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || A.sfxGain);
    o.start(t0); o.stop(t0 + dur + 0.06);
  }

  /* ---------------- nhạc nền ----------------
     Marimba vui nhộn, tự sinh khi chơi chứ không lặp lại y hệt.

     Ba bè:
       trầm      — nốt gốc và quãng năm xen kẽ theo từng phách, nghe nhún
       giai điệu — marimba, móc đơn, có đảo phách và có chỗ nghỉ
       hoà âm    — vòng Đô trưởng - La thứ - Fa trưởng - Sol, mỗi ô nhịp một hợp âm

     Marimba dựng bằng cộng hài âm chứ không lọc: hài âm thứ tư rất mạnh và
     tắt nhanh hơn nốt gốc, chính hai chỗ đó cho ra tiếng gỗ. Thêm hài âm thứ
     mười tắt rất nhanh làm tiếng dùi gõ vào thanh.

     Chỉnh nhanh: MUSIC_VOL to nhỏ, BPM nhanh chậm, REST_CHANCE thưa dày.      */

  const BPM = 112;
  const BEAT = 60 / BPM;
  const BAR = BEAT * 4;
  const REST_CHANCE = 0.25;

  /* [gốc, quãng năm] của từng hợp âm, tính bằng Hz */
  const PROG = [[65.41, 98.00],    // Đô trưởng
                [55.00, 82.41],    // La thứ
                [43.65, 65.41],    // Fa trưởng
                [49.00, 73.42]];   // Sol

  const PENT = [261.63, 293.66, 329.63, 392.00, 440.00,
                523.25, 587.33, 659.25, 783.99];   // ngũ cung Đô, hai quãng tám

  const OFFBEATS = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
  let melIdx = 4, barNo = 0;

  /* Một tiếng gảy dựng bằng cộng hài âm. Mỗi hài âm là [bội số, độ lớn, hằng
     số tắt]; hài âm cao tắt nhanh hơn thì nghe mới ra chất gỗ.
     setTargetAtTime cho ra đúng đường cong e mũ trừ, tức đúng cách một vật
     rung tắt dần trong đời thật. */
  function pluck(f, t0, amp, attack, parts) {
    if (!A.ctx) return;
    parts.forEach(function (p) {
      const o = A.ctx.createOscillator(), g = A.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * p[0];
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(Math.max(0.0002, amp * p[1]), t0 + attack);
      g.gain.setTargetAtTime(0.0001, t0 + attack, p[2]);
      o.connect(g); g.connect(A.musicGain);
      o.start(t0); o.stop(t0 + attack + p[2] * 6 + 0.05);
    });
  }

  const MARIMBA = [[1, 1.0, 0.45], [4, 0.55, 0.16], [10, 0.18, 0.05]];
  const BASS = [[1, 1.0, 0.22], [2, 0.30, 0.22]];

  function scheduleBar(t0) {
    const ch = PROG[barNo % PROG.length];

    /* bè trầm nhún: gốc, quãng năm, gốc, quãng năm */
    for (let b = 0; b < 4; b++) pluck(ch[b % 2], t0 + b * BEAT, 0.50, 0.004, BASS);

    /* giai điệu đi từng bậc, không nhảy xa, thỉnh thoảng bỏ trống một nốt */
    OFFBEATS.forEach(function (b) {
      if (Math.random() < REST_CHANCE) return;
      melIdx += Math.floor(Math.random() * 5) - 2;
      if (melIdx < 0) melIdx = 0;
      if (melIdx >= PENT.length) melIdx = PENT.length - 1;
      pluck(PENT[melIdx], t0 + b * BEAT, (b % 1 === 0) ? 0.55 : 0.38, 0.003, MARIMBA);
    });

    barNo++;
  }

  /* Đặt trước hai ô nhịp rồi cứ nửa ô nhịp lại kiểm một lần. setTimeout chạy
     không đều, nhưng mọi nốt đều hẹn theo đồng hồ của WebAudio nên tiết tấu
     vẫn chính xác từng mili giây. */
  function tick() {
    clearTimeout(A.timer);
    if (!A.ctx || !A.playing) return;
    while (A.nextBar < now() + BAR * 2) { scheduleBar(A.nextBar); A.nextBar += BAR; }
    A.timer = setTimeout(tick, BAR * 500);
  }

  function musicStart() {
    if (!init() || A.playing) return;
    A.playing = true; barNo = 0; melIdx = 4;
    A.nextBar = now() + 0.25;
    tick();
    A.musicGain.gain.cancelScheduledValues(now());
    A.musicGain.gain.setValueAtTime(0.0001, now());
    A.musicGain.gain.exponentialRampToValueAtTime(on ? MUSIC_VOL : 0.0001, now() + 1.8);
  }

  function musicStop() {
    clearTimeout(A.timer);
    A.playing = false;
    if (!A.ctx) return;
    const t = now();
    A.musicGain.gain.cancelScheduledValues(t);
    A.musicGain.gain.setValueAtTime(Math.max(0.0002, A.musicGain.gain.value), t);
    A.musicGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
  }

  /* ---------------- hiệu ứng ---------------- */
  const sfx = {
    click: function () { if (A.ctx) tone(660, now(), 0.06, 'triangle', 0.10); },
    hit: function () {
      if (!A.ctx) return; const t = now();
      tone(523.25, t, 0.18, 'triangle', 0.16);
      tone(784.00, t + 0.07, 0.30, 'sine', 0.11);
    },
    miss: function () {
      if (!A.ctx) return; const t = now();
      tone(146.83, t, 0.26, 'triangle', 0.13);
      tone(98.00, t + 0.03, 0.34, 'sine', 0.13);
    },
    level: function () {
      if (!A.ctx) return; const t = now();
      [392.00, 523.25, 659.25].forEach(function (f, i) { tone(f, t + i * 0.11, 0.55, 'triangle', 0.13); });
    },
    lose: function () {
      if (!A.ctx) return; const t = now();
      [392.00, 329.63, 261.63, 196.00].forEach(function (f, i) {
        tone(f, t + i * 0.17, 0.85, 'triangle', 0.13);
      });
    },
    done: function () {
      if (!A.ctx) return; const t = now();
      [261.63, 392.00, 523.25, 784.00].forEach(function (f, i) { tone(f, t + i * 0.17, 0.95, 'sine', 0.12); });
    }
  };

  /* ---------------- bật tắt ---------------- */
  function setOn(v) {
    on = !!v;
    try { localStorage.setItem(KEY_SND, on ? '1' : '0'); } catch (e) { }
    if (!A.ctx) { if (on) musicStart(); return on; }
    const t = now();
    A.sfxGain.gain.setTargetAtTime(on ? SFX_VOL : 0, t, 0.05);
    A.musicGain.gain.cancelScheduledValues(t);
    A.musicGain.gain.setValueAtTime(Math.max(0.0002, A.musicGain.gain.value), t);
    A.musicGain.gain.exponentialRampToValueAtTime(on ? MUSIC_VOL : 0.0001, t + 0.6);
    if (on && !A.playing) musicStart();
    return on;
  }
  const isOn = () => on;

  /* iOS treo AudioContext khi chuyển tab hay khoá màn hình — chạm lại là đánh thức */
  ['touchend', 'pointerup', 'click'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      try { if (A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) { }
    }, { passive: true, capture: true });
  });
  document.addEventListener('visibilitychange', function () {
    try { if (!document.hidden && A.ctx && A.ctx.state === 'suspended') A.ctx.resume(); } catch (e) { }
  });

  return { init: init, sfx: sfx, musicStart: musicStart, musicStop: musicStop, setOn: setOn, isOn: isOn };
})();
