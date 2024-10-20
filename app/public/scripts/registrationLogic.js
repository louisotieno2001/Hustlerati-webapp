document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('registerButton');
    const toggleVisibility = document.getElementById('pass-visibility');
    const passField = document.getElementById('password');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');
    const success = document.getElementById('success');

    async function showLoader() {
        loader.style.display = 'flex';
    }

    // Function to hide the loader
    async function hideLoader() {
        loader.style.display = 'none';
    }

    async function showError() {
        error.style.display = 'block'
    }

    async function showSuccess() {
        success.style.display = 'block'
    }

    toggleVisibility.addEventListener('click', async (e) => {
        e.preventDefault();
        passField.type = passField.type === 'password' ? 'text' : 'password';
    });

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        showLoader();
        const firstName = document.getElementById('fname').value;
        const lastName = document.getElementById('lname').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        // Validate input (you may want to implement more robust validation)
        if (!firstName || !lastName || !email || !phone || !password) {
            showError();
            error.innerText = "All fields are required.";
            hideLoader()
            return;
        }

        // Create user data object
        const userData = {
            firstName,
            lastName,
            email,
            phone,
            password
        };
        try {
            // Send registration data to server
            showLoader();
            const response = await fetch('/register-user', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess();
                success.innerText = "You have successfully registered on Hustlerati!";
                // Redirect to login page 
                window.location.href = "/login";
            } else {
                showError();
                error.innerText = "Registration failed. Please try again.";
                console.log(error);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            showError();
            error.innerText = "An error occurred. Please try again later.";
        }
    });
});