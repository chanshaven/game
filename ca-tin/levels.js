/* ============================================================================
   CẢ TIN — bộ sinh luật
   ----------------------------------------------------------------------------
   Mỗi ván sinh ra tám bảng luật KHÁC NHAU, cộng màn nghịch lý cố định, nên chơi lại không thể
   dựa vào trí nhớ. Nhưng luật không sinh bừa: KIỂU NÓI DỐI là phần đã thiết kế
   sẵn, chỉ có thuộc tính cụ thể mới bốc ngẫu nhiên. Nhờ vậy độ khó và cái cảm
   giác "à ra thế" giữ nguyên qua mọi ván.

   Ba thứ ngẫu nhiên mỗi ván:
     1. Thuộc tính trong từng luật  (lam + số chẵn / tam giác + số lớn hơn 5 ...)
     2. Kiểu nói dối của từng màn   (bốc trong bậc khó của màn đó)
     3. Màn NÓI THẬT rơi vào đâu    (đâu đó từ màn 3 đến màn 6)

   Mỗi ván có một MÃ VÁN bốn ký tự. Cùng mã thì cùng bộ luật, nên gửi mã cho
   bạn bè là họ gặp đúng bộ luật của mình. Mở bằng ?van=XXXX cũng được.
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

/* ---------- thuộc tính của ô ----------
   Mỗi ô có ba thứ IN TRÊN NÓ (màu, hình, số) và một thứ nữa không in ra:
   CHỖ NÓ NẰM trên lưới. Người chơi quen soi ba thứ đầu, nên luật nói về chỗ
   đứng giấu được rất lâu mà vẫn hoàn toàn công bằng — thông tin luôn bày ra
   trước mắt, chỉ là không ai nghĩ tới.                                       */
const AXES = { mau: 'màu sắc', hinh: 'hình dạng', so: 'con số' };

const ATOMS = [
  { ax: 'mau',  pos: 'màu lam',   neg: 'không phải màu lam',   test: t => t.color === 'lam' },
  { ax: 'mau',  pos: 'màu đỏ',    neg: 'không phải màu đỏ',    test: t => t.color === 'đỏ' },
  { ax: 'mau',  pos: 'màu vàng',  neg: 'không phải màu vàng',  test: t => t.color === 'vàng' },

  { ax: 'hinh', pos: 'hình tròn',     neg: 'không phải hình tròn',     test: t => t.shape === 'tròn' },
  { ax: 'hinh', pos: 'hình vuông',    neg: 'không phải hình vuông',    test: t => t.shape === 'vuông' },
  { ax: 'hinh', pos: 'hình tam giác', neg: 'không phải hình tam giác', test: t => t.shape === 'tam giác' },

  /* Ô mang số 1-12. Dải 1-9 cũ không đủ cho "chia hết cho 5" — chỉ đúng mỗi
     số 5, một ô trên chín, bàn chơi quá mỏng. Nới lên 12 thì ÷5 được {5,10},
     ÷4 được {4,8,12}, ÷6 được {6,12}, và mở thêm cả số nguyên tố. */
  { ax: 'so', pos: 'mang số chẵn',           neg: 'mang số lẻ',                   test: t => t.num % 2 === 0 },
  { ax: 'so', pos: 'mang số lẻ',             neg: 'mang số chẵn',                 test: t => t.num % 2 === 1 },
  { ax: 'so', pos: 'mang số chia hết cho 3', neg: 'mang số không chia hết cho 3', test: t => t.num % 3 === 0 },
  { ax: 'so', pos: 'mang số chia hết cho 4', neg: 'mang số không chia hết cho 4', test: t => t.num % 4 === 0 },
  { ax: 'so', pos: 'mang số chia hết cho 5', neg: 'mang số không chia hết cho 5', test: t => t.num % 5 === 0 },
  { ax: 'so', pos: 'mang số chia hết cho 6', neg: 'mang số không chia hết cho 6', test: t => t.num % 6 === 0 },
  { ax: 'so', pos: 'mang số lớn hơn 6',      neg: 'mang số từ 6 trở xuống',       test: t => t.num > 6 },
  { ax: 'so', pos: 'mang số nhỏ hơn 5',      neg: 'mang số từ 5 trở lên',         test: t => t.num < 5 },
  { ax: 'so', pos: 'mang số nguyên tố',      neg: 'mang số không phải nguyên tố',
    test: t => [2, 3, 5, 7, 11].indexOf(t.num) >= 0 }
];

