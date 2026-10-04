// Временный скрипт: показать, что кабинет отрисовал в блоке «Последняя заявка»
const fs = require("fs");
const os = require("os");
const path = require("path");

const file = path.join(os.tmpdir(), "cab2.html");
const html = fs.readFileSync(file, "utf8");
const i = html.indexOf("Последняя заявка");
const chunk = html
  .slice(Math.max(0, i - 100), i + 900)
  .replace(/<[^>]+>/g, "|")
  .replace(/\|+/g, " | ");
console.log(chunk.slice(0, 600));
