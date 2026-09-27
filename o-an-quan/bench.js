/* ============================================================================
   Chạy:  node bench.js
   Đo cân bằng: người đi trước lợi bao nhiêu, luật quan non đổi được gì, và ba
   mức máy cách nhau cỡ nào. Chỉnh số trong engine hay ai xong thì chạy lại.
   ========================================================================== */
const E = require('./engine.js'), AI = require('./ai.js');
function play(lv, opts) {
  const s = E.newGame(opts || {});
  let t = 0;
  while (!s.over && t++ < 3000) { const m = AI.pick(s, lv[s.turn]); if (!m) break; E.applyMove(s, m); }
  return [E.score(s, 0), E.score(s, 1), t];
}
function bench(label, lv, n, opts) {
  let w0 = 0, w1 = 0, d = 0, turns = 0;
  for (let i = 0; i < n; i++) { const [a, b, t] = play(lv, opts); turns += t; if (a > b) w0++; else if (b > a) w1++; else d++; }
  console.log(label.padEnd(42), 'P0 ' + w0, 'P1 ' + w1, 'hoà ' + d,
    '| P0 thắng ' + (100 * w0 / n).toFixed(0) + '%', '| lượt tb ' + (turns / n).toFixed(0));
  return { w0, w1, d, n };
}
console.log('--- lợi thế người đi trước (thường vs thường, 300 ván) ---');
bench('khoá một chiều, CÓ luật quan non', ['thuong','thuong'], 300);
bench('khoá một chiều, BỎ luật quan non', ['thuong','thuong'], 300, { quanNon: 0 });
bench('được chọn chiều, có quan non    ', ['thuong','thuong'], 300, { lockDirection: false });
console.log('\n--- mạnh yếu giữa ba mức (đổi bên cho công bằng) ---');
let a = bench('Khó (đi trước)  vs Thường', ['kho','thuong'], 50);
let b = bench('Thường vs Khó (đi sau)   ', ['thuong','kho'], 50);
console.log('   -> Khó thắng ' + (100*(a.w0+b.w1)/(a.n+b.n)).toFixed(0) + '% số ván');
let c = bench('Thường (đi trước) vs Dễ  ', ['thuong','de'], 300);
let e = bench('Dễ vs Thường (đi sau)    ', ['de','thuong'], 300);
console.log('   -> Thường thắng ' + (100*(c.w0+e.w1)/(c.n+e.n)).toFixed(0) + '% số ván');
const E = require('./engine.js'), AI = require('./ai.js');
function play(lv, opts) {
  const s = E.newGame(opts || {});
  let t = 0;
  while (!s.over && t++ < 3000) { const m = AI.pick(s, lv[s.turn]); if (!m) break; E.applyMove(s, m); }
  return [E.score(s, 0), E.score(s, 1), t];
}
function bench(label, lv, n, opts) {
  let w0 = 0, w1 = 0, d = 0, turns = 0;
  for (let i = 0; i < n; i++) { const [a, b, t] = play(lv, opts); turns += t; if (a > b) w0++; else if (b > a) w1++; else d++; }
  console.log(label.padEnd(42), 'P0 ' + w0, 'P1 ' + w1, 'hoà ' + d,
    '| P0 thắng ' + (100 * w0 / n).toFixed(0) + '%', '| lượt tb ' + (turns / n).toFixed(0));
  return { w0, w1, d, n };
}
console.log('--- lợi thế người đi trước (thường vs thường, 300 ván) ---');
bench('khoá một chiều, CÓ luật quan non', ['thuong','thuong'], 300);
bench('khoá một chiều, BỎ luật quan non', ['thuong','thuong'], 300, { quanNon: 0 });
bench('được chọn chiều, có quan non    ', ['thuong','thuong'], 300, { lockDirection: false });
console.log('\n--- mạnh yếu giữa ba mức (đổi bên cho công bằng) ---');
let a = bench('Khó (đi trước)  vs Thường', ['kho','thuong'], 50);
let b = bench('Thường vs Khó (đi sau)   ', ['thuong','kho'], 50);
console.log('   -> Khó thắng ' + (100*(a.w0+b.w1)/(a.n+b.n)).toFixed(0) + '% số ván');
let c = bench('Thường (đi trước) vs Dễ  ', ['thuong','de'], 300);
let e = bench('Dễ vs Thường (đi sau)    ', ['de','thuong'], 300);
console.log('   -> Thường thắng ' + (100*(c.w0+e.w1)/(c.n+e.n)).toFixed(0) + '% số ván');