/* Vị trí trên lưới 3x3, ô số 0 ở góc trên trái, ô số 8 ở góc dưới phải.
   Cố ý bỏ "ô chính giữa" vì chỉ có đúng một ô hợp lệ, bàn chơi sẽ quá mỏng. */
const POS = [
  { pos: 'ở hàng trên cùng',  test: i => i < 3 },
  { pos: 'ở hàng giữa',       test: i => i >= 3 && i < 6 },
  { pos: 'ở hàng dưới cùng',  test: i => i >= 6 },
  { pos: 'ở cột bên trái',    test: i => i % 3 === 0 },
  { pos: 'ở cột giữa',        test: i => i % 3 === 1 },
  { pos: 'ở cột bên phải',    test: i => i % 3 === 2 },
  { pos: 'ở bốn góc',         test: i => i === 0 || i === 2 || i === 6 || i === 8 },
  { pos: 'ở bốn cạnh',        test: i => i === 1 || i === 3 || i === 5 || i === 7 }
];

/* Luật nhắc tới ô vừa chọn. Chỗ này lật ngược cách nghĩ: luật không nằm trên
   bàn nữa mà nằm giữa người chơi và nước đi liền trước của chính họ. */
/* Mọi điều kiện ở đây phải đúng với MỌI ô có thể vừa chọn. Hai điều kiện
   "mang số lớn hơn" và "mang số nhỏ hơn" đã bị bỏ vì tạo ngõ cụt: chọn phải
   ô số 9 rồi thì không còn ô nào lớn hơn, bàn chơi không dựng nổi và người
   chơi kẹt vĩnh viễn. */
const HIST = [
  { pos: 'cùng màu với ô bạn vừa chọn',  test: (t, p) => t.color === p.color },
  { pos: 'cùng hình với ô bạn vừa chọn', test: (t, p) => t.shape === p.shape },
  { pos: 'cùng màu nhưng khác hình với ô bạn vừa chọn',
    test: (t, p) => t.color === p.color && t.shape !== p.shape },
  { pos: 'khác cả màu lẫn hình với ô bạn vừa chọn',
    test: (t, p) => t.color !== p.color && t.shape !== p.shape },
  { pos: 'khác tính chẵn lẻ với ô bạn vừa chọn',
    test: (t, p) => (t.num % 2) !== (p.num % 2) }
];

const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* Gợi ý suy ra từ luật thật: chỉ nói thuộc tính nào KHÔNG dự phần, không bao
   giờ nói thẳng đáp án. Cố ý không nhắc tới vị trí ở những màn thường — nhắc
   ra là lộ mất trục thứ tư trước khi người chơi kịp gặp nó. */
function hintFor(used) {
  const rest = Object.keys(AXES).filter(k => used.indexOf(k) < 0).map(k => AXES[k]);
  if (!rest.length) return 'Cả ba thuộc tính đều dự phần vào luật thật.';
  return cap(rest.join(' và ')) + ' không liên quan.';
}

/* ---------- dựng bàn chơi ----------
   Luật giờ có thể phụ thuộc vào chỗ ô nằm và vào nước đi trước, nên không
   dựng bàn theo kiểu chọn sẵn ô đúng ô sai nữa. Thay vào đó bốc cả bàn rồi
   đếm, không đạt thì bốc lại. Cách này đúng cho mọi kiểu luật.
   Mỗi bàn giữ 2-4 ô đúng: ít hơn thì mò mãi không ra, nhiều hơn thì ăn may. */
const COLORS = ['lam', 'đỏ', 'vàng'];
const SHAPES = ['tròn', 'vuông', 'tam giác'];
const rndInt = n => Math.floor(Math.random() * n);
const randTile = () => ({ color: COLORS[rndInt(3)], shape: SHAPES[rndInt(3)], num: 1 + rndInt(12) });
const tkey = t => t.color + '|' + t.shape + '|' + t.num;

function randomBoard() {
  const seen = Object.create(null), tiles = [];
  let guard = 0;
  while (tiles.length < 9 && guard++ < 400) {
    const t = randTile(), k = tkey(t);
    if (seen[k]) continue;
    seen[k] = 1; tiles.push(t);
  }
  return tiles;
}

