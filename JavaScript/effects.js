/* Site-wide visual effects: ambient background, scroll progress,
   navbar states, scroll-reveal, hero typing, card tilt + spotlight. */
document.addEventListener('DOMContentLoaded', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- Ambient background ---------- */
    const bg = document.createElement('div');
    bg.className = 'bg-fx';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<div class="bg-orbs">'
        + '<div class="bg-orb bg-orb--1"></div>'
        + '<div class="bg-orb bg-orb--2"></div>'
        + '<div class="bg-orb bg-orb--3"></div>'
        + '<div class="bg-beam bg-beam--1"></div>'
        + '<div class="bg-beam bg-beam--2"></div>'
        + '</div>';
    document.body.prepend(bg);
    const orbLayer = bg.querySelector('.bg-orbs');

    /* ---------- Scroll progress bar ---------- */
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    const navbar = document.querySelector('.navbar');
    let ticking = false;

    function onScroll() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /* ---------- Active nav link ---------- */
    const norm = p => p.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
    const page = norm(location.pathname.toLowerCase());
    document.querySelectorAll('.nav-links a').forEach(link => {
        const raw = link.getAttribute('href') || '';
        if (raw.startsWith('mailto:') || raw.startsWith('http')) return;
        if (norm(new URL(raw, location.href).pathname.toLowerCase()) === page) {
            link.classList.add('active-link');
        }
    });

    /* ---------- Scroll-reveal (staggered per container) ---------- */
    const revealSelector = [
        '.tech-item',
        '.goals ul li',
        '.repository-card',
        '.resume-card',
        '.app-card'
    ].join(', ');

    const targets = document.querySelectorAll(revealSelector);
    if (targets.length && !reducedMotion && 'IntersectionObserver' in window) {
        const groups = new Map();
        targets.forEach(el => {
            const parent = el.parentElement;
            const index = groups.get(parent) || 0;
            groups.set(parent, index + 1);
            el.setAttribute('data-rv', '');
            el.style.setProperty('--rv-delay', Math.min(index * 70, 560) + 'ms');
        });

        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('rv-in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.01, rootMargin: '0px 0px 18% 0px' });

        targets.forEach(el => revealObserver.observe(el));

        // safety net: never leave content invisible if the observer misfires
        setTimeout(() => {
            targets.forEach(el => el.classList.add('rv-in'));
        }, 4000);
    }

    // same safety net for the legacy .visible reveal used by page scripts
    setTimeout(() => {
        document.querySelectorAll('.project-card, .certification-card, .career-step-content, .moving-dot')
            .forEach(el => el.classList.add('visible'));
    }, 4000);

    /* ---------- Hero typing effect (home page only) ---------- */
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && document.querySelector('.profile-flip-card') && !reducedMotion) {
        const phrases = [
            'DevOps Engineer',
            'Cloud Architect',
            'AWS & GCP Certified',
            'Automation Enthusiast'
        ];
        heroTitle.textContent = '';
        const text = document.createElement('span');
        const caret = document.createElement('span');
        caret.className = 'type-caret';
        heroTitle.append(text, caret);

        let phrase = 0, char = 0, deleting = false;

        function tick() {
            const current = phrases[phrase];
            char += deleting ? -1 : 1;
            text.textContent = current.slice(0, char);

            let delay = deleting ? 40 : 75;
            if (!deleting && char === current.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && char === 0) {
                deleting = false;
                phrase = (phrase + 1) % phrases.length;
                delay = 400;
            }
            setTimeout(tick, delay);
        }
        tick();
    }

    /* ---------- Constellation particles (desktop only) ---------- */
    if (finePointer && !reducedMotion && window.innerWidth > 768) {
        const canvas = document.createElement('canvas');
        canvas.className = 'bg-particles';
        canvas.setAttribute('aria-hidden', 'true');
        bg.appendChild(canvas);
        const cx = canvas.getContext('2d');

        let W, H, dots = [];
        const mouse = { x: -9999, y: -9999 };
        let accent = [79, 143, 247];

        function readAccent() {
            const hex = getComputedStyle(document.body).getPropertyValue('--clr-primary').trim();
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (m) accent = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
        }
        readAccent();
        const modeSwitchEl = document.getElementById('modeSwitch');
        if (modeSwitchEl) modeSwitchEl.addEventListener('change', () => setTimeout(readAccent, 50));

        function resize() {
            const rect = bg.getBoundingClientRect();
            W = canvas.width = Math.round(rect.width);
            H = canvas.height = Math.round(rect.height);
            const count = Math.min(50, Math.floor(W * H / 34000));
            dots = Array.from({ length: count }, () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.6
            }));
        }
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

        const LINK = 110, MOUSE_LINK = 160;

        // canvas sits inside .bg-fx (inset: -40px) and never moves — constant offset
        const CANVAS_OFFSET = 40;

        (function draw() {
            cx.clearRect(0, 0, W, H);
            const [r, g, b] = accent;
            const mX = mouse.x + CANVAS_OFFSET, mY = mouse.y + CANVAS_OFFSET;

            for (const d of dots) {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0 || d.x > W) d.vx *= -1;
                if (d.y < 0 || d.y > H) d.vy *= -1;
                cx.beginPath();
                cx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                cx.fillStyle = `rgba(${r},${g},${b},0.5)`;
                cx.fill();
            }

            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < LINK) {
                        cx.beginPath();
                        cx.moveTo(dots[i].x, dots[i].y);
                        cx.lineTo(dots[j].x, dots[j].y);
                        cx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / LINK) * 0.18})`;
                        cx.stroke();
                    }
                }
                const mdx = dots[i].x - mX, mdy = dots[i].y - mY;
                const mdist = Math.hypot(mdx, mdy);
                if (mdist < MOUSE_LINK) {
                    cx.beginPath();
                    cx.moveTo(dots[i].x, dots[i].y);
                    cx.lineTo(mX, mY);
                    cx.strokeStyle = `rgba(${r},${g},${b},${(1 - mdist / MOUSE_LINK) * 0.3})`;
                    cx.stroke();
                }
            }
            requestAnimationFrame(draw);
        })();
    }

    /* ---------- Background parallax on cursor ---------- */
    if (finePointer && !reducedMotion) {
        let tx = 0, ty = 0, px = 0, py = 0;
        window.addEventListener('pointermove', e => {
            tx = (e.clientX / window.innerWidth - 0.5) * 26;
            ty = (e.clientY / window.innerHeight - 0.5) * 18;
        }, { passive: true });
        (function drift() {
            px += (tx - px) * 0.04;
            py += (ty - py) * 0.04;
            orbLayer.style.transform = 'translate3d(' + px.toFixed(2) + 'px,' + py.toFixed(2) + 'px,0)';
            requestAnimationFrame(drift);
        })();
    }

    /* ---------- Magnetic CTA buttons ---------- */
    if (finePointer && !reducedMotion) {
        document.querySelectorAll('.cta-button').forEach(btn => {
            btn.addEventListener('pointermove', e => {
                const rect = btn.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform =
                    'translate(' + (dx * 0.22).toFixed(1) + 'px,' + (dy * 0.22 - 4).toFixed(1) + 'px) scale(1.03)';
            });
            btn.addEventListener('pointerleave', () => {
                btn.style.transform = '';
            });
        });
    }

    /* ---------- Card tilt + cursor spotlight ---------- */
    if (finePointer && !reducedMotion) {
        const tiltSelector = '.project-card, .certification-card, .resume-card, .app-card, .tile';
        const noTilt = ['tile-intro', 'tile-terminal', 'tile-stats', 'tile-link', 'tile-photo'];
        const MAX_TILT = 5;

        document.querySelectorAll(tiltSelector).forEach(card => {
            const spotlightOnly = noTilt.some(c => card.classList.contains(c));

            card.addEventListener('pointermove', e => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
                if (spotlightOnly) return;
                const rx = ((0.5 - py) * MAX_TILT).toFixed(2);
                const ry = ((px - 0.5) * MAX_TILT).toFixed(2);
                card.style.transform =
                    'translateY(-7px) perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Animated terminal (bento home) ---------- */
    const term = document.getElementById('terminal');
    if (term) {
        const script = [
            { cmd: 'whoami', out: [['t-dim', 'matvey — devops engineer']] },
            { cmd: 'terraform apply -auto-approve', out: [['t-ok', 'Apply complete! Resources: 42 added, 0 destroyed.']] },
            { cmd: 'kubectl get pods -n prod', out: [['t-ok', 'All pods Running  ✔']] },
            { cmd: 'ls ~/certifications | wc -l', out: [['t-dim', '10']] },
            { cmd: 'echo "$COFFEE_LEVEL"', out: [['t-ok', '▓▓▓▓▓▓▓▓▓▓ 100%']] }
        ];

        function render(lines, typing) {
            term.innerHTML = lines.map(l => l).join('\n')
                + (typing !== undefined
                    ? '\n<span class="t-prompt">$</span> ' + typing + '<span class="term-caret"></span>'
                    : '\n<span class="t-prompt">$</span> <span class="term-caret"></span>');
        }

        if (reducedMotion) {
            const all = [];
            script.forEach(s => {
                all.push('<span class="t-prompt">$</span> ' + s.cmd);
                s.out.forEach(([cls, txt]) => all.push('<span class="' + cls + '">' + txt + '</span>'));
            });
            render(all.slice(-8));
        } else {
            const MAX_LINES = 6;
            let history = [], step = 0;

            function typeCmd(cmd, i, done) {
                render(history, cmd.slice(0, i));
                if (i <= cmd.length) {
                    setTimeout(() => typeCmd(cmd, i + 1, done), 34 + Math.random() * 40);
                } else {
                    setTimeout(done, 350);
                }
            }

            (function play() {
                const s = script[step % script.length];
                typeCmd(s.cmd, 0, () => {
                    history.push('<span class="t-prompt">$</span> ' + s.cmd);
                    s.out.forEach(([cls, txt]) => history.push('<span class="' + cls + '">' + txt + '</span>'));
                    history = history.slice(-MAX_LINES);
                    render(history);
                    step++;
                    setTimeout(play, 1900);
                });
            })();
        }
    }

    /* ---------- Count-up stats ---------- */
    const statNums = document.querySelectorAll('.stat-num[data-count]');
    if (statNums.length) {
        function countUp(el) {
            if (el.dataset.done) return;
            el.dataset.done = '1';
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            if (reducedMotion) { el.textContent = target + suffix; return; }
            const t0 = performance.now(), dur = 1400;
            (function tick(now) {
                const p = Math.min((now - t0) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(t0);
        }

        if ('IntersectionObserver' in window) {
            const statObs = new IntersectionObserver(entries => {
                entries.forEach(en => {
                    if (en.isIntersecting) {
                        countUp(en.target);
                        statObs.unobserve(en.target);
                    }
                });
            }, { threshold: 0.4 });
            statNums.forEach(el => statObs.observe(el));
            // safety net: never leave counters at 0 if the observer misfires
            setTimeout(() => statNums.forEach(countUp), 4000);
        } else {
            statNums.forEach(countUp);
        }
    }

    /* ---------- Command palette (⌘K) ---------- */
    (function cmdk() {
        const S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
        const ICONS = {
            home: S + '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
            user: S + '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
            rocket: S + '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
            box: S + '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
            file: S + '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
            award: S + '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
            download: S + '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
            mail: S + '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
            moon: S + '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
            github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12v3.14c0 .3.21.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
            linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>'
        };
        const items = [
            { icon: ICONS.home, label: 'Home', hint: 'page', act: () => location.href = '/' },
            { icon: ICONS.user, label: 'About', hint: 'page', act: () => location.href = '/about/' },
            { icon: ICONS.rocket, label: 'Projects', hint: 'page', act: () => location.href = '/projects/' },
            { icon: ICONS.box, label: 'Repositories', hint: 'page', act: () => location.href = '/repositories/' },
            { icon: ICONS.file, label: 'Resume', hint: 'page', act: () => location.href = '/resume/' },
            { icon: ICONS.award, label: 'Certifications', hint: 'page', act: () => location.href = '/certifications/' },
            { icon: ICONS.download, label: 'Download CV (PDF)', hint: 'action', act: () => location.href = '/PDF/resume-eng.pdf' },
            { icon: ICONS.mail, label: 'Send me an email', hint: 'action', act: () => location.href = 'mailto:mathewguralskiy@gmail.com' },
            { icon: ICONS.moon, label: 'Toggle day / night theme', hint: 'action', act: () => { const s = document.getElementById('modeSwitch'); if (s) { s.checked = !s.checked; s.dispatchEvent(new Event('change')); } } },
            { icon: ICONS.github, label: 'Open GitHub profile', hint: 'link', act: () => window.open('https://github.com/MatveyGuralskiy', '_blank', 'noopener') },
            { icon: ICONS.linkedin, label: 'Open LinkedIn', hint: 'link', act: () => window.open('https://www.linkedin.com/in/matveyguralskiy/', '_blank', 'noopener') }
        ];

        const btn = document.createElement('button');
        btn.className = 'cmdk-btn';
        btn.setAttribute('aria-label', 'Open command palette');
        btn.innerHTML = '<span class="cmdk-btn-label">Search</span><kbd>⌘K</kbd>';
        document.body.appendChild(btn);

        const overlay = document.createElement('div');
        overlay.className = 'cmdk-overlay';
        overlay.innerHTML = '<div class="cmdk" role="dialog" aria-label="Command palette">'
            + '<input class="cmdk-input" type="text" placeholder="Type a command or search…" autocomplete="off">'
            + '<div class="cmdk-list"></div></div>';
        document.body.appendChild(overlay);

        const input = overlay.querySelector('.cmdk-input');
        const list = overlay.querySelector('.cmdk-list');
        let filtered = items, sel = 0;

        function paint() {
            if (!filtered.length) {
                list.innerHTML = '<div class="cmdk-empty">No results</div>';
                return;
            }
            list.innerHTML = filtered.map((it, i) =>
                '<div class="cmdk-item' + (i === sel ? ' sel' : '') + '" data-i="' + i + '">'
                + '<span class="ci-icon">' + it.icon + '</span><span>' + it.label + '</span>'
                + '<span class="ci-hint">' + it.hint + '</span></div>'
            ).join('');
        }

        function open() {
            overlay.classList.add('open');
            input.value = '';
            filtered = items;
            sel = 0;
            paint();
            setTimeout(() => input.focus(), 30);
        }

        function close() {
            overlay.classList.remove('open');
        }

        btn.addEventListener('click', open);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            filtered = items.filter(it => it.label.toLowerCase().includes(q));
            sel = 0;
            paint();
        });

        list.addEventListener('click', e => {
            const item = e.target.closest('.cmdk-item');
            if (item) { close(); filtered[+item.dataset.i].act(); }
        });

        window.addEventListener('keydown', e => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                overlay.classList.contains('open') ? close() : open();
                return;
            }
            if (!overlay.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % filtered.length; paint(); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; paint(); }
            else if (e.key === 'Enter' && filtered[sel]) { close(); filtered[sel].act(); }
        });
    })();
});
