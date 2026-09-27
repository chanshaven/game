/* ============================================================================
   Ô ĂN QUAN — luật chơi
   Thuần logic, không đụng tới DOM. Chạy được bằng node để kiểm tra.

   BÀN CỜ LÀ MỘT VÒNG TRÒN
   Dù là bàn 2 người (hình chữ nhật), 3 người (tam giác) hay 4 người (vuông),
   sỏi vẫn chỉ chạy vòng quanh theo một đường khép kín. Nên trong code bàn cờ
   chỉ là một mảng ô nối đuôi nhau:

       [quan 0] [5 ô của người 0] [quan 1] [5 ô của người 1] [quan 2] ...

   Bàn 2 người ra đúng 12 ô như bàn cổ điển. Bàn 3 người ra 18 ô, 4 người ra
   24 ô. Viết một lần, dùng cho cả ba.

   MỘT LƯỢT ĐI
   1. Bốc hết sỏi ở một ô dân của mình, rải mỗi ô một viên theo chiều đã chọn.
   2. Rải hết viên cuối, nhìn ô kế tiếp:
      - là ô quan        -> mất lượt, hết lượt.
      - còn sỏi          -> bốc luôn ô đó, rải tiếp.
      - trống            -> ăn sỏi ở ô liền sau ô trống ấy. Ăn xong mà lại gặp
                            một ô trống nữa rồi một ô có sỏi thì ăn tiếp
                            (ăn liên hoàn). Hai ô trống liền nhau thì dừng.
   2b. QUAN NON: ô quan còn dưới 5 dân thì chưa được ăn. Ai rải vào đúng thế ăn
      quan non thì mất lượt, phải chờ quan "già" thêm. Không có luật này thì
      nước đầu tiên của ván đã ăn được quan và ván tàn sau mấy lượt.
   3. Đến lượt ai mà cả năm ô của người đó trống thì phải rải lại: lấy trong
      chỗ sỏi đã ăn, mỗi ô một viên. Không đủ thì vay của đối thủ, cuối ván trả.
   4. Hết quan tàn dân: cả hai ô quan sạch sỏi thì ván kết thúc, ai còn sỏi
      bên phần mình thì vơ về. Dân 1 điểm, quan 10 điểm.
   ========================================================================== */
const OAQ = (function () {
  'use strict';

  const DEFAULTS = {
    players: 2,        // 2, 3 hay 4
    perSide: 5,        // số ô dân mỗi người
    startDan: 5,       // sỏi ban đầu mỗi ô dân
    startQuan: 1,      // quan ban đầu mỗi ô quan
    quanValue: 10,     // một quan ăn bằng mấy dân
    quanNon: 5,        // quan còn dưới ngần này dân thì chưa được ăn (0 = bỏ luật)
    lockDirection: true, // cổ điển: khoá một chiều cả ván
    fixedDir: 1        // chiều khoá (+1 hoặc -1)
  };

  /* ---- dựng ván mới -------------------------------------------------- */
  function newGame(opts) {
    const o = Object.assign({}, DEFAULTS, opts || {});
    const cells = [];
    for (let s = 0; s < o.players; s++) {
      cells.push({ kind: 'quan', side: -1, corner: s, dan: 0, quan: o.startQuan });
      for (let k = 0; k < o.perSide; k++) {
        cells.push({ kind: 'dan', side: s, idx: k, dan: o.startDan, quan: 0 });
      }
    }
    return {
      opts: o,
      n: o.players,
      perSide: o.perSide,
      cells: cells,
      captured: Array.from({ length: o.players }, () => ({ dan: 0, quan: 0 })),
      debt: Array.from({ length: o.players }, () => new Array(o.players).fill(0)),
      turn: 0,
      over: false,
      moveCount: 0
    };
  }

  function clone(s) {
    return {
      opts: s.opts, n: s.n, perSide: s.perSide,
      cells: s.cells.map(c => ({
        kind: c.kind, side: c.side, idx: c.idx, corner: c.corner, dan: c.dan, quan: c.quan
      })),
      captured: s.captured.map(c => ({ dan: c.dan, quan: c.quan })),
      debt: s.debt.map(r => r.slice()),
      turn: s.turn, over: s.over, moveCount: s.moveCount
    };
  }

  /* ---- tra cứu ------------------------------------------------------- */
  function sideCells(s, p) {
    const start = p * (s.perSide + 1) + 1, out = [];
    for (let k = 0; k < s.perSide; k++) out.push(start + k);
    return out;
  }
  function quanIndex(s, p) { return p * (s.perSide + 1); }
  function ownerOf(s, i) { return s.cells[i].side; }
  function next(s, i, dir) { const L = s.cells.length; return (i + dir + L) % L; }

  function allQuanEmpty(s) {
    for (let i = 0; i < s.cells.length; i++) {
      const c = s.cells[i];
      if (c.kind === 'quan' && (c.dan > 0 || c.quan > 0)) return false;
    }
    return true;
  }

  function legalMoves(s, p) {
    if (p === undefined || p === null) p = s.turn;
    if (s.over) return [];
    const dirs = s.opts.lockDirection ? [s.opts.fixedDir] : [1, -1];
    const out = [];
    for (const i of sideCells(s, p)) {
      if (s.cells[i].dan > 0) for (const d of dirs) out.push({ cell: i, dir: d });
    }
    return out;
  }

  function score(s, p) {
    return s.captured[p].dan + s.captured[p].quan * s.opts.quanValue;
  }

  /* Tổng sỏi trên bàn + trong tay mọi người. Dùng để kiểm tra không rơi vãi. */
  function census(s) {
    let dan = 0, quan = 0;
    for (const c of s.cells) { dan += c.dan; quan += c.quan; }
    for (const c of s.captured) { dan += c.dan; quan += c.quan; }
    return { dan: dan, quan: quan };
  }

  /* ---- rải lại khi hết sỏi -------------------------------------------- */
  function needsRefill(s, p) {
    return sideCells(s, p).every(i => s.cells[i].dan === 0);
  }

  function refill(s, p, events) {
    const placed = [];
    for (const i of sideCells(s, p)) {
      let from = p;
      if (s.captured[p].dan > 0) {
        s.captured[p].dan--;
      } else {
        /* vay của người đang giữ nhiều dân nhất */
        let best = -1, bestv = 0;
        for (let q = 0; q < s.n; q++) {
          if (q !== p && s.captured[q].dan > bestv) { bestv = s.captured[q].dan; best = q; }
        }
        if (best < 0) {
          if (placed.length) events.push({ t: 'refill', player: p, placed: placed });
          return false;                     // cả làng hết sỏi, không rải nổi
        }
        s.captured[best].dan--;
        s.debt[p][best]++;
        from = best;
      }
      s.cells[i].dan++;
      placed.push({ cell: i, from: from });
    }
    events.push({ t: 'refill', player: p, placed: placed });
    return true;
  }

  /* ---- kết thúc ván --------------------------------------------------- */
  function finish(s, events, reason) {
    for (let p = 0; p < s.n; p++) {
      const got = [];
      for (const i of sideCells(s, p)) {
        const c = s.cells[i];
        if (c.dan || c.quan) {
          s.captured[p].dan += c.dan; s.captured[p].quan += c.quan;
          got.push({ cell: i, dan: c.dan, quan: c.quan });
          c.dan = 0; c.quan = 0;
        }
      }
      if (got.length) events.push({ t: 'sweep', player: p, got: got });
    }
    /* sỏi còn kẹt ở ô quan (chỉ xảy ra khi ván tàn vì bí nước): chia đôi cho
       hai người ngồi kề ô đó, lẻ ra thì phần người phía sau. */
    for (let c = 0; c < s.n; c++) {
      const qi = quanIndex(s, c), qc = s.cells[qi];
      if (!qc.dan && !qc.quan) continue;
      const after = c, before = (c - 1 + s.n) % s.n;
      const half = Math.floor(qc.dan / 2);
      s.captured[before].dan += half;
      s.captured[after].dan += qc.dan - half;
      if (qc.quan) s.captured[after].quan += qc.quan;
      events.push({ t: 'splitQuan', cell: qi, to: [before, after], dan: qc.dan, quan: qc.quan });
      qc.dan = 0; qc.quan = 0;
    }

    /* trả nợ đã vay */
    for (let p = 0; p < s.n; p++) {
      for (let q = 0; q < s.n; q++) {
        const d = s.debt[p][q];
        if (d > 0) {
          s.captured[p].dan -= d; s.captured[q].dan += d; s.debt[p][q] = 0;
          events.push({ t: 'settle', from: p, to: q, dan: d });
        }
      }
    }
    s.over = true;
    events.push({ t: 'over', reason: reason || 'hetquan' });
  }

  /* ---- đi một nước ----------------------------------------------------
     Sửa thẳng vào state, trả về danh sách sự kiện để giao diện chạy hoạt ảnh.
     Muốn thử nước mà không đổi ván thật thì clone() trước.                */
  function applyMove(s, move) {
    const events = [];
    if (s.over) return events;
    const p = s.turn;
    const dir = s.opts.lockDirection ? s.opts.fixedDir : (move.dir || 1);

    let pos = move.cell;
    if (s.cells[pos].kind !== 'dan' || s.cells[pos].side !== p || s.cells[pos].dan <= 0) {
      return events;                        // nước không hợp lệ, bỏ qua
    }

    let hand = s.cells[pos].dan;
    s.cells[pos].dan = 0;
    events.push({ t: 'pick', cell: pos, count: hand, player: p, chain: false });

    let guard = 0;
    while (true) {
      if (++guard > 4000) { events.push({ t: 'stall' }); break; }

      while (hand > 0) {
        pos = next(s, pos, dir);
        s.cells[pos].dan++;
        hand--;
        events.push({ t: 'sow', cell: pos, player: p, left: hand });
      }

      const nx = next(s, pos, dir);
      const nc = s.cells[nx];

      if (nc.kind === 'quan') { events.push({ t: 'stopQuan', cell: nx, player: p }); break; }

      if (nc.dan > 0) {                      // còn sỏi -> bốc tiếp
        hand = nc.dan; nc.dan = 0; pos = nx;
        events.push({ t: 'pick', cell: nx, count: hand, player: p, chain: true });
        continue;
      }

      /* ô kế tiếp trống -> ăn, và ăn liên hoàn nếu còn gặp trống-rồi-có */
      let cur = nx, ate = false, blocked = false, g2 = 0;
      while (++g2 < 200) {
        const tgt = next(s, cur, dir);
        const tc = s.cells[tgt];
        if (tc.dan > 0 || tc.quan > 0) {
          if (tc.kind === 'quan' && tc.quan > 0 && s.opts.quanNon > 0 && tc.dan < s.opts.quanNon) {
            events.push({ t: 'quanNon', cell: tgt, player: p, have: tc.dan, need: s.opts.quanNon });
            blocked = true;
            break;                                   // quan còn non, mất lượt
          }
          s.captured[p].dan += tc.dan;
          s.captured[p].quan += tc.quan;
          events.push({ t: 'eat', cell: tgt, dan: tc.dan, quan: tc.quan, player: p, kind: tc.kind });
          tc.dan = 0; tc.quan = 0;
          ate = true;
          cur = next(s, tgt, dir);
          const cc = s.cells[cur];
          if (cc.dan > 0 || cc.quan > 0) break;   // ô kế không trống -> thôi
        } else break;                              // hai ô trống liền -> thôi
      }
      if (!ate && !blocked) events.push({ t: 'stopEmpty', cell: nx, player: p });
      break;
    }

    s.moveCount++;

    if (allQuanEmpty(s)) { finish(s, events, 'hetquan'); return events; }

    /* chuyển lượt, rải lại cho ai hết sỏi */
    let q = p, found = false;
    for (let k = 0; k < s.n; k++) {
      q = (q + 1) % s.n;
      if (needsRefill(s, q)) refill(s, q, events);
      if (legalMoves(s, q).length > 0) { s.turn = q; found = true; break; }
    }
    if (!found) finish(s, events, 'bi');
    return events;
  }

  /* Thử một nước trên bản sao, trả về {state, events} — cho máy tính toán. */
  function simulate(s, move) {
    const c = clone(s);
    const ev = applyMove(c, move);
    return { state: c, events: ev };
  }

  const API = {
    DEFAULTS: DEFAULTS,
    newGame: newGame, clone: clone, simulate: simulate,
    sideCells: sideCells, quanIndex: quanIndex, ownerOf: ownerOf, next: next,
    legalMoves: legalMoves, applyMove: applyMove,
    score: score, census: census, needsRefill: needsRefill, allQuanEmpty: allQuanEmpty
  };
  return API;
})();

if (typeof module !== 'undefined' && module.exports) module.exports = OAQ;
