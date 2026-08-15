// Media host. Every asset URL on the site derives from this one value —
// change it here (and the literal URLs in index.html's <head>) to move CDNs.
const MEDIA_BASE = 'https://ik.imagekit.io/kabirrr';

// ImageKit transform: cap width, auto-negotiate webp/avif, quality 80.
// Grid tiles render ~510px wide, so 1024 covers 2x retina.
const SHOT_TRANSFORM = '?tr=w-1024,f-auto,q-80';

// Project images — displayed as tiles in grid.html
const projectImages = [
    'shot-01.webp',
    'shot-02.webp',
    'shot-03.webp',
    'shot-04.webp',
    'shot-05.webp',
    'shot-06.webp',
    'shot-07.webp',
    'shot-08.webp',
    'shot-09.webp',
    'shot-10.webp',
    'shot-11.webp',
    'shot-12.png',
    'shot-13.jpg'
].map(name => `${MEDIA_BASE}/${name}${SHOT_TRANSFORM}`);

/**
 * Initialize Random Theme - Moved UP for immediate execution
 */
function initThemes() {
    // WCAG Compliant Palettes (approximate checks for high contrast)
    const themes = [
        {
            name: "Classic Blue",
            colors: {
                "--body-bg": "#364BA8",
                "--frame-bg": "#FFFFFF",
                "--text-main": "#000000",
                "--text-secondary": "#666666",
                "--accent-color": "#0076FF",
                "--card-bg": "rgba(230, 230, 230, 0.5)",
                "--border-color": "#E6E6E6",
                "--cursor-color": "#000000",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Dark Mode",
            colors: {
                "--body-bg": "#000000",
                "--frame-bg": "#111111",
                "--text-main": "#FFFFFF",
                "--text-secondary": "#AAAAAA",
                "--accent-color": "#3B82F6", /* Bright blue for dark bg */
                "--card-bg": "rgba(40, 40, 40, 0.5)",
                "--border-color": "#333333",
                "--cursor-color": "#FFFFFF",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Swiss Red",
            colors: {
                "--body-bg": "#D90429", /* Vivid Red */
                "--frame-bg": "#F8F9FA",
                "--text-main": "#2B2D42",
                "--text-secondary": "#555555",
                "--accent-color": "#EF233C",
                "--card-bg": "rgba(220, 220, 225, 0.5)",
                "--border-color": "#E5E5E5",
                "--cursor-color": "#D90429",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Emerald Forest",
            colors: {
                "--body-bg": "#0D3B2E", /* Deep Green */
                "--frame-bg": "#F0F7F4", /* Very light mint/white */
                "--text-main": "#1B4332",
                "--text-secondary": "#40916C",
                "--accent-color": "#2D6A4F",
                "--card-bg": "rgba(200, 230, 210, 0.4)",
                "--border-color": "#D8F3DC",
                "--cursor-color": "#1B4332",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Royal Purple",
            colors: {
                "--body-bg": "#240046", /* Deep Purple */
                "--frame-bg": "#FFFFFF",
                "--text-main": "#10002B",
                "--text-secondary": "#5A189A",
                "--accent-color": "#7B2CBF",
                "--card-bg": "rgba(240, 230, 255, 0.5)",
                "--border-color": "#E0AAFF",
                "--cursor-color": "#240046",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Slate Minimalist",
            colors: {
                "--body-bg": "#334155", /* Slate 700 */
                "--frame-bg": "#F1F5F9", /* Slate 100 */
                "--text-main": "#0F172A",
                "--text-secondary": "#64748B",
                "--accent-color": "#475569",
                "--card-bg": "rgba(203, 213, 225, 0.4)",
                "--border-color": "#CBD5E1",
                "--cursor-color": "#1E293B",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Sunset Drift",
            colors: {
                "--body-bg": "#9A3324", /* Burnt Orange */
                "--frame-bg": "#FFF8F0", /* Warm White */
                "--text-main": "#4A1C17",
                "--text-secondary": "#8C3D34",
                "--accent-color": "#D44D3D",
                "--card-bg": "rgba(255, 230, 220, 0.5)",
                "--border-color": "#FFD6CC",
                "--cursor-color": "#4A1C17",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Coffee House",
            colors: {
                "--body-bg": "#483C32", /* Dark Taupe */
                "--frame-bg": "#F5F5DC", /* Beige */
                "--text-main": "#3E2723",
                "--text-secondary": "#6D4C41",
                "--accent-color": "#8D6E63", /* Light Brown */
                "--card-bg": "rgba(200, 180, 160, 0.3)",
                "--border-color": "#D7CCC8",
                "--cursor-color": "#3E2723",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Midnight Slate",
            colors: {
                "--body-bg": "#1E293B", /* Slate 800 - Dark but not pure black */
                "--frame-bg": "#FFFFFF", /* Pure White */
                "--text-main": "#0F172A", /* Slate 900 - Very dark for high contrast */
                "--text-secondary": "#64748B", /* Slate 500 - Medium gray */
                "--accent-color": "#3B82F6", /* Blue 500 - WCAG AAA on white */
                "--card-bg": "rgba(248, 250, 252, 0.95)", /* Slate 50 with opacity */
                "--border-color": "#E2E8F0", /* Slate 200 */
                "--cursor-color": "#0F172A",
                "--on-accent-color": "#FFFFFF"
            }
        }
    ];

    // Helper to apply and save theme
    function setTheme(theme) {
        const root = document.documentElement;
        for (const [property, value] of Object.entries(theme.colors)) {
            root.style.setProperty(property, value);
        }
        console.log(`Applied Theme: ${theme.name}`);

        // Save to local storage
        try {
            localStorage.setItem('currentTheme', theme.name);
        } catch (e) { } // ignore

        // Update URLs to pass theme param (Robust fallback)
        try {
            document.querySelectorAll('a[href*="grid.html"], a[href*="index.html"]').forEach(link => {
                try {
                    // Use new URL with just the href - browsers handle absolute paths correctly
                    const url = new URL(link.href);
                    url.searchParams.set('theme', theme.name);
                    link.href = url.toString();
                } catch (err) {
                    // ignore
                }
            });
        } catch (e) { }
    }

    // Pick a random theme
    function setRandomTheme() {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        setTheme(randomTheme);
    }

    try {
        // Find theme by Name
        let targetTheme = themes.find(t => t.name === 'Dark Mode');
        setTheme(targetTheme);
    } catch (e) {
        // Fallback to Dark Mode on error
        const defaultTheme = themes.find(t => t.name === 'Dark Mode');
        setTheme(defaultTheme);
    }

    // Event Listener for Double Click (Empty Space)
    // Note: We need to make sure this is only added once. 
    // Since initThemes is called immediately now, this is fine.
    if (!window._themeListenerAdded) {
        document.addEventListener('dblclick', (e) => {
            // Check if we clicked on an interactive element
            const interactive = e.target.closest('a, button, input, textarea, .project-card, .nav-link, .shot-card');

            if (!interactive) {
                const selection = window.getSelection().toString();
                if (!selection.trim()) {
                    // setRandomTheme(); // Theme locked to black
                    if (window.getSelection) window.getSelection().removeAllRanges();
                }
            }
        });
        window._themeListenerAdded = true;
    }
}

// EXECUTE IMMEDIATELY
initThemes();

let currentImageIndex = 0;
let isTransitioning = false;
let carouselInterval = null;
const imageChangeDelay = 2000; // 2 seconds delay between images

// Get both image elements for seamless switching
const carouselImage1 = document.getElementById('carousel-image-1');
const carouselImage2 = document.getElementById('carousel-image-2');

/**
 * Preloads all images to ensure smooth transitions
 */
function preloadImages() {
    projectImages.forEach((src) => {
        const img = new Image();
        img.src = src;
    });
}

/**
 * Preloads the next image in the sequence
 */
function preloadNextImage() {
    const nextIndex = (currentImageIndex + 1) % projectImages.length;
    const nextImage = new Image();
    nextImage.src = projectImages[nextIndex];
}

/**
 * Changes the displayed image in the carousel with seamless transition
 */
function changeImage() {
    if (isTransitioning) return;
    isTransitioning = true;

    const currentActive = carouselImage1.classList.contains('active') ? carouselImage1 : carouselImage2;
    const nextInactive = currentActive === carouselImage1 ? carouselImage2 : carouselImage1;

    // Move to next image index
    currentImageIndex = (currentImageIndex + 1) % projectImages.length;

    // Clear any existing event handlers
    nextInactive.onload = null;
    nextInactive.onerror = null;

    // Set the next image source
    const newImageSrc = projectImages[currentImageIndex];
    nextInactive.src = newImageSrc;
    nextInactive.alt = `Project Image ${currentImageIndex + 1}`;

    // Preload the image after this one for next switch
    preloadNextImage();

    // Check if image is already loaded
    if (nextInactive.complete && nextInactive.naturalWidth > 0) {
        performSwitch(currentActive, nextInactive);
    } else {
        // Wait for image to load
        nextInactive.onload = () => {
            if (nextInactive.complete && nextInactive.naturalWidth > 0) {
                performSwitch(currentActive, nextInactive);
            }
        };
        nextInactive.onerror = () => {
            // If image fails, switch anyway to avoid getting stuck
            performSwitch(currentActive, nextInactive);
        };
    }
}

/**
 * Performs the actual image switch
 */
function performSwitch(currentActive, nextInactive) {
    // Prevent multiple switches
    if (!isTransitioning) return;

    // Instant switch - no transition
    currentActive.classList.remove('active');
    nextInactive.classList.add('active');

    // Reset transition flag after a brief moment to ensure switch completes
    setTimeout(() => {
        isTransitioning = false;
    }, 50);
}

/**
 * Initialize the carousel
 */
function initCarousel() {
    if (!carouselImage1 || !carouselImage2) return;

    // Preload all images first
    preloadImages();

    // Set initial image
    carouselImage1.src = projectImages[0];
    carouselImage1.alt = 'Project Image 1';
    carouselImage1.classList.add('active');

    // Preload next image
    carouselImage2.src = projectImages[1];
    carouselImage2.alt = 'Project Image 2';

    // Wait for initial image to load, then start carousel
    if (carouselImage1.complete) {
        startCarousel();
    } else {
        carouselImage1.onload = startCarousel;
    }
}

/**
 * Starts the carousel rotation
 */
function startCarousel() {
    // Preload next image
    preloadNextImage();

    // Start the carousel rotation
    carouselInterval = setInterval(changeImage, imageChangeDelay);
}

// Initialize everything when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCarousel();
        initHoverReveal();
        initProjectHover();
        initCustomCursor();
        initPreloader();
        initStampShine();
        initCarouselReveal();
        initWebGLBackground();
    });
} else {
    initCarousel();
    initHoverReveal();
    initProjectHover();
    initCustomCursor();
    initPreloader();
    initStampShine();
    initCarouselReveal();
    initWebGLBackground();
}

/**
 * Initialize Random Theme
 */
function initThemes() {
    // WCAG Compliant Palettes (approximate checks for high contrast)
    const themes = [
        {
            name: "Classic Blue",
            colors: {
                "--body-bg": "#364BA8",
                "--frame-bg": "#FFFFFF",
                "--text-main": "#000000",
                "--text-secondary": "#666666",
                "--accent-color": "#0076FF",
                "--card-bg": "rgba(230, 230, 230, 0.5)",
                "--border-color": "#E6E6E6",
                "--cursor-color": "#000000",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Dark Mode",
            colors: {
                "--body-bg": "#000000",
                "--frame-bg": "#111111",
                "--text-main": "#FFFFFF",
                "--text-secondary": "#AAAAAA",
                "--accent-color": "#3B82F6", /* Bright blue for dark bg */
                "--card-bg": "rgba(40, 40, 40, 0.5)",
                "--border-color": "#333333",
                "--cursor-color": "#FFFFFF",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Swiss Red",
            colors: {
                "--body-bg": "#D90429", /* Vivid Red */
                "--frame-bg": "#F8F9FA",
                "--text-main": "#2B2D42",
                "--text-secondary": "#555555",
                "--accent-color": "#EF233C",
                "--card-bg": "rgba(220, 220, 225, 0.5)",
                "--border-color": "#E5E5E5",
                "--cursor-color": "#D90429",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Emerald Forest",
            colors: {
                "--body-bg": "#0D3B2E", /* Deep Green */
                "--frame-bg": "#F0F7F4", /* Very light mint/white */
                "--text-main": "#1B4332",
                "--text-secondary": "#40916C",
                "--accent-color": "#2D6A4F",
                "--card-bg": "rgba(200, 230, 210, 0.4)",
                "--border-color": "#D8F3DC",
                "--cursor-color": "#1B4332",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Royal Purple",
            colors: {
                "--body-bg": "#240046", /* Deep Purple */
                "--frame-bg": "#FFFFFF",
                "--text-main": "#10002B",
                "--text-secondary": "#5A189A",
                "--accent-color": "#7B2CBF",
                "--card-bg": "rgba(240, 230, 255, 0.5)",
                "--border-color": "#E0AAFF",
                "--cursor-color": "#240046",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Slate Minimalist",
            colors: {
                "--body-bg": "#334155", /* Slate 700 */
                "--frame-bg": "#F1F5F9", /* Slate 100 */
                "--text-main": "#0F172A",
                "--text-secondary": "#64748B",
                "--accent-color": "#475569",
                "--card-bg": "rgba(203, 213, 225, 0.4)",
                "--border-color": "#CBD5E1",
                "--cursor-color": "#1E293B",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Sunset Drift",
            colors: {
                "--body-bg": "#9A3324", /* Burnt Orange */
                "--frame-bg": "#FFF8F0", /* Warm White */
                "--text-main": "#4A1C17",
                "--text-secondary": "#8C3D34",
                "--accent-color": "#D44D3D",
                "--card-bg": "rgba(255, 230, 220, 0.5)",
                "--border-color": "#FFD6CC",
                "--cursor-color": "#4A1C17",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Coffee House",
            colors: {
                "--body-bg": "#483C32", /* Dark Taupe */
                "--frame-bg": "#F5F5DC", /* Beige */
                "--text-main": "#3E2723",
                "--text-secondary": "#6D4C41",
                "--accent-color": "#8D6E63", /* Light Brown */
                "--card-bg": "rgba(200, 180, 160, 0.3)",
                "--border-color": "#D7CCC8",
                "--cursor-color": "#3E2723",
                "--on-accent-color": "#FFFFFF"
            }
        },
        {
            name: "Midnight Slate",
            colors: {
                "--body-bg": "#1E293B", /* Slate 800 - Dark but not pure black */
                "--frame-bg": "#FFFFFF", /* Pure White */
                "--text-main": "#0F172A", /* Slate 900 - Very dark for high contrast */
                "--text-secondary": "#64748B", /* Slate 500 - Medium gray */
                "--accent-color": "#3B82F6", /* Blue 500 - WCAG AAA on white */
                "--card-bg": "rgba(248, 250, 252, 0.95)", /* Slate 50 with opacity */
                "--border-color": "#E2E8F0", /* Slate 200 */
                "--cursor-color": "#0F172A",
                "--on-accent-color": "#FFFFFF"
            }
        }
    ];

    // Helper to apply and save theme
    function setTheme(theme) {
        const root = document.documentElement;
        for (const [property, value] of Object.entries(theme.colors)) {
            root.style.setProperty(property, value);
        }
        console.log(`Applied Theme: ${theme.name}`);

        // Save to local storage
        localStorage.setItem('currentTheme', theme.name);

        // Update URLs to pass theme param (Robust fallback)
        try {
            const param = `?theme=${encodeURIComponent(theme.name)}`;
            document.querySelectorAll('a[href*="grid.html"], a[href*="index.html"]').forEach(link => {
                try {
                    // Use new URL with just the href - browsers handle absolute paths correctly
                    const url = new URL(link.href);
                    url.searchParams.set('theme', theme.name);
                    link.href = url.toString();
                } catch (err) {
                    console.error("Failed to update link URL", err);
                }
            });
        } catch (e) {
            console.warn("Theme URL update failed", e);
        }
    }

    // Pick a random theme
    function setRandomTheme() {
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        setTheme(randomTheme);
    }

    try {
        // Find theme by Name
        let targetTheme = themes.find(t => t.name === 'Dark Mode');
        setTheme(targetTheme);
    } catch (e) {
        console.error("Theme initialization error", e);
        // Fallback to Dark Mode on error
        const defaultTheme = themes.find(t => t.name === 'Dark Mode');
        setTheme(defaultTheme);
    }

    // Event Listener for Double Click (Empty Space)
    document.addEventListener('dblclick', (e) => {
        // Check if we clicked on an interactive element
        const interactive = e.target.closest('a, button, input, textarea, .project-card, .nav-link');

        if (!interactive) {
            const selection = window.getSelection().toString();
            // Allow checking if selection is just whitespace
            if (!selection.trim()) {
                // setRandomTheme(); // Theme locked to black
                window.getSelection().removeAllRanges();
            }
        }
    });
}

/**
 * Initialize Preloader
 */
function initPreloader() {
    const introText = document.querySelector('.preloader-intro-text');
    if (!introText) {
        prepareTextReveal();
        animateEntrance();
        return;
    }

    // Prepare text reveal hidden states
    prepareTextReveal();

    const tl = gsap.timeline();

    // Slide-up + fade in — same motion as headline reveal
    tl.to(introText, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out"
    });

    // Hold for a beat
    tl.to(introText, {
        opacity: 1,
        duration: 0.7
    });

    // Fade out, then trigger page entrance
    tl.to(introText, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            animateEntrance();
        }
    });
}

function prepareHeadlineReveal() {
    const headline = document.querySelector('.hero-headline');
    if (!headline) return;

    const text = headline.textContent.trim();
    const words = text.split(/\s+/);
    headline.innerHTML = words.map(word => {
        return `<span class="word-mask"><span class="reveal-word">${word}</span></span>`;
    }).join(' ');
}

function prepareTextReveal() {
    // Split the headline into animated word blocks
    prepareHeadlineReveal();

    // Set initial state for reveal words
    gsap.set('.reveal-word', {
        y: '100%'
    });

    // Set initial state for supporting elements
    const supportingSelectors = [
        '.top-nav-centered .nav-link',
        '.hero-sub-tag',
        '.project-badges .badge-item',
        '.bottom-bar-centered .footer-pill'
    ].join(', ');

    gsap.set(supportingSelectors, {
        y: 20,
        autoAlpha: 0
    });
}

function animateEntrance() {
    // Remove is-loading immediately so elements are not hidden by CSS during transition
    document.body.classList.remove('is-loading');

    const tl = gsap.timeline({
        onComplete: () => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.remove();
        }
    });

    // 1. Fade out the white preloader screen
    tl.to('#preloader', {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
    });

    // 2. Zoom out background WebGL canvas/body slightly
    tl.fromTo('#webgl-bg', {
        scale: 1.08
    }, {
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
    }, 0); // starts at same time as preloader fade

    // 3. Masked reveal of the headline words
    tl.to('.reveal-word', {
        y: '0%',
        duration: 0.9,
        stagger: 0.02,
        ease: "power3.out"
    }, 0.2); // starts shortly after preloader fade starts

    // 4. Reveal navigation, sub-tag, badges, and footer pills
    const supportingSelectors = [
        '.top-nav-centered .nav-link',
        '.hero-sub-tag',
        '.project-badges .badge-item',
        '.bottom-bar-centered .footer-pill'
    ].join(', ');

    tl.to(supportingSelectors, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        clearProps: "transform"
    }, 0.3);
}


/**
 * Initialize Custom Cursor with Grid Trail
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    const cursorR = cursor.querySelector('.cursor-r');
    const cursorG = cursor.querySelector('.cursor-g');
    const cursorB = cursor.querySelector('.cursor-b');
    const cursorDot = cursor.querySelector('.cursor-dot');

    if (!cursorR || !cursorG || !cursorB || !cursorDot) return;

    // Set initial position
    gsap.set(cursor, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Track sub-ring offsets (relative to cursor center)
    let rX = 0, rY = 0;
    let gX = 0, gY = 0;
    let bX = 0, bY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    const setCursorX = gsap.quickSetter(cursor, "x", "px");
    const setCursorY = gsap.quickSetter(cursor, "y", "px");

    const setRX = gsap.quickSetter(cursorR, "x", "px");
    const setRY = gsap.quickSetter(cursorR, "y", "px");
    const setGX = gsap.quickSetter(cursorG, "x", "px");
    const setGY = gsap.quickSetter(cursorG, "y", "px");
    const setBX = gsap.quickSetter(cursorB, "x", "px");
    const setBY = gsap.quickSetter(cursorB, "y", "px");

    // Track previous grid position for the round trail dots
    let lastGridX = -100;
    let lastGridY = -100;
    const snap = 20;

    function updateCursor() {
        // Interpolate main cursor container
        let dx = targetX - currentX;
        let dy = targetY - currentY;
        currentX += dx * 0.15; // Smooth lag
        currentY += dy * 0.15;

        setCursorX(currentX);
        setCursorY(currentY);

        // Check if cursor is visible (so we don't calculate if hidden)
        const opacity = gsap.getProperty(cursor, "opacity");
        if (opacity >= 0.5) {
            // Calculate velocity/displacement from target
            let velX = targetX - currentX;
            let velY = targetY - currentY;

            // Offset the sub-rings in opposite directions proportional to velocity
            // Red splits along velocity direction
            let rTargetX = velX * 0.45;
            let rTargetY = velY * 0.45;
            // Blue splits in opposite direction
            let bTargetX = -velX * 0.45;
            let bTargetY = -velY * 0.45;
            // Green splits slightly perpendicular or less
            let gTargetX = velX * 0.1;
            let gTargetY = velY * 0.1;

            // Spring-like interpolation for sub-rings back to center
            rX += (rTargetX - rX) * 0.12;
            rY += (rTargetY - rY) * 0.12;
            gX += (gTargetX - gX) * 0.12;
            gY += (gTargetY - gY) * 0.12;
            bX += (bTargetX - bX) * 0.12;
            bY += (bTargetY - bY) * 0.12;

            setRX(rX);
            setRY(rY);
            setGX(gX);
            setGY(gY);
            setBX(bX);
            setBY(bY);

            // Grid Trail Logic using interpolated coordinates
            const gridX = Math.round(currentX / snap) * snap;
            const gridY = Math.round(currentY / snap) * snap;

            if (gridX !== lastGridX || gridY !== lastGridY) {
                const pixel = document.createElement('div');
                pixel.className = 'trail-pixel';
                pixel.style.left = `${gridX}px`;
                pixel.style.top = `${gridY}px`;
                pixel.style.transform = 'translate(-50%, -50%)';
                document.body.appendChild(pixel);

                gsap.to(pixel, {
                    opacity: 0,
                    duration: 0.5,
                    delay: 0.1,
                    ease: "power2.out",
                    onComplete: () => pixel.remove()
                });

                lastGridX = gridX;
                lastGridY = gridY;
            }
        }

        requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Interactive hover states for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .nav-link, .project-card, .trusted-by a');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to([cursorR, cursorG, cursorB], { scale: 1.4, borderWidth: '1px', duration: 0.3, ease: "power2.out", overwrite: "auto" });
            gsap.to(cursorDot, { scale: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to([cursorR, cursorG, cursorB], { scale: 1.0, borderWidth: '1.5px', duration: 0.3, ease: "power2.out", overwrite: "auto" });
            gsap.to(cursorDot, { scale: 1.0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        });
    });
}
/**
 * Initialize Hover Reveal for Projects
 */
function initProjectHover() {
    const projectLinks = document.querySelectorAll('.project-card');
    const revealCard = document.querySelector('.project-reveal-card');
    const revealHeadline = revealCard.querySelector('.reveal-headline');
    const revealTags = revealCard.querySelector('.reveal-tags');
    const revealLogo = revealCard.querySelector('.reveal-logo');
    const revealImage = revealCard.querySelector('.reveal-image');
    const cursor = document.querySelector('.custom-cursor');
    const displacementMap = document.querySelector('#displacement');

    if (!projectLinks.length || !revealCard) return;

    // Center the card on the cursor using percent transforms
    // We might want to offset it slightly so it doesn't cover the cursor exactly or flickers
    gsap.set(revealCard, { xPercent: -50, yPercent: -50 });

    const setX = gsap.quickSetter(revealCard, "x", "px");
    const setY = gsap.quickSetter(revealCard, "y", "px");

    document.addEventListener('mousemove', (e) => {
        setX(e.clientX);
        setY(e.clientY);
    });

    projectLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            // Update content
            const headline = link.getAttribute('data-headline');
            const tags = link.getAttribute('data-tags');
            const logo = link.getAttribute('data-logo');
            const imageSrc = link.getAttribute('data-image');

            if (headline) revealHeadline.textContent = headline;
            if (tags) revealTags.textContent = tags;
            if (logo) revealLogo.textContent = logo;
            if (imageSrc && revealImage) revealImage.src = imageSrc;

            // Hide custom cursor
            if (cursor) gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true });

            // Liquid Effect: Animate displacement scale from high to 0
            if (displacementMap) {
                gsap.fromTo(displacementMap,
                    { attr: { scale: 50 } },
                    { attr: { scale: 0 }, duration: 0.8, ease: "power2.out", overwrite: true }
                );
            }

            gsap.to(revealCard, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: true
            });
        });

        link.addEventListener('mouseleave', () => {
            // Show custom cursor
            if (cursor) gsap.to(cursor, { autoAlpha: 1, duration: 0.2, overwrite: true });

            // Optional: Animate distortion out
            if (displacementMap) {
                gsap.to(displacementMap, {
                    attr: { scale: 30 },
                    duration: 0.4,
                    ease: "power2.in",
                    overwrite: true
                });
            }

            gsap.to(revealCard, {
                autoAlpha: 0,
                scale: 0.95,
                duration: 0.15,
                ease: "power2.out",
                overwrite: true
            });
        });
    });
}

/**
 * Initialize Hover Reveal for Social Links
 */
function initHoverReveal() {
    const links = document.querySelectorAll('.nav-link[data-hover-src]');
    const img = document.querySelector('.hover-reveal-img');
    const placeholder = document.querySelector('.hover-reveal-placeholder');
    const cursor = document.querySelector('.custom-cursor');

    if (links.length === 0 || !img || !placeholder) return;

    // Center the image and placeholder on the cursor using percent transforms
    gsap.set(img, { xPercent: -50, yPercent: -50 });
    gsap.set(placeholder, { xPercent: -50, yPercent: -50 });

    // QuickSetter for performance
    const setImgX = gsap.quickSetter(img, "x", "px");
    const setImgY = gsap.quickSetter(img, "y", "px");
    const setPlaceholderX = gsap.quickSetter(placeholder, "x", "px");
    const setPlaceholderY = gsap.quickSetter(placeholder, "y", "px");

    // Track mouse movement constantly
    document.addEventListener('mousemove', (e) => {
        setImgX(e.clientX);
        setImgY(e.clientY);
        setPlaceholderX(e.clientX);
        setPlaceholderY(e.clientY);
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const imgSrc = link.getAttribute('data-hover-src');
            if (imgSrc) {
                // Try to load the image
                const testImg = new Image();
                testImg.onload = () => {
                    // Image loaded successfully
                    img.src = imgSrc;
                    // Hide custom cursor
                    if (cursor) gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true });

                    gsap.to(img, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true
                    });
                };

                testImg.onerror = () => {
                    // Image failed to load, show placeholder
                    if (cursor) gsap.to(cursor, { autoAlpha: 0, duration: 0.2, overwrite: true });

                    gsap.to(placeholder, {
                        autoAlpha: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out",
                        overwrite: true
                    });
                };

                testImg.src = imgSrc;
            }
        });

        link.addEventListener('mouseleave', () => {
            // Show custom cursor
            if (cursor) gsap.to(cursor, { autoAlpha: 1, duration: 0.2, overwrite: true });

            gsap.to(img, {
                autoAlpha: 0,
                scale: 0.8,
                duration: 0.15,
                ease: "power2.out",
                overwrite: true
            });

            gsap.to(placeholder, {
                autoAlpha: 0,
                scale: 0.8,
                duration: 0.15,
                ease: "power2.out",
                overwrite: true
            });
        });
    });
}

/**
 * Initialize Stamp Shine Effect
 * Creates a silver spotlight that follows the cursor over the stamp
 */
function initStampShine() {
    const stampDecoration = document.querySelector('.stamp-decoration');
    const stampShine = document.querySelector('.stamp-shine');

    if (!stampDecoration || !stampShine) return;

    stampDecoration.addEventListener('mousemove', (e) => {
        const rect = stampDecoration.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Update the radial gradient position to follow cursor
        stampShine.style.background = `radial-gradient(
            circle 80px at ${x}% ${y}%,
            rgba(192, 192, 192, 0.8) 0%,
            rgba(220, 220, 220, 0.6) 20%,
            rgba(255, 255, 255, 0.4) 40%,
            transparent 70%
        )`;
    });
}

/**
 * Initialize Carousel Reveal Effect
 * Creates a cursor-based mask reveal of the next image
 */
function initCarouselReveal() {
    const carousel = document.getElementById('image-carousel');
    const canvas = document.getElementById('carousel-reveal-canvas');
    const image1 = document.getElementById('carousel-image-1');
    const image2 = document.getElementById('carousel-image-2');

    if (!carousel || !canvas || !image1 || !image2) return;

    const ctx = canvas.getContext('2d');
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;

    // Grid snapping like custom cursor
    let lastGridX = -100;
    let lastGridY = -100;
    const snap = 20;

    // Trail points for grid-snapped reveals
    const trailPoints = [];
    const cursorSize = 20; // Match custom cursor size

    // Set canvas size
    function resizeCanvas() {
        const rect = carousel.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse events
    carousel.addEventListener('mouseenter', () => {
        isHovering = true;
        gsap.to(canvas, { opacity: 1, duration: 0.3 });
        // Hide custom cursor
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            gsap.to(customCursor, { autoAlpha: 0, duration: 0.2 });
        }
    });

    carousel.addEventListener('mouseleave', () => {
        isHovering = false;
        gsap.to(canvas, { opacity: 0, duration: 0.3 });
        trailPoints.length = 0;
        // Show custom cursor
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            gsap.to(customCursor, { autoAlpha: 1, duration: 0.2 });
        }
    });

    carousel.addEventListener('mousemove', (e) => {
        const rect = carousel.getBoundingClientRect();
        const rawX = e.clientX - rect.left;
        const rawY = e.clientY - rect.top;

        // Update actual mouse position
        mouseX = rawX;
        mouseY = rawY;

        // Calculate grid-snapped position
        const gridX = Math.round(rawX / snap) * snap;
        const gridY = Math.round(rawY / snap) * snap;

        // Only add trail point if moved to new grid cell
        if (gridX !== lastGridX || gridY !== lastGridY) {
            trailPoints.push({
                x: gridX,
                y: gridY,
                timestamp: Date.now()
            });

            lastGridX = gridX;
            lastGridY = gridY;
        }
    });

    // Get next image
    function getNextImage() {
        const nextIndex = (currentImageIndex + 1) % projectImages.length;
        return projectImages[nextIndex];
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (!isHovering) return;

        // Remove old trail points (fade after 500ms like custom cursor)
        const now = Date.now();
        const fadeTime = 500;
        while (trailPoints.length > 0 && now - trailPoints[0].timestamp > fadeTime) {
            trailPoints.shift();
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Load and draw next image
        const nextImageSrc = getNextImage();
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = nextImageSrc;

        if (img.complete) {
            drawReveal(img);
        } else {
            img.onload = () => drawReveal(img);
        }
    }

    function drawReveal(img) {
        ctx.save();

        // Create clipping path from trail using pixels (rectangles)
        if (trailPoints.length > 0) {
            ctx.beginPath();

            // Draw square pixels at each trail point
            for (let i = 0; i < trailPoints.length; i++) {
                const point = trailPoints[i];
                const size = cursorSize;

                // Draw square pixel at each trail point
                ctx.rect(point.x - size / 2, point.y - size / 2, size, size);
            }

            // Add current cursor position as square pixel
            ctx.rect(mouseX - cursorSize / 2, mouseY - cursorSize / 2, cursorSize, cursorSize);

            ctx.clip();

            // Draw next image only in clipped area (the pixel trail)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        ctx.restore();
    }

    animate();
}

/**
 * Initialize WebGL background video distortion (Three.js)
 */
function initWebGLBackground() {
    const canvas = document.getElementById('webgl-bg');
    const video = document.querySelector('.bg-video');
    if (!canvas || !video) return;

    // Wait for video to be ready
    if (video.readyState >= 2) {
        setupWebGL();
    } else {
        video.addEventListener('loadeddata', setupWebGL);
    }

    function setupWebGL() {
        // Ensure video is playing
        video.play().catch(e => console.log("Video autoplay blocked, retrying on interaction."));

        // Get actual canvas layout dimensions (instead of window viewport)
        let canvasRect = canvas.getBoundingClientRect();

        // 1. Create WebGL Renderer, Scene, Camera
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            powerPreference: "high-performance"
        });
        renderer.setSize(canvasRect.width, canvasRect.height, false);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        // Flat 2D orthographic camera
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // 2. Create Offscreen Canvas for Mouse Trail
        const trailCanvas = document.createElement('canvas');
        trailCanvas.width = 256;
        trailCanvas.height = 256;
        const trailCtx = trailCanvas.getContext('2d');

        // Initialize trail canvas with neutral color (R:127, G:127, B:0)
        trailCtx.fillStyle = 'rgb(127, 127, 0)';
        trailCtx.fillRect(0, 0, 256, 256);

        // 3. Create WebGL Textures
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;

        const trailTexture = new THREE.CanvasTexture(trailCanvas);
        trailTexture.minFilter = THREE.LinearFilter;
        trailTexture.magFilter = THREE.LinearFilter;

        // 4. Calculate Aspect Ratios for object-fit: cover with safety margin
        const videoAspect = 1920 / 1080;
        const uvScale = new THREE.Vector2(1, 1);

        function updateUvScale() {
            const screenAspect = canvasRect.width / canvasRect.height;
            // Add a 5% safety margin (0.95 factor) to prevent edge smearing/stretching during distortion
            if (screenAspect > videoAspect) {
                uvScale.set(0.95, (videoAspect / screenAspect) * 0.95);
            } else {
                uvScale.set((screenAspect / videoAspect) * 0.95, 0.95);
            }
        }
        updateUvScale();

        // 5. Shader Material with unscaled UVs (vUvRaw) for trail mapping
        const vertexShader = `
            varying vec2 vUv;
            varying vec2 vUvRaw;
            uniform vec2 uUvScale;
            void main() {
                vUv = (uv - 0.5) * uUvScale + 0.5;
                vUvRaw = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform sampler2D uVideo;
            uniform sampler2D uTrail;
            varying vec2 vUv;
            varying vec2 vUvRaw;
            void main() {
                // Sample displacement map using raw unscaled UV coordinates
                vec4 trail = texture2D(uTrail, vUvRaw);
                
                // Vector component coordinates [0, 1] mapped to [-1, 1]
                vec2 displacement = vec2(trail.r - 0.5, trail.g - 0.5) * 2.0;
                float force = trail.b; // Speed maps to blue channel
                
                // Warp video UVs based on displacement vector (0.18 force for premium look)
                vec2 distortedUv = vUv - displacement * force * 0.18;
                distortedUv = clamp(distortedUv, 0.001, 0.999);
                
                // Apply chromatic aberration (RGB split) based on force
                float r = texture2D(uVideo, distortedUv + vec2(force * 0.015, 0.0)).r;
                float g = texture2D(uVideo, distortedUv).g;
                float b = texture2D(uVideo, distortedUv - vec2(force * 0.015, 0.0)).b;
                
                gl_FragColor = vec4(r, g, b, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uVideo: { value: videoTexture },
                uTrail: { value: trailTexture },
                uUvScale: { value: uvScale }
            },
            depthWrite: false,
            depthTest: false
        });

        // 6. Create Fullscreen Plane Mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // 7. Track Cursor Velocity and Draw to Canvas
        let targetMouseX = window.innerWidth / 2;
        let targetMouseY = window.innerHeight / 2;
        let currentMouseX = targetMouseX;
        let currentMouseY = targetMouseY;
        let lastTrailX = currentMouseX;
        let lastTrailY = currentMouseY;

        document.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        // 8. Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            // Fade trail canvas towards neutral displacement color (127, 127, 0)
            trailCtx.fillStyle = 'rgb(127, 127, 0)';
            trailCtx.globalAlpha = 0.04; // Slower decay rate for premium fluid effect
            trailCtx.fillRect(0, 0, 256, 256);
            trailCtx.globalAlpha = 1.0;

            // Interpolate mouse coordinates for smooth lag effect
            let dx = targetMouseX - currentMouseX;
            let dy = targetMouseY - currentMouseY;
            currentMouseX += dx * 0.15;
            currentMouseY += dy * 0.15;

            // Calculate velocity between frames
            let trailDx = currentMouseX - lastTrailX;
            let trailDy = currentMouseY - lastTrailY;
            let dist = Math.sqrt(trailDx * trailDx + trailDy * trailDy);

            if (dist > 0.1) {
                // Convert viewport coordinates to trail canvas coordinates relative to canvasRect
                let relativeMouseX = currentMouseX - canvasRect.left;
                let relativeMouseY = currentMouseY - canvasRect.top;
                let lastRelativeMouseX = lastTrailX - canvasRect.left;
                let lastRelativeMouseY = lastTrailY - canvasRect.top;

                let scaledX = (relativeMouseX / canvasRect.width) * 256;
                let scaledY = (relativeMouseY / canvasRect.height) * 256;
                let prevScaledX = (lastRelativeMouseX / canvasRect.width) * 256;
                let prevScaledY = (lastRelativeMouseY / canvasRect.height) * 256;

                // Scale values to fit [0, 255]
                // Neutral is 127. Pos/Neg direction mapped left/right.
                let r = Math.min(Math.max(127 + trailDx * 3, 0), 255);
                let g = Math.min(Math.max(127 + trailDy * 3, 0), 255);
                let b = Math.min(Math.max(dist * 6, 0), 255);

                trailCtx.beginPath();
                trailCtx.strokeStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
                trailCtx.lineWidth = 18;
                trailCtx.lineCap = 'round';
                trailCtx.moveTo(prevScaledX, prevScaledY);
                trailCtx.lineTo(scaledX, scaledY);
                trailCtx.stroke();
            }

            lastTrailX = currentMouseX;
            lastTrailY = currentMouseY;

            // Flag WebGL texture for update
            trailTexture.needsUpdate = true;

            // Render scene
            renderer.render(scene, camera);
        }
        animate();

        // 9. Resize & Scroll Handling (keeping canvasRect and WebGL size in sync)
        window.addEventListener('resize', () => {
            canvasRect = canvas.getBoundingClientRect();
            renderer.setSize(canvasRect.width, canvasRect.height, false);
            updateUvScale();
        });
        window.addEventListener('scroll', () => {
            canvasRect = canvas.getBoundingClientRect();
        });
    }
}
