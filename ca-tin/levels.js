/* ============================================================================
   CẢ TIN — bộ sinh luật
   ----------------------------------------------------------------------------
   Mỗi ván sinh ra một bộ sáu bảng luật KHÁC NHAU, nên chơi lại không thể
   dựa vào trí nhớ. Nhưng luật không sinh bừa: KIỂU NÓI DỐI là phần đã thiết kế
   sẵn, chỉ có thuộc tính cụ thể mới bốc ngẫu nhiên. Nhờ vậy độ khó và cái cảm
   giác "à ra thế" giữ nguyên qua mọi ván.

   Ba thứ ngẫu nhiên mỗi ván:
     1. Thuộc tính trong từng luật  (lam + số chẵn / tam giác + số lớn hơn 5 ...)
     2. Kiểu nói dối của từng màn   (bốc trong bậc khó của màn đó)
     3. Màn NÓI THẬT rơi vào đâu    (đâu đó từ màn 3 đến màn 6)

   Mỗi ván có một MÃ VÁN bốn ký tự. Cùng mã thì cùng bộ luật, nên gửi mã cho
   bạn bè là họ gặp đúng sáu bảng luật của mình. Mở bằng ?van=XXXX cũng được.
   ========================================================================== */

/* ---------- bộ sinh số ngẫu nhiên có hạt giống (mulberry32) ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* Bảng chữ bỏ 0/O/1/I để đọc qua điện thoại không nhầm */
const SEED_ALPHA = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function newSeedCode() {
  let s = '';
  for (let i = 0; i < 4; i++) s += SEED_ALPHA[Math.floor(Math.random() * SEED_ALPHA.length)];
  return s;
}
function normSeedCode(c) {
  c = String(c || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (c.length !== 4) return null;
  for (let i = 0; i < 4; i++) if (SEED_ALPHA.indexOf(c[i]) < 0) return null;
  return c;
}
function seedToInt(c) {
  let n = 0;
  for (let i = 0; i < c.length; i++) n = n * 32 + SEED_ALPHA.indexOf(c[i]);
  return (n + 0x9E3779B9) | 0;
}

/* ---------- thuộc tính của ô ---------- */
const AXES = { mau: 'màu sắc', hinh: 'hình dạng', so: 'con số' };

/* Mỗi "điều kiện" có dạng khẳng định và dạng phủ định viết sẵn, để câu tiếng
   Việt lúc nào cũng đọc xuôi — không ghép máy móc kiểu "không phải số chẵn". */
const ATOMS = [
  { ax: 'mau',  pos: 'màu lam',   neg: 'không phải màu lam',   test: t => t.color === 'lam' },
  { ax: 'mau',  pos: 'màu đỏ',    neg: 'không phải màu đỏ',    test: t => t.color === 'đỏ' },
  { ax: 'mau',  pos: 'màu vàng',  neg: 'không phải màu vàng',  test: t => t.color === 'vàng' },

  { ax: 'hinh', pos: 'hình tròn',     neg: 'không phải hình tròn',     test: t => t.shape === 'tròn' },
  { ax: 'hinh', pos: 'hình vuông',    neg: 'không phải hình vuông',    test: t => t.shape === 'vuông' },
  { ax: 'hinh', pos: 'hình tam giác', neg: 'không phải hình tam giác', test: t => t.shape === 'tam giác' },

  { ax: 'so', pos: 'mang số chẵn',           neg: 'mang số lẻ',                     test: t => t.num % 2 === 0 },
  { ax: 'so', pos: 'mang số lẻ',             neg: 'mang số chẵn',                   test: t => t.num % 2 === 1 },
  { ax: 'so', pos: 'mang số lớn hơn 5',      neg: 'mang số từ 5 trở xuống',         test: t => t.num > 5 },
  { ax: 'so', pos: 'mang số nhỏ hơn 5',      neg: 'mang số từ 5 trở lên',           test: t => t.num < 5 },
  { ax: 'so', pos: 'mang số chia hết cho 3', neg: 'mang số không chia hết cho 3',   test: t => t.num % 3 === 0 }
];

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* Gợi ý tự suy ra từ luật thật: nói tên những thuộc tính KHÔNG dự phần.
   Không bao giờ nói thẳng đáp án, chỉ thu hẹp chỗ phải tìm. */
function hintFor(used) {
  const rest = Object.keys(AXES).filter(k => used.indexOf(k) < 0).map(k => AXES[k]);
  if (!rest.length) return 'Cả ba thuộc tính đều dự phần vào luật thật.';
  return cap(rest.join(' và ')) + ' không liên quan.';
}

/* ---------- khuôn nói dối ----------
   need = số điều kiện cần bốc, mỗi điều kiện nằm trên một thuộc tính khác nhau.
   used = những thuộc tính mà LUẬT THẬT dùng tới (để sinh gợi ý).             */
const TEMPLATES = {

  /* Bảng luật nói đúng nhưng nói thiếu */
  THIEU: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.pos + ' VÀ ' + B.pos + '.',
      test: t => A.test(t) && B.test(t),
      used: [A.ax, B.ax]
    }),
    voices: [
      'Tôi đã nói thật. Chỉ là chưa nói hết.',
      'Một nửa sự thật vẫn được tính là một nửa.'
    ]
  },

  /* Bảng luật nói ngược hoàn toàn */
  DAO: {
    need: 1,
    make: A => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.neg + '.',
      test: t => !A.test(t),
      used: [A.ax]
    }),
    voices: [
      'Bạn đọc đúng từng chữ. Đó mới là vấn đề.',
      'Ngược lại. Lúc nào cũng có thể là ngược lại.'
    ]
  },

  /* Bảng luật chỉ sang một thuộc tính hoàn toàn không liên quan */
  TRUC: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + B.pos + '. ' + cap(AXES[A.ax]) + ' hoàn toàn không liên quan.',
      test: t => B.test(t),
      used: [B.ax]
    }),
    voices: [
      'Đừng tin vào thứ được viết to nhất.',
      'Tôi chỉ tay sang trái để bạn khỏi nhìn sang phải.'
    ]
  },

  /* Hai lời nói dối chồng lên nhau: vừa ngược, vừa thiếu */
  KETHOP: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.neg + ' VÀ ' + B.pos + '.',
      test: t => !A.test(t) && B.test(t),
      used: [A.ax, B.ax]
    }),
    voices: [
      'Hai lời nói dối chồng lên nhau vẫn chỉ là một bảng luật.',
      'Bạn gỡ được lớp thứ nhất rồi. Còn một lớp nữa.'
    ]
  },

  /* Bảng luật đưa hai lựa chọn để giấu đi thuộc tính thứ ba */
  HOAC: {
    need: 3,
    make: (A, B, C) => ({
      shown: 'Chọn ô ' + A.pos + ' hoặc ' + B.pos + '.',
      truth: 'Ô ' + C.pos + '.',
      test: t => C.test(t),
      used: [C.ax]
    }),
    voices: [
      'Tôi cho bạn hai lựa chọn để bạn quên rằng còn lựa chọn thứ ba.',
      'Bạn đã ngừng đọc bảng luật. Đó là lúc bạn bắt đầu chơi được.'
    ]
  },

  /* Bảng luật NÓI THẬT — cái bẫy khó nhất, vì lúc này bạn đã hết tin */
  THAT: {
    need: 1,
    make: A => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.pos + '. Bảng luật nói thật.',
      test: t => A.test(t),
      used: [A.ax]
    }),
    voices: [
      'Lần này tôi nói thật. Bạn đã mất bao lâu để tin?',
      'Không phải lần nào tôi cũng nói dối. Đó mới là chỗ khó.'
    ]
  }
};

/* Bậc khó của từng màn: hai màn đầu dễ, hai màn giữa vừa, hai màn cuối khó */
const TIER_PLAN  = [1, 1, 2, 2, 3, 3];
const TIER_POOLS = {
  1: ['THIEU', 'DAO'],
  2: ['TRUC', 'THIEU', 'DAO'],
  3: ['KETHOP', 'HOAC', 'TRUC']
};

const FIRST_VOICE = 'Bảng luật đầu tiên đã nói dối bạn. Các bảng sau cũng vậy.';
const OUTRO = 'Bạn đã đọc sáu bảng luật và tin đúng một bảng. Tỉ lệ đó vẫn cao hơn ngoài kia.';

/* ---------- vũ trụ 81 ô, dùng để kiểm luật sinh ra có chơi được không ---- */
const UNIVERSE = (function () {
  const u = [];
  ['lam', 'đỏ', 'vàng'].forEach(c =>
    ['tròn', 'vuông', 'tam giác'].forEach(s => {
      for (let n = 1; n <= 9; n++) u.push({ color: c, shape: s, num: n });
    }));
  return u;
})();
const countValid = test => UNIVERSE.filter(test).length;

/* ---------- dựng một ván ----------
   Ràng buộc để sáu màn không bị trùng lặp hay tự lộ đáp án cho nhau:
     - màn liền kề không dùng cùng kiểu nói dối
     - màn liền kề không dùng cùng bộ thuộc tính trong luật thật
       (nếu không sẽ ra cảnh màn 2 "số chẵn -> số lẻ", màn 3 "số lẻ -> số chẵn")
     - mỗi kiểu nói dối xuất hiện tối đa hai lần một ván
     - không lặp lại nguyên văn một bảng luật đã hiện
   Bí quá thì nới dần ràng buộc, nên vòng lặp luôn kết thúc.                  */
function pickAtoms(R, n) {
  const axes = ['mau', 'hinh', 'so'];
  for (let i = axes.length - 1; i > 0; i--) {
    const j = Math.floor(R() * (i + 1));
    const t = axes[i]; axes[i] = axes[j]; axes[j] = t;
  }
  return axes.slice(0, n).map(ax => {
    const pool = ATOMS.filter(a => a.ax === ax);
    return pool[Math.floor(R() * pool.length)];
  });
}

function buildRun(code) {
  const R = mulberry32(seedToInt(code));
  const truthSlot = 2 + Math.floor(R() * 4);   // màn nói thật rơi vào màn 3–6
  const levels = [];
  const seenTruth = {}, seenShown = {}, kindCount = {};
  let prevKind = '', prevAxKey = '';

  for (let i = 0; i < 6; i++) {
    let lv = null, guard = 0;

    while (!lv && guard++ < 900) {
      const loose = guard > 500;               // nới ràng buộc nếu bí
      let kind;

      if (i === truthSlot) {
        kind = 'THAT';
      } else {
        const pool = TIER_POOLS[TIER_PLAN[i]];
        kind = pool[Math.floor(R() * pool.length)];
        if (!loose) {
          if (kind === prevKind) continue;
          if ((kindCount[kind] || 0) >= 2) continue;
        }
      }

      const T = TEMPLATES[kind];
      const cand = T.make.apply(null, pickAtoms(R, T.need));
      cand.kind = kind;
      cand.hint = hintFor(cand.used);

      const axKey = cand.used.slice().sort().join('+');
      if (!loose && axKey === prevAxKey) continue;
      if (seenShown[cand.shown] || seenTruth[cand.truth]) continue;

      const n = countValid(cand.test);
      if (n < 4 || n > 54) continue;           // quá hiếm hoặc quá lỏng

      seenShown[cand.shown] = 1;
      seenTruth[cand.truth] = 1;
      kindCount[kind] = (kindCount[kind] || 0) + 1;
      prevKind = kind; prevAxKey = axKey;
      lv = cand;
    }

    // lưới an toàn: gần như không bao giờ chạm tới
    if (!lv) {
      const A = ATOMS[(i * 4 + 3) % ATOMS.length];
      lv = TEMPLATES.DAO.make(A);
      lv.kind = 'DAO';
      lv.hint = hintFor(lv.used);
    }

    const vs = TEMPLATES[lv.kind].voices;
    lv.voice = (i === 0) ? FIRST_VOICE : vs[Math.floor(R() * vs.length)];
    levels.push(lv);
  }

  return levels;
}
