// Project images array - replace with your actual image paths
const projectImages = [
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924583/Frame_2087330674_soowrn.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924583/Frame_2087330673_ozujrb.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924584/Frame_2087330676_kpl4nc.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924583/Frame_2087330669_ezp3xv.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924583/Frame_1000005192_eho55e.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1766924583/Frame_2087330675_rg4sun.png'
];

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
            name: "Neon Nights",
            colors: {
                "--body-bg": "#0B0C15", /* Deepest Black/Blue */
                "--frame-bg": "#15161E", /* Dark surface */
                "--text-main": "#E0E0E0",
                "--text-secondary": "#94A3B8",
                "--accent-color": "#4F46E5", /* Indigo */
                "--card-bg": "rgba(30, 35, 50, 0.6)",
                "--border-color": "#2A3345",
                "--cursor-color": "#4F46E5",
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
            name: "Glacier Blue",
            colors: {
                "--body-bg": "#0D1822", /* Deep Ocean */
                "--frame-bg": "#F0F9FF", /* Ice White */
                "--text-main": "#0C4A6E",
                "--text-secondary": "#38BDF8", /* Sky Blue */
                "--accent-color": "#0284C7", /* Ocean Blue */
                "--card-bg": "rgba(200, 240, 255, 0.5)",
                "--border-color": "#BAE6FD",
                "--cursor-color": "#0C4A6E",
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

    // Initialize: Priority -> URL Param -> LocalStorage -> Random
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlThemeName = urlParams.get('theme');
        const localThemeName = localStorage.getItem('currentTheme');

        // Find theme by Name
        let targetTheme = themes.find(t => t.name === urlThemeName);
        if (!targetTheme) targetTheme = themes.find(t => t.name === localThemeName);

        if (targetTheme) {
            setTheme(targetTheme);
        } else {
            setRandomTheme();
        }
    } catch (e) {
        setRandomTheme();
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
                    setRandomTheme();
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
const imageChangeDelay = 3000; // 3 seconds delay between images

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
        initCarousel();
        initHoverReveal();
        initProjectHover();
        initCustomCursor();
        initPreloader();
    });
} else {
    initCarousel();
    initHoverReveal();
    initProjectHover();
    initCustomCursor();
    initPreloader();
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
            name: "Neon Nights",
            colors: {
                "--body-bg": "#0B0C15", /* Deepest Black/Blue */
                "--frame-bg": "#15161E", /* Dark surface */
                "--text-main": "#E0E0E0",
                "--text-secondary": "#94A3B8",
                "--accent-color": "#4F46E5", /* Indigo */
                "--card-bg": "rgba(30, 35, 50, 0.6)",
                "--border-color": "#2A3345",
                "--cursor-color": "#4F46E5",
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
            name: "Glacier Blue",
            colors: {
                "--body-bg": "#0D1822", /* Deep Ocean */
                "--frame-bg": "#F0F9FF", /* Ice White */
                "--text-main": "#0C4A6E",
                "--text-secondary": "#38BDF8", /* Sky Blue */
                "--accent-color": "#0284C7", /* Ocean Blue */
                "--card-bg": "rgba(200, 240, 255, 0.5)",
                "--border-color": "#BAE6FD",
                "--cursor-color": "#0C4A6E",
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

    // Initialize: Priority -> URL Param -> LocalStorage -> Random
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlThemeName = urlParams.get('theme');
        const localThemeName = localStorage.getItem('currentTheme');

        // Find theme by Name
        let targetTheme = themes.find(t => t.name === urlThemeName);
        if (!targetTheme) targetTheme = themes.find(t => t.name === localThemeName);

        if (targetTheme) {
            setTheme(targetTheme);
        } else {
            setRandomTheme();
        }
    } catch (e) {
        console.error("Theme initialization error", e);
        setRandomTheme();
    }

    // Event Listener for Double Click (Empty Space)
    document.addEventListener('dblclick', (e) => {
        // Check if we clicked on an interactive element
        const interactive = e.target.closest('a, button, input, textarea, .project-card, .nav-link');

        if (!interactive) {
            const selection = window.getSelection().toString();
            // Allow checking if selection is just whitespace
            if (!selection.trim()) {
                setRandomTheme();
                window.getSelection().removeAllRanges();
            }
        }
    });
}

/**
 * Initialize Preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Calculate grid size based on the container size
    const rect = preloader.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // We want relatively square pixels, let's pick a column count that works well
    const cols = 20;
    const pixelSize = width / cols;
    const rows = Math.ceil(height / pixelSize);

    // Create pixels
    const totalPixels = cols * rows;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < totalPixels; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'pixel';
        // Ensure pixel dimensions match calculated exactly to prevent gaps
        pixel.style.width = `${pixelSize}px`;
        pixel.style.height = `${pixelSize}px`;
        fragment.appendChild(pixel);
    }

    preloader.appendChild(fragment);

    // Animate unloading
    // Create a timeline for the flicker and reveal
    const tl = gsap.timeline({
        onStart: () => {
            // Prepare text reveal hidden state internally before preloader finishes
            prepareTextReveal();
        },
        onComplete: () => {
            preloader.remove();
            document.body.classList.remove('is-loading');

            // Trigger the reveal animation
            animateTextReveal();
        }
    });

    // Phase 1: Random Flicker (glitch effect)
    tl.to('.pixel', {
        autoAlpha: 0,
        duration: 0,
        stagger: {
            amount: 0.5,
            from: "random",
            grid: [rows, cols]
        },
        yoyo: true,
        repeat: 1,
        ease: "none"
    });

    // Phase 2: Full Reveal
    tl.to('.pixel', {
        autoAlpha: 0,
        duration: 0,
        stagger: {
            amount: 1,
            from: "random",
            grid: [rows, cols]
        },
        ease: "none",
        delay: 0.2
    });
}

const revealSelectors = [
    '.top-bar .sub-headline',
    '.nav-link',
    '.cta',
    '.hero .sub-headline',
    '.main-headline',
    '.live-title',
    '.live-text',
    '.project-card',
    '.pill',
    '.work-bar',
    '.work-meta-bottom',
    '.carousel-header',
    '.carousel-link',
    '.carousel-image.active'
].join(', ');

function prepareTextReveal() {
    // Set initial state for content reveal
    gsap.set(revealSelectors, {
        y: 20,
        autoAlpha: 0
    });
}

function animateTextReveal() {
    gsap.to(revealSelectors, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.03, // Fast ripple
        ease: "power3.out",
        clearProps: "transform" // Keep opacity 1, remove transform
    });
}


/**
 * Initialize Custom Cursor with Grid Trail
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");

    // Track previous grid position
    let lastGridX = -100;
    let lastGridY = -100;
    const snap = 20;

    document.addEventListener('mousemove', (e) => {
        setX(e.clientX);
        setY(e.clientY);

        // Check if cursor is visible (opacity is approximately 1)
        // We use getComputedStyle or check opacity directly if set by GSAP
        // Getting style from GSAP cache is faster: gsap.getProperty(cursor, "opacity")
        const opacity = gsap.getProperty(cursor, "opacity");
        if (opacity < 0.5) return; // Don't draw trail if cursor is hidden

        // Grid Trail Logic
        // Calculate current grid position (top-left of the cell)
        const gridX = Math.round(e.clientX / snap) * snap;
        const gridY = Math.round(e.clientY / snap) * snap;

        // If we moved to a new cell
        if (gridX !== lastGridX || gridY !== lastGridY) {
            // Create a pixel at the NEW position (marking the path)
            const pixel = document.createElement('div');
            pixel.className = 'trail-pixel';

            // Adjust to center the 20x20 pixel on the grid point 
            // The main cursor is centered (-50%, -50%). 
            // If we want pixels to align with a grid, we should place them at top-left gridX, gridY 
            // but since cursor is free-floating, let's span the pixel at the snapped coordinates.
            // Since gridX is rounded, it snaps to nearest 20.
            // Let's position it simply.
            pixel.style.left = `${gridX}px`;
            pixel.style.top = `${gridY}px`;
            // Center it to align with the visual snap feel.
            pixel.style.transform = 'translate(-50%, -50%)';

            document.body.appendChild(pixel);

            // Animate it: Wait, then flicker/fade
            gsap.to(pixel, {
                opacity: 0,
                duration: 0.5,
                delay: 0.1, // Short persistence
                ease: "power2.out",
                onComplete: () => pixel.remove()
            });

            lastGridX = gridX;
            lastGridY = gridY;
        }
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
    const cursor = document.querySelector('.custom-cursor');

    if (links.length === 0 || !img) return;

    // Center the image on the cursor using percent transforms
    gsap.set(img, { xPercent: -50, yPercent: -50 });

    // QuickSetter for performance
    const setX = gsap.quickSetter(img, "x", "px");
    const setY = gsap.quickSetter(img, "y", "px");

    // Track mouse movement constantly
    document.addEventListener('mousemove', (e) => {
        setX(e.clientX);
        setY(e.clientY);
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const imgSrc = link.getAttribute('data-hover-src');
            if (imgSrc) {
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
        });
    });
}
