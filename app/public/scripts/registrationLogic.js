document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('registerButton');
    const toggleVisibility = document.getElementById('pass-visibility');
    const passField = document.getElementById('password');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const firstNameError = document.getElementById('f-name-error');
    const secondNameError = document.getElementById('s-name-error');
    const mailError = document.getElementById('mail-error');
    const passError = document.getElementById('pass-error');
    const phoneError = document.getElementById('phone-error');

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

        // Regex patterns for validation
        const firstNameRegex = /^.{2,}$/; // At least 2 characters
        const secondNameRegex = /^.{2,}$/; // At least 2 characters
        const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\d{10}$/; // 10 digits, only numbers

        // Validate inputs
        if (!firstNameRegex.test(firstName)) {
            firstNameError.style.display = 'block';
            firstNameError.innerText = "First name must consist at least 2 characters.";
        }
        if (!secondNameRegex.test(lastName)) {
            secondNameError.style.display = 'block';
            secondNameError.innerText = "Second name must consist at least 2 characters.";
        }
        if (!mailRegex.test(email)) {
            mailError.style.display = 'block';
            mailError.innerText = "Email must have an @ sign.";
        }
        if (!phoneRegex.test(phone)) {
            phoneError.style.display = 'block';
            phoneError.innerText = "Phone number must be exactly 10 digits.";
        }

        // Password validation
        const passwordErrors = [];

        if (password.length < 8) {
            passwordErrors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            passwordErrors.push("Password must include at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            passwordErrors.push("Password must include at least one lowercase letter.");
        }
        if (!/\d/.test(password)) {
            passwordErrors.push("Password must include at least one number.");
        }
        if (!/[@$!%*?&(){}^,.;:#<>]/.test(password)) {
            passwordErrors.push("Password must include at least one special character.");
        }

        // Display password errors
        if (passwordErrors.length > 0) {
            passError.style.display = 'block'
            passError.innerText = passwordErrors.join(' ');
        }

        // If there are validation errors, stop submission
        if (firstNameError.innerText ||secondNameError.innerText || mailError.innerText || phoneError.innerText  || passError.innerText) {
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

        console.log(userData)
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
        } finally {
            hideLoader();
        }
    });
});