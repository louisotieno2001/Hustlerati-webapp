document.addEventListener('DOMContentLoaded', async function () {
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

    // Add click event to cards

    document.querySelectorAll('.one-card').forEach(card => {
        card.addEventListener('click', async function () {
            const id = this.getAttribute('data-news-id');

            if (!id) {
                showFeedback();
                error.innerText = "This post cannot be retrieved at this time. Try again later";
                return;
            }

            const newsId = { id: id };
            window.location.href = `/blog?newsId=${id}`;
        });
    });
});