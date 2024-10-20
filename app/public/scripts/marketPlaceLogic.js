document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');

    openMenu.addEventListener('click', () => {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
        subMenu.style.display = 'block';
    });

    closeMenu.addEventListener('click', () => {
        closeMenu.style.display = 'none';
        openMenu.style.display = 'block';
        subMenu.style.display = 'none';
    });

    // Carousel functionality
    const slides = document.querySelectorAll('.carousel img');
    const carouselInner = document.getElementById('carousel-inner');
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * 100; // Calculate offset for slide transition
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    document.getElementById('nextBtn').addEventListener('click', nextSlide);
    document.getElementById('prevBtn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    // Automatic slide transition
    setInterval(nextSlide, 3000);
});