function makeBoard(test, prev, tries) {
  for (let a = 0; a < (tries || 500); a++) {
    const tiles = randomBoard();
    if (tiles.length < 9) continue;
    let n = 0;
    for (let i = 0; i < 9; i++) if (test(tiles[i], i, prev)) n++;
    if (n >= 2 && n <= 4) return tiles;
  }
  return null;
}

/* ---------- khuôn nói dối ----------
   Mọi hàm test đều nhận (ô, số thứ tự trên lưới, ô vừa chọn trước đó). Phần
   lớn khuôn bỏ qua hai tham số sau; chỉ VITRI dùng số thứ tự và LICHSU dùng ô
   trước đó.                                                                  */
const TEMPLATES = {

  THIEU: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.pos + ' VÀ ' + B.pos + '.',
      test: t => A.test(t) && B.test(t),
      shownTest: t => A.test(t),
      used: [A.ax, B.ax]
    }),
    voices: ['Tôi đã nói thật. Chỉ là chưa nói hết.',
             'Một nửa sự thật vẫn được tính là một nửa.']
  },

  DAO: {
    need: 1,
    make: A => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.neg + '.',
      test: t => !A.test(t),
      shownTest: t => A.test(t),
      used: [A.ax]
    }),
    voices: ['Bạn đọc đúng từng chữ. Đó mới là vấn đề.',
             'Ngược lại. Lúc nào cũng có thể là ngược lại.']
  },

  TRUC: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + B.pos + '. ' + cap(AXES[A.ax]) + ' hoàn toàn không liên quan.',
      test: t => B.test(t),
      shownTest: t => A.test(t),
      used: [B.ax]
    }),
    voices: ['Đừng tin vào thứ được viết to nhất.',
             'Tôi chỉ tay sang trái để bạn khỏi nhìn sang phải.']
  },

  KETHOP: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.neg + ' VÀ ' + B.pos + '.',
      test: t => !A.test(t) && B.test(t),
      shownTest: t => A.test(t),
      used: [A.ax, B.ax]
    }),
    voices: ['Hai lời nói dối chồng lên nhau vẫn chỉ là một bảng luật.',
             'Bạn gỡ được lớp thứ nhất rồi. Còn một lớp nữa.']
  },

  HOAC: {
    need: 3,
    make: (A, B, C) => ({
      shown: 'Chọn ô ' + A.pos + ' hoặc ' + B.pos + '.',
      truth: 'Ô ' + C.pos + '.',
      test: t => C.test(t),
      shownTest: t => A.test(t) || B.test(t),
      used: [C.ax]
    }),
    voices: ['Tôi cho bạn hai lựa chọn để bạn quên rằng còn lựa chọn thứ ba.',
             'Bạn đã ngừng đọc bảng luật. Đó là lúc bạn bắt đầu chơi được.']
  },

  THAT: {
    need: 1,
    make: A => ({
      shown: 'Chọn ô ' + A.pos + '.',
      truth: 'Ô ' + A.pos + '. Bảng luật nói thật.',
      test: t => A.test(t),
      shownTest: t => A.test(t),
      used: [A.ax]
    }),
    voices: ['Lần này tôi nói thật. Bạn đã mất bao lâu để tin?',
             'Không phải lần nào tôi cũng nói dối. Đó mới là chỗ khó.']
  },

  /* Bảng luật nêu HAI điều kiện nhưng chỉ một cái là thật. Gương soi ngược
     của THIEU, và ác hơn: người chơi kiểm cả hai, thấy đều đúng, rồi không
     bao giờ nghĩ tới chuyện BỚT đi một cái. */
  THUA: {
    need: 2,
    make: (A, B) => ({
      shown: 'Chọn ô ' + A.pos + ' và ' + B.pos + '.',
      truth: 'Ô ' + B.pos + '. Điều kiện "' + A.pos + '" là thừa.',
      test: t => B.test(t),
      shownTest: t => A.test(t) && B.test(t),
      used: [B.ax]
    }),
    voices: ['Tôi nói thừa một điều kiện. Bạn kiểm cả hai và thấy đều đúng.',
             'Bớt đi khó hơn thêm vào. Ai cũng quen thêm vào.']
  },

  /* Luật thật nói về CHỖ ô nằm, không nói gì về thứ in trên ô */
  VITRI: {
    need: 1, pos: true,
    make: function (A, P) {
      return {
        shown: 'Chọn ô ' + A.pos + '.',
        truth: 'Ô ' + P.pos + '. Thứ in trên ô hoàn toàn không liên quan.',
        test: (t, i) => P.test(i),
        shownTest: t => A.test(t),
        used: [], usesPos: true,
        hint: 'Luật thật không nói về thứ in trên ô.'
      };
    },
    voices: ['Bạn soi ba thứ in trên ô. Còn một thứ thứ tư.',
             'Chỗ đứng cũng là một thuộc tính. Tôi chỉ không ghi nó ra.']
  },

  /* Luật thật nhắc tới nước đi liền trước của chính người chơi */
  LICHSU: {
    need: 1, hist: true,
    make: function (A, H) {
      return {
        shown: 'Chọn ô ' + A.pos + '.',
        truth: 'Ô ' + H.pos + '.',
        test: (t, i, prev) => !prev || H.test(t, prev),
        shownTest: t => A.test(t),
        used: [], usesPrev: true,
        hint: 'Luật thật nhắc tới ô bạn đã chọn ngay trước đó.'
      };
    },
    voices: ['Luật không nằm trên bàn. Nó nằm giữa bạn và nước đi trước.',
             'Bạn đi tìm luật ở một chỗ cố định. Nó thì đi theo bạn.']
  }
};

