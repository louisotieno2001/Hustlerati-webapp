document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('registerBusiness');
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

    submitBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        showLoader();
        const businessName = document.getElementById('name').value;
        const businessNiche = document.getElementById('niche').value;
        const empNo = document.getElementById('numbers').value;
        const businessPhone = document.getElementById('phone').value;
        const location = document.getElementById('location').value;

        // Validate input (you may want to implement more robust validation)
        if (!businessName || !businessNiche || !empNo || !businessPhone || !location) {
            showError();
            error.innerText = "All fields are required.";
            hideLoader();
            return;
        }

        // Create user data object
        const formData = {
            businessName,
            businessNiche,
            businessPhone,
            location,
            empNo
        };
        try {
            // Send registration data to server
            showLoader();
            const response = await fetch('/update-business', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess();
                success.innerText = "Business regisration successful!";
                window.location.href = "/home";
            } else {
                showError();
                error.innerText = "Registration failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during registration:", error);
            showError();
            error.innerText = "An error occurred. Please try again later.";
        }finally{
            hideLoader();
        }
    });
})
