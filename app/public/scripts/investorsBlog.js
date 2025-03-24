document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const cards = document.querySelectorAll('.one-card');

    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', async function () {
            const id = this.getAttribute('data-news-id');

            if (!id) {
                showFeedback();
                document.getElementById("error").innerText = "This post cannot be retrieved at this time. Try again later";
                return;
            }

            const newsId = { id: id };
            window.location.href = `/investors-blog?blogId=${id}`;
        });
    });

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