/* Tám màn sinh ra, rồi màn thứ chín là màn nghịch lý cố định ở dưới. */
const TIER_PLAN  = [1, 1, 2, 2, 2, 3, 3, 3];
/* Bậc khó xếp theo SỐ LẦN THỬ ĐO ĐƯỢC, không theo cảm tính.
   Đo bằng một người chơi giả suy luận hoàn hảo, trung vị số lần thử:
     DAO 5 · TRUC 6 · THUA 6 · HOAC 6 · KETHOP 8 · LICHSU 8 · VITRI 9 · THIEU 10
   THIEU ("A và B") hoá ra KHÓ NHẤT chứ không phải dễ nhất như xếp ban đầu:
   bảng luật đúng một nửa nên thỉnh thoảng làm theo vẫn trúng, và chính sự
   xác nhận nửa vời đó gây rối hơn hẳn một lời nói dối trắng trợn. */
const TIER_POOLS = {
  1: ['DAO', 'TRUC', 'THUA'],
  2: ['THIEU', 'HOAC', 'THUA', 'DAO', 'TRUC'],
  3: ['KETHOP', 'LICHSU', 'VITRI', 'THIEU', 'HOAC']
};

/* Giới hạn lần thử mỗi màn, theo bậc khó. Hết lần thử là thua cả ván.
   Nút gợi ý mở ở 60% giới hạn, để còn kịp dùng. */
const LIMITS = { 1: 10, 2: 15, 3: 20 };

const LOSE_VOICES = [
  'Bạn thử rất nhiều lần, theo cùng một lối nghĩ. Tôi chỉ cần bạn đừng đổi ý.',
  'Bạn tìm rất chăm. Chỉ là tìm đúng chỗ tôi muốn bạn tìm.',
  'Hết lần thử rồi. Bảng luật thì vẫn còn nguyên đó, không suy suyển gì.'
];

const FIRST_VOICE = 'Bảng luật đầu tiên đã nói dối bạn. Các bảng sau cũng vậy.';

/* ---------- màn cuối ----------
   "Luật chơi là lời nói dối." Nếu câu đó đúng thì nó đang nói dối, nên nó sai;
   nếu nó sai thì bảng luật đang nói thật, nên nó đúng. Không ô nào trên bàn
   cho ra kết quả đúng, và đó không phải lỗi — đó là cả màn chơi.

   Cách qua màn: ngừng chạm vào bàn. Khi người chơi ngồi yên, một nét gạch
   chậm rãi kéo ngang chính dòng chữ đang nói dối họ. Chạm vào bất cứ đâu là
   nét gạch tan đi và phải làm lại. Thứ duy nhất gạch được lời nói dối đó là
   việc không làm gì cả.                                                      */
