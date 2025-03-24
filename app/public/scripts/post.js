document.addEventListener("DOMContentLoaded", async () => {
    const submitPostBtn = document.getElementById('post-submit');
    const previewdiv = document.getElementById('add-preview');
    const pickImage = document.getElementById('pick-image');
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

    pickImage.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
        previewdiv.style.display = 'block';
    });

    let selectedFileData = null; // Initialize the variable to hold the selected file

    fileInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileType = selectedFile.type;
                let mediaPreview;
    
                if (fileType.startsWith('image/')) {
                    mediaPreview = document.createElement('img');
                    mediaPreview.src = event.target.result;
                    mediaPreview.style.maxWidth = '100%';
                    mediaPreview.style.maxHeight = '100%';
                } else if (fileType.startsWith('video/')) {
                    mediaPreview = document.createElement('video');
                    mediaPreview.src = event.target.result;
                    mediaPreview.controls = true; // Add controls for video playback
                    mediaPreview.style.maxWidth = '100%';
                    mediaPreview.style.maxHeight = '100%';
                }
    
                if (mediaPreview) {
                    previewdiv.innerHTML = ''; // Clear previous previews
                    previewdiv.appendChild(mediaPreview);
                }
    
                // Store the selected file
                selectedFileData = selectedFile; // Ensure this is a File object
            };
            reader.readAsDataURL(selectedFile);
        }
    });
    
    submitPostBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const title = document.getElementById('title').value;
        const body = document.getElementById('body').value;
    
        // Validate input (you may want to implement more robust validation)
        if (!title || !body) {
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "Both title and body fields are required.";
            hideLoader();
            return;
        }
    
        // Check if a file has been selected
        if (!selectedFileData) {
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "No media file selected.";
            hideLoader();
            return;
        }
    
        // Create FormData object and append title, body, and selected file
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        
        // Ensure selectedFileData is a Blob
        const blob = new Blob([selectedFileData], { type: selectedFileData.type });
        formData.append('media', blob, selectedFileData.name); // Pass the Blob and the original file name
    
        console.log(formData);
    
        try {
            // Send post data to server
            showLoader();
            const response = await fetch('/update-news', {
                method: "POST",
                body: formData // Send FormData instead of JSON
            });
    
            const result = await response.json();
    
            if (response.ok) {
                showFeedback();
                success.style.display = 'flex';
                success.innerText = "Posted successfully.";
                // window.location.href = document.referrer;
                // Clear selected file data
                selectedFileData = null;
            } else {
                showFeedback();
                errorParagraph.style.display = 'flex';
                errorParagraph.innerText = "Post update failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during post update:", error);
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "An error occurred. Please try again later.";
        } finally {
            hideLoader();
        }
    });    
})