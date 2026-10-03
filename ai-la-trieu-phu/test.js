/* ============================================================================
   Kiểm tra nhanh trước khi đẩy lên.  Chạy:  node test.js

   Soát ba thứ:
     1. Ngân hàng câu hỏi có đúng định dạng không, có câu nào hỏng không
     2. Đáp án đúng có dồn vào một chữ cái không (người chơi đoán được là hỏng)
     3. Mọi file mp3 khai báo trong audio.js có thật nằm trong thư mục sound/ không
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const { QUESTIONS } = require('./questions.js');

let loi = 0, canh = 0;
const sai = m => { console.log('  LỖI   ' + m); loi++; };
const nhac = m => { console.log('  Lưu ý ' + m); canh++; };

/* ===== 1. Ngân hàng câu hỏi ============================================== */

console.log('\n--- Ngân hàng câu hỏi ---');
const dem = { A: 0, B: 0, C: 0, D: 0 };
let tong = 0;

for (let lv = 1; lv <= 15; lv++) {
  const kho = QUESTIONS[lv];
  if (!Array.isArray(kho) || !kho.length) { sai('level ' + lv + ' không có câu nào'); continue; }

  kho.forEach((c, k) => {
    const o = 'level ' + lv + ' câu ' + (k + 1) + ': ';
    if (typeof c.q !== 'string' || !c.q.trim()) sai(o + 'thiếu nội dung câu hỏi');
    if (!Array.isArray(c.a) || c.a.length !== 4) { sai(o + 'phải có đúng 4 phương án'); return; }
    if (c.a.some(x => typeof x !== 'string' || !x.trim())) sai(o + 'có phương án rỗng');
    if (!Number.isInteger(c.c) || c.c < 0 || c.c > 3) { sai(o + 'c phải là số 0, 1, 2 hoặc 3'); return; }

    const thay = new Set(c.a.map(x => x.trim().toLowerCase()));
    if (thay.size !== 4) sai(o + 'có hai phương án trùng nhau');

    /* đáp án đúng dài hơn hẳn ba cái kia thì đoán ra ngay */
    const d = c.a[c.c].length;
    const khac = c.a.filter((_, i) => i !== c.c).map(x => x.length);
    if (d > Math.max.apply(null, khac) * 1.8) nhac(o + 'đáp án đúng dài hơn hẳn, dễ bị đoán');

    dem['ABCD'[c.c]]++;
    tong++;
  });
}

console.log('  ' + tong + ' câu, phân bố đáp án đúng: ' +
  Object.keys(dem).map(k => k + '=' + dem[k]).join('  '));
Object.keys(dem).forEach(k => {
  if (tong >= 20 && dem[k] / tong > 0.4) nhac('đáp án đúng rơi vào ' + k + ' quá nhiều');
  if (tong >= 20 && dem[k] === 0) nhac('không câu nào có đáp án đúng là ' + k);
});

/* ===== 2. File âm thanh ================================================== */

console.log('\n--- File âm thanh ---');
const js = fs.readFileSync(path.join(__dirname, 'audio.js'), 'utf8');
const khai = [...js.matchAll(/'([A-Za-z0-9\-/]+\.mp3)'/g)].map(m => m[1]);
const duy = [...new Set(khai)];

const thieu = duy.filter(f => !fs.existsSync(path.join(__dirname, 'sound', f)));
console.log('  khai báo ' + duy.length + ' file, thiếu ' + thieu.length);
thieu.forEach(f => nhac('chưa có sound/' + f));

/* file có trong thư mục nhưng chưa được khai báo — nhiều khi là quên dùng */
function quet(dir, goc) {
  let ra = [];
  if (!fs.existsSync(dir)) return ra;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    const rel = goc ? goc + '/' + e.name : e.name;
    if (e.isDirectory()) ra = ra.concat(quet(p, rel));
    else if (e.name.endsWith('.mp3')) ra.push(rel);
  }
  return ra;
}
const coTrenO = quet(path.join(__dirname, 'sound'), '');
const thua = coTrenO.filter(f => duy.indexOf(f) < 0);
if (thua.length) { console.log('  có file chưa dùng tới:'); thua.forEach(f => console.log('    ' + f)); }

/* ===== 3. Cú pháp các file js ============================================ */

console.log('\n--- Cú pháp ---');
['questions.js', 'audio.js', 'game.js'].forEach(f => {
  try {
    new (require('vm').Script)(fs.readFileSync(path.join(__dirname, f), 'utf8'), { filename: f });
    console.log('  ' + f + ' OK');
  } catch (e) { sai(f + ' — ' + e.message); }
});

/* ===== Kết ============================================================== */

console.log('\n' + (loi ? loi + ' LỖI' : 'Không có lỗi') + ', ' + canh + ' lưu ý.\n');
process.exit(loi ? 1 : 0);
