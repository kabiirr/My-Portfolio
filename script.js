// Project images array - replace with your actual image paths
const projectImages = [
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703354/Frame_2087330658_vjlont.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703519/Frame_2087330480_qwiqzw.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703515/Frame_2087330479_gehpzx.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703662/Frame_2087330477_mkrkx3.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703657/Frame_2087330471_n04dg2.png',
    'https://res.cloudinary.com/dwbdylcas/image/upload/v1764703654/Frame_2087330476_pnsze2.png'
];

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

// Initialize carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

