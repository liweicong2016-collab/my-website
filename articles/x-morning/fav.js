/* X早报收藏 · 本地数据库(localStorage) + 本页置顶
 * 用法: digest 页在 </body> 前引用 <script src="fav.js"></script>,
 * 并在 .meta 后放置 <section id="fav-pin" hidden><h2 class="sec">♥ 收藏置顶</h2><div id="fav-pin-list"></div></section>
 */
(function () {
"use strict";
var KEY = "xmorning_favs";
function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
function paint(btn, on) {
  btn.textContent = on ? "\u2665" : "\u2661";
  btn.classList.toggle("on", !!on);
  btn.title = on ? "取消收藏" : "收藏";
}
function dataOf(item) {
  var a = item.querySelector('.src a[href*="/status/"]');
  if (!a) return null;
  var m = a.href.match(/\/status\/(\d+)/);
  if (!m) return null;
  var h3 = item.querySelector("h3"), p = item.querySelector("p");
  var sec = "", n = item.previousElementSibling;
  while (n) {
    if (n.tagName === "H2" && n.classList.contains("sec")) { sec = n.textContent.trim(); break; }
    n = n.previousElementSibling;
  }
  var h1 = document.querySelector("h1");
  return {
    id: m[1],
    t: h3 ? h3.textContent.trim() : "",
    s: p ? p.textContent.trim().slice(0, 220) : "",
    h: (a.textContent || "").trim(),
    u: a.href,
    d: h1 ? h1.textContent.trim() : "",
    sec: sec
  };
}
function toggle(d) {
  var favs = load(), on = !!favs[d.id];
  if (on) { delete favs[d.id]; } else { favs[d.id] = Object.assign({ ts: Date.now() }, d); }
  save(favs);
  var els = document.querySelectorAll('.fav-btn[data-tid="' + d.id + '"]'), i;
  for (i = 0; i < els.length; i++) paint(els[i], !on);
  renderPin();
}
function renderPin() {
  var sec = document.getElementById("fav-pin"), list = document.getElementById("fav-pin-list");
  if (!sec || !list) return;
  list.innerHTML = "";
  var favs = load(), shown = 0;
  Array.prototype.forEach.call(document.querySelectorAll(".item"), function (item) {
    if (item.closest("#fav-pin-list")) return;
    var id = item.getAttribute("data-tid");
    if (id && favs[id] && item._fav) {
      var c = item.cloneNode(true), d = item._fav;
      Array.prototype.forEach.call(c.querySelectorAll(".fav-btn"), function (b) {
        paint(b, true);
        b.onclick = function (ev) { ev.preventDefault(); ev.stopPropagation(); toggle(d); };
      });
      list.appendChild(c);
      shown++;
    }
  });
  sec.hidden = shown === 0;
}
document.addEventListener("DOMContentLoaded", function () {
  Array.prototype.forEach.call(document.querySelectorAll(".item"), function (item) {
    if (item.closest("#fav-pin-list")) return;
    var d = dataOf(item);
    if (!d) return;
    item.setAttribute("data-tid", d.id);
    item._fav = d;
    var src = item.querySelector(".src");
    if (src && !src.querySelector(".fav-btn")) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fav-btn";
      b.setAttribute("data-tid", d.id);
      paint(b, !!load()[d.id]);
      b.onclick = function (ev) { ev.preventDefault(); ev.stopPropagation(); toggle(d); };
      src.appendChild(b);
    }
  });
  renderPin();
});
})();
