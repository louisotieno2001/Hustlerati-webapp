document.addEventListener('DOMContentLoaded', async function () {
    const submitPostBtn = document.getElementById('post-submit');
    const previewDiv = document.getElementById('preview');
    const pickImage = document.getElementById('pick-image');
    const fileInput = document.getElementById('fileInput');
    const errorParagraph = document.getElementById('error');
    const success = document.getElementById('success');

    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    pickImage.addEventListener('click', (e) => {
        e.preventDefault();

        // Request camera access if needed (for mobile browsers or when you want camera input)
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream) => {
                console.log("Camera access granted.");
                // You can use the stream for capturing media or create a video preview, etc.
                // Stop the stream after you're done
                stream.getTracks().forEach(track => track.stop());
            })
            .catch((err) => {
                console.error("Camera access denied:", err);
                alert("Camera access is required for media capture.");
            });

        // Trigger file input click
        fileInput.click();
        previewDiv.style.display = 'block';
    });

    fileInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imgPreview = document.createElement('img');
                imgPreview.src = event.target.result;
                imgPreview.style.maxWidth = '100%';
                imgPreview.style.maxHeight = '100%';
                previewDiv.appendChild(imgPreview);

                // Store the selected file
                selectedFileData = selectedFile;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    submitPostBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;

        // Validate input (you may want to implement more robust validation)
        if (!title || !body) {
            showFeedback()
            errorParagraph.style.display = 'block'
            errorParagraph.innerText = "Title and body are required.";
            return;
        }

        // Create FormData object and append title, body, and selected file
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('media', selectedFileData);

        // console.log(formData);

        try {
            // Send post data to server
            const response = await fetch('/update-post', {
                method: "POST",
                body: formData// Send FormData instead of JSON
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback();
                success.style.display = 'block'
                success.innerText = "Post updated";
                // Clear selected file data
                selectedFileData = null;
                window.location.href = document.referrer
            } else {
                showFeedback();
                errorParagraph.style.display = 'block'
                errorParagraph.innerHtml = "Post update failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during post update:", error);
            showFeedback();
            errorParagraph.style.display = 'block'
            errorParagraph.innerText = "An error occurred. Please try again later.";
        }
    });
});
