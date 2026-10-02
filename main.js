(function () {
  const articles = [
    {
      slug: "domestic-maas-token-wars-2026.html",
      title: "国内 MaaS 大战 2026：Token 经济的两条战线",
      date: "2026-06-02",
      tag: "MaaS",
      tags: ["MaaS", "Token经济", "国产AI"]
    },
    {
      slug: "domestic-ai-accelerator-ecosystem-2026.html",
      title: "国产 AI 加速器生态实战观察",
      date: "2026-06-02",
      tag: "AI加速器",
      tags: ["AI加速器", "量化", "国产AI"]
    },
    {
      slug: "andrej-karpathy-interviews.html",
      title: "Andrej Karpathy 访谈与演讲全记录",
      date: "2026-05-28",
      tag: "AI",
      tags: ["AI", "大模型", "访谈"]
    },
    {
      slug: "mena-companies-deep-report.html",
      title: "中东互联网独角兽深度报告",
      date: "2026-05-27",
      tag: "MENA",
      tags: ["MENA", "云计算", "ICT"]
    },
    {
      slug: "middle-east-article.html",
      title: "中东资本、东南亚算力：一场正在发生的产业迁移",
      date: "2026-05-23",
      tag: "AI算力",
      tags: ["东南亚", "IDC", "AI算力"]
    },
    {
      slug: "token-economy-2026.html",
      title: "Token 经济这一年：我们真的在见证一场定价革命吗？",
      date: "2026-05-23",
      tag: "Token经济",
      tags: ["AI", "Token经济", "大模型"]
    }
  ];

  const isArticlePage = location.pathname.includes("/articles/");

  function ensureProgressBar() {
    if (!isArticlePage && !document.body.classList.contains("report-page")) return;
    if (document.querySelector(".progress-bar")) return;
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    document.body.prepend(bar);

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function addReadingTime() {
    if (!isArticlePage) return;
    if (document.querySelector(".reading-time")) return;
    const body = document.querySelector(".article-body");
    if (!body) return;
    const text = body.innerText || "";
    const words = text.match(/[A-Za-z0-9]+|[\u4e00-\u9fff]/g) || [];
    const minutes = Math.max(2, Math.ceil(words.length / 420));
    const el = document.createElement("div");
    el.className = "reading-time";
    el.textContent = `${minutes} min read · 深度阅读`;

    const heroDate = document.querySelector(".bis-hero .date");
    const firstTitle = body.querySelector("h1");
    if (heroDate) {
      heroDate.insertAdjacentElement("afterend", el);
    } else if (firstTitle) {
      firstTitle.insertAdjacentElement("afterend", el);
    }
  }

  function addRelated() {
    if (!isArticlePage || document.querySelector(".related-wrap")) return;
    const current = decodeURIComponent(location.pathname.split("/").pop());
    const currentArticle = articles.find((article) => article.slug === current);
    if (!currentArticle) return;
    const scored = articles
      .filter((article) => article.slug !== current)
      .map((article) => ({
        ...article,
        score: article.tags.filter((tag) => currentArticle.tags.includes(tag)).length
      }))
      .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
      .slice(0, 3);

    if (!scored.length) return;
    const wrap = document.createElement("section");
    wrap.className = "related-wrap";
    wrap.innerHTML = `
      <div class="related-label">Related Reading</div>
      <h2 class="related-title">相关推荐</h2>
      <div class="related-grid">
        ${scored.map((article) => `
          <a class="related-card" href="${article.slug}">
            <span>${article.tag}</span>
            <strong>${article.title}</strong>
            <small>${article.date}</small>
          </a>
        `).join("")}
      </div>
    `;

    const container = document.querySelector(".article-body") || document.querySelector(".c");
    if (container) container.appendChild(wrap);
  }

  function markNavigation() {
    const path = location.pathname;
    document.querySelectorAll("a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href.includes("thailand-idc.html") && path.endsWith("/thailand-idc.html")) {
        link.classList.add("active");
      }
      if ((href === "../index.html" || href === "index.html") && path.endsWith("/index.html")) {
        link.classList.add("active");
      }
    });
  }

  function normalizeFooter() {
    const footer = document.querySelector("footer");
    if (!footer || footer.querySelector(".footer-links")) return;
    const rootPrefix = isArticlePage ? "../" : "";
    footer.innerHTML = `
      <div class="footer-inner">
        <p class="footer-links">
          <a href="https://github.com/liweicong2016-collab" target="_blank">GitHub</a>
          <a href="${rootPrefix}index.html">首页</a>
          <a href="${rootPrefix}thailand-idc.html">泰国IDC报告</a>
        </p>
        <p>© 2026 Livius · AI · Compute · Southeast Asia · All research for reference only</p>
      </div>
    `;
  }


  function addShareBar() {
    if (!isArticlePage || document.querySelector(".share-bar")) return;
    const container = document.querySelector(".article-body") || document.querySelector(".c");
    if (!container) return;
    const title = document.title || "";
    const url = location.href;
    const bar = document.createElement("div");
    bar.className = "share-bar";
    bar.innerHTML = `
      <span class="share-label">一键转发</span>
      <a class="share-btn" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}" title="分享到 X">X</a>
      <button class="share-btn" data-act="copy" title="复制链接">复制链接</button>
      <button class="share-btn" data-act="wechat" title="微信扫码转发">微信</button>
      ${navigator.share ? '<button class="share-btn" data-act="native" title="系统分享">更多</button>' : ''}
      <span class="share-tip"></span>
    `;
    const style = document.createElement("style");
    style.textContent = `
      .share-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:36px 0 8px;padding:18px 20px;border:1px solid #1e2d45;border-radius:12px;background:#0d1321}
      .share-label{font-size:13px;font-weight:700;color:#94a3b8;margin-right:4px}
      .share-btn{display:inline-flex;align-items:center;gap:6px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.25);color:#38bdf8;font-size:13px;font-weight:600;padding:8px 16px;border-radius:8px;cursor:pointer;text-decoration:none;font-family:inherit;transition:all .15s}
      .share-btn:hover{background:rgba(56,189,248,.2);transform:translateY(-1px)}
      .share-tip{font-size:12px;color:#34d399;min-height:16px}
    `;
    document.head.appendChild(style);
    container.appendChild(bar);
    const tip = bar.querySelector(".share-tip");
    bar.querySelector('[data-act="wechat"]').addEventListener("click", () => {
      let modal = document.getElementById("wx-share-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "wx-share-modal";
        modal.innerHTML = `
          <div class="wxm-bg"></div>
          <div class="wxm-box">
            <div class="wxm-title">微信扫码转发</div>
            <img class="wxm-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}" alt="QR">
            <div class="wxm-hint">微信扫一扫，在微信内打开后<br>点右上角转发给朋友 / 分享到朋友圈</div>
            <button class="wxm-close">关闭</button>
          </div>`;
        const st = document.createElement("style");
        st.textContent = `
          #wx-share-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center}
          #wx-share-modal .wxm-bg{position:absolute;inset:0;background:rgba(0,0,0,.65)}
          #wx-share-modal .wxm-box{position:relative;background:#0d1321;border:1px solid #1e2d45;border-radius:16px;padding:28px 32px;text-align:center;max-width:320px}
          #wx-share-modal .wxm-title{font-size:15px;font-weight:700;color:#e8eaf0;margin-bottom:16px}
          #wx-share-modal .wxm-qr{width:200px;height:200px;border-radius:8px;background:#fff;padding:8px}
          #wx-share-modal .wxm-hint{font-size:12.5px;color:#94a3b8;margin:14px 0 18px;line-height:1.7}
          #wx-share-modal .wxm-close{background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.25);color:#38bdf8;font-size:13px;padding:8px 28px;border-radius:8px;cursor:pointer;font-family:inherit}
        `;
        document.head.appendChild(st);
        document.body.appendChild(modal);
        modal.querySelector(".wxm-bg").addEventListener("click", () => modal.remove());
        modal.querySelector(".wxm-close").addEventListener("click", () => modal.remove());
      }
      modal.style.display = "flex";
    });

    bar.querySelector('[data-act="copy"]').addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(url);
        tip.textContent = "链接已复制";
      } catch (e) {
        const ta = document.createElement("textarea");
        ta.value = url; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); tip.textContent = "链接已复制"; }
        catch (_) { tip.textContent = "复制失败，请手动复制地址栏"; }
        ta.remove();
      }
      setTimeout(() => (tip.textContent = ""), 2000);
    });
    const nativeBtn = bar.querySelector('[data-act="native"]');
    if (nativeBtn) nativeBtn.addEventListener("click", () => {
      navigator.share({ title, url }).catch(() => {});
    });
  }

  ensureProgressBar();
  addReadingTime();
  addRelated();
  addShareBar();
  markNavigation();
  normalizeFooter();
}());
