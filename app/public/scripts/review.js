document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitButton');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');
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
        }, 5000);
    }

    async function showError() {
        error.style.display = 'block';
    }

    async function showSuccess() {
        success.style.display = 'block';
    }

    function redirectPage() {
        setTimeout(() => {
            showLoader()
            window.location.href= "/login";
        }, 5000);
    }

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        showLoader();

        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Get the number of stars clicked from the hidden input
        const stars = document.getElementById('stars').value || 0; // Default to 0 if no stars clicked

        // Validate input
        if (!firstName || !lastName || !email || !phone || !message || !stars) {
            showFeedback();
            showError();
            error.innerText = "All fields are required.";
            hideLoader();
            return;
        }

        // Create user data object including stars
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            message,
            stars
        };

        console.log(userData)

        try {
            // Send registration data to server
            showLoader();
            const response = await fetch('/contact-us', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback()
                showSuccess();
                success.innerText = "You have successfully sent a message on Hustlerati! We will get back to you as soon as possible!";
                // Redirect to login page 
                redirectPage();
            } else {
                showFeedback()
                showError();
                error.innerText = "Message failed to send. Please try again.";
                console.log(result);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            showFeedback()
            showError();
            error.innerText = "An error occurred. Please try again later.";
        } finally {
            hideLoader()
        }
    });
});

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function () {
        const value = this.getAttribute('data-value');

        // Remove the clicked class from all stars
        document.querySelectorAll('.star').forEach(s => {
            s.classList.remove('clicked');
        });

        // Add the clicked class to the stars up to the clicked one
        for (let i = 0; i < value; i++) {
            document.querySelectorAll('.star')[i].classList.add('clicked');
        }

        // Update the hidden input with the number of stars clicked
        document.getElementById('stars').value = value;
    });
});