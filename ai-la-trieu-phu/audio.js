/* ============================================================================
   AI LÀ TRIỆU PHÚ — âm thanh

   Hai tầng tách biệt:

   1. TIẾNG NÓI / NHẠC HIỆU  — là file mp3 thật trong thư mục sound/.
      Đây là phần làm nên không khí trường quay, không thể giả lập được.

   2. NHẠC NỀN              — cũng là file mp3, nằm trong sound/nen/.
      Ba đoạn piano lặp liền mạch, mỗi đoạn cho một chặng câu hỏi. Không có
      tiếng nào sinh bằng mã nữa — bản trước dựng bằng WebAudio nghe è è rất
      khó chịu nên đã bỏ hẳn.

      Thay bằng nhạc nền thật của chương trình thì chỉ cần đổi tên file trong
      SND['nen-1'..'nen-3']. Không có file thì im lặng, game vẫn chạy bình
      thường. Người chơi tắt riêng nhạc nền được bằng nút trên màn hình, tiếng
      dẫn vẫn chạy.

      Nhạc nền tự nhỏ xuống khi MC nói rồi to lại khi MC dứt lời.

   Quy tắc: một lúc chỉ có MỘT tiếng nói phát. Gọi say() khi tiếng cũ chưa dứt
   thì tiếng cũ bị cắt — đúng như trường quay, MC không nói chồng lên chính mình.
   ========================================================================== */
const AU = (function () {
  'use strict';

  const DIR = 'sound/';
  const KEY = 'altp-sound';

  /* ---------------------------------------------------------------------- *
     Danh mục file. Mỗi khoá trỏ tới MỘT MẢNG — gọi say() sẽ bốc ngẫu nhiên
     một file trong mảng, nên thêm biến thể vào là chương trình tự đỡ nhàm.
     File không tồn tại thì coi như phát xong ngay, game không đứng.
   * ---------------------------------------------------------------------- */
  const SND = {
    /* nhạc hiệu */
    intro:        ['nhac-hieu/Intro.mp3'],
    hieuDai:      ['nhac-hieu/nhac-hieu-dai.mp3'],
    xongCau5:     ['nhac-hieu/nhac-hieu-xong-cau-so-5.mp3'],

    /* dẫn vào từng câu — câu 12 đến 15 chưa có file, sẽ tự bỏ qua */
    cau1:  ['cau-hoi/cau-hoi-dau-tien.mp3'],
    cau2:  ['cau-hoi/cau-hoi-so-2.mp3'],
    cau3:  ['cau-hoi/cau-hoi-so-3.mp3'],
    cau4:  ['cau-hoi/cau-hoi-so-4.mp3'],
    cau5:  ['cau-hoi/cau-hoi-so-5.mp3'],
    cau6:  ['cau-hoi/cau-hoi-so-6.mp3'],
    cau7:  ['cau-hoi/cau-hoi-so-7.mp3'],
    cau8:  ['cau-hoi/cau-hoi-so-8.mp3'],
    cau9:  ['cau-hoi/cau-hoi-so-9.mp3'],
    cau10: ['cau-hoi/cau-hoi-so-10.mp3'],
    cau11: ['cau-hoi/cau-hoi-so-11.mp3'],
    cau12: ['cau-hoi/cau-hoi-so-12.mp3'],
    cau13: ['cau-hoi/cau-hoi-so-13.mp3'],
    cau14: ['cau-hoi/cau-hoi-so-14.mp3'],
    cau15: ['cau-hoi/cau-hoi-so-15.mp3'],

    /* trả lời đúng — câu chung, không nhắc tên phương án */
    dung: [
      'tra-loi-dung/do-la-cau-tra-loi-dung.mp3',
      'tra-loi-dung/do-la-cau-tra-loi-dung-xin-chuc-mung.mp3',
      'tra-loi-dung/do-moi-la-cau-tra-loi-dung.mp3',
      'tra-loi-dung/va-do-la-cau-tra-loi-dung.mp3',
      'tra-loi-dung/va-do-la-cau-tra-loi-dung-xin-chuc-mung.mp3',
      'tra-loi-dung/va-do-chac-chan-la-cau-tra-loi-dung-roi.mp3',
      'tra-loi-dung/va-chac-chan-do-la-cau-tra-loi-dung-roi-xin-chuc-mung.mp3',
      'tra-loi-dung/xin-chuc-mung-do-la-cau-tra-loi-dung.mp3',
    ],

    /* trả lời đúng — câu có nhắc đúng tên phương án, nghe sinh động hơn */
    'dung-A': ['A-dung/A-la-cau-tra-loi-dung.mp3',
               'A-dung/A-xin-chuc-mung.mp3'],
    'dung-B': ['B-dung/B-do-la-cau-tra-loi-dung.mp3',
               'B-dung/B-xin-chuc-mung.mp3',
               'B-dung/cau-tra-loi-dung-la-B.mp3'],
    'dung-C': ['C-dung/C-chac-chan-do-la-cau-tra-loi-dung.mp3',
               'C-dung/C-xin-chuc-mung.mp3',
               'C-dung/C-xin-chuc-mung-do-la-cau-tra-loi-dung.mp3'],
    'dung-D': ['D-dung/D-do-la-cau-tra-loi-dung.mp3',
               'D-dung/D-la-cau-tra-loi-dung.mp3',
               'D-dung/D-xin-chuc-mung.mp3'],

    /* trả lời sai — chữ cái ở đây là ĐÁP ÁN ĐÚNG, không phải cái người chơi chọn
       ("A mới là câu trả lời đúng") */
    'sai-A': ['A-sai/A-moi-la-cau-tra-loi-dung.mp3',
              'A-sai/cau-tra-loi-dung-phai-la-A.mp3',
              'A-sai/phuong-an-A-la-cau-tra-loi-dung.mp3'],
    'sai-B': ['B-sai/B-la-cau-tra-loi-dung.mp3'],
    'sai-C': ['C-sai/C-moi-la-cau-tra-loi-dung.mp3',
              'C-sai/cau-tra-loi-dung-cua-chung-toi-la-C.mp3'],
    'sai-D': ['D-sai/D-moi-la-cau-tra-loi-dung.mp3'],

    /* trợ giúp */
    'tg-5050':    ['50-50/50-50.mp3'],
    'tg-dt':      ['goi-dien-thoai/chung-toi-se-danh-cho-hai-nguoi-mot-khoang-thoi-gian.mp3'],
    'tg-dt-30s':  ['goi-dien-thoai/30-giay-bat-dau.mp3'],
    'tg-khangia': ['hoi-y-kien-khan-gia/hoi-y-kien-khan-gia-trong-truong-quay.mp3'],
    /* Hai file này đều là câu dẫn mời tổ tư vấn, phát liền nhau nghe như lắp
       bắp. Gộp làm một nhóm, mỗi lần bốc một câu. */
    'tg-tuvan':   ['tu-van-tai-cho/to-tu-van-tai-cho.mp3',
                   'tu-van-tai-cho/to-tu-van-tai-cho-de-tu-van.mp3'],
    'tg-tuvan-B': ['tu-van-tai-cho/ca-3-nguoi-chon-B.mp3'],
    'tg-tuvan-ok':['tu-van-tai-cho/chuc-mung-3-nguoi-to-tu-van.mp3'],

    /* dẫn chuyện */
    luatChoi:  ['khac/luat-choi.mp3'],
    sanSang:   ['khac/da-san-sang-choi-voi-chung-toi-chua.mp3'],
    batDau:    ['khac/nguoi-choi-da-san-sang-va-chung-ta-bat-dau-di-tim-altp.mp3'],
    qua5Cau:   ['khac/ban-da-nhanh-chong-vuot-qua-5-cau-hoi.mp3'],
    camOn:     ['khac/that-la-tuyet-voi-xin-cam-on.mp3'],

    /* Nhạc nền ba chặng — câu 1-5, câu 6-10, câu 11-15.
       Hiện cả ba cùng là một đoạn: chính nhạc hiệu của chương trình, cắt vòng
       lặp liền mạch rồi hạ nhỏ. Có nhạc riêng cho từng chặng thì cứ chép đè
       lên đúng file tương ứng. */
    'nen-1': ['nen/nen-1.mp3'],
    'nen-2': ['nen/nen-2.mp3'],
    'nen-3': ['nen/nen-3.mp3'],
  };

  /* ---------------------------------------------------------------------- */

  const KEY_NEN = 'altp-nhac-nen';

  let on = true;        /* tiếng nói + hiệu ứng */
  let bedOn = true;     /* riêng nhạc nền, tắt được mà tiếng dẫn vẫn chạy */
  try { if (localStorage.getItem(KEY) === '0') on = false; } catch (e) { }
  try { if (localStorage.getItem(KEY_NEN) === '0') bedOn = false; } catch (e) { }

  const V = {
    el: null,          /* thẻ audio đang phát tiếng nói */
    bedEl: null,       /* thẻ audio nhạc nền (khi dùng file) */
    token: 0,          /* đếm lượt, để huỷ callback của tiếng đã bị cắt */
    missing: {},       /* nhớ file nào không có để lần sau khỏi thử lại */
    noi: false,        /* MC có đang nói không, để hạ nhạc nền xuống */
    duckHen: null,
  };

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* Tắt hẳn một thẻ audio. Phải đánh dấu __tat TRƯỚC khi xoá src: xoá src làm
     trình duyệt bắn sự kiện error, không đánh dấu thì game tưởng là thiếu file
     rồi ghi vào sổ đen, và từ đó về sau file ấy không bao giờ được phát nữa. */
  function tatEl(el) {
    if (!el) return;
    el.__tat = true;
    try { el.pause(); el.removeAttribute('src'); el.load(); } catch (e) { }
  }

  /* ===== 1. Tiếng nói ==================================================== */

  /* say(key, done) — phát một file trong nhóm key, xong thì gọi done().
     Trả về hàm huỷ. Không có file, tắt tiếng, hoặc trình duyệt chặn: done()
     vẫn được gọi (sau một nhịp ngắn) để game chạy tiếp. */
  function say(key, done) {
    stopVoice();
    const list = SND[key];
    const cb = typeof done === 'function' ? done : function () { };
    const myToken = ++V.token;
    const fire = () => { if (myToken === V.token) { duck(false); cb(); } };

    if (!on || !list || !list.length) { setTimeout(fire, 60); return () => { }; }

    const avail = list.filter(f => !V.missing[f]);
    if (!avail.length) { setTimeout(fire, 60); return () => { }; }

    duck(true);

    const src = DIR + pick(avail);
    const el = new Audio(src);
    el.preload = 'auto';
    V.el = el;

    el.addEventListener('ended', fire);
    el.addEventListener('error', () => {
      if (el.__tat) return;                       /* mình tự tắt, không phải lỗi */
      V.missing[src.slice(DIR.length)] = 1;
      fire();
    });

    const p = el.play();
    if (p && p.catch) p.catch(() => fire());   /* trình duyệt chặn tự phát */

    return () => { if (myToken === V.token) stopVoice(); };
  }

  /* Phát lần lượt nhiều nhóm. chain(['intro','sanSang'], xong) */
  function chain(keys, done) {
    let i = 0;
    const step = () => {
      if (i >= keys.length) { if (done) done(); return; }
      say(keys[i++], step);
    };
    step();
    return () => { V.token++; stopVoice(); };
  }

  function stopVoice() {
    if (V.el) { tatEl(V.el); V.el = null; }
    duck(false);
  }

  /* Cắt mọi thứ đang phát, kể cả callback đang chờ */
  function cut() { V.token++; stopVoice(); }

  /* Tên nhóm tiếng dẫn vào câu thứ n */
  const danCau = n => 'cau' + n;

  /* ===== 2. Nhạc nền + tiếng hiệu ứng, sinh bằng WebAudio =============== */

  const A = { ctx: null, master: null, bed: null, bedTimer: null, tier: 0 };

  function ctx() {
    if (A.ctx) { if (A.ctx.state === 'suspended' && A.ctx.resume) A.ctx.resume(); return A.ctx; }
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      A.ctx = new C();
      if (A.ctx.state === 'suspended' && A.ctx.resume) A.ctx.resume();
      A.master = A.ctx.createGain();
      A.master.gain.value = 0.9;
      /* Bộ nén cuối đường: nhạc nền và tiếng hiệu ứng chồng nhau dễ vỡ tiếng */
      let out = A.ctx.destination;
      try {
        const comp = A.ctx.createDynamicsCompressor();
        comp.threshold.value = -10; comp.knee.value = 20; comp.ratio.value = 4;
        comp.attack.value = 0.004; comp.release.value = 0.25;
        comp.connect(A.ctx.destination); out = comp;
      } catch (e) { }
      A.master.connect(out);
      return A.ctx;
    } catch (e) { return null; }
  }

  function now() { return A.ctx ? A.ctx.currentTime : 0; }

  /* atk: thời gian nốt lên tiếng. Để mặc định là gõ gọn; đưa số lớn hơn thì
     nốt dâng lên từ từ, dùng cho tiếng chuông của nhạc nền. */
  function tone(freq, t0, dur, type, gain, dest, atk) {
    if (!A.ctx) return;
    const o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), t0 + (atk || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || A.master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function noise(t0, dur, gain, freq) {
    if (!A.ctx) return;
    const n = Math.floor(A.ctx.sampleRate * dur);
    const buf = A.ctx.createBuffer(1, Math.max(1, n), A.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = A.ctx.createBufferSource(); s.buffer = buf;
    const f = A.ctx.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = freq || 900; f.Q.value = 0.8;
    const g = A.ctx.createGain(); g.gain.value = gain;
    s.connect(f); f.connect(g); g.connect(A.master);
    s.start(t0);
  }

  /* --- nhạc nền ba chặng --------------------------------------------------
     tier 1 = câu 1-5, tier 2 = câu 6-10, tier 3 = câu 11-15.

     Chỉ là phát một file mp3 lặp đi lặp lại, không có gì sinh bằng mã. File
     vào và ra đều nhỏ dần chứ không cắt phụt, và tự hạ xuống khi MC đang nói.  */

  /* Ba file nhạc nền đã được hạ sẵn xuống rất khẽ khi cắt, nên số ở đây cao
     hơn ta tưởng; nghe ra loa thì nó vẫn chỉ là một lớp mỏng phía dưới. */
  const BED_TO = 0.40;    /* âm lượng bình thường của nhạc nền */
  const BED_NHO = 0.14;   /* âm lượng khi MC đang nói */

  function bedStart(tier) {
    if (!on || !bedOn) return;
    if (A.tier === tier && V.bedEl) return;

    const list = SND['nen-' + tier];
    if (!list || !list.length) { bedStop(); return; }   /* chưa có file thì im lặng */

    const f = pick(list);
    /* ba chặng đang dùng chung một đoạn nhạc — đang phát đúng file đó rồi thì
       cứ để chạy tiếp, bật lại từ đầu nghe rất lộ */
    if (V.bedEl && V.bedFile === f) { A.tier = tier; return; }

    bedStop();
    if (V.missing[f]) return;

    const el = new Audio(DIR + f);
    el.loop = true;
    el.volume = 0.0001;
    el.addEventListener('error', () => {
      if (el.__tat) return;
      V.missing[f] = 1; V.bedEl = null; A.tier = 0;
    });

    /* Mỗi câu lại bật nhạc từ đầu thì nghe mãi một đoạn mở. Vào ở một chỗ
       bất kỳ trong bài cho đỡ nhàm — nhạc lặp liền mạch nên vào đâu cũng được. */
    el.addEventListener('loadedmetadata', () => {
      if (el.__tat || !isFinite(el.duration)) return;
      try { el.currentTime = Math.random() * Math.max(0, el.duration - 1); } catch (e) { }
    });

    const p = el.play();
    if (p && p.catch) p.catch(() => { V.bedEl = null; A.tier = 0; });

    V.bedEl = el;
    V.bedFile = f;
    A.tier = tier;
    /* vào nhạc trong hai giây rưỡi */
    ramp(el, V.noi ? BED_NHO : BED_TO, 2500);
  }

  function bedStop() {
    A.tier = 0;
    const el = V.bedEl;
    if (!el) return;
    V.bedEl = null; V.bedFile = null;
    ramp(el, 0, 900, () => tatEl(el));
  }

  /* Đưa âm lượng của một thẻ audio về đích trong ms mili giây */
  function ramp(el, dich, ms, xong) {
    if (el.__ramp) clearInterval(el.__ramp);
    const buoc = 40;
    const lan = Math.max(1, Math.round(ms / buoc));
    const dau = el.volume;
    let i = 0;
    el.__ramp = setInterval(() => {
      i++;
      const v = dau + (dich - dau) * (i / lan);
      try { el.volume = Math.max(0, Math.min(1, v)); } catch (e) { }
      if (i >= lan) {
        clearInterval(el.__ramp); el.__ramp = null;
        if (xong) xong();
      }
    }, buoc);
  }

  /* Hạ nhạc nền xuống khi MC nói, nâng lại khi MC dứt lời. Nâng lại có chờ
     một nhịp, nếu không thì giữa hai câu dẫn liền nhau nhạc sẽ phồng lên rồi
     xẹp xuống nghe như sóng. */
  function duck(dangNoi) {
    V.noi = dangNoi;
    if (V.duckHen) { clearTimeout(V.duckHen); V.duckHen = null; }
    if (!V.bedEl) return;
    if (dangNoi) ramp(V.bedEl, BED_NHO, 320);
    else V.duckHen = setTimeout(() => {
      if (V.bedEl && !V.noi) ramp(V.bedEl, BED_TO, 900);
    }, 420);
  }


  /* --- tiếng hiệu ứng ngắn ----------------------------------------------- */
  const FX = {
    /* bấm chọn một phương án */
    chon() { if (!ctx() || !on) return; const t = now(); tone(660, t, 0.09, 'triangle', 0.16); },

    /* chốt đáp án — một tiếng trầm dội xuống, nhạc nền tắt ngay sau đó */
    chot() {
      if (!ctx() || !on) return; const t = now();
      tone(220, t, 0.55, 'triangle', 0.10);
      tone(110, t, 1.0, 'sine', 0.18);
      noise(t, 0.3, 0.035, 260);
    },

    /* khoảng lặng chờ kết quả — một nốt nhỏ lặp, càng cao level càng nhanh */
    dung() {
      if (!ctx() || !on) return; const t = now();
      for (let i = 0; i < 5; i++) tone(523.25 * (1 + i * 0.26), t + i * 0.085, 0.3, 'triangle', 0.12);
      tone(1046.5, t + 0.44, 1.1, 'sine', 0.13);
    },

    sai() {
      if (!ctx() || !on) return; const t = now();
      tone(196, t, 0.8, 'triangle', 0.13);
      tone(146.83, t + 0.12, 1.0, 'triangle', 0.12);
      tone(98, t, 1.2, 'sine', 0.14);
      noise(t, 0.4, 0.035, 200);
    },

    /* vượt mốc an toàn */
    moc() {
      if (!ctx() || !on) return; const t = now();
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(f, t + i * 0.1, 0.5, 'triangle', 0.15));
    },

    /* chốt ván: thắng 150 triệu */
    thang() {
      if (!ctx() || !on) return; const t = now();
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98].forEach((f, i) =>
        tone(f, t + i * 0.11, 0.9, 'triangle', 0.16));
      tone(130.81, t, 2.2, 'sine', 0.16);
    },

    /* tiếng đồng hồ 30 giây khi gọi điện thoại */
    tick() { if (!ctx() || !on) return; const t = now(); tone(1046.5, t, 0.07, 'sine', 0.085); },

    /* tiếng gạt bỏ hai phương án sai của 50:50 */
    bay() {
      if (!ctx() || !on) return; const t = now();
      noise(t, 0.3, 0.07, 1400);
      tone(880, t, 0.22, 'triangle', 0.1);
      tone(440, t + 0.1, 0.3, 'triangle', 0.09);
    },
  };

  /* ===== Bật tắt ========================================================= */

  function toggle() {
    on = !on;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) { }
    if (!on) { cut(); bedStop(); }
    return on;
  }
  function isOn() { return on; }

  /* Tắt riêng nhạc nền, tiếng dẫn vẫn chạy bình thường */
  function toggleBed(tier) {
    bedOn = !bedOn;
    try { localStorage.setItem(KEY_NEN, bedOn ? '1' : '0'); } catch (e) { }
    if (!bedOn) bedStop();
    else if (tier) bedStart(tier);
    return bedOn;
  }
  function isBedOn() { return bedOn; }

  /* Gọi một lần ở cú chạm đầu tiên — trình duyệt chỉ cho mở WebAudio sau đó */
  function unlock() { ctx(); }

  return {
    say, chain, cut, stopVoice, danCau,
    bedStart, bedStop, toggleBed, isBedOn,
    FX, toggle, isOn, unlock, SND,
  };
})();
