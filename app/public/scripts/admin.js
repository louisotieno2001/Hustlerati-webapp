document.addEventListener('DOMContentLoaded', async function () {
    document.getElementById('filter').addEventListener('input', function() {
        const filterValue = this.value.toLowerCase(); // Get the input value and convert to lowercase
        const cards = document.querySelectorAll('.card'); // Select all card elements
    
        cards.forEach(card => {
            const orderId = card.getAttribute('data-id'); // Get the ID from the data-id attribute
            // Check if the order ID includes the filter value
            if (orderId.toLowerCase().includes(filterValue)) {
                card.style.display = ''; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });

    const fulfillBtn = document.querySelectorAll('.fulfill');
    const loader = document.getElementById('loader');
    const errorParagraph = document.getElementById('error');
    const success = document.getElementById('success');

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
            showLoader()
            location.reload();
        }, 1000);
    }

    fulfillBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var orderId = this.getAttribute('data-card-id');
            const userData = {
                orderId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/complete-order', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    showFeedback();
                    success.style.display = 'block';
                    success.innerText = "Completed successfully!";
                    reloadPage();
                } else {
                    showFeedback();
                    error.style.display = 'block';
                    error.innerText = "Order completion failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during order completion:", error);
                showFeedback();
                error.style.display = 'block';
                error.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        });
    });
})