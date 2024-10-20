document.addEventListener('DOMContentLoaded', function () {
    const filterInput = document.getElementById('filter-theme');
    const productSections = document.querySelectorAll('.category-section');

    // Function to filter products based on the input
    function filterProducts() {
        const filterValue = filterInput.value.toLowerCase().trim();

        // Loop through all product sections
        productSections.forEach(section => {
            const sectionTitle = section.querySelector('h2').textContent.toLowerCase();
            const productCards = section.querySelectorAll('.product-card');
            let sectionMatches = false; // Flag to check if this section should be shown

            // Filter each product card within the section
            productCards.forEach(card => {
                const productInfo = card.querySelector('.product-info').textContent.toLowerCase();

                if (sectionTitle.includes(filterValue) || productInfo.includes(filterValue)) {
                    card.style.display = 'block'; // Show the product card if it matches the filter
                    sectionMatches = true;
                } else {
                    card.style.display = 'none'; // Hide the product card if it doesn't match
                }
            });

            // If no products match in the section, hide the entire section
            section.style.display = sectionMatches ? 'block' : 'none';
        });
    }

    // Add event listener to the filter input
    filterInput.addEventListener('input', filterProducts);
});
