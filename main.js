(() => {
  const languages = ["zh", "en", "ja", "vi"];
  const root = new URL("/my-website/", window.location.origin);

  const homeUrl = (lang) => {
    if (lang === "zh") return root.href;
    return new URL(lang + "/", root).href;
  };

  document.querySelectorAll(".lang-switch .lang-btn").forEach((button) => {
    const lang = button.dataset.lang;
    if (!languages.includes(lang)) return;
    button.href = homeUrl(lang);
    button.classList.toggle("active", lang === (document.querySelector(".lang-switch")?.dataset.current || "zh"));
  });

  const articlePage = window.location.pathname.includes("/articles/");
  const reportPage = document.body.classList.contains("report-page") || window.location.pathname.endsWith("thailand-idc.html");

  if (articlePage || reportPage) {
    let bar = document.querySelector(".progress-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "progress-bar";
      document.body.prepend(bar);
    }
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0) + "%";
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  if (articlePage) {
    const body = document.querySelector(".article-body");
    if (body && !document.querySelector(".reading-time")) {
      const text = body.innerText || "";
      const tokens = text.match(/[A-Za-z0-9]+|[\u4e00-\u9fff]/g) || [];
      const readingTime = document.createElement("div");
      readingTime.className = "reading-time";
      readingTime.textContent = Math.max(2, Math.ceil(tokens.length / 420)) + " min read · 深度阅读";
      const date = document.querySelector(".bis-hero .date");
      if (date) date.insertAdjacentElement("afterend", readingTime);
    }
  }

  const footer = document.querySelector("footer");
  if (footer && !footer.querySelector(".footer-links")) {
    const prefix = articlePage ? "../" : "";
    footer.innerHTML = '<div class="footer-inner"><p class="footer-links">' +
      '<a href="https://github.com/liweicong2016-collab" target="_blank">GitHub</a>' +
      '<a href="' + prefix + 'index.html">首页</a>' +
      '<a href="' + prefix + 'thailand-idc.html">泰国IDC报告</a>' +
      '</p><p>© 2026 Livius · AI · Compute · Southeast Asia · All research for reference only</p></div>';
  }
})();