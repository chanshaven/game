/* ============================================================================
   Ô ĂN QUAN — máy đấu

   Dễ     : đi gần như ngẫu nhiên, chỉ tránh nước dại rõ ràng.
   Thường : nhìn trước một nước — ăn được nhiều nhất, trừ đi chỗ đối thủ ăn lại.
   Khó    : minimax cắt tỉa alpha-beta. Nhánh chỉ có năm nước nên đào sâu được.

   Ô ăn quan không có yếu tố may rủi: cùng một thế, cùng một nước thì kết quả
   luôn như nhau. Nên minimax chạy thẳng, không cần mô phỏng xác suất.
   ========================================================================== */
const OAQ_AI = (function (E) {
  'use strict';

  const LEVELS = {
    de:     { name: 'Dễ',     depth: 0, noise: 1.0 },
    thuong: { name: 'Trung bình', depth: 2, noise: 0.25 },
    kho:    { name: 'Khó',    depth: 7, noise: 0 }
  };

  /* Điểm thế cờ dưới con mắt của người chơi me.
     Sỏi đã ăn là chắc ăn. Sỏi còn nằm bên phần mình chỉ đáng một phần nhỏ:
     cuối ván mới được vơ, mà từ giờ đến đó nó có thể chạy sang nhà hàng xóm. */
  function evaluate(s, me) {
    let best = -Infinity, mine = E.score(s, me);
    for (let q = 0; q < s.n; q++) if (q !== me) best = Math.max(best, E.score(s, q));
    let v = mine - best;

    for (let p = 0; p < s.n; p++) {
      let onside = 0;
      for (const i of E.sideCells(s, p)) onside += s.cells[i].dan;
      v += (p === me ? 0.12 : -0.12) * onside;
    }

    /* Quan chưa ai ăn: ai đang ở thế dễ với tới thì hơn một chút. Đo thô bằng
       khoảng cách từ ô có sỏi gần nhất của mình tới ô quan. Quan còn non thì
       chưa ăn được, coi như chưa đáng thèm. */
    const non = s.opts.quanNon || 0;
    for (let c = 0; c < s.n; c++) {
      const qi = E.quanIndex(s, c), qc = s.cells[qi];
      if (qc.quan <= 0) continue;
      const ripe = (non <= 0 || qc.dan >= non);
      const pot = qc.quan * s.opts.quanValue + qc.dan;
      if (!ripe) { v += 0.05 * qc.dan; continue; }
      for (let p = 0; p < s.n; p++) {
        let near = 99;
        for (const i of E.sideCells(s, p)) {
          if (s.cells[i].dan <= 0) continue;
          const d = (qi - i + s.cells.length) % s.cells.length;
          near = Math.min(near, d);
        }
        if (near < 99) v += (p === me ? 1 : -1) * pot * 0.02 * (1 / (1 + near));
      }
    }
    return v;
  }

  function terminalValue(s, me) {
    let best = -Infinity;
    for (let q = 0; q < s.n; q++) if (q !== me) best = Math.max(best, E.score(s, q));
    const d = E.score(s, me) - best;
    return d * 100;   // ván đã xong thì hơn hẳn mọi thế cờ đang dở
  }

  /* Minimax hai người. Ba bốn người thì dùng đánh giá tham một nước. */
  function search(s, me, depth, alpha, beta, nodes) {
    if (s.over) return terminalValue(s, me);
    if (depth <= 0) return evaluate(s, me);
    nodes.n++;
    if (nodes.n > nodes.cap) return evaluate(s, me);

    const turn = s.turn;
    const moves = E.legalMoves(s, turn);
    if (!moves.length) return evaluate(s, me);

    const maximizing = (turn === me);
    let best = maximizing ? -Infinity : Infinity;

    for (const mv of moves) {
      const c = E.clone(s);
      E.applyMove(c, mv);
      const v = search(c, me, depth - 1, alpha, beta, nodes);
      if (maximizing) {
        if (v > best) best = v;
        if (best > alpha) alpha = best;
      } else {
        if (v < best) best = v;
        if (best < beta) beta = best;
      }
      if (beta <= alpha) break;
    }
    return best;
  }

  /* Ăn được bao nhiêu trong chính nước này */
  function immediateGain(events, p) {
    let g = 0;
    for (const e of events) if (e.t === 'eat' && e.player === p) g += e.dan + e.quan * 10;
    return g;
  }

  function pick(state, level) {
    const L = LEVELS[level] || LEVELS.thuong;
    const me = state.turn;
    const moves = E.legalMoves(state, me);
    if (!moves.length) return null;
    if (moves.length === 1) return moves[0];

    const scored = [];

    if (L.depth <= 0) {
      /* Dễ: chấm điểm rất thô — ăn được thì thích, ngoài ra tuỳ hứng. */
      for (const mv of moves) {
        const r = E.simulate(state, mv);
        scored.push({ mv: mv, v: immediateGain(r.events, me) * 0.5 + Math.random() * 6 });
      }
    } else if (state.n > 2) {
      /* Nhiều người: tham một nước, có nhìn qua nước trả đũa của người kế tiếp. */
      for (const mv of moves) {
        const r = E.simulate(state, mv);
        let v = immediateGain(r.events, me) + evaluate(r.state, me) * 0.5;
        if (!r.state.over) {
          const nxt = r.state.turn;
          if (nxt !== me) {
            let worst = 0;
            for (const m2 of E.legalMoves(r.state, nxt)) {
              worst = Math.max(worst, immediateGain(E.simulate(r.state, m2).events, nxt));
            }
            v -= worst * 0.8;
          }
        }
        scored.push({ mv: mv, v: v });
      }
    } else {
      const nodes = { n: 0, cap: 120000 };
      for (const mv of moves) {
        const c = E.clone(state);
        E.applyMove(c, mv);
        const v = search(c, me, L.depth - 1, -Infinity, Infinity, nodes);
        scored.push({ mv: mv, v: v });
      }
    }

    if (L.noise > 0) for (const s of scored) s.v += (Math.random() - 0.5) * L.noise * 4;

    scored.sort((a, b) => b.v - a.v);
    return scored[0].mv;
  }

  return { LEVELS: LEVELS, pick: pick, evaluate: evaluate };
})(typeof module !== 'undefined' && module.exports ? require('./engine.js') : OAQ);

if (typeof module !== 'undefined' && module.exports) module.exports = OAQ_AI;