const PARADOX = {
  kind: 'NGHICHLY',
  shown: 'Luật chơi là lời nói dối.',
  truth: 'Không ô nào đúng. Cách duy nhất qua màn là không chọn gì.',
  test: () => false,
  shownTest: () => true,        // chạm vào bàn, tức là vẫn tin có gì đó để chọn
  used: [], isParadox: true,
  hint: 'Bảng luật chưa bao giờ nói rằng bạn phải chọn.',
  voice: 'Bạn đã ngừng lại. Đó là nước đi duy nhất tôi không viết được thành luật.',
  limit: 25,
  loseVoice: 'Bạn chạm vào bàn hai mươi lăm lần. Chưa lần nào tôi bảo bạn phải chạm.',
  /* Ba câu thả dần khi người chơi càng thử càng sai */
  nudges: [
    [5,  'Cứ thử tiếp đi. Tôi có cả ngày.'],
    [12, 'Bạn đang làm đúng thứ tôi bảo bạn làm.'],
    [20, 'Tôi chưa bao giờ nói bạn phải chọn.']
  ]
};

/* Câu kết đổi theo số lần người chơi đã TIN bảng luật, chứ không theo điểm.
   Đó mới là thứ trò chơi này nói về. */
const OUTROS = [
  { min: 7, text: 'Chín lần tôi viết ra một dòng. Bạn tin bảy lần trở lên. ' +
                  'Ngoài kia tôi không phải viết cẩn thận đến thế.' },
  { min: 4, text: 'Bạn tin khoảng một nửa. Đó là tỉ lệ của người đã học được ' +
                  'cách nghi ngờ, nhưng chưa học được lúc nào nên thôi nghi ngờ.' },
  { min: 0, text: 'Bạn thôi tin tôi từ rất sớm. Nhưng thôi tin cũng là một thói ' +
                  'quen, và thói quen nào cũng có người biết cách dùng.' }
];

/* 108 tổ hợp thuộc tính, dùng để loại những luật quá hiếm hoặc quá lỏng */
const UNIVERSE = (function () {
  const u = [];
  COLORS.forEach(c => SHAPES.forEach(s => { for (let n = 1; n <= 12; n++) u.push({ color: c, shape: s, num: n }); }));
  return u;
})();
const countValid = test => UNIVERSE.filter(t => test(t, 0, null)).length;

/* ---------- dựng một ván ----------
   Ràng buộc để chín màn không trùng lặp hay tự lộ đáp án cho nhau:
     - màn liền kề không dùng cùng kiểu nói dối
     - màn liền kề không dùng cùng bộ thuộc tính trong luật thật
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
  const n = TIER_PLAN.length;
  /* Màn nói thật rơi đâu đó từ màn 3 tới màn áp chót — không để ở màn cuối,
     vì kết ván bằng một màn dễ thì hụt hẫng. */
  const truthSlot = 2 + Math.floor(R() * (n - 2));
  const levels = [];
  const seenTruth = {}, seenShown = {}, kindCount = {};
  let prevKind = '', prevAxKey = '';

  for (let i = 0; i < n; i++) {
    let lv = null, guard = 0;

    while (!lv && guard++ < 900) {
      const loose = guard > 500;
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
      const atoms = pickAtoms(R, T.need);
      if (T.pos)  atoms.push(POS[Math.floor(R() * POS.length)]);
      if (T.hist) atoms.push(HIST[Math.floor(R() * HIST.length)]);
      const cand = T.make.apply(null, atoms);
      cand.kind = kind;
      cand.limit = LIMITS[TIER_PLAN[i]];
      if (!cand.hint) cand.hint = hintFor(cand.used);

      const axKey = cand.usesPos ? 'vitri' : cand.usesPrev ? 'lichsu' : cand.used.slice().sort().join('+');
      if (!loose && axKey === prevAxKey) continue;
      if (seenShown[cand.shown] || seenTruth[cand.truth]) continue;

      /* Luật chỉ nói về thuộc tính thì đếm được thẳng trên 81 tổ hợp. Luật nói
         về vị trí hay về nước đi trước thì phải thử dựng bàn mới biết có chơi
         được không. */
      if (!cand.usesPos && !cand.usesPrev) {
        /* Khung tính trên 108 tổ hợp: dưới 12 thì bàn chơi quá mỏng (ví dụ
           "÷5 VÀ màu lam" chỉ còn 6 tổ hợp), trên 72 thì quá lỏng. */
        const c = countValid(cand.test);
        if (c < 12 || c > 72) continue;
      } else {
        const probe = cand.usesPrev ? randTile() : null;
        if (!makeBoard(cand.test, probe, 120)) continue;
      }

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

  levels.push(PARADOX);      // màn chín, luôn luôn là màn nghịch lý
  return levels;
}
