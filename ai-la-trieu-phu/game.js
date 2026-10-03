/* ============================================================================
   AI LÀ TRIỆU PHÚ — luật chơi

   Mười lăm câu, thang tiền và hai mốc an toàn đúng theo bản phát trên VTV3
   quãng 2015-2016. Bốn quyền trợ giúp, mỗi quyền dùng một lần trong cả ván.

   Trả lời sai thì rơi về mốc gần nhất đã vượt qua:
     sai ở câu 1-5   -> ra về tay trắng
     sai ở câu 6-10  -> giữ 2.000.000
     sai ở câu 11-15 -> giữ 22.000.000
   Dừng cuộc chơi lúc nào cũng được, giữ nguyên số tiền của câu vừa trả lời đúng.

   Chốt đáp án phải bấm HAI LẦN vào cùng một phương án (hoặc bấm rồi Enter).
   Lần đầu là chọn, lần hai mới là "câu trả lời cuối cùng" — y như MC hỏi lại.
   ========================================================================== */
(function () {
  'use strict';

  /* ===== Hằng số ======================================================== */

  const LADDER = [
    200000, 400000, 600000, 1000000, 2000000,
    3000000, 6000000, 10000000, 14000000, 22000000,
    30000000, 40000000, 60000000, 85000000, 150000000,
  ];
  const MOC = [5, 10];            /* câu 5 và câu 10 là mốc an toàn */

  /* Tư vấn tại chỗ chỉ có từ câu này trở đi. Năm câu đầu chỉ có ba quyền kia. */
  const TU_VAN_TU_CAU = 6;
  const KY_TU = ['A', 'B', 'C', 'D'];

  /* Thời gian cho mỗi câu, tính bằng GIÂY, chia theo ba chặng.
     Đặt cả ba về 0 là tắt hẳn đồng hồ. Đồng hồ dừng trong lúc dùng trợ giúp,
     và dừng hẳn khi đã chốt đáp án. */
  const GIO = { 5: 30, 10: 45, 15: 60 };

  /* Khoảng lặng trước khi công bố kết quả, tính bằng mili giây.
     Càng lên cao MC càng câu giờ — chỗ này chính là chỗ tim đập. */
  const CHO = { 4: 900, 9: 1900, 12: 2900, 15: 4200 };

  /* Độ tin cậy của người trợ giúp theo chặng câu hỏi */
  const TIN = {
    dt: [[5, .92], [10, .72], [13, .50], [15, .35]],   /* người thân */
    kg: [[5, .84], [10, .62], [13, .40], [15, .32]],   /* tỉ lệ khán giả chọn đúng */
    tv: [[5, .90], [10, .70], [13, .52], [15, .40]],   /* mỗi thành viên tổ tư vấn */
  };

  const TEN_THAN = ['chị Hà', 'anh Tuấn', 'cô Lan', 'chú Bình', 'bạn Nam'];
  const TEN_TUVAN = [
    ['Khán giả số 1', 'giáo viên cấp ba'],
    ['Khán giả số 2', 'sinh viên năm cuối'],
    ['Khán giả số 3', 'kỹ sư xây dựng'],
    ['Khán giả số 4', 'hướng dẫn viên du lịch'],
    ['Khán giả số 5', 'nhân viên thư viện'],
    ['Khán giả số 6', 'bác sĩ nội trú'],
  ];

  /* ===== Trạng thái ===================================================== */

  const S = {
    level: 1,
    cau: null,          /* câu hỏi hiện tại */
    con: [0, 1, 2, 3],  /* các phương án còn lại sau 50:50 */
    chon: -1,           /* đang chọn, chưa chốt */
    khoa: true,         /* true = chưa cho bấm */
    xong: false,
    daDung: { f: false, dt: false, kg: false, tv: false },
    tuvanDung: false,   /* tổ tư vấn vừa rồi có đúng không */
    vuaTuVan: false,
    daRa: {},           /* câu đã dùng trong ván này, theo level */
    hen: [],            /* mọi setTimeout/setInterval đang chạy */
    giay: 0,            /* số giây còn lại của câu hiện tại */
    giayTong: 0,
    gioId: null,
  };

  /* ===== Tiện ích ======================================================= */

  const $ = id => document.getElementById(id);
  const rnd = n => Math.floor(Math.random() * n);
  const pick = a => a[rnd(a.length)];
  const tien = n => n.toLocaleString('vi-VN');

  function hen(fn, ms) { const t = setTimeout(fn, ms); S.hen.push(t); return t; }
  function lap(fn, ms) { const t = setInterval(fn, ms); S.hen.push(t); return t; }
  function donHen() { S.hen.forEach(t => { clearTimeout(t); clearInterval(t); }); S.hen = []; }

  /* Lấy độ tin cậy ứng với level hiện tại */
  function tin(loai) {
    const bang = TIN[loai];
    for (let i = 0; i < bang.length; i++) if (S.level <= bang[i][0]) return bang[i][1];
    return bang[bang.length - 1][1];
  }

  function cho() {
    for (const k of [4, 9, 12, 15]) if (S.level <= k) return CHO[k];
    return CHO[15];
  }

  function chang() { return S.level <= 5 ? 1 : S.level <= 10 ? 2 : 3; }

  /* Số giây cho câu hiện tại, 0 nghĩa là không đếm giờ */
  function giayCho() {
    for (const k of [5, 10, 15]) if (S.level <= k) return GIO[k] || 0;
    return GIO[15] || 0;
  }

  /* Số tiền giữ được nếu trả lời sai ngay bây giờ */
  function tienRoi() {
    let m = 0;
    for (const k of MOC) if (S.level > k) m = LADDER[k - 1];
    return m;
  }

  /* Số tiền đang giữ (đã trả lời đúng tới câu level-1) */
  function tienGiu() { return S.level > 1 ? LADDER[S.level - 2] : 0; }

  const el = {
    man: { intro: $('s-intro'), ready: $('s-ready'), play: $('s-play'), end: $('s-end') },
    host: $('host'), stage: $('stage'), qtext: $('qtext'), answers: $('answers'),
    ladder: $('ladder'),
    ll: { f: $('ll-5050'), dt: $('ll-dt'), kg: $('ll-kg'), tv: $('ll-tv') },
    btnStop: $('btn-stop'), btnQuit: $('btn-quit'), btnSound: $('btn-sound'), btnBed: $('btn-bed'),
    timer: $('timer'), timerN: $('timer-n'), timerFg: document.querySelector('.t-fg'),
    endTitle: $('end-title'), endSum: $('end-sum'), endNote: $('end-note'),
  };
  const nut = [...el.answers.querySelectorAll('.ans')];

  function man(ten) {
    Object.keys(el.man).forEach(k => el.man[k].classList.toggle('on', k === ten));
    el.btnQuit.hidden = (ten !== 'play');
  }

  function noi(html) { el.host.innerHTML = html || ''; }

  function the(html) {
    el.stage.innerHTML = html === null || html === undefined
      ? '<p class="host" id="host"></p>'
      : html;
    if (html === null || html === undefined) el.host = $('host');
  }

  function donThe() { el.stage.innerHTML = '<p class="host" id="host"></p>'; el.host = $('host'); }

  /* ===== Thang tiền ===================================================== */

  function veThang() {
    /* Vạch vàng đặc = câu vừa trả lời đúng, tức số tiền đang có.
       Vạch nhấp nháy = câu đang chơi, chưa phải tiền của mình. */
    const daCo = S.level - 1;
    let h = '';
    for (let i = LADDER.length; i >= 1; i--) {
      const cls = ['lv'];
      if (MOC.indexOf(i) >= 0 || i === 15) cls.push('moc');
      if (i < daCo) cls.push('done');
      if (i === daCo) cls.push('won');
      if (i === S.level) cls.push('now');
      h += '<div class="' + cls.join(' ') + '"><span class="n">' + i + '</span>' +
        '<span class="v">' + tien(LADDER[i - 1]) + '</span></div>';
    }
    el.ladder.innerHTML = h;
    /* Trên điện thoại thang nằm ngang, cuộn sao cho câu hiện tại nhìn thấy */
    const now = el.ladder.querySelector('.lv.now');
    if (now && now.scrollIntoView) {
      try { now.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); } catch (e) { }
    }
  }

  /* ===== Đồng hồ đếm ngược ============================================== */

  const CHU_VI = 2 * Math.PI * 25;   /* bán kính vòng tròn trong index.html */

  function moGio() {
    dongGio();
    const t = giayCho();
    if (!t) { el.timer.hidden = true; return; }
    S.giayTong = t;
    S.giay = t;
    el.timer.hidden = false;
    el.timer.classList.remove('nghi');
    veGio();
    S.gioId = lap(nhipGio, 1000);
  }

  function nhipGio() {
    if (S.xong) { dongGio(); return; }
    /* đang chạy trợ giúp thì treo đồng hồ lại, không trừ giây */
    if (S.khoa) { el.timer.classList.add('nghi'); return; }
    el.timer.classList.remove('nghi');
    S.giay--;
    veGio();
    if (S.giay > 0 && S.giay <= 5) AU.FX.tick();
    if (S.giay <= 0) { dongGio(); hetGio(); }
  }

  function veGio() {
    const con = Math.max(0, S.giay);
    el.timerN.textContent = con;
    if (el.timerFg) el.timerFg.style.strokeDashoffset = CHU_VI * (1 - con / S.giayTong);
    el.timer.classList.toggle('hot', con <= 10);
  }

  function dongGio() {
    if (S.gioId) { clearInterval(S.gioId); S.gioId = null; }
    el.timer.classList.remove('nghi');
  }

  function hetGio() {
    S.khoa = true;
    nut.forEach(b => b.disabled = true);
    el.btnStop.disabled = true;
    Object.keys(el.ll).forEach(k => el.ll[k].disabled = true);

    AU.cut(); AU.bedStop(); AU.FX.sai();
    if (S.chon >= 0) nut[S.chon].classList.remove('sel');
    nut[S.cau.c].classList.add('ok');
    noi('Hết giờ rồi.');
    AU.say('sai-' + KY_TU[S.cau.c], () => ketThuc('het-gio'));
  }

  /* ===== Bắt đầu ván mới ================================================ */

  function vanMoi() {
    donHen(); dongGio(); AU.cut(); AU.bedStop();
    S.level = 1; S.xong = false; S.daRa = {};
    S.daDung = { f: false, dt: false, kg: false, tv: false };
    Object.keys(el.ll).forEach(k => {
      el.ll[k].disabled = false;
      el.ll[k].classList.remove('used', 'vuamo');
    });
    man('play');
    veThang();
    raCau();
  }

  /* ===== Ra câu hỏi ===================================================== */

  function raCau() {
    const kho = QUESTIONS[S.level] || [];
    if (!kho.length) { ketThuc('loi'); return; }

    /* tránh lặp câu trong cùng một ván */
    const daDung = S.daRa[S.level] || [];
    let con = kho.filter((_, i) => daDung.indexOf(i) < 0);
    if (!con.length) { S.daRa[S.level] = []; con = kho; }
    const idx = kho.indexOf(pick(con));
    S.daRa[S.level] = (S.daRa[S.level] || []).concat([idx]);

    S.cau = kho[idx];
    S.con = [0, 1, 2, 3];
    S.chon = -1;
    S.khoa = true;
    S.vuaTuVan = false;

    donThe();
    veThang();

    /* dọn trạng thái cũ của bốn nút */
    nut.forEach(b => {
      b.className = 'ans';
      b.disabled = true;
      b.style.visibility = 'hidden';
    });
    el.qtext.textContent = '';
    el.btnStop.disabled = true;

    const dan = AU.danCau(S.level);
    noi(S.level === 1 ? 'Câu hỏi đầu tiên.' : 'Câu hỏi số ' + S.level + '.');

    AU.say(dan, function () {
      /* hiện câu hỏi, rồi lần lượt bốn phương án */
      el.qtext.textContent = S.cau.q;
      noi('');
      S.cau.a.forEach((t, i) => {
        hen(() => {
          const b = nut[i];
          b.querySelector('.t').textContent = t;
          b.style.visibility = 'visible';
        }, 160 * (i + 1));
      });
      hen(() => {
        nut.forEach((b, i) => { b.disabled = S.con.indexOf(i) < 0; });
        S.khoa = false;
        el.btnStop.disabled = false;
        AU.bedStart(chang());
        capNhatTroGiup();
        moGio();
        /* đúng câu mở khoá tư vấn tại chỗ thì nháy sáng nút cho người chơi thấy */
        if (S.level === TU_VAN_TU_CAU && !S.daDung.tv) {
          el.ll.tv.classList.add('vuamo');
          hen(() => el.ll.tv.classList.remove('vuamo'), 2400);
        }
      }, 160 * 5);
    });
  }

  /* ===== Chọn và chốt =================================================== */

  function bam(i) {
    if (S.khoa || S.xong) return;
    if (S.con.indexOf(i) < 0) return;

    if (S.chon === i) { chot(i); return; }

    S.chon = i;
    nut.forEach((b, k) => b.classList.toggle('sel', k === i));
    AU.FX.chon();
    noi('Bấm <b>' + KY_TU[i] + '</b> thêm một lần nữa — hoặc nhấn Enter — để chốt.');
  }

  function chot(i) {
    S.khoa = true;
    S.xong = false;
    dongGio();
    nut.forEach(b => b.disabled = true);
    el.btnStop.disabled = true;
    Object.keys(el.ll).forEach(k => el.ll[k].disabled = true);

    AU.cut();
    AU.bedStop();
    AU.FX.chot();
    noi('Đó là câu trả lời cuối cùng của bạn chứ?');

    nut[i].classList.add('blink');

    hen(() => {
      nut[i].classList.remove('blink');
      congBo(i);
    }, cho());
  }

  /* ===== Công bố kết quả ================================================ */

  function congBo(i) {
    const dung = S.cau.c;
    const kyTu = KY_TU[dung];

    if (i === dung) {
      nut[i].classList.remove('sel');
      nut[i].classList.add('ok');
      AU.FX.dung();
      noi('');

      /* nếu vừa nhờ tổ tư vấn và họ chỉ đúng, cảm ơn họ trước */
      const truoc = (S.vuaTuVan && S.tuvanDung) ? ['tg-tuvan-ok'] : [];
      /* quá nửa số lần dùng câu có nhắc tên phương án cho sinh động */
      const key = Math.random() < 0.55 ? 'dung-' + kyTu : 'dung';

      AU.chain(truoc.concat([key]), () => qua());
    } else {
      nut[i].classList.remove('sel');
      nut[i].classList.add('bad');
      nut[dung].classList.add('ok');
      AU.FX.sai();
      noi('');
      AU.say('sai-' + kyTu, () => ketThuc('sai'));
    }
  }

  /* Trả lời đúng -> lên câu tiếp */
  function qua() {
    if (S.level === 15) { ketThuc('thang'); return; }

    const vuaQua = S.level;
    S.level++;

    if (vuaQua === 5) {
      AU.FX.moc();
      veThang();
      noi('Bạn đã vượt qua mốc <b>' + tien(LADDER[4]) + '</b> đồng.' +
        (S.daDung.tv ? '' : '<br>Từ câu số ' + TU_VAN_TU_CAU +
          ' bạn có thêm quyền <b>tư vấn tại chỗ</b>.'));
      AU.chain(['qua5Cau', 'xongCau5'], () => raCau());
      return;
    }
    if (vuaQua === 10) {
      AU.FX.moc();
      veThang();
      noi('Bạn đã chắc chắn mang về <b>' + tien(LADDER[9]) + '</b> đồng.');
      hen(() => raCau(), 2400);
      return;
    }
    hen(() => raCau(), 900);
  }

  /* ===== Kết thúc ván =================================================== */

  function ketThuc(kieu) {
    S.xong = true;
    donHen(); dongGio(); AU.bedStop();
    el.timer.hidden = true;

    let title, sum, note;
    if (kieu === 'thang') {
      sum = tien(LADDER[14]) + ' đồng';
      title = 'Xin chúc mừng! Bạn đã trả lời đúng cả mười lăm câu hỏi.';
      note = 'Bạn là triệu phú của chương trình hôm nay.';
      AU.FX.thang();
      AU.say('camOn');
    } else if (kieu === 'dung-lai') {
      sum = tien(tienGiu()) + ' đồng';
      title = 'Bạn đã dừng cuộc chơi ở câu số ' + S.level + '.';
      note = 'Đáp án đúng của câu này là ' + KY_TU[S.cau.c] + ': ' + S.cau.a[S.cau.c] + '.';
      AU.FX.moc();
      AU.say('camOn');
    } else if (kieu === 'het-gio') {
      const giu = tienRoi();
      sum = tien(giu) + ' đồng';
      title = 'Hết giờ ở câu số ' + S.level + '.';
      note = 'Đáp án đúng là ' + KY_TU[S.cau.c] + ': ' + S.cau.a[S.cau.c] + '. ' +
        (giu > 0 ? 'Nhờ đã qua mốc an toàn, bạn vẫn mang về số tiền này.'
                 : 'Chưa qua mốc an toàn nào nên bạn ra về tay trắng.');
    } else if (kieu === 'loi') {
      sum = '—';
      title = 'Chưa có câu hỏi nào ở câu số ' + S.level + '.';
      note = 'Mở file questions.js và thêm câu cho level ' + S.level + ' là chơi tiếp được.';
    } else {
      const giu = tienRoi();
      sum = tien(giu) + ' đồng';
      title = 'Rất tiếc, bạn đã trả lời sai ở câu số ' + S.level + '.';
      note = giu > 0
        ? 'Nhờ đã vượt qua mốc an toàn, bạn vẫn mang về số tiền này.'
        : 'Chưa qua được mốc an toàn nào nên bạn ra về tay trắng. Chơi lại nhé.';
    }

    el.endTitle.textContent = title;
    el.endSum.textContent = sum;
    el.endNote.textContent = note;
    hen(() => man('end'), (kieu === 'sai' || kieu === 'het-gio') ? 1200 : 600);
  }

  /* ===== Trợ giúp ======================================================= */

  function chuaMoTuVan() { return S.level < TU_VAN_TU_CAU; }

  function capNhatTroGiup() {
    Object.keys(el.ll).forEach(k => {
      const khoa = (k === 'tv') && chuaMoTuVan();
      el.ll[k].disabled = S.daDung[k] || S.khoa || khoa;
      el.ll[k].classList.toggle('used', S.daDung[k]);
      el.ll[k].classList.toggle('khoa', khoa);
    });
    /* nhãn dưới nút nói luôn khi nào mới dùng được, khỏi phải đoán */
    const lb = el.ll.tv.querySelector('.lb');
    if (lb) lb.textContent = chuaMoTuVan() ? 'Từ câu ' + TU_VAN_TU_CAU : 'Tư vấn';
    el.ll.tv.title = chuaMoTuVan()
      ? 'Tư vấn tại chỗ — chỉ có từ câu số ' + TU_VAN_TU_CAU
      : 'Tư vấn tại chỗ';
  }

  function dungTroGiup(k) {
    if (S.khoa || S.xong || S.daDung[k]) return false;
    if (k === 'tv' && chuaMoTuVan()) return false;
    S.daDung[k] = true;
    S.khoa = true;                       /* khoá tạm trong lúc trợ giúp chạy */
    nut.forEach(b => b.disabled = true);
    el.btnStop.disabled = true;
    capNhatTroGiup();
    AU.cut();
    return true;
  }

  function moKhoa() {
    if (S.xong) return;
    S.khoa = false;
    nut.forEach((b, i) => b.disabled = S.con.indexOf(i) < 0);
    el.btnStop.disabled = false;
    capNhatTroGiup();
  }

  /* Các phương án SAI còn lại */
  function saiCon() { return S.con.filter(i => i !== S.cau.c); }

  /* --- 50:50 ------------------------------------------------------------- */
  function tg5050() {
    if (!dungTroGiup('f')) return;
    noi('Năm mươi, năm mươi.');

    const sai = saiCon();
    const giu = pick(sai);                        /* giữ lại một phương án sai */
    const bo = sai.filter(i => i !== giu);
    S.con = [S.cau.c, giu].sort((a, b) => a - b);

    AU.say('tg-5050', () => {
      AU.FX.bay();
      bo.forEach(i => {
        nut[i].classList.add('gone');
        if (S.chon === i) { S.chon = -1; nut[i].classList.remove('sel'); }
      });
      hen(() => { noi(''); moKhoa(); }, 700);
    });
  }

  /* --- Gọi điện thoại cho người thân ------------------------------------- */
  function tgDienThoai() {
    if (!dungTroGiup('dt')) return;
    const ten = pick(TEN_THAN);

    the('<div class="card"><h3>Gọi điện thoại cho người thân</h3>' +
      '<p class="host" style="margin:0 0 10px">Đang nối máy với <b>' + ten + '</b>…</p>' +
      '<div class="clock" id="dt-clock">30</div>' +
      '<p class="host" style="margin:6px 0 0;font-size:12.5px;opacity:.75">' +
      'Ba mươi giây bắt đầu.</p>' +
      '<div id="dt-ans"></div></div>');

    AU.chain(['tg-dt', 'tg-dt-30s'], () => {
      const o = $('dt-clock');
      if (!o) return;
      let t = 30;
      /* người thân lên tiếng ở một thời điểm bất kỳ giữa chừng */
      const noiLuc = 12 + rnd(11);
      const id = lap(() => {
        t--;
        if (o) { o.textContent = t; o.classList.toggle('hot', t <= 10); }
        AU.FX.tick();
        if (t <= noiLuc || t <= 0) {
          clearInterval(id);
          traLoiDienThoai(ten);
        }
      }, 1000);
    });
  }

  function traLoiDienThoai(ten) {
    const o = $('dt-ans');
    const dung = Math.random() < tin('dt');
    const sai = saiCon();
    let i, cau;

    if (!dung && S.level >= 11 && Math.random() < 0.22) {
      cau = '<b>' + ten + ':</b> Câu này mình chịu thật, không dám đoán bừa đâu.';
      i = -1;
    } else {
      i = dung ? S.cau.c : (sai.length ? pick(sai) : S.cau.c);
      const tuTin = dung ? (S.level <= 8 ? 0.8 : 0.5) : 0.35;
      if (Math.random() < tuTin) {
        cau = '<b>' + ten + ':</b> Chắc chắn là <b>' + KY_TU[i] + '</b>. Cứ chốt đi!';
      } else if (Math.random() < 0.6) {
        cau = '<b>' + ten + ':</b> Mình nghĩ là <b>' + KY_TU[i] + '</b>, nhưng không chắc lắm đâu nhé.';
      } else {
        cau = '<b>' + ten + ':</b> Cái này mình cũng mơ hồ… thử <b>' + KY_TU[i] + '</b> xem sao.';
      }
    }

    if (o) {
      o.innerHTML = '<div class="people" style="margin-top:12px"><div class="person">' +
        '<span class="av">&#9742;</span>' +
        '<span class="nm">' + cau + '</span>' +
        '<span class="pk">' + (i < 0 ? '?' : KY_TU[i]) + '</span></div></div>';
    }
    const c = $('dt-clock'); if (c) c.classList.remove('hot');
    hen(() => { donThe(); moKhoa(); }, 3800);
  }

  /* --- Hỏi ý kiến khán giả trong trường quay ----------------------------- */
  function tgKhanGia() {
    if (!dungTroGiup('kg')) return;
    noi('');

    const con = S.con.slice();
    const pDung = tin('kg');
    /* tỉ lệ cho đáp án đúng, dao động quanh độ tin cậy của chặng */
    let v = {};
    let phanDung = Math.max(0.22, Math.min(0.95, pDung + (Math.random() - 0.5) * 0.22));
    if (con.length === 2) phanDung = Math.max(0.35, Math.min(0.9, phanDung + 0.12));

    /* Thỉnh thoảng khán giả cũng lạc: ở chặng cuối có khi họ dồn vào một
       phương án sai. Không có cú này thì trợ giúp khán giả hoá ra đáp án. */
    let dinhDanh = S.cau.c;
    if (S.level >= 11 && Math.random() < 0.2 && con.length > 2) {
      dinhDanh = pick(saiCon());
      phanDung = 0.3 + Math.random() * 0.14;
    }

    v[dinhDanh] = Math.round(phanDung * 100);
    const khac = con.filter(i => i !== dinhDanh);
    let conLai = 100 - v[dinhDanh];
    khac.forEach((i, k) => {
      if (k === khac.length - 1) { v[i] = conLai; }
      else { const x = rnd(conLai + 1); v[i] = x; conLai -= x; }
    });

    let h = '<div class="card"><h3>Ý kiến khán giả trong trường quay</h3><div class="bars">';
    for (let i = 0; i < 4; i++) {
      const pct = con.indexOf(i) >= 0 ? (v[i] || 0) : 0;
      h += '<div class="bar-col">' +
        '<div class="bar-wrap"><div class="bar" data-pct="' + pct + '"></div></div>' +
        '<div class="bar-pct" data-txt="' + (con.indexOf(i) >= 0 ? pct + '%' : '—') + '">&nbsp;</div>' +
        '<div class="bar-key">' + KY_TU[i] + '</div></div>';
    }
    h += '</div></div>';
    the(h);

    AU.say('tg-khangia', () => {
      el.stage.querySelectorAll('.bar').forEach(b => {
        b.style.height = Math.max(2, +b.dataset.pct) + '%';
      });
      /* con số chỉ hiện cùng lúc cột dựng lên, hiện trước là lộ đáp án */
      hen(() => el.stage.querySelectorAll('.bar-pct')
        .forEach(o => { o.textContent = o.dataset.txt; }), 900);
      hen(() => { donThe(); moKhoa(); }, 4200);
    });
  }

  /* --- Tư vấn tại chỗ ---------------------------------------------------- */
  function tgTuVan() {
    if (!dungTroGiup('tv')) return;
    noi('');
    S.vuaTuVan = true;

    /* ba người, mỗi người đoán độc lập */
    const ds = TEN_TUVAN.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    const sai = saiCon();
    const p = tin('tv');
    const chonCua = ds.map(() => (Math.random() < p || !sai.length) ? S.cau.c : pick(sai));

    const soDung = chonCua.filter(i => i === S.cau.c).length;
    S.tuvanDung = soDung >= 2;

    the('<div class="card"><h3>Tổ tư vấn tại chỗ</h3><div class="people" id="tv-list"></div></div>');

    AU.say('tg-tuvan', () => {
      const box = $('tv-list');
      ds.forEach((ng, k) => {
        hen(() => {
          if (!box) return;
          const i = chonCua[k];
          const d = document.createElement('div');
          d.className = 'person';
          d.innerHTML = '<span class="av">&#9787;</span>' +
            '<span class="nm"><b class="who">' + ng[0] + '</b>' + ng[1] + ' — ' + loiTuVan(i, chonCua[k] === S.cau.c) + '</span>' +
            '<span class="pk">' + KY_TU[i] + '</span>';
          box.appendChild(d);
        }, 1200 * k);
      });

      hen(() => {
        /* cả ba cùng chọn B thì có đúng câu dẫn cho trường hợp này */
        const dongY = chonCua.every(i => i === chonCua[0]);
        const sauDo = () => hen(() => { donThe(); moKhoa(); }, 1800);
        if (dongY && chonCua[0] === 1) AU.say('tg-tuvan-B', sauDo);
        else sauDo();
      }, 1200 * 3 + 300);
    });
  }

  function loiTuVan(i, dung) {
    const chac = ['chắc chắn phương án này', 'không phải nghĩ nhiều', 'tôi biết câu này'];
    const vua = ['tôi nghiêng về phương án này', 'theo tôi thì là nó', 'tôi đoán vậy'];
    const yeu = ['tôi không chắc lắm', 'chỉ là cảm giác thôi', 'tôi đoán liều'];
    const r = Math.random();
    if (dung && r < 0.55) return pick(chac);
    if (r < 0.75) return pick(vua);
    return pick(yeu);
  }

  /* ===== Dừng cuộc chơi ================================================= */

  function dungLai() {
    if (S.khoa || S.xong) return;
    const giu = tienGiu();
    const ok = confirm('Dừng cuộc chơi ở câu ' + S.level + ' và mang về ' + tien(giu) + ' đồng?');
    if (!ok) return;
    S.khoa = true;
    dongGio();
    nut.forEach(b => b.disabled = true);
    nut[S.cau.c].classList.add('ok');
    ketThuc('dung-lai');
  }

  /* ===== Gắn sự kiện ==================================================== */

  nut.forEach(b => b.addEventListener('click', () => bam(+b.dataset.i)));

  el.ll.f.addEventListener('click', tg5050);
  el.ll.dt.addEventListener('click', tgDienThoai);
  el.ll.kg.addEventListener('click', tgKhanGia);
  el.ll.tv.addEventListener('click', tgTuVan);
  el.btnStop.addEventListener('click', dungLai);

  $('btn-start').addEventListener('click', () => {
    AU.unlock();
    man('ready');
    AU.chain(['intro', 'sanSang']);
  });

  $('btn-rules').addEventListener('click', () => {
    AU.unlock();
    const b = $('btn-rules');
    b.disabled = true; b.textContent = 'Đang phát luật chơi…';
    AU.say('luatChoi', () => { b.disabled = false; b.textContent = 'Nghe luật chơi'; });
  });

  $('btn-ready').addEventListener('click', () => {
    AU.cut();
    AU.say('batDau', () => vanMoi());
    man('play');
    veThang();
    donThe();
    nut.forEach(b => { b.className = 'ans'; b.disabled = true; b.style.visibility = 'hidden'; });
    el.qtext.textContent = '';
    el.timer.hidden = true;
    noi('Và chúng ta bắt đầu đi tìm Ai Là Triệu Phú.');
  });

  $('btn-again').addEventListener('click', () => { AU.cut(); vanMoi(); });

  el.btnQuit.addEventListener('click', () => {
    donHen(); dongGio(); AU.cut(); AU.bedStop();
    el.timer.hidden = true;
    S.xong = true;
    man('intro');
  });

  function veNutTieng() {
    const a = AU.isOn(), b = AU.isBedOn();
    el.btnSound.textContent = 'Tiếng: ' + (a ? 'bật' : 'tắt');
    el.btnSound.classList.toggle('tat', !a);
    el.btnBed.textContent = 'Nhạc nền: ' + (b ? 'bật' : 'tắt');
    el.btnBed.classList.toggle('tat', !b);
  }

  el.btnSound.addEventListener('click', () => { AU.toggle(); veNutTieng(); });

  el.btnBed.addEventListener('click', () => {
    /* bật lại giữa ván thì vào đúng chặng đang chơi */
    const dangChoi = el.man.play.classList.contains('on') && !S.xong && !S.khoa;
    AU.toggleBed(dangChoi ? chang() : 0);
    veNutTieng();
  });

  veNutTieng();

  /* Bàn phím: A B C D hoặc 1 2 3 4 để chọn, Enter để chốt */
  document.addEventListener('keydown', e => {
    if (!el.man.play.classList.contains('on')) return;
    const k = e.key.toUpperCase();
    const i = KY_TU.indexOf(k) >= 0 ? KY_TU.indexOf(k) : '1234'.indexOf(k);
    if (i >= 0) { e.preventDefault(); bam(i); return; }
    if (e.key === 'Enter' && S.chon >= 0 && !S.khoa) { e.preventDefault(); chot(S.chon); }
  });

  /* Mở WebAudio ở cú chạm đầu tiên, trình duyệt nào cũng đòi điều này */
  ['pointerdown', 'keydown'].forEach(ev =>
    document.addEventListener(ev, function once() {
      AU.unlock();
      document.removeEventListener(ev, once);
    }, { once: true }));

  veThang();
})();
