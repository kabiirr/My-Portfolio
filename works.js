/* ==========================================================================
   Works page (grid.html)
   Three views over the same set of shots:
     1. Canvas — an infinite, wrapping light table you drag, throw and zoom,
                 drawn in WebGL (works-gl.js) so it bends with your drag
     2. Pile   — the shots as cards you can grab and fling (GSAP Draggable + Inertia)
     3. Index  — a clothesline per live project, sagging under its own shots
   Any shot opens the case view, which flies the image out of where you clicked.
   Full-page captures ("long" shots) scroll on hover and scroll for real in the
   case view. Optional interface sounds come from works-sound.js.
   ========================================================================== */
(() => {
    'use strict';

    gsap.registerPlugin(Draggable, InertiaPlugin);

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const dur = (s) => (reduceMotion ? 0 : s);

    /* ----------------------------------------------------------------------
       Content
       Blurbs come from each design's own headline copy.
       TODO(kabir): names for the two untitled projects, and live links for
       the projects that have url: null.
       ---------------------------------------------------------------------- */
    const PROJECTS = [
        {
            key: 'mederva',
            name: 'Mederva',
            blurb: 'Longevity care, covered by insurance. Continuous care powered by intelligent clarity.',
            tags: ['Web design', 'Social'],
            url: null,
        },
        {
            key: 'pintours',
            name: 'Pintours',
            blurb: 'Operational AI for real-world experience design, across travel, mobility, events and entertainment.',
            tags: ['Web design', 'AI'],
            url: null,
        },
        {
            key: 'primer',
            name: 'Primer Field',
            blurb: 'World models for real decisions: a substrate for generating and inspecting future states.',
            tags: ['Web design', 'Social'],
            url: null,
        },
        {
            key: 'axion',
            name: 'Axion',
            blurb: 'Neural performance, redefined for real people. Technology designed for humans, not cyborgs.',
            tags: ['Design', 'Framer dev'],
            url: 'https://www.axionclick.com/',
        },
        {
            key: 'plrium',
            name: 'Plrium',
            blurb: 'Business banking for building great things: one platform for cards, treasury, bill pay and insights.',
            tags: ['Web design', 'Fintech'],
            url: null,
        },
        {
            key: 'wilan',
            name: 'Wilan Institute',
            blurb: 'Propelling women forward. Step into your leadership future today.',
            tags: ['Design'],
            url: 'https://www.wilaninstitute.com/',
        },
        {
            key: 'ream',
            name: 'Ream',
            blurb: 'The AI-powered CAD tool for engineers who would rather build than click. Swap clicks for commands.',
            tags: ['Web design', 'Product'],
            url: null,
        },
        {
            key: 'pillybook',
            name: 'PillyBook',
            blurb: 'A friendly notebook designed to support real learning. Add a thought and see where it goes.',
            tags: ['Brand', 'Social'],
            url: null,
        },
        {
            key: 'reave',
            name: 'Reave AI',
            blurb: 'Accelerate your revenue with AI-driven sales intelligence.',
            tags: ['Web design', 'SaaS'],
            url: null,
        },
        {
            key: 'emir',
            name: 'Emir',
            blurb: 'Fixing the way roofs get fixed. Guaranteed pricing, real-time tracking, national coverage.',
            tags: ['Web design'],
            url: null,
        },
        {
            key: 'minised',
            name: 'Minised',
            blurb: 'Trusted by leading AI builders and enterprise teams.',
            tags: ['Web design'],
            url: null,
        },
        {
            key: 'enesee',
            name: 'Enesee',
            blurb: 'Tokenized growth systems for Web3 launches that scale. Your liquidity event deserves more than just a mod.',
            tags: ['Design', 'Framer dev'],
            url: 'https://www.enesee.agency/',
        },
        {
            key: 'cosamote',
            name: 'Cosamote',
            blurb: 'A collective agency for the daring.',
            tags: ['Web design'],
            url: null,
        },
        {
            key: 'fintech',
            name: 'Untitled fintech',
            blurb: 'A global account and card for builders, dreamers and doers everywhere: instant payouts, stocks, ETFs and crypto.',
            tags: ['Campaign', 'Fintech'],
            url: null,
        },
        {
            key: 'careers',
            name: 'Untitled careers',
            blurb: 'A vacancy board: explore current openings and find your next role.',
            tags: ['Web design'],
            url: null,
        },
    ];

    /* iw / ih: the export's pixel size, used for layout before images load.
       long: a page taller than its tile, which scrolls on hover. */
    const SHOTS = [
        { id: 'mederva-hero', project: 'mederva', iw: 1600, ih: 900, alt: 'Mederva homepage: Longevity care, covered by insurance' },
        { id: 'mederva-cream', project: 'mederva', iw: 1600, ih: 900, alt: 'Mederva homepage in cream with pastel stripes' },
        { id: 'mederva-conditions', project: 'mederva', iw: 1600, ih: 900, alt: 'Mederva section: Conditions we support' },
        { id: 'mederva-focus', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: Health, in focus' },
        { id: 'mederva-score', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: Your healthspan score' },
        { id: 'mederva-water', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: weekly water intake card over a portrait' },
        { id: 'mederva-arch', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: Focus changes everything' },
        { id: 'mederva-pills', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: a ticker of taglines on teal' },
        { id: 'mederva-stats', project: 'mederva', iw: 1293, ih: 1616, alt: 'Mederva post: outcome stats on an orange gradient' },
        { id: 'pintours-hero', project: 'pintours', iw: 1600, ih: 969, alt: 'Pintours homepage: Operational AI for real-world experience design' },
        { id: 'pintours-engine', project: 'pintours', iw: 1600, ih: 1483, alt: 'Pintours section: A fully integrated experience engine' },
        { id: 'primer-trust', project: 'primer', iw: 1600, ih: 900, alt: 'Primer Field: Built for environments where trust is mandatory' },
        { id: 'primer-simulation', project: 'primer', iw: 1600, ih: 880, alt: 'Primer Field homepage: Simulation, not speculation' },
        { id: 'primer-substrate', project: 'primer', iw: 1600, ih: 2000, alt: 'Primer Field post: A substrate for generating and inspecting future states' },
        { id: 'primer-world-models', project: 'primer', iw: 1600, ih: 2000, alt: 'Primer Field post: World models for real decisions' },
        { id: 'axion-performance', project: 'axion', iw: 1600, ih: 802, alt: 'Axion: Neural performance, redefined for real people' },
        { id: 'axion-neural', project: 'axion', iw: 1492, ih: 681, alt: 'Axion hero with a sculpted headset render' },
        { id: 'axion-footer', project: 'axion', iw: 1600, ih: 803, alt: 'Axion footer: Technology designed for humans, not cyborgs' },
        { id: 'plrium-hero', project: 'plrium', iw: 1600, ih: 1032, alt: 'Plrium homepage: Business banking for building great things' },
        { id: 'plrium-features', project: 'plrium', iw: 1600, ih: 1139, alt: 'Plrium feature grid: Access an entire financial platform' },
        { id: 'plrium-banking', project: 'plrium', iw: 1600, ih: 912, alt: 'Plrium section: Everything you need for smooth banking' },
        { id: 'plrium-pink', project: 'plrium', iw: 1600, ih: 1421, alt: 'Plrium pink gradient hero and footer' },
        { id: 'wilan-leadership', project: 'wilan', iw: 1600, ih: 1170, alt: 'Wilan Institute: Step into your leadership future today' },
        { id: 'wilan-mentors', project: 'wilan', iw: 1600, ih: 1230, alt: 'Wilan Institute: Your experience can shape someone’s future' },
        { id: 'wilan-news', project: 'wilan', iw: 1600, ih: 799, alt: 'Wilan Institute news cards' },
        { id: 'wilan-leadership-wide', project: 'wilan', iw: 1600, ih: 1174, alt: 'Wilan Institute leadership call to action and footer' },
        { id: 'ream-site', project: 'ream', iw: 1600, ih: 843, alt: 'Ream homepage: Swap clicks for commands' },
        { id: 'ream-describe', project: 'ream', iw: 764, ih: 943, alt: 'Ream card: Describe the part' },
        { id: 'ream-builders', project: 'ream', iw: 724, ih: 943, alt: 'Ream card: For the builders' },
        { id: 'ream-geometry', project: 'ream', iw: 775, ih: 956, alt: 'Ream card on dark red' },
        { id: 'ream-card', project: 'ream', iw: 775, ih: 956, alt: 'Ream card: The Language of Geometry' },
        { id: 'pillybook-thought', project: 'pillybook', iw: 1274, ih: 1437, alt: 'PillyBook poster: Add a thought and see where it goes' },
        { id: 'pillybook-tools', project: 'pillybook', iw: 1600, ih: 1805, alt: 'PillyBook poster: The best tools are the ones kids want to return to' },
        { id: 'pillybook-ideas', project: 'pillybook', iw: 1600, ih: 1805, alt: 'PillyBook poster: Where ideas feel comfortable' },
        { id: 'pillybook-stickers', project: 'pillybook', iw: 1212, ih: 1367, alt: 'PillyBook sticker sheet' },
        { id: 'reave-hero', project: 'reave', iw: 1600, ih: 1554, alt: 'Reave AI homepage: Accelerate your revenue with AI-driven sales intelligence' },
        { id: 'reave-sales', project: 'reave', iw: 1600, ih: 1724, long: true, alt: 'Reave AI page: Sales teams still lose countless hours on repetitive work' },
        { id: 'emir-hero', project: 'emir', iw: 1600, ih: 871, alt: 'Emir homepage: Fixing the way roofs get fixed' },
        { id: 'emir-quote', project: 'emir', iw: 1600, ih: 1849, long: true, alt: 'Emir quote form and footer over a painted sky' },
        { id: 'minised-footer', project: 'minised', iw: 1600, ih: 1144, alt: 'Minised: Trusted by leading AI builders, with footer' },
        { id: 'minised-testimonials', project: 'minised', iw: 1600, ih: 967, alt: 'Minised testimonial cards' },
        { id: 'enesee-liquidity', project: 'enesee', iw: 1600, ih: 984, alt: 'Enesee: Your liquidity event deserves more than just a mod' },
        { id: 'cosamote', project: 'cosamote', iw: 1600, ih: 953, alt: 'Cosamote homepage: A collective agency for the daring' },
        { id: 'fintech-payouts', project: 'fintech', iw: 1600, ih: 1034, alt: 'Fintech campaign: instant payouts anywhere, London to Nigeria and Ghana' },
        { id: 'fintech-stocks', project: 'fintech', iw: 1600, ih: 1034, alt: 'Fintech campaign: US stocks, ETFs, crypto and rewards' },
        { id: 'fintech-creators', project: 'fintech', iw: 1600, ih: 1034, alt: 'Fintech campaign: Serving creators, founders and teams' },
        { id: 'fintech-app', project: 'fintech', iw: 1600, ih: 1428, alt: 'Fintech campaign: For the way you work and spend now' },
        { id: 'careers-vacancy', project: 'careers', iw: 1600, ih: 797, alt: 'Careers page vacancy board' },
    ].map((s) => ({ focusY: s.long ? 0 : 0.5, ...s, src: `assets/works/shots/${s.id}.jpg` }));

    const projectOf = (shot) => PROJECTS.find((p) => p.key === shot.project);
    const shotsOf = (key) => SHOTS.filter((s) => s.project === key);
    const pad2 = (n) => String(n).padStart(2, '0');

    /* ----------------------------------------------------------------------
       Canvas geometry. The shots are laid out once as justified rows of mixed
       heights (one "block"), and that block repeats in every direction.
       Every row spans the full block width, so the wrap seams are invisible.
       ---------------------------------------------------------------------- */
    const GAP = 13;
    const BLOCK_W = 2900;
    const ROW_H = [300, 250, 340, 270, 320, 285, 260];
    const LONG_ASPECT = 1.25; // long pages show a landscape window onto the page
    const START = { x: 24, y: 84 }; // first tile sits just under the top chrome
    const ZOOM = { min: 0.4, max: 1.6, overview: 0.45 };
    const MAX_TILE = { w: 700, h: 400 };

    const NOTES = [
        { aspect: 1.35, html: `<span><strong>Selected works</strong>Kabir — web design</span><span>${pad2(PROJECTS.length)} projects · ${pad2(SHOTS.length)} shots</span>` },
        { aspect: 1.6, html: '<span><strong>Drag anywhere</strong>Click a shot to open the project</span><span>2 for the pile · 3 for the index</span>' },
    ];

    /** Round-robin across projects so shots from the same project rarely sit together */
    function interleave() {
        const queues = PROJECTS.map((p) => SHOTS.filter((s) => s.project === p.key));
        const out = [];
        // Alternate the direction each round so neighbours change from round to round
        for (let round = 0; queues.some((q) => q.length); round++) {
            const order = round % 2 ? [...queues].reverse() : queues;
            order.forEach((q) => q.length && out.push(q.shift()));
        }
        return out;
    }

    function layoutBlock() {
        const items = interleave().map((shot) => ({ shot, aspect: shot.long ? LONG_ASPECT : shot.iw / shot.ih }));
        items.splice(4, 0, { note: NOTES[0], aspect: NOTES[0].aspect });
        items.splice(Math.floor(items.length * 0.6), 0, { note: NOTES[1], aspect: NOTES[1].aspect });

        // Greedy rows: add items until the row overflows the block width at its target height
        const rows = [];
        let row = [];
        let sum = 0;
        for (const it of items) {
            row.push(it);
            sum += it.aspect;
            const target = ROW_H[rows.length % ROW_H.length];
            if (sum * target + GAP * (row.length - 1) >= BLOCK_W) {
                rows.push(row);
                row = [];
                sum = 0;
            }
        }
        if (row.length) {
            // A short leftover row would blow up to a huge height, so fold it into the last one
            const target = ROW_H[rows.length % ROW_H.length];
            if (rows.length && sum * target < BLOCK_W * 0.6) rows[rows.length - 1].push(...row);
            else rows.push(row);
        }

        // Scale each row to fill the block width exactly
        let y = 0;
        for (const r of rows) {
            const h = (BLOCK_W - GAP * (r.length - 1)) / r.reduce((a, it) => a + it.aspect, 0);
            let x = 0;
            for (const it of r) {
                it.x = Math.round(x);
                it.y = Math.round(y);
                it.w = Math.round(it.aspect * h);
                it.h = Math.round(h);
                x += it.aspect * h + GAP;
            }
            y += h + GAP;
        }
        return { w: BLOCK_W, h: Math.round(y), items };
    }

    const BLOCK = layoutBlock();
    for (const it of BLOCK.items) if (it.shot) Object.assign(it.shot, { x: it.x, y: it.y, w: it.w, h: it.h });

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

    const body = document.body;
    const stage = $('#stage');
    const world = $('#world');
    const glCanvas = $('.stage__gl');
    const pileEl = $('#pile');
    const indexList = $('#index-list');
    const caseEl = $('#case');
    const helpEl = $('#help');
    const cursor = $('.cursor');
    const cursorLabel = $('.cursor__label');

    let vw = innerWidth;
    let vh = innerHeight;
    let view = 'canvas';
    let busy = false; // true while a view or case transition runs

    const sound = window.createWorksSound();

    /* ======================================================================
       1. Canvas
       ====================================================================== */
    const cam = {
        x: START.x, y: START.y, z: 1, // rendered
        tx: START.x, ty: START.y, tz: 1, // target
        vx: 0, vy: 0,
    };
    const EASE = reduceMotion ? 1 : 0.085;

    // { el, img, shot | null, lx, ly, w, h, col, row, depth, x, y, visible, hover, dim, scroll, reveal }
    let tiles = [];
    let grid = { cols: 0, rows: 0 };
    let needsRender = true;

    // WebGL is for fine pointers with motion allowed; everyone else gets plain DOM images
    let glr = null;
    let glOn = false;
    if (finePointer && !reduceMotion) {
        try {
            glr = window.createWorksGL(glCanvas);
        } catch (err) {
            console.warn('[works] WebGL unavailable, using DOM images', err);
        }
    }

    function layoutCopies() {
        const cols = Math.ceil((vw / ZOOM.min + MAX_TILE.w) / BLOCK.w);
        const rows = Math.ceil((vh / ZOOM.min + MAX_TILE.h) / BLOCK.h);
        if (cols === grid.cols && rows === grid.rows) return;
        grid = { cols, rows };

        world.textContent = '';
        tiles = [];
        const frag = document.createDocumentFragment();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // The first copy is the one in the tab order and the one that plays the intro
                const primary = row === 0 && col === 0;

                BLOCK.items.forEach((it, n) => {
                    if (it.note) {
                        const note = document.createElement('div');
                        note.className = 'tile tile--note';
                        note.setAttribute('aria-hidden', 'true');
                        note.style.width = `${it.w}px`;
                        note.style.height = `${it.h}px`;
                        note.innerHTML = it.note.html;
                        frag.append(note);
                        tiles.push({ el: note, shot: null, lx: it.x, ly: it.y, w: it.w, h: it.h, col, row, depth: 1 });
                        return;
                    }

                    const shot = it.shot;
                    const i = SHOTS.indexOf(shot);
                    const el = document.createElement('button');
                    el.type = 'button';
                    el.className = shot.long ? 'tile tile--long' : 'tile';
                    el.dataset.shot = i;
                    el.style.width = `${it.w}px`;
                    el.style.height = `${it.h}px`;
                    if (primary) {
                        el.setAttribute('aria-label', `Open ${projectOf(shot).name}: ${shot.alt}`);
                    } else {
                        el.tabIndex = -1;
                        el.setAttribute('aria-hidden', 'true');
                    }
                    const img = document.createElement('img');
                    img.src = shot.src;
                    img.alt = '';
                    img.decoding = 'async';
                    img.draggable = false;
                    img.style.objectPosition = `50% ${shot.focusY * 100}%`;
                    el.append(img);
                    frag.append(el);
                    tiles.push({
                        el, img, shot, lx: it.x, ly: it.y, w: it.w, h: it.h, col, row, intro: primary,
                        depth: 0.3 + ((n * 7) % 10) / 10, hover: 0, dim: 0, scroll: 0, reveal: 1,
                    });
                });
            }
        }
        world.append(frag);
        needsRender = true;
    }

    const wrap = (v, span) => ((v % span) + span) % span;
    const lag = () => ({
        x: reduceMotion ? 0 : gsap.utils.clamp(-40, 40, cam.vx * 1.6),
        y: reduceMotion ? 0 : gsap.utils.clamp(-40, 40, cam.vy * 1.6),
    });

    function render() {
        const spanX = grid.cols * BLOCK.w;
        const spanY = grid.rows * BLOCK.h;
        const startX = vw / 2 - spanX / 2;
        const startY = vh / 2 - spanY / 2;
        const v = lag();

        // The table squeezes a touch while it moves fast
        const speed = Math.hypot(cam.vx, cam.vy);
        const squeeze = reduceMotion ? 1 : 1 - Math.min(speed * 0.0012, 0.06);
        const scale = cam.z * squeeze;
        world.style.transform = `scale(${scale})`;
        // Text notes are DOM, not WebGL, so they can't bend; fade them while the table is flying
        world.classList.toggle('is-fast', glOn && speed > 6);

        // Visible world area (the world scales about the viewport centre), plus a margin
        const cx = vw / 2;
        const cy = vh / 2;
        const halfW = cx / scale + 60;
        const halfH = cy / scale + 60;
        const glItems = [];

        for (const t of tiles) {
            const x = wrap(t.lx + t.col * BLOCK.w + cam.x - startX, spanX) + startX + v.x * t.depth;
            const y = wrap(t.ly + t.row * BLOCK.h + cam.y - startY, spanY) + startY + v.y * t.depth;
            t.x = x;
            t.y = y;
            // Cull off-screen copies so only a handful of tiles are ever painted
            const visible = x < cx + halfW && x + t.w > cx - halfW && y < cy + halfH && y + t.h > cy - halfH;
            if (t.visible !== visible) {
                t.visible = visible;
                t.el.style.display = visible ? '' : 'none';
            }
            if (!visible) continue;
            t.el.style.transform = `translate(${x}px, ${y}px)`;

            if (!t.shot) continue;
            if (t.shot.long && t.shownScroll !== t.scroll) {
                t.shownScroll = t.scroll;
                t.el.style.setProperty('--p', `${t.scroll * 100}%`);
            }
            if (glOn) {
                glItems.push({
                    src: t.shot.src,
                    x: cx + (x - cx) * scale, y: cy + (y - cy) * scale, w: t.w * scale, h: t.h * scale,
                    focusY: t.shot.long ? t.scroll : t.shot.focusY,
                    zoom: 1 + 0.04 * t.hover, dim: t.dim, reveal: t.reveal,
                });
            } else if (t.shot.long) {
                t.img.style.objectPosition = `50% ${t.scroll * 100}%`;
            }
        }

        if (glOn) glr.draw(glItems, v);
        updateCoords();
    }

    const coordEls = { x: $('[data-coord="x"]'), y: $('[data-coord="y"]'), z: $('[data-coord="z"]') };
    const fmt = (n) => (n >= 0 ? '+' : '−') + String(Math.abs(Math.round(n))).padStart(4, '0');

    function updateCoords() {
        coordEls.x.textContent = fmt(START.x - cam.x);
        coordEls.y.textContent = fmt(START.y - cam.y);
        coordEls.z.textContent = Math.round(cam.z * 100);
    }

    /* Per-tile hover, dim and hover-scroll easing. Returns true while anything is still moving. */
    const SCROLL_PX_PER_S = 150;

    function stepTiles(dt) {
        let active = false;
        const anyHover = !!hovered;
        for (const t of tiles) {
            if (!t.shot || !t.visible) continue;
            const isHover = t.el === hovered;

            if (glOn) {
                const h = isHover ? 1 : 0;
                const d = anyHover && !isHover ? 1 : 0;
                t.hover += (h - t.hover) * 0.12;
                t.dim += (d - t.dim) * 0.12;
                if (Math.abs(h - t.hover) > 0.002 || Math.abs(d - t.dim) > 0.002) active = true;
                else {
                    t.hover = h;
                    t.dim = d;
                }
            }

            if (t.shot.long) {
                if (isHover) {
                    // Scroll down the page at a steady reading pace
                    const ratio = t.img.naturalWidth ? t.img.naturalHeight / t.img.naturalWidth : 4;
                    const travel = Math.max(1, t.w * ratio - t.h);
                    if (t.scroll < 1) {
                        t.scroll = Math.min(1, t.scroll + (SCROLL_PX_PER_S * dt) / travel);
                        active = true;
                    }
                } else if (t.scroll > 0) {
                    // ...and spring back to the top when the cursor leaves
                    t.scroll += (0 - t.scroll) * 0.1;
                    if (t.scroll < 0.0005) t.scroll = 0;
                    active = true;
                }
            }
        }
        return active;
    }

    let lastTime = performance.now();

    function tick() {
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;

        const px = cam.x;
        const py = cam.y;
        cam.x += (cam.tx - cam.x) * EASE;
        cam.y += (cam.ty - cam.y) * EASE;
        cam.z += (cam.tz - cam.z) * EASE;
        cam.vx = cam.x - px;
        cam.vy = cam.y - py;

        const moving = Math.abs(cam.tx - cam.x) > 0.05 || Math.abs(cam.ty - cam.y) > 0.05 || Math.abs(cam.tz - cam.z) > 0.0005;
        const animating = view === 'canvas' && stepTiles(dt);
        if (view === 'index') tickLines();

        if (moving || animating || needsRender) {
            if (!moving) {
                cam.x = cam.tx;
                cam.y = cam.ty;
                cam.z = cam.tz;
                cam.vx = cam.vy = 0;
            }
            render();
            needsRender = false;
        }
    }

    const canvasLive = () => view === 'canvas' && !busy && caseEl.hidden && helpEl.hidden;

    function panBy(dx, dy) {
        cam.tx += dx / cam.z;
        cam.ty += dy / cam.z;
    }

    function zoomTo(z) {
        cam.tz = gsap.utils.clamp(ZOOM.min, ZOOM.max, z);
        const out = cam.tz < 0.9;
        overviewBtn.setAttribute('aria-pressed', String(out));
        overviewBtn.textContent = out ? 'Zoom in' : 'Zoom out';
    }

    /* Pointer: drag with momentum, two-finger pinch, click-to-open */
    const pointers = new Map();
    let drag = null;
    let pinch = null;
    const hint = $('.stage__hint');
    if (!finePointer) hint.textContent = 'Drag around. Tap any shot.';

    stage.addEventListener('pointerdown', (e) => {
        if (!canvasLive() || (e.pointerType === 'mouse' && e.button !== 0)) return;
        try { stage.setPointerCapture(e.pointerId); } catch { /* synthetic or already-released pointer */ }
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: cam.tz };
            drag = null;
            return;
        }
        drag = {
            startX: e.clientX, startY: e.clientY,
            lastX: e.clientX, lastY: e.clientY, lastT: performance.now(),
            vx: 0, vy: 0, moved: false,
            tile: e.target.closest('.tile[data-shot]'),
        };
    });

    stage.addEventListener('pointermove', (e) => {
        if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pinch && pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            zoomTo(pinch.z * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d));
            return;
        }
        if (!drag) return;

        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        const now = performance.now();
        const dt = Math.max(1, now - drag.lastT);

        if (!drag.moved && Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 5) {
            drag.moved = true;
            stage.classList.add('is-dragging');
            clearHover();
            setCursor('Drag', true);
            hint.classList.add('is-gone');
        }
        if (drag.moved) panBy(dx, dy);

        // Smoothed velocity in px/ms for the throw
        drag.vx = drag.vx * 0.6 + (dx / dt) * 0.4;
        drag.vy = drag.vy * 0.6 + (dy / dt) * 0.4;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;
        drag.lastT = now;
    });

    function endPointer(e) {
        pointers.delete(e.pointerId);
        if (pinch) {
            if (pointers.size < 2) pinch = null;
            return;
        }
        if (!drag) return;

        if (drag.moved) {
            // Fling: carry the release velocity forward (stale moves don't count)
            if (!reduceMotion && performance.now() - drag.lastT < 80) {
                const clampV = gsap.utils.clamp(-4, 4); // px/ms, so a flick can't launch the table into orbit
                panBy(clampV(drag.vx) * 260, clampV(drag.vy) * 260);
            }
        } else if (drag.tile && e.type === 'pointerup') {
            openCase(+drag.tile.dataset.shot, drag.tile);
        }
        stage.classList.remove('is-dragging');
        drag = null;
    }

    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    stage.addEventListener('wheel', (e) => {
        if (!canvasLive()) return;
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            zoomTo(cam.tz * Math.exp(-e.deltaY * 0.01));
        } else {
            const k = e.deltaMode === 1 ? 32 : 1;
            panBy(-e.deltaX * k, -e.deltaY * k);
            hint.classList.add('is-gone');
        }
    }, { passive: false });

    /* Keyboard users: activating a tile opens it, focusing one centres it */
    stage.addEventListener('click', (e) => {
        const tile = e.target.closest('.tile[data-shot]');
        if (tile && e.detail === 0) openCase(+tile.dataset.shot, tile);
    });

    stage.addEventListener('focusin', (e) => {
        const t = tiles.find((t) => t.el === e.target);
        if (!t || !e.target.matches(':focus-visible')) return;
        cam.tx += (vw / 2 - (t.x + t.w / 2));
        cam.ty += (vh / 2 - (t.y + t.h / 2));
    });

    /* Hover spotlight */
    let hovered = null;

    function clearHover() {
        if (hovered) hovered.classList.remove('is-hover');
        hovered = null;
        world.classList.remove('has-hover');
    }

    stage.addEventListener('pointerover', (e) => {
        if (drag?.moved || e.pointerType !== 'mouse') return;
        const tile = e.target.closest('.tile[data-shot]');
        if (tile === hovered) return;
        clearHover();
        if (tile) {
            hovered = tile;
            tile.classList.add('is-hover');
            world.classList.add('has-hover');
            const shot = SHOTS[+tile.dataset.shot];
            setCursor(shot.long ? `Scrolling ${projectOf(shot).name}` : `View ${projectOf(shot).name}`, true);
            sound.play('tick');
        } else {
            setCursor('Drag', true);
        }
    });

    stage.addEventListener('pointerleave', () => {
        clearHover();
        setCursor('', false);
    });

    const overviewBtn = $('[data-action="overview"]');
    overviewBtn.addEventListener('click', toggleOverview);

    function toggleOverview() {
        if (view !== 'canvas') setView('canvas');
        zoomTo(cam.tz < 0.9 ? 1 : ZOOM.overview);
        hint.classList.add('is-gone');
    }

    /** The on-screen copy of a shot nearest the viewport centre, as a screen rect */
    function visibleTileRect(shotIndex) {
        let best = null;
        let bestD = Infinity;
        for (const t of tiles) {
            if (t.shot !== SHOTS[shotIndex]) continue;
            const d = Math.hypot(t.x + t.w / 2 - vw / 2, t.y + t.h / 2 - vh / 2);
            if (d < bestD) {
                bestD = d;
                best = t;
            }
        }
        if (!best) return null;
        if (!best.visible) {
            best.el.style.display = '';
            best.visible = true;
        }
        return best.el.getBoundingClientRect();
    }

    /* ======================================================================
       2. Pile
       ====================================================================== */
    let cards = [];
    let pileZ = 1;

    function cardScale() {
        // 37 cards: keep them smaller than their canvas tiles so the pile stays a pile
        return 0.62 * gsap.utils.clamp(0.5, 1, Math.min(vw / 1400, vh / 860));
    }

    function buildPile() {
        const s = cardScale();
        cards = SHOTS.map((shot, i) => {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'card';
            el.dataset.shot = i;
            el.setAttribute('aria-label', `Open ${projectOf(shot).name}: ${shot.alt}`);
            const w = Math.round(shot.w * s);
            // Very tall captures are trimmed so cards stay throwable
            const h = Math.round(Math.min(shot.h, shot.w * 1.5) * s);
            el.style.width = `${w}px`;
            el.style.height = `${h}px`;
            el.style.left = `${-w / 2}px`;
            el.style.top = `${-h / 2}px`;
            el.innerHTML = `<img src="${shot.src}" alt="" draggable="false" decoding="async" style="object-position: 50% ${shot.focusY * 100}%">`;
            pileEl.append(el);
            return { el, shot, i, w, h };
        });

        Draggable.create(cards.map((c) => c.el), {
            type: 'x,y',
            inertia: !reduceMotion,
            bounds: pileBounds(),
            edgeResistance: 0.75,
            zIndexBoost: false,
            onPress() {
                this.target.style.zIndex = ++pileZ;
                gsap.to(this.target, { scale: 1.06, duration: dur(0.3), ease: 'power3.out' });
                setCursor('Throw', true);
                sound.play('pick');
            },
            onDrag() {
                // Cards lean into the direction of travel
                gsap.to(this.target, { rotation: `+=${gsap.utils.clamp(-6, 6, this.deltaX * 0.25)}`, duration: dur(0.4), overwrite: 'auto' });
            },
            onRelease() {
                gsap.to(this.target, { scale: 1, duration: dur(0.5), ease: 'power3.out' });
                setCursor('Drag', true);
                if (this.isDragging) {
                    const speed = Math.hypot(InertiaPlugin.getVelocity(this.target, 'x'), InertiaPlugin.getVelocity(this.target, 'y'));
                    if (speed > 300) sound.play('throw', Math.min(1, speed / 3000));
                }
            },
            onClick() {
                const c = cards.find((c) => c.el === this.target);
                openCase(c.i, c.el);
            },
        });

        // Keyboard: Enter / Space on a focused card
        pileEl.addEventListener('click', (e) => {
            const el = e.target.closest('.card');
            if (el && e.detail === 0) openCase(+el.dataset.shot, el);
        });
        pileEl.addEventListener('pointerover', (e) => {
            if (e.pointerType === 'mouse') setCursor(e.target.closest('.card') ? 'Drag' : '', !!e.target.closest('.card'));
        });
        pileEl.addEventListener('pointerleave', () => setCursor('', false));
    }

    function pileBounds() {
        return { minX: 60, maxX: vw - 60, minY: 110, maxY: vh - 110 };
    }

    function scatter(stagger = 0.035) {
        return gsap.to(cards.map((c) => c.el), {
            x: () => vw / 2 + gsap.utils.random(-0.32, 0.32) * Math.max(vw - 360, 200),
            y: () => vh / 2 + gsap.utils.random(-0.22, 0.22) * Math.max(vh - 300, 200),
            rotation: () => gsap.utils.random(-16, 16),
            scale: 1,
            opacity: 1,
            duration: dur(1.1),
            ease: 'expo.out',
            stagger: dur(stagger),
        });
    }

    function enterPile(from) {
        if (!cards.length) buildPile();
        pileEl.hidden = false;

        cards.forEach((c) => {
            const r = from === 'canvas' ? visibleTileRect(c.i) : null;
            if (r) {
                gsap.set(c.el, { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: r.width / c.w, rotation: 0, opacity: 1 });
            } else {
                gsap.set(c.el, { x: vw / 2 + gsap.utils.random(-200, 200), y: -vh * 0.6, rotation: gsap.utils.random(-40, 40), scale: 1, opacity: 1 });
            }
        });
        return scatter(from === 'canvas' ? 0.02 : 0.05);
    }

    function exitPile(to) {
        const els = cards.map((c) => c.el);
        gsap.killTweensOf(els);
        let tl;
        if (to === 'canvas') {
            tl = gsap.timeline();
            cards.forEach((c, i) => {
                const r = visibleTileRect(c.i);
                if (!r) return;
                tl.to(c.el, { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: r.width / c.w, rotation: 0, duration: dur(0.9), ease: 'expo.inOut' }, dur(i * 0.015));
            });
            // Hand over to the real tiles underneath once the cards land
            tl.to(els, { opacity: 0, duration: dur(0.25) });
        } else {
            tl = gsap.to(els, { y: `+=${vh}`, rotation: () => gsap.utils.random(-30, 30), duration: dur(0.7), ease: 'power3.in', stagger: dur(0.02) });
        }
        return tl.then(() => {
            pileEl.hidden = true;
        });
    }

    /* ======================================================================
       3. Index — a clothesline per live project.
       Each rope is a small verlet simulation pinned at both ends. The title
       hangs at its centre and the project's shots are pegged either side, each
       by its two top corners. Hung items add weight to the rope points they're
       pegged to, and heavier lines stretch more, so every rope sags the way
       its own load would make it. Moving the cursor through the ropes pushes
       them like wind.
       ====================================================================== */
    // TODO(kabir): add other live sites here as they launch.
    const LIVE = [
        { name: 'Axion', url: 'https://www.axionclick.com/', project: 'axion' },
        { name: 'Enesee', url: 'https://www.enesee.agency/', project: 'enesee' },
        { name: 'Wilan Institute', url: 'https://www.wilaninstitute.com/', project: 'wilan' },
        { name: 'Chronicle Labs', url: 'https://chronicle-labs.com/', project: null },
        { name: 'Granville', url: 'https://granville.vercel.app/', project: null },
        { name: 'Imaginary Space', url: 'https://www.imaginaryspace.ai/', project: null, tags: ['Brand', 'Web design'] },
    ];
    const domainOf = (url) => new URL(url).hostname.replace(/^www\./, '');

    const indexEl = $('#works-index');
    const ropeSvg = $('.lines__svg');
    // Tuned offline: an empty line sags ~30px, a fully loaded one ~70px, with
    // the rope itself barely stretching (the slack sets the shape, not the solver).
    const ROPE_N = 28;          // points per rope
    const GRAVITY = 0.03;       // px per step²
    const LOAD_PULL = 3;        // extra gravity per unit of load on a point
    const ITERATIONS = 100;     // constraint passes per step (higher = stiffer rope)
    const SUBSTEPS = 2;         // sim steps per frame, so the low gravity still feels lively
    const SLACK = { base: 1.0001, perLoad: 0.0011 };

    let lines = [];
    let linesAwake = false;
    let stillFrames = 0;
    let lastPointer = null;

    function ropeLayout() {
        const g = parseFloat(getComputedStyle(body).getPropertyValue('--gutter')) || 24;
        const chromeH = 32;
        const top = g + chromeH + 40;
        const bottom = vh - (g + chromeH + 12);
        // Lines with shots need room for them to hang; title-only lines get less
        const weights = LIVE.map((p) => (p.project ? 1.3 : 0.65));
        const unit = (bottom - top) / weights.reduce((a, b) => a + b, 0);
        const ys = weights.map((w, i) => top + unit * weights.slice(0, i).reduce((a, b) => a + b, 0));
        const band = unit * 1.3; // a shot line's band, which sets shot and title sizes
        const narrow = vw < 700;
        const overhang = 80; // ropes run past both screen edges, so their ends stay out of view
        return {
            g, top, band, ys, narrow, x0: -overhang, x1: vw + overhang, viewL: g, viewR: vw - g,
            // Phones get smaller titles and shots so one shot still fits each side
            itemH: narrow ? gsap.utils.clamp(34, 76, band * 0.46) : gsap.utils.clamp(48, 170, band * 0.62),
            titleSize: narrow ? gsap.utils.clamp(16, 26, band * 0.19) : gsap.utils.clamp(20, 54, band * 0.25),
        };
    }

    function buildLines() {
        indexList.textContent = '';
        ropeSvg.textContent = '';
        ropeSvg.setAttribute('viewBox', `0 0 ${vw} ${vh}`);
        const L0 = ropeLayout();
        const { narrow } = L0;
        const span = L0.x1 - L0.x0;
        // Fractional rope index for an x position, so pegs sit exactly where the item needs them
        const toIndex = (x) => gsap.utils.clamp(1, ROPE_N - 2, ((x - L0.x0) / span) * (ROPE_N - 1));

        lines = LIVE.map((p, li) => {
            const y = L0.ys[li];
            const items = [];

            // Title: chunky uppercase letters, each hung from the rope on its own with
            // a little tilt, drop and size jitter, so the word reads as hand-stuck
            const title = document.createElement('a');
            title.className = 'line__title is-measuring';
            title.href = p.url;
            title.target = '_blank';
            title.rel = 'noopener noreferrer';
            title.setAttribute('aria-label', `${p.name} (live site, opens in a new tab)`);
            title.style.fontSize = `${L0.titleSize}px`;
            title.innerHTML = [...p.name].map((c) => `<span class="line__ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
            indexList.append(title);
            const tw = title.offsetWidth;
            const cx = (L0.x0 + L0.x1) / 2;
            const letters = [...title.children].map((el, n) => {
                const rand = (k) => {
                    const s = Math.sin((li + 1) * 12.9898 + (n + 1) * 78.233 + k * 37.719) * 43758.5453;
                    return (s - Math.floor(s)) * 2 - 1; // deterministic -1..1
                };
                return {
                    el, kind: 'ch', w: el.offsetWidth, h: el.offsetHeight, x: cx - tw / 2 + el.offsetLeft,
                    load: 0.8 / p.name.length, drop: 4,
                    rot: rand(1) * 5.5 * (Math.PI / 180), dy: rand(2) * 0.07 * L0.titleSize, scale: 1 + rand(3) * 0.04,
                };
            });
            title.classList.remove('is-measuring');
            items.push(...letters);

            // Shots: alternate left and right of the title, working outwards
            const shots = p.project ? shotsOf(p.project) : [];
            const perSide = narrow ? 1 : 3;
            const gap = narrow ? 8 : 22;
            let leftEdge = cx - tw / 2 - gap * 1.5;
            let rightEdge = cx + tw / 2 + gap * 1.5;
            shots.forEach((shot, n) => {
                const side = n % 2 === 0 ? 'left' : 'right';
                if (items.filter((it) => it.side === side).length >= perSide) return;
                const h = L0.itemH;
                const w = Math.round(h * (shot.long ? LONG_ASPECT : shot.iw / shot.ih));
                const x = side === 'left' ? leftEdge - w : rightEdge;
                if (x < L0.viewL + (narrow ? 4 : 12) || x + w > L0.viewR - (narrow ? 4 : 12)) return;
                if (side === 'left') leftEdge = x - gap;
                else rightEdge = x + w + gap;

                const el = document.createElement('button');
                el.type = 'button';
                el.className = 'line__shot';
                el.dataset.shot = SHOTS.indexOf(shot);
                el.style.width = `${w}px`;
                el.style.height = `${h}px`;
                el.setAttribute('aria-label', `Open ${p.name}: ${shot.alt}`);
                el.innerHTML = `<img src="${shot.src}" alt="" draggable="false" decoding="async" style="object-position: 50% ${shot.focusY * 100}%">`;
                // Load scales with the shot's area, relative to a square of the standard height
                items.push({ el, kind: 'shot', side, w, h, x, load: gsap.utils.clamp(0.5, 2.5, (w * h) / (h * h)), drop: -4 });
            });

            // Keep tab order left → right along the line
            items.filter((it) => it.kind === 'shot').sort((a, b) => a.x - b.x).forEach((it) => {
                if (it.x < cx) indexList.insertBefore(it.el, title);
                else indexList.append(it.el);
            });

            // Rope points, with each item's weight split between its two pegs
            const totalLoad = items.reduce((s, it) => s + it.load, 0);
            const pts = Array.from({ length: ROPE_N }, (_, i) => {
                const x = L0.x0 + (span * i) / (ROPE_N - 1);
                return { x, y, px: x, py: y, load: 0, pinned: i === 0 || i === ROPE_N - 1 };
            });
            // Each peg carries half its item's weight, shared between its two nearest points
            const addLoad = (f, load) => {
                const i = Math.floor(f);
                const t = f - i;
                pts[i].load += load * (1 - t);
                pts[i + 1].load += load * t;
            };
            for (const it of items) {
                if (it.kind === 'ch') {
                    // Letters hang from a single point at their centre
                    it.f = toIndex(it.x + it.w / 2);
                    addLoad(it.f, it.load);
                    continue;
                }
                it.fL = toIndex(it.x);
                it.fR = toIndex(it.x + it.w);
                addLoad(it.fL, it.load / 2);
                addLoad(it.fR, it.load / 2);
            }
            // Heavier lines stretch a little more, so they hang lower
            const rest = (span / (ROPE_N - 1)) * (SLACK.base + SLACK.perLoad * totalLoad);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'line__rope');
            ropeSvg.append(path);
            const line = { pts, rest, items, path, title, hover: 0, hoverTarget: 0 };
            // Hovering a title flips every letter's tilt the other way
            title.addEventListener('pointerenter', () => { line.hoverTarget = 1; wakeLines(); });
            title.addEventListener('pointerleave', () => { line.hoverTarget = 0; wakeLines(); });
            return line;
        });
    }

    function stepLines() {
        let motion = 0;
        for (const L of lines) {
            const P = L.pts;
            for (const p of P) {
                if (p.pinned) continue;
                const vx = (p.x - p.px) * 0.985;
                const vy = (p.y - p.py) * 0.985;
                p.px = p.x;
                p.py = p.y;
                p.x += vx;
                p.y += vy + GRAVITY * (1 + p.load * LOAD_PULL);
                motion = Math.max(motion, Math.abs(vx) + Math.abs(vy));
            }
            for (let k = 0; k < ITERATIONS; k++) {
                for (let i = 0; i < P.length - 1; i++) {
                    const a = P[i];
                    const b = P[i + 1];
                    const dx = b.x - a.x;
                    const dy = b.y - a.y;
                    const d = Math.hypot(dx, dy) || 1;
                    const diff = (d - L.rest) / d;
                    // Loaded points are "heavier", so the constraint moves them less
                    const wa = a.pinned ? 0 : 1 / (1 + a.load * LOAD_PULL);
                    const wb = b.pinned ? 0 : 1 / (1 + b.load * LOAD_PULL);
                    const s = wa + wb;
                    if (!s) continue;
                    a.x += (dx * diff * wa) / s;
                    a.y += (dy * diff * wa) / s;
                    b.x -= (dx * diff * wb) / s;
                    b.y -= (dy * diff * wb) / s;
                }
            }
        }
        return motion;
    }

    /** Position on the rope at a fractional point index */
    function ropeAt(P, f) {
        const i = Math.min(Math.floor(f), P.length - 2);
        const t = f - i;
        return { x: P[i].x + (P[i + 1].x - P[i].x) * t, y: P[i].y + (P[i + 1].y - P[i].y) * t };
    }

    function renderLines() {
        for (const L of lines) {
            let d = `M${L.pts[0].x.toFixed(1)} ${L.pts[0].y.toFixed(1)}`;
            for (let i = 1; i < L.pts.length; i++) d += ` L${L.pts[i].x.toFixed(1)} ${L.pts[i].y.toFixed(1)}`;
            L.path.setAttribute('d', d);
            L.hover += (L.hoverTarget - L.hover) * 0.18;
            const flip = 1 - 2 * L.hover;
            for (const it of L.items) {
                if (it.kind === 'ch') {
                    const p = ropeAt(L.pts, it.f);
                    const a = ropeAt(L.pts, Math.max(0, it.f - 0.4));
                    const b = ropeAt(L.pts, Math.min(L.pts.length - 1, it.f + 0.4));
                    const ang = Math.atan2(b.y - a.y, b.x - a.x) + it.rot * flip;
                    it.el.style.transform = `translate(${(p.x - it.w / 2).toFixed(1)}px, ${(p.y + it.drop + it.dy).toFixed(1)}px) rotate(${ang.toFixed(4)}rad) scale(${it.scale})`;
                    continue;
                }
                const a = ropeAt(L.pts, it.fL);
                const b = ropeAt(L.pts, it.fR);
                const ang = Math.atan2(b.y - a.y, b.x - a.x);
                it.el.style.transform = `translate(${a.x.toFixed(1)}px, ${(a.y + it.drop).toFixed(1)}px) rotate(${ang.toFixed(4)}rad)`;
            }
        }
    }

    function wakeLines() {
        linesAwake = true;
        stillFrames = 0;
    }

    /** Called from the main ticker while the index is showing */
    function tickLines() {
        if (!linesAwake || reduceMotion) return;
        let motion = 0;
        for (let s = 0; s < SUBSTEPS; s++) motion = Math.max(motion, stepLines());
        renderLines();
        // Sleep once everything has settled, so an idle index costs nothing
        const easing = lines.some((L) => Math.abs(L.hoverTarget - L.hover) > 0.002);
        stillFrames = motion < 0.005 && !easing ? stillFrames + 1 : 0;
        if (stillFrames > 90) linesAwake = false;
    }

    async function enterIndex() {
        // Letter widths are measured, so the title font has to be ready first
        try { await document.fonts.load(`700 ${ropeLayout().titleSize}px Inter`); } catch { /* fall back to whatever loaded */ }
        if (view !== 'index') return;
        buildLines();
        if (reduceMotion) {
            for (let i = 0; i < 1500; i++) stepLines();
            renderLines();
            return;
        }
        // Lift every rope a little so it drops, stretches and settles into its sag
        for (const L of lines) for (const p of L.pts) if (!p.pinned) p.py = p.y + 6;
        renderLines();
        gsap.fromTo(indexList.children, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.02 });
        wakeLines();
    }

    function initIndex() {
        // Wind: the cursor pushes nearby rope points along its direction of travel
        indexEl.addEventListener('pointermove', (e) => {
            if (reduceMotion || view !== 'index') return;
            if (lastPointer) {
                const dx = e.clientX - lastPointer.x;
                const dy = e.clientY - lastPointer.y;
                const R = 110;
                for (const L of lines) {
                    for (const p of L.pts) {
                        if (p.pinned) continue;
                        const dist = Math.hypot(p.x - e.clientX, p.y - e.clientY);
                        if (dist > R) continue;
                        const f = (1 - dist / R) * 0.32;
                        p.x += gsap.utils.clamp(-30, 30, dx) * f;
                        p.y += gsap.utils.clamp(-30, 30, dy) * f;
                    }
                }
                wakeLines();
            }
            lastPointer = { x: e.clientX, y: e.clientY };
        });
        indexEl.addEventListener('pointerleave', () => (lastPointer = null));

        indexList.addEventListener('click', (e) => {
            const shot = e.target.closest('.line__shot');
            if (shot) openCase(+shot.dataset.shot, shot);
        });
        indexList.addEventListener('pointerover', (e) => {
            if (e.pointerType !== 'mouse') return;
            const shot = e.target.closest('.line__shot');
            const title = e.target.closest('.line__title');
            if (shot) setCursor(`View ${projectOf(SHOTS[+shot.dataset.shot]).name}`, true);
            else if (title) setCursor('Visit site', true);
            else setCursor('', false);
            if ((shot || title) && !(shot || title).contains(e.relatedTarget)) sound.play('tick');
        });
        indexEl.addEventListener('pointerleave', () => setCursor('', false));
    }

    /* ======================================================================
       View switching
       ====================================================================== */
    const viewBtns = $$('.views__btn');
    const pill = $('.views__pill');

    function placePill() {
        const btn = viewBtns.find((b) => b.dataset.view === view);
        pill.style.setProperty('--pill-x', `${btn.offsetLeft}px`);
        pill.style.setProperty('--pill-w', `${btn.offsetWidth}px`);
    }

    async function setView(next) {
        if (next === view || busy) return;
        const prev = view;
        busy = true;
        view = next;
        viewBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === next)));
        placePill();
        clearHover();
        sound.play('view');

        if (prev === 'pile') {
            const leaving = exitPile(next);
            if (next === 'canvas') {
                // Show the table underneath just before the cards land
                gsap.delayedCall(dur(0.7), () => (body.dataset.view = next));
                await leaving;
            } else {
                body.dataset.view = next;
            }
        } else {
            body.dataset.view = next;
        }

        if (next === 'canvas') needsRender = true;
        if (next === 'pile') enterPile(prev);
        if (next === 'index') enterIndex();

        busy = false;
    }

    viewBtns.forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

    $('.skip-link').addEventListener('click', (e) => {
        e.preventDefault();
        setView('index');
        // The list is hidden until the view switches
        setTimeout(() => $('.line__title')?.focus(), 50);
    });

    /* ======================================================================
       Case view
       ====================================================================== */
    const caseImg = $('.case__img');
    const caseMedia = $('.case__media');
    const caseTitle = $('.case__title');
    const caseTags = $('.case__tags');
    const caseThumbs = $('.case__thumbs');
    const caseVisit = $('.case__visit');
    const caseInfo = $('.case__info');
    const caseBackdrop = $('.case__backdrop');
    const caseClose = $('.case__close');
    const outside = [$('main'), $('.chrome-top'), $('.chrome-bottom')];

    let current = { shot: 0, origin: null };

    function fillCase(shotIndex) {
        const shot = SHOTS[shotIndex];
        const p = projectOf(shot);
        const pIndex = PROJECTS.indexOf(p);

        $('[data-case="n"]').textContent = pad2(pIndex + 1);
        $('[data-case="total"]').textContent = pad2(PROJECTS.length);
        caseTitle.textContent = p.name;
        caseTags.textContent = p.tags.join(', ');
        caseVisit.hidden = !p.url;
        if (p.url) caseVisit.href = p.url;

        const list = shotsOf(p.key);
        caseThumbs.hidden = list.length < 2;
        caseThumbs.innerHTML = list.map((s, i) => `<li><button type="button" data-shot="${SHOTS.indexOf(s)}" aria-label="Shot ${i + 1} of ${list.length}${s.long ? ', full page' : ''}"${s === shot ? ' aria-current="true"' : ''}><img src="${s.src}" alt=""></button></li>`).join('');

        // Full-page captures become a scrollable page in the media area
        caseMedia.classList.toggle('is-long', !!shot.long);
        caseMedia.tabIndex = shot.long ? 0 : -1;
        if (shot.long) caseMedia.setAttribute('aria-label', `${p.name} full page, scrollable`);
        else caseMedia.removeAttribute('aria-label');
        caseMedia.scrollTop = 0;

        caseImg.src = shot.src;
        caseImg.alt = shot.alt;
        current.shot = shotIndex;
    }

    /** Where the case image is actually visible (long pages are clipped by their scroller) */
    function caseImgRect() {
        const r = caseImg.getBoundingClientRect();
        if (!caseMedia.classList.contains('is-long')) return r;
        const m = caseMedia.getBoundingClientRect();
        return new DOMRect(r.left, m.top, r.width, Math.min(r.height, m.height));
    }

    /** Clone an image and animate it between two screen rects */
    function fly(src, from, to, { duration = 0.9, ease = 'expo.inOut', focusY = 0.5 } = {}) {
        const img = new Image();
        img.src = src;
        img.alt = '';
        Object.assign(img.style, {
            position: 'fixed', left: '0', top: '0', zIndex: '45', margin: '0',
            width: `${to.width}px`, height: `${to.height}px`, objectFit: 'cover', objectPosition: `50% ${focusY * 100}%`,
            borderRadius: '4px', pointerEvents: 'none', transformOrigin: '0 0',
        });
        document.body.append(img);
        const at = (r) => ({ x: r.left, y: r.top, scaleX: r.width / to.width, scaleY: r.height / to.height });
        return gsap.fromTo(img, at(from), { ...at(to), duration: dur(duration), ease }).then(() => img.remove());
    }

    function revealCaseText() {
        gsap.fromTo([$('.case__meta'), caseThumbs, $('.case__actions')], { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: dur(0.6), ease: 'power3.out', stagger: dur(0.05), delay: dur(0.15) });
    }

    async function openCase(shotIndex, originEl) {
        if (busy || !caseEl.hidden) return;
        busy = true;
        clearHover();
        setCursor('', false);
        sound.play('open');
        current.origin = originEl;

        fillCase(shotIndex);
        caseEl.hidden = false;
        outside.forEach((el) => (el.inert = true));
        gsap.set(caseImg, { opacity: 0 });
        gsap.fromTo(caseBackdrop, { opacity: 0 }, { opacity: 1, duration: dur(0.6) });
        gsap.fromTo(caseClose, { opacity: 0 }, { opacity: 1, duration: dur(0.6), delay: dur(0.3) });
        revealCaseText();

        try { await caseImg.decode(); } catch { /* cached or broken: carry on */ }

        const from = originEl?.getBoundingClientRect();
        if (from && from.width && !reduceMotion) {
            await fly(caseImg.src, from, caseImgRect(), { focusY: SHOTS[shotIndex].focusY });
        }
        gsap.set(caseImg, { opacity: 1 });
        caseClose.focus({ preventScroll: true });
        busy = false;
    }

    async function closeCase() {
        if (busy || caseEl.hidden) return;
        busy = true;
        sound.play('close');

        const origin = current.origin;
        const showsSameShot = origin && +origin.dataset.shot === current.shot;
        const to = showsSameShot && origin.isConnected ? origin.getBoundingClientRect() : null;

        gsap.to([caseInfo, caseClose], { opacity: 0, duration: dur(0.3) });
        gsap.to(caseBackdrop, { opacity: 0, duration: dur(0.6), delay: dur(0.1) });

        if (to && to.width && !reduceMotion) {
            const from = caseImgRect();
            gsap.set(caseImg, { opacity: 0 });
            await fly(caseImg.src, from, to, { duration: 0.8, focusY: SHOTS[current.shot].focusY });
        } else {
            await gsap.to(caseImg, { opacity: 0, scale: 0.94, duration: dur(0.4) });
        }

        caseEl.hidden = true;
        gsap.set([caseInfo, caseClose, caseImg], { clearProps: 'opacity,scale' });
        outside.forEach((el) => (el.inert = false));
        if (origin?.isConnected && origin.matches('button')) origin.focus({ preventScroll: true });
        busy = false;
    }

    async function swapShot(shotIndex, dir = 1) {
        if (busy || shotIndex === current.shot) return;
        busy = true;
        sound.play('step');
        const sameProject = SHOTS[shotIndex].project === SHOTS[current.shot].project;
        await gsap.to(caseImg, { x: -40 * dir, opacity: 0, duration: dur(0.25), ease: 'power2.in' });
        fillCase(shotIndex);
        if (!sameProject) revealCaseText();
        try { await caseImg.decode(); } catch { /* ignore */ }
        await gsap.fromTo(caseImg, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: dur(0.45), ease: 'power3.out' });
        busy = false;
    }

    function stepProject(dir) {
        const p = projectOf(SHOTS[current.shot]);
        const next = PROJECTS[wrap(PROJECTS.indexOf(p) + dir, PROJECTS.length)];
        swapShot(SHOTS.indexOf(shotsOf(next.key)[0]), dir);
    }

    caseEl.addEventListener('click', (e) => {
        const action = e.target.closest('[data-action]')?.dataset.action;
        if (action === 'close') closeCase();
        if (action === 'prev') stepProject(-1);
        if (action === 'next') stepProject(1);
        const thumb = e.target.closest('.case__thumbs button');
        if (thumb) {
            const target = +thumb.dataset.shot;
            swapShot(target, target > current.shot ? 1 : -1);
        }
    });

    /* Keep Tab inside open dialogs */
    function trapFocus(e, container) {
        const focusables = $$('a[href]:not([hidden]), button:not([disabled]), [tabindex="0"]', container).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    /* ======================================================================
       Help sheet
       ====================================================================== */
    const helpBtn = $('[data-action="help"]');

    function toggleHelp(open = helpEl.hidden) {
        helpEl.hidden = !open;
        helpBtn.setAttribute('aria-expanded', String(open));
        outside.forEach((el) => (el.inert = open));
        if (open) $('[data-action="help-close"]').focus();
        else helpBtn.focus();
    }

    helpBtn.addEventListener('click', () => toggleHelp(true));
    helpEl.addEventListener('click', (e) => {
        if (e.target === helpEl || e.target.closest('[data-action="help-close"]')) toggleHelp(false);
    });

    /* ======================================================================
       Sound toggle (off by default; the choice is remembered per browser)
       ====================================================================== */
    const soundBtn = $('[data-action="sound"]');

    function setSound(on, save = true) {
        sound.set(on);
        soundBtn.setAttribute('aria-pressed', String(on));
        if (save) {
            try { localStorage.setItem('works-sound', on ? '1' : '0'); } catch { /* storage blocked */ }
        }
        if (on) sound.play('view');
    }

    soundBtn.addEventListener('click', () => setSound(!sound.enabled));
    try {
        // A saved "on" only arms the toggle; browsers still need a gesture before audio plays
        if (localStorage.getItem('works-sound') === '1') setSound(true, false);
    } catch { /* storage blocked */ }

    /* ======================================================================
       Keyboard
       ====================================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;

        if (!helpEl.hidden) {
            if (e.key === 'Escape') toggleHelp(false);
            if (e.key === 'Tab') trapFocus(e, helpEl);
            return;
        }
        if (!caseEl.hidden) {
            if (e.key === 'Escape') closeCase();
            if (e.key === 'ArrowLeft') stepProject(-1);
            if (e.key === 'ArrowRight') stepProject(1);
            if (e.key === 'Tab') trapFocus(e, caseEl);
            return;
        }

        const k = e.key.toLowerCase();
        if (k === '1') setView('canvas');
        else if (k === '2') setView('pile');
        else if (k === '3') setView('index');
        else if (k === 'z') toggleOverview();
        else if (k === 'm') setSound(!sound.enabled);
        else if (k === '?') toggleHelp(true);
        else if (k === 'r' && view === 'pile' && !busy) {
            scatter(0.02);
            sound.play('throw', 0.6);
        } else if (view === 'canvas' && e.key.startsWith('Arrow') && canvasLive()) {
            e.preventDefault();
            const step = 240;
            panBy(
                e.key === 'ArrowLeft' ? step : e.key === 'ArrowRight' ? -step : 0,
                e.key === 'ArrowUp' ? step : e.key === 'ArrowDown' ? -step : 0,
            );
        }
    });

    /* ======================================================================
       Cursor label
       ====================================================================== */
    function setCursor(text, on) {
        if (!finePointer) return;
        if (text) cursorLabel.textContent = text;
        cursor.classList.toggle('is-on', on);
    }

    if (finePointer) {
        const cursorX = gsap.quickTo(cursor, 'x', { duration: dur(0.35), ease: 'power3' });
        const cursorY = gsap.quickTo(cursor, 'y', { duration: dur(0.35), ease: 'power3' });
        addEventListener('pointermove', (e) => {
            cursorX(e.clientX);
            cursorY(e.clientY + 28);
        });
    }

    /* ======================================================================
       Bottom bar details
       ====================================================================== */
    function scrambleIn(el, delay) {
        const text = el.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*';
        el.setAttribute('aria-label', text);
        const state = { p: 0 };
        gsap.to(state, {
            p: 1,
            duration: dur(0.9),
            delay: dur(delay),
            ease: 'power2.out',
            onUpdate() {
                const done = Math.floor(state.p * text.length);
                el.textContent = text.slice(0, done) + [...text.slice(done)].map((c) => (c === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0])).join('');
            },
            onComplete() {
                el.textContent = text;
            },
        });
    }

    $$('[data-scramble]').forEach((el, i) => scrambleIn(el, 0.4 + i * 0.12));

    // Magnetic arrow on the CTA
    const cta = $('.cta');
    const arrow = $('.cta__arrow');
    if (finePointer && !reduceMotion) {
        const ax = gsap.quickTo(arrow, 'x', { duration: 0.4, ease: 'power3' });
        cta.addEventListener('pointermove', (e) => {
            const r = cta.getBoundingClientRect();
            ax(gsap.utils.clamp(-3, 4, (e.clientX - (r.right - 18)) * 0.1));
        });
        cta.addEventListener('pointerleave', () => ax(0));
    }

    /* ======================================================================
       Boot
       ====================================================================== */
    function onResize() {
        vw = innerWidth;
        vh = innerHeight;
        layoutCopies();
        if (glr) glr.resize(vw, vh);
        needsRender = true;
        placePill();
        cards.forEach((c) => Draggable.get(c.el)?.applyBounds(pileBounds()));
        if (view === 'index') {
            // Rebuild for the new width and settle straight away (no drop-in replay)
            buildLines();
            for (let i = 0; i < 1500; i++) stepLines();
            renderLines();
            wakeLines();
        }
    }

    function intro() {
        if (reduceMotion) return;
        const first = tiles.filter((t) => t.intro && t.shot);
        gsap.from(world, { opacity: 0, duration: 0.8 });
        if (glOn) {
            gsap.from(glCanvas, { opacity: 0, duration: 0.8 });
            first.forEach((t) => (t.reveal = 0));
            gsap.to(first, {
                reveal: 1,
                duration: 1.2,
                ease: 'expo.out',
                stagger: { each: 0.06, from: 'center' },
                onUpdate: () => (needsRender = true),
            });
        } else {
            gsap.fromTo(first.map((t) => t.img), { clipPath: 'inset(100% 0% 0% 0%)' }, {
                clipPath: 'inset(0% 0% 0% 0%)',
                clearProps: 'clipPath',
                duration: 1.2,
                ease: 'expo.out',
                stagger: { each: 0.06, from: 'center' },
            });
        }
    }

    // Phones open on a zoomed-out table so more than one shot is visible
    if (vw < 700) cam.z = cam.tz = 0.6;

    layoutCopies();
    initIndex();
    placePill();
    gsap.ticker.add(tick);
    addEventListener('resize', onResize);
    document.fonts?.ready.then(placePill);

    if (glr) {
        glr.resize(vw, vh);
        // Hand the canvas to WebGL once every texture is on the GPU; keep DOM images until then
        world.style.opacity = '0';
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('texture timeout')), 6000));
        Promise.race([glr.load(SHOTS.map((s) => s.src)), timeout])
            .then(() => {
                glOn = true;
                stage.classList.add('gl-on');
            })
            .catch((err) => {
                console.warn('[works] staying on DOM images:', err.message);
                glr = null;
            })
            .finally(() => {
                world.style.opacity = '';
                needsRender = true;
                intro();
            });
    } else {
        render();
        intro();
    }
})();
