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

  ensureProgressBar();
  addReadingTime();
  addRelated();
  markNavigation();
  normalizeFooter();
}());
