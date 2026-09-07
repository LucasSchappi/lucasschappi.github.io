/* Schappi Studios — site behaviour. No dependencies. */
(function () {
  "use strict";

  /* -- Mobile navigation --------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* -- Header shadow on scroll --------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -- Scroll reveal -------------------------------------------------- */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* -- Trailer: swap poster for the real embed on click --------------- */
  /* Playable game embeds. The game is only fetched once someone asks to play,
     so visiting a page that carries one costs nothing. */
  document.querySelectorAll("[data-play]").forEach(function (embed) {
    var stage = embed.querySelector(".play-embed__stage");
    var start = embed.querySelector(".play-embed__start");
    var full = embed.querySelector("[data-fullscreen]");
    if (!stage) return;

    function launch() {
      if (stage.querySelector("iframe")) return stage.querySelector("iframe");
      var src = embed.getAttribute("data-play");
      if (!src) return null;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = embed.getAttribute("data-play-title") || "Game";
      iframe.allowFullscreen = true;
      stage.innerHTML = "";
      stage.appendChild(iframe);
      iframe.focus();
      return iframe;
    }

    if (start) {
      start.addEventListener("click", function (e) {
        e.preventDefault();
        launch();
      });
    }

    if (full) {
      full.addEventListener("click", function (e) {
        e.preventDefault();
        launch();
        var req = stage.requestFullscreen || stage.webkitRequestFullscreen;
        if (!req) {
          // No fullscreen API (older iOS Safari). Fall through to the link's
          // own href, which opens the game on its own page.
          window.location.href = embed.getAttribute("data-play");
          return;
        }
        var done = req.call(stage);
        if (done && done.catch) done.catch(function () {});
        var iframe = stage.querySelector("iframe");
        if (iframe) iframe.focus();
      });
    }

    // Keep focus in the game whenever the frame is clicked, otherwise the
    // keys go to the page behind it.
    document.addEventListener("fullscreenchange", function () {
      var iframe = stage.querySelector("iframe");
      if (iframe) iframe.focus();
    });
  });

  document.querySelectorAll("[data-video]").forEach(function (frame) {
    var btn = frame.querySelector(".play-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var src = frame.getAttribute("data-video");
      if (!src) return;
      var iframe = document.createElement("iframe");
      iframe.src = src + (src.indexOf("?") === -1 ? "?" : "&") + "autoplay=1";
      iframe.title = frame.getAttribute("data-video-title") || "Trailer";
      iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.innerHTML = "";
      frame.appendChild(iframe);
    });
  });

  /* -- Screenshot lightbox -------------------------------------------- */
  var gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    var shots = Array.prototype.slice.call(gallery.querySelectorAll("button"));
    var index = 0;

    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Screenshot viewer");
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<img alt="">' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>';
    document.body.appendChild(box);

    var boxImg = box.querySelector("img");
    var lastFocus = null;

    function show(i) {
      index = (i + shots.length) % shots.length;
      var src = shots[index].getAttribute("data-full") ||
                shots[index].querySelector("img").getAttribute("src");
      boxImg.src = src;
      boxImg.alt = shots[index].querySelector("img").getAttribute("alt") || "";
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add("is-open");
      document.body.classList.add("nav-open");
      box.querySelector(".lightbox__close").focus();
    }
    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      if (lastFocus) lastFocus.focus();
    }

    shots.forEach(function (btn, i) {
      btn.addEventListener("click", function () { open(i); });
    });
    box.querySelector(".lightbox__close").addEventListener("click", close);
    box.querySelector(".lightbox__nav--prev").addEventListener("click", function () { show(index - 1); });
    box.querySelector(".lightbox__nav--next").addEventListener("click", function () { show(index + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });

    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === "ArrowRight") show(index + 1);
    });
  }

  /* -- Copy-to-clipboard (press kit boilerplate) ---------------------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.querySelector(btn.getAttribute("data-copy"));
      if (!target || !navigator.clipboard) return;
      navigator.clipboard.writeText(target.innerText.trim()).then(function () {
        var original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = original; }, 1800);
      });
    });
  });

  /* -- Forms ----------------------------------------------------------
     No backend wired up yet. Point `action` at Formspree / Buttondown /
     ConvertKit and delete this block, or keep it and POST via fetch.     */
  document.querySelectorAll("[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (!form.getAttribute("action")) {
        e.preventDefault();
        var status = form.querySelector(".form-status");
        if (status) {
          status.textContent = "Form not connected yet — see README.md step 4.";
        }
      }
    });
  });

  /* -- Footer year ----------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Game of the day. A static site has no server to ask, so the choice comes
     from the date: everyone opening the page on the same day sees the same
     game, and it moves on at midnight. The markup already contains a real
     entry, so this only ever swaps one working thing for another. */
  var featured = document.querySelector("[data-game-of-the-day]");
  if (featured) {
    var GAMES = [
      {
        title: "Schappi\u2019s Flight Simulator",
        desc: "Fly a light aircraft over terrain that is generated as you go. Dawn, dusk or night, and a different world every time.",
        href: "/games/flight-sim/",
        img: "/assets/img/flight-sim-cover.jpg?v=1",
        alt: "A light aircraft banking over a lake at dusk",
        cta: "Play in your browser"
      },
      {
        title: "God Sim",
        desc: "A few thousand simulated people on a planet. Villages, faiths and wars come out of the rules rather than a script.",
        href: "/games/god-sim/",
        img: "/assets/img/god-sim.jpg",
        alt: "The God Sim world-creation screen",
        cta: "Play in your browser"
      },
      {
        title: "Fire Arcade",
        desc: "An unblocked games site built on Google Sites \u2014 so most school filters can't block it. Free, no account, nothing to install.",
        href: "https://sites.google.com/schappi.com/fire-arcade",
        img: "/assets/img/fire-arcade-card.jpg",
        alt: "The Fire Arcade home page",
        cta: "Visit Fire Arcade"
      }
    ];

    // Whole days since the epoch, in local time, so it turns over at midnight
    // rather than at some hour that depends on where you are.
    var now = new Date();
    var days = Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000
    );
    var game = GAMES[((days % GAMES.length) + GAMES.length) % GAMES.length];

    var set = function (sel, fn) {
      var el = featured.querySelector(sel);
      if (el) fn(el);
    };
    set("[data-gotd-title]", function (el) { el.textContent = game.title; });
    set("[data-gotd-desc]", function (el) { el.textContent = game.desc; });
    set("[data-gotd-link]", function (el) { el.href = game.href; });
    set("[data-gotd-cta]", function (el) { el.href = game.href; el.textContent = game.cta; });
    set("[data-gotd-img]", function (el) { el.src = game.img; el.alt = game.alt; });
  }


  /* Game of the week poll ------------------------------------------------
     A static site cannot count votes on its own, so this talks to a small
     API. Set POLL_ENDPOINT to switch it on; while it is empty, or if the
     request fails, the section stays hidden and the page is simply without
     it. See docs/poll-api.md for the API this expects. */
  var POLL_ENDPOINT = "";

  var poll = document.querySelector("[data-poll]");
  if (poll && POLL_ENDPOINT) {
    var POLL_GAMES = [
      { id: "flight-sim", name: "Schappi’s Flight Simulator" },
      { id: "god-sim", name: "God Sim" },
      { id: "turret-showdown", name: "Turret Showdown" },
      { id: "sheep-and-tree-world", name: "Sheep and Tree World" }
    ];

    var list = poll.querySelector("[data-poll-list]");
    var status = poll.querySelector("[data-poll-status]");

    /* ISO week, so the poll turns over on Monday the same way everywhere and
       the key is something a human can read in the database. */
    function isoWeek(d) {
      var t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));   // Thursday of this week
      var jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
      var week = Math.ceil(((t - jan1) / 86400000 + 1) / 7);
      return t.getUTCFullYear() + "-W" + (week < 10 ? "0" + week : week);
    }
    var week = isoWeek(new Date());
    var voteKey = "poll-vote-" + week;

    function myVote() {
      try { return localStorage.getItem(voteKey); } catch (e) { return null; }
    }
    function remember(id) {
      try { localStorage.setItem(voteKey, id); } catch (e) {}
    }

    function render(votes, voted) {
      var total = 0;
      POLL_GAMES.forEach(function (g) { total += votes[g.id] || 0; });
      list.innerHTML = "";
      POLL_GAMES.forEach(function (g) {
        var n = votes[g.id] || 0;
        var li = document.createElement("li");
        var row = document.createElement("button");
        row.type = "button";
        row.className = "poll__row" + (voted === g.id ? " poll__row--mine" : "");
        if (voted) row.disabled = true;

        var bar = document.createElement("span");
        bar.className = "poll__bar";
        bar.style.width = voted && total ? Math.round((n / total) * 100) + "%" : "0";

        var name = document.createElement("span");
        name.className = "poll__name";
        name.textContent = g.name;

        var count = document.createElement("span");
        count.className = "poll__count";
        // Counts stay hidden until you vote, so the tally cannot lead you.
        count.textContent = voted
          ? n + (n === 1 ? " vote" : " votes")
          : "Vote";

        row.appendChild(bar);
        row.appendChild(name);
        row.appendChild(count);
        row.addEventListener("click", function () { cast(g.id); });
        li.appendChild(row);
        list.appendChild(li);
      });
      status.textContent = voted
        ? total + (total === 1 ? " vote" : " votes") + " this week. Thanks for voting."
        : "";
    }

    function cast(id) {
      if (myVote()) return;
      remember(id);
      render({}, id);
      status.textContent = "Counting…";
      fetch(POLL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: week, game: id })
      })
        .then(function (r) { return r.json(); })
        .then(function (data) { render(data.votes || {}, id); })
        .catch(function () {
          status.textContent = "Your vote could not be sent. Try again later.";
        });
    }

    fetch(POLL_ENDPOINT + "?week=" + encodeURIComponent(week))
      .then(function (r) {
        if (!r.ok) throw new Error("poll unavailable");
        return r.json();
      })
      .then(function (data) {
        render(data.votes || {}, myVote());
        poll.hidden = false;   // only now is there anything worth showing
      })
      .catch(function () { /* leave the section hidden */ });
  }

})();
