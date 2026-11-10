"use strict";

(function () {
  var THEME_KEY = "jaxx-theme";
  var LANG_KEY = "jaxx-lang";

  var copy = {
    zh: {
      htmlLang: "zh-CN",
      title: "赛博吴同学 · Jaxx Wu",
      ogTitle: "赛博吴同学",
      description: "探索极限之外",
      ogLocale: "zh_CN",
      langGroup: "语言",
      brand: "赛博吴同学",
      lede: "探索极限之外",
      factIdentityLabel: "视频号",
      factIdentity: "赛博吴同学",
      factXLabel: "X",
      factEmailLabel: "邮箱",
      skip: "跳到主要内容",
      themeToDark: "切换到深色",
      themeToLight: "切换到浅色"
    },
    en: {
      htmlLang: "en",
      title: "Jaxx Wu · 赛博吴同学",
      ogTitle: "Jaxx Wu",
      description: "Exploring beyond the limits",
      ogLocale: "en_US",
      langGroup: "Language",
      brand: "Jaxx Wu",
      lede: "Exploring beyond the limits",
      factIdentityLabel: "WeChat Channels",
      factIdentity: "赛博吴同学",
      factXLabel: "X",
      factEmailLabel: "Email",
      skip: "Skip to content",
      themeToDark: "Switch to dark theme",
      themeToLight: "Switch to light theme"
    }
  };

  var lang = "zh";
  var theme = "light";
  var langGroup = document.querySelector(".seg");
  var themeButton = document.getElementById("theme");
  var heading = document.querySelector("h1");
  var nameZh = heading.querySelector(".name-zh");
  var nameEn = heading.querySelector(".name-en");

  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {}
  }

  function setMeta(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.setAttribute("content", value);
  }

  function themeLabel() {
    var pack = copy[lang];
    return theme === "dark" ? pack.themeToLight : pack.themeToDark;
  }

  function applyTheme(next) {
    theme = next === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    setMeta('meta[name="theme-color"]', theme === "dark" ? "#0b0d12" : "#f3efe6");
    themeButton.setAttribute("aria-label", themeLabel());
  }

  function applyLang(next) {
    lang = next === "en" ? "en" : "zh";
    var pack = copy[lang];
    var root = document.documentElement;
    root.lang = pack.htmlLang;
    root.setAttribute("data-lang", lang);
    document.title = pack.title;
    setMeta('meta[name="description"]', pack.description);
    setMeta('meta[property="og:title"]', pack.ogTitle);
    setMeta('meta[property="og:description"]', pack.description);
    setMeta('meta[property="og:locale"]', pack.ogLocale);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (pack[key] == null) return;
      var html = String(pack[key]).split("赛博吴同学").join("<span class=\"keep\">赛博吴同学</span>");
      el.innerHTML = html;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (pack[key] != null) el.setAttribute("aria-label", pack[key]);
    });

    langGroup.querySelectorAll("[data-lang-set]").forEach(function (button) {
      var selected = button.getAttribute("data-lang-set") === lang;
      button.setAttribute("aria-checked", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
    });

    heading.insertBefore(nameZh, nameEn);

    themeButton.setAttribute("aria-label", themeLabel());
  }

  var savedTheme = readStorage(THEME_KEY);
  var savedLang = readStorage(LANG_KEY);
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : (systemDark ? "dark" : "light"));
  applyLang(savedLang === "en" ? "en" : "zh");

  langGroup.addEventListener("click", function (event) {
    var button = event.target.closest("[data-lang-set]");
    if (!button) return;
    var next = button.getAttribute("data-lang-set");
    writeStorage(LANG_KEY, next);
    applyLang(next);
  });

  langGroup.addEventListener("keydown", function (event) {
    var forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    var backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;
    event.preventDefault();
    var next = forward ? (lang === "zh" ? "en" : "zh") : (lang === "en" ? "zh" : "en");
    writeStorage(LANG_KEY, next);
    applyLang(next);
    langGroup.querySelector('[data-lang-set="' + next + '"]').focus();
  });

  themeButton.addEventListener("click", function () {
    var next = theme === "dark" ? "light" : "dark";
    writeStorage(THEME_KEY, next);
    applyTheme(next);
    if (document.documentElement.getAttribute("data-motion") === "reduce") redrawScene();
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
    var stored = readStorage(THEME_KEY);
    if (stored === "dark" || stored === "light") return;
    applyTheme(event.matches ? "dark" : "light");
    if (document.documentElement.getAttribute("data-motion") === "reduce") redrawScene();
  });

  var redrawScene = function () {};
  mountScene(document.getElementById("scene"), function (redraw) { redrawScene = redraw; });

  function mountScene(canvas, bindRedraw) {
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    var phi = (1 + Math.sqrt(5)) / 2;
    var rawVerts = [
      [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
      [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1]
    ];
    var faces = [
      [0, 1, 8], [0, 8, 4], [0, 4, 5], [0, 5, 9], [0, 9, 1],
      [1, 6, 8], [8, 6, 10], [8, 10, 4], [4, 10, 2], [4, 2, 5],
      [5, 2, 11], [5, 11, 9], [9, 11, 7], [9, 7, 1], [1, 7, 6],
      [3, 6, 7], [3, 10, 6], [3, 2, 10], [3, 11, 2], [3, 7, 11]
    ];
    var verts = rawVerts.map(normalize);
    var edges = edgesFromFaces(faces);
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var finePointer = window.matchMedia("(pointer: fine)").matches;
    var dust = [];
    var dustBucket = 0;
    var raf = 0;
    var last = 0;
    var spin = 0.55;
    var width = 0;
    var height = 0;
    var parallaxX = 0;
    var parallaxY = 0;
    var targetX = 0;
    var targetY = 0;
    var current = null;
    var paintTheme = "";

    ensureDust();

    function normalize(v) {
      var length = Math.hypot(v[0], v[1], v[2]) || 1;
      return [v[0] / length, v[1] / length, v[2] / length];
    }

    function edgesFromFaces(source) {
      var seen = Object.create(null);
      var list = [];
      source.forEach(function (face) {
        [[0, 1], [1, 2], [2, 0]].forEach(function (pair) {
          var a = face[pair[0]];
          var b = face[pair[1]];
          var key = a < b ? a + "-" + b : b + "-" + a;
          if (seen[key]) return;
          seen[key] = true;
          list.push([a, b]);
        });
      });
      return list;
    }

    function parseRgb(value, fallback) {
      var parts = String(value).split(",").map(function (part) { return Number(part.trim()); });
      if (parts.length !== 3 || parts.some(function (n) { return Number.isNaN(n); })) return fallback.slice();
      return parts;
    }

    function mix(from, to, amount) {
      return [
        from[0] + (to[0] - from[0]) * amount,
        from[1] + (to[1] - from[1]) * amount,
        from[2] + (to[2] - from[2]) * amount
      ];
    }

    function rgba(rgb, alpha) {
      return "rgba(" + (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0) + "," + alpha + ")";
    }

    function rotate(v, yaw, pitch) {
      var cy = Math.cos(yaw);
      var sy = Math.sin(yaw);
      var x1 = v[0] * cy + v[2] * sy;
      var z1 = -v[0] * sy + v[2] * cy;
      var cp = Math.cos(pitch);
      var sp = Math.sin(pitch);
      return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
    }

    function ensureDust() {
      var bucket = window.innerWidth < 760 ? 28 : 56;
      if (bucket === dustBucket) return;
      dustBucket = bucket;
      dust = [];
      for (var i = 0; i < bucket; i += 1) {
        var orbit = i % 2;
        dust.push({
          orbit: orbit,
          angle: (i / bucket) * Math.PI * 2 + (i % 5) * 0.17,
          speed: (0.045 + (i % 7) * 0.008) * (i % 2 === 0 ? 1 : -1),
          radius: orbit === 0 ? 1.58 : 1.95,
          lift: ((i % 9) - 4) * 0.035,
          tilt: orbit === 0 ? 0.62 : -0.38,
          size: i % 11 === 0 ? 2.1 : 0.75 + (i % 4) * 0.28
        });
      }
    }

    function colors() {
      var style = getComputedStyle(document.documentElement);
      return {
        line: parseRgb(style.getPropertyValue("--scene-line"), [224, 196, 150]),
        node: parseRgb(style.getPropertyValue("--scene-node"), [176, 224, 208]),
        dust: parseRgb(style.getPropertyValue("--scene-dust"), [232, 220, 196]),
        face: parseRgb(style.getPropertyValue("--scene-face"), [224, 196, 150])
      };
    }

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1.35 : 1.75);
      var cssWidth = canvas.clientWidth || window.innerWidth;
      var cssHeight = canvas.clientHeight || window.innerHeight;
      var bitmapWidth = Math.max(1, Math.round(cssWidth * dpr));
      var bitmapHeight = Math.max(1, Math.round(cssHeight * dpr));
      if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
        canvas.width = bitmapWidth;
        canvas.height = bitmapHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = cssWidth;
      height = cssHeight;
      ensureDust();
    }

    function project(point, originX, originY, radius) {
      var camera = 4.15;
      var scale = camera / (camera - point[2]);
      return {
        x: originX + point[0] * radius * scale,
        y: originY - point[1] * radius * scale,
        z: point[2],
        scale: scale
      };
    }

    function drawGem(originX, originY, radius, yaw, pitch, alphaScale, facesOn, palette) {
      var view = verts.map(function (vertex) {
        return rotate(vertex, yaw, pitch);
      });
      var light = normalize([0.35, 0.8, 1]);
      var projected = view.map(function (vertex) {
        return project(vertex, originX, originY, radius);
      });

      if (facesOn) {
        var faceOrder = faces.map(function (face, index) {
          var a = view[face[0]];
          var b = view[face[1]];
          var c = view[face[2]];
          var ux = b[0] - a[0];
          var uy = b[1] - a[1];
          var uz = b[2] - a[2];
          var vx = c[0] - a[0];
          var vy = c[1] - a[1];
          var vz = c[2] - a[2];
          var normal = normalize([uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx]);
          var shade = Math.max(0, normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]);
          return {
            index: index,
            depth: (a[2] + b[2] + c[2]) / 3,
            shade: shade
          };
        }).sort(function (a, b) { return a.depth - b.depth; });

        faceOrder.forEach(function (item) {
          var face = faces[item.index];
          var a = projected[face[0]];
          var b = projected[face[1]];
          var c = projected[face[2]];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.lineTo(c.x, c.y);
          ctx.closePath();
          ctx.fillStyle = rgba(palette.face, (0.015 + item.shade * 0.09) * alphaScale);
          ctx.fill();
        });
      }

      edges.forEach(function (edge) {
        var a = projected[edge[0]];
        var b = projected[edge[1]];
        var depth = (a.z + b.z) / 2;
        var closeness = (depth + 1.2) / 2.4;
        var alpha = (0.18 + closeness * 0.72) * alphaScale;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineWidth = (2.8 + closeness * 1.4) * ((a.scale + b.scale) / 2);
        ctx.strokeStyle = rgba(palette.line, alpha * 0.18);
        ctx.stroke();
        ctx.lineWidth = (1.05 + closeness * 0.45) * ((a.scale + b.scale) / 2);
        ctx.strokeStyle = rgba(palette.line, alpha);
        ctx.stroke();
      });

      if (!facesOn) return;
      projected.forEach(function (point) {
        var closeness = (point.z + 1.2) / 2.4;
        var nodeRadius = (1.7 + closeness * 2.1) * point.scale;
        var glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, nodeRadius * 3.2);
        glow.addColorStop(0, rgba(palette.node, 0.85 * alphaScale));
        glow.addColorStop(1, rgba(palette.node, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, nodeRadius * 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function drawOrbit(originX, originY, radius, tilt, scale, yaw, pitch, alpha, palette) {
      ctx.beginPath();
      for (var i = 0; i <= 80; i += 1) {
        var angle = (i / 80) * Math.PI * 2;
        var x = Math.cos(angle) * scale;
        var y = 0;
        var z = Math.sin(angle) * scale;
        var ct = Math.cos(tilt);
        var st = Math.sin(tilt);
        var tilted = [x, y * ct - z * st, y * st + z * ct];
        var point = project(rotate(tilted, yaw, pitch), originX, originY, radius);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      }
      ctx.strokeStyle = rgba(palette.line, alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function draw(now) {
      if (!width || !height) return;
      var reduced = motionQuery.matches;
      document.documentElement.setAttribute("data-motion", reduced ? "reduce" : "full");
      var time = reduced ? 0 : now / 1000;
      spin = 0.7 + time * 0.12;

      var themeName = document.documentElement.getAttribute("data-theme") || "";
      var target = colors();
      if (!current || themeName !== paintTheme && reduced) {
        current = {
          line: target.line.slice(),
          node: target.node.slice(),
          dust: target.dust.slice(),
          face: target.face.slice()
        };
      }
      paintTheme = themeName;
      if (reduced) {
        current = target;
      } else {
        current.line = mix(current.line, target.line, 0.08);
        current.node = mix(current.node, target.node, 0.08);
        current.dust = mix(current.dust, target.dust, 0.08);
        current.face = mix(current.face, target.face, 0.08);
      }

      if (!reduced && finePointer) {
        parallaxX += (targetX - parallaxX) * 0.06;
        parallaxY += (targetY - parallaxY) * 0.06;
      } else {
        parallaxX *= 0.9;
        parallaxY *= 0.9;
      }

      var mobile = width < 760;
      var compact = !mobile && width < 1240;
      var originX = mobile ? width * 0.86 : (compact ? width * 0.84 : width * 0.76);
      var originY = mobile ? height * 0.2 : height * 0.47;
      var radius = Math.min(width, height) * (mobile ? 0.3 : compact ? 0.175 : 0.21);
      var pitch = 0.52 + parallaxY + (reduced ? 0 : Math.sin(time * 0.22) * 0.05);
      var yaw = parallaxX;

      ctx.clearRect(0, 0, width, height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      var halo = ctx.createRadialGradient(originX, originY, radius * 0.15, originX, originY, radius * 2.35);
      halo.addColorStop(0, rgba(current.line, mobile ? 0.07 : 0.11));
      halo.addColorStop(1, rgba(current.line, 0));
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(originX, originY, radius * 2.35, 0, Math.PI * 2);
      ctx.fill();

      drawOrbit(originX, originY, radius, 0.62, 1.58, yaw, pitch, 0.28, current);
      if (!mobile && !compact) drawOrbit(originX, originY, radius, -0.38, 1.95, yaw, pitch, 0.18, current);

      dust.forEach(function (speck) {
        var angle = speck.angle + (reduced ? 0 : time * speck.speed);
        var x = Math.cos(angle) * speck.radius;
        var y = speck.lift;
        var z = Math.sin(angle) * speck.radius;
        var ct = Math.cos(speck.tilt);
        var st = Math.sin(speck.tilt);
        var point = project(rotate([x, y * ct - z * st, y * st + z * ct], yaw, pitch), originX, originY, radius);
        ctx.fillStyle = rgba(current.dust, 0.35 + (point.z + 1) * 0.18);
        ctx.beginPath();
        ctx.arc(point.x, point.y, speck.size * point.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!mobile && !compact) {
        drawGem(originX, originY, radius * 1.55, -spin * 0.45 + 0.8, pitch + 0.35, 0.28, false, current);
      }
      drawGem(originX, originY, radius, spin, pitch, 1, true, current);
    }

    function frame(now) {
      raf = window.requestAnimationFrame(frame);
      if (now - last < 32) return;
      last = now;
      draw(now);
    }

    function syncMotion() {
      var reduced = motionQuery.matches;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      resize();
      if (reduced || document.hidden) {
        draw(performance.now());
        return;
      }
      last = 0;
      raf = window.requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", function (event) {
      if (!finePointer || motionQuery.matches) return;
      targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.62) * 0.45;
      targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.48) * 0.28;
    }, { passive: true });

    document.addEventListener("visibilitychange", syncMotion);
    motionQuery.addEventListener("change", syncMotion);
    window.addEventListener("resize", syncMotion);
    if ("ResizeObserver" in window) {
      var observer = new ResizeObserver(syncMotion);
      observer.observe(canvas);
    }
    bindRedraw(function () { draw(performance.now()); });
    syncMotion();
  }
})();
