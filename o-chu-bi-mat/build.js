/* ============================================================================
   Gộp index.html + questions.js + game.js thành MỘT file duy nhất
   để gửi qua Zalo / email / USB, mở phát chạy luôn.

   Cách chạy:  node build.js
   Kết quả:    o-chu-bi-mat-1-file.html
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const OUT = 'o-chu-bi-mat-1-file.html';

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

html = html.replace(/[ \t]*<script src="([^"]+)"><\/script>\r?\n?/g, (m, src) => {
  const file = path.join(dir, src);
  if (!fs.existsSync(file)) { console.warn('Không thấy file:', src, '— bỏ qua'); return m; }
  const code = fs.readFileSync(file, 'utf8').replace(/<\/script>/gi, '<\\/script>');
  console.log('  gộp', src, '(' + code.length + ' ký tự)');
  return '<script>\n/* ===== ' + src + ' ===== */\n' + code + '\n</script>\n';
});

fs.writeFileSync(path.join(dir, OUT), html, 'utf8');
console.log('Xong ->', OUT, '(' + html.length + ' ký tự)');
