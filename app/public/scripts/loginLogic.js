document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById('login-btn');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const toggleVisibility = document.getElementById('pass-visibility');
    const passField = document.getElementById('login-password');
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

    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const emailValue = loginEmail.value.trim();
        const passwordValue = loginPassword.value.trim();

        if (emailValue === '' || passwordValue === '') {
            showError();
            error.innerText = 'Both email and password are required.';
            hideLoader();
        } else {
            const userData = {
                email: emailValue,
                password: passwordValue,
            };

            try {
                showLoader();
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const result = await response.json();

                if (result.message === 'Login successful') {
                    showSuccess();
                    success.innerText = 'Login successful!';
                    window.location.href = result.redirect;
                } else {
                    showError();
                    error.innerText = 'Login failed. Check your credentials.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                showError();
                error.innerText = 'An error occurred during login. Please try again.';
            }finally{
                hideLoader();
            }
        }
    });

});