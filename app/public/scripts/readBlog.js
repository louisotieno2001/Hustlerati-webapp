document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const cards = document.querySelectorAll('.card');
    const comment = document.getElementById('comment');
    const sendComment = document.getElementById('sendComment');
    const likePost = document.getElementById('like');
    const sharePost = document.getElementById('share');

    // Function to get query parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Add click event to cards
    cards.forEach(card => {
        card.addEventListener('click', function () {
            const title = this.getAttribute('data-title');
            const body = this.getAttribute('data-body');
            const image = this.getAttribute('data-image');

            const url = `/blog?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&image=${encodeURIComponent(image)}`;
            console.log(url); // Log the URL before redirecting
            window.location.href = url;
        });
    });

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const body = urlParams.get('body');
    const image = getQueryParam('image');

    // Set blog title and body
    document.getElementById('blog-title').innerText = title || "No Title Available";
    document.getElementById('blog-body').innerText = body || "No Content Available.";

    // Set background image
    const blogImageDiv = document.getElementById('blog-image');
    if (image) {
        blogImageDiv.style.backgroundImage = `url('${image}')`;
        blogImageDiv.style.backgroundSize = 'cover';
        blogImageDiv.style.backgroundPosition = 'center';
        blogImageDiv.style.height = '300px'; // Set a height for the div
    } else {
        blogImageDiv.style.backgroundImage = "url('/images/default-image.png')";
    }

    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    // Menu toggle event listeners
    openMenu.addEventListener('click', async (e) => {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
        subMenu.style.display = 'block'; // Show submenu
    });

    closeMenu.addEventListener('click', async (e) => {
        closeMenu.style.display = 'none';
        openMenu.style.display = 'block';
        subMenu.style.display = 'none'; // Hide submenu
    });

});