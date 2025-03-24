document.addEventListener('DOMContentLoaded', async function () {
    const shelfDialog = document.getElementById('shelf-dialog');
    const itemImage = document.getElementById('item_image');
    const itemImageInput = document.getElementById('itemImageInput');
    const itemPreviewDiv = document.getElementById('item_preview');
    const fileInput = document.getElementById('fileInput');
    const submitItemBtn = document.getElementById('submit_item');
    const errorParagraph = document.getElementById('error');
    const success = document.getElementById('success');


    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    itemImage.addEventListener('click', (e) => {
        e.preventDefault();
        itemImageInput.click();
        itemPreviewDiv.style.display = 'block';
    });

    itemImageInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgPreview = document.createElement('img');
                imgPreview.src = event.target.result;
                imgPreview.style.maxWidth = '100%';
                imgPreview.style.maxHeight = '100%';
                itemPreviewDiv.appendChild(imgPreview);

                // Store the selected file
                selectedFileData = selectedFile;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    submitItemBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const name = document.getElementById('item_name').value.trim();
        const quantity = document.getElementById('item_quantity').value.trim();
        const price = document.getElementById('item_price').value.trim();
        const condition = document.getElementById('item_condition').value.trim();
        const availability = document.getElementById('item_availability').value.trim();
        const description = document.getElementById('item_description').value.trim();

        // Validate input (you may want to implement more robust validation)
        if (!name || !quantity || !price || !condition || !availability || !description) {
            showFeedback();
            errorParagraph.style.display = 'block'
            errorParagraph.innerText = "All fields are required.";
            return;
        }

        // Create FormData object and append title, body, and selected file
        const formData = new FormData();
        formData.append('name', name);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('condition', condition);
        formData.append('availability', availability);
        formData.append('description', description);
        formData.append('media', selectedFileData);

        console.log(formData);

        try {
            // Send post data to server
            const response = await fetch('/update-shelf', {
                method: "POST",
                body: formData// Send FormData instead of JSON
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback()
                success.style.display = 'block';
                success.innerText = "Shelf successfully updated";
                // Clear selected file data
                selectedFileData = null;
                window.location.href = document.referrer;
            } else {
                showFeedback()
                errorParagraph.style.display = 'block'
                errorParagraph.innerText = "Shelf update failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during shelf update:", error);
            showFeedback();
            errorParagraph.style.display = 'block'
            errorParagraph.innerText = "An error occurred. Please try again later.";
        }
    });
});
