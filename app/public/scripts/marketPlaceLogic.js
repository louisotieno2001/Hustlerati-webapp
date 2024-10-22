document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const loader = document.getElementById('loader');
    const errorParagraph = document.getElementById('error');
    const success = document.getElementById('success');
    const cartNumber = document.getElementById('cart-numbers');
    const cart = document.getElementById('cart');

    cart.addEventListener('click', async (e) => {
        window.location.href = '/cart'
    });

    async function showLoader() {
        loader.style.display = 'flex';
    }

    async function hideLoader() {
        loader.style.display = 'none';
    }
    
    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    function reloadPage() {
        setTimeout(() => {
            location.reload();
        }, 1000);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const sellerId = this.getAttribute('data-seller-id');
            const productImage = this.getAttribute('data-product-image');
            const itemQuantity = parseInt(this.getAttribute('data-item-quantity'), 10);
            const unitPrice = this.getAttribute('data-unit-price');

            if (itemQuantity === 0) {
                showFeedback();
                errorParagraph.style.display = 'flex';
                errorParagraph.innerText = "This product is depleted.";
            } else {
                const userData = {
                    productId,
                    productName,
                    sellerId,
                    productImage,
                    unitPrice
                };

                // console.log("Collected info", userData);

                try {
                    showLoader();
                    const response = await fetch('/add-order', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // Only update quantity if order was successful
                        showFeedback();
                        success.style.display = 'flex';
                        success.innerText = "Order successful!";
                        reloadPage();
                    } else {
                        showFeedback();
                        errorParagraph.style.display = 'flex';
                        errorParagraph.innerText = "Order failed. Please try again.";
                    }
                } catch (error) {
                    console.error("Error while making order:", error);
                    showFeedback();
                    errorParagraph.style.display = 'flex';
                    errorParagraph.innerText = "An error occurred. Please try again later.";
                } finally {
                    hideLoader();
                }

            }
        });
    });

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
