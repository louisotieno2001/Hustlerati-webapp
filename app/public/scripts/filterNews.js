document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const newsCards = document.querySelectorAll('.card');

    // Function to filter news posts based on the title
    function filterPost() {
        const searchText = searchInput.value.toLowerCase().trim();

        newsCards.forEach(card => {
            const postTitle = card.querySelector('h1').textContent.toLowerCase();

            // Check if the post title contains the search text
            if (postTitle.includes(searchText)) {
                card.style.display = 'block'; // Show the card if it matches the search
            } else {
                card.style.display = 'none'; // Hide the card if it doesn't match
            }
        });
    }

    // Attach the filter function to the search input
    searchInput.addEventListener('input', filterPost);
});
