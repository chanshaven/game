/* ============================================================================
   Chạy:  node test.js
   Đánh hàng nghìn ván máy với máy để bắt lỗi luật trước khi mó tới giao diện.
   Kiểm: sỏi không tự sinh tự mất, ván nào cũng kết thúc, không kẹt vòng lặp,
   và ba mức máy phải mạnh dần lên.
   ========================================================================== */
const E = require('./engine.js');
const AI = require('./ai.js');

function playOne(levels, opts) {
  const s = E.newGame(opts || {});
  const start = E.census(s);
  let turns = 0, stalls = 0;
  while (!s.over) {
    if (++turns > 3000) return { s, turns, bad: 'không chịu kết thúc', stalls };
    const mv = AI.pick(s, levels[s.turn]);
    if (!mv) return { s, turns, bad: 'bí nước mà ván chưa xong', stalls };
    const ev = E.applyMove(s, mv);
    for (const e of ev) if (e.t === 'stall') stalls++;
    const c = E.census(s);
    if (c.dan !== start.dan || c.quan !== start.quan) {
      return { s, turns, bad: 'sỏi sai: ' + JSON.stringify(c) + ' đáng lẽ ' + JSON.stringify(start), stalls };
    }
  }
  return { s, turns, bad: null, stalls };
}

function run(label, levels, n, opts) {
  let wins = [0, 0, 0, 0], draws = 0, maxTurns = 0, sumTurns = 0, stalls = 0;
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    const r = playOne(levels, opts);
    if (r.bad) { console.log('  HỎNG ván ' + i + ': ' + r.bad); return false; }
    stalls += r.stalls;
    maxTurns = Math.max(maxTurns, r.turns); sumTurns += r.turns;
    const sc = [];
    for (let p = 0; p < r.s.n; p++) sc.push(E.score(r.s, p));
    const best = Math.max.apply(null, sc);
    const who = sc.filter(x => x === best).length;
    if (who > 1) draws++; else wins[sc.indexOf(best)]++;
  }
  const ms = Date.now() - t0;
  console.log('  ' + label + ': ' + wins.slice(0, opts && opts.players ? opts.players : 2).join(' - ') +
    '  hoà ' + draws + ' | lượt tb ' + (sumTurns / n).toFixed(1) + ', dài nhất ' + maxTurns +
    ' | kẹt ' + stalls + ' | ' + ms + 'ms');
  return true;
}

console.log('\n== Bàn 2 người, khoá một chiều, có luật quan non ==');
run('ngẫu nhiên vs ngẫu nhiên', ['de', 'de'], 400);
run('thường  vs thường      ', ['thuong', 'thuong'], 300);
run('thường  vs ngẫu nhiên   ', ['thuong', 'de'], 200);
run('ngẫu nhiên vs thường    ', ['de', 'thuong'], 200);
run('khó     vs thường       ', ['kho', 'thuong'], 40);
run('thường  vs khó          ', ['thuong', 'kho'], 40);

console.log('\n== Bàn 2 người, khoá một chiều, BỎ luật quan non ==');
run('thường vs thường', ['thuong', 'thuong'], 200, { quanNon: 0 });

console.log('\n== Bàn 2 người, được chọn chiều ==');
run('thường vs thường', ['thuong', 'thuong'], 200, { lockDirection: false });
run('khó    vs dễ    ', ['kho', 'de'], 30, { lockDirection: false });

console.log('\n== Bàn 3 người (tam giác) ==');
run('ba máy thường', ['thuong', 'thuong', 'thuong'], 150, { players: 3 });

console.log('\n== Bàn 4 người (vuông) ==');
run('bốn máy thường', ['thuong', 'thuong', 'thuong', 'thuong'], 120, { players: 4 });

/* Kiểm riêng vài tình huống luật ---------------------------------------- */
console.log('\n== Kiểm luật từng nước ==');
function show(s) { return s.cells.map(c => (c.kind === 'quan' ? '[' + c.quan + '/' + c.dan + ']' : c.dan)).join(' '); }

let s = E.newGame({});
console.log('  bày ban đầu : ' + show(s));
let ev = E.applyMove(s, { cell: 5, dir: 1 });
console.log('  người 0 đi ô 5: ' + show(s));
console.log('  sự kiện     : ' + ev.map(e => e.t).join(','));
console.log('  đã ăn       : ' + JSON.stringify(s.captured));
console.log('  lượt kế     : người ' + s.turn);

/* Thế ăn quan: viên cuối rơi vào ô 4, ô 5 trống, ô 6 là quan đã đủ già */
function theAnQuan(danTrongQuan) {
  const g = E.newGame({});
  for (const c of g.cells) if (c.kind === 'dan') c.dan = 0;
  g.cells[3].dan = 1;                 // rải một viên -> rơi vào ô 4
  g.cells[5].dan = 0;                 // ô 5 trống -> ngắm ô 6
  g.cells[6].dan = danTrongQuan;      // quan đang có ngần này dân
  const e = E.applyMove(g, { cell: 3, dir: 1 });
  return { g: g, ev: e };
}
let r = theAnQuan(1);
console.log('  quan non (1 dân): ' + r.ev.map(e => e.t).join(',') + ' -> người 0 được ' + E.score(r.g, 0) + ' điểm');
r = theAnQuan(6);
console.log('  quan già (6 dân): ' + r.ev.map(e => e.t + (e.t === 'eat' ? '(' + e.dan + 'd+' + e.quan + 'q)' : '')).join(',') +
  ' -> người 0 được ' + E.score(r.g, 0) + ' điểm');

/* Thế phải rải lại */
s = E.newGame({});
for (const i of E.sideCells(s, 1)) s.cells[i].dan = 0;
s.captured[1].dan = 9;
s.cells[1].dan = 1; s.cells[2].dan = 0; s.cells[3].dan = 0; s.cells[4].dan = 0; s.cells[5].dan = 0;
ev = E.applyMove(s, { cell: 1, dir: 1 });
console.log('  rải lại     : ' + ev.map(e => e.t).join(',') + ' | người 1 còn ăn ' + s.captured[1].dan +
  ' dân, bàn: ' + show(s));
console.log('');
