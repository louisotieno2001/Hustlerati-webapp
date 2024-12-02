document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const postBtn = document.getElementById('post');
    const postDialog = document.getElementById('post-dialog');
    const submitPostBtn = document.getElementById('post-submit');
    const previewDiv = document.getElementById('preview');
    const pickImage = document.getElementById('pick-image');
    const shelfBtn = document.getElementById('add_to_shelf');
    const shelfDialog = document.getElementById('shelf-dialog');
    const itemImage = document.getElementById('item_image');
    const itemImageInput = document.getElementById('itemImageInput');
    const itemPreviewDiv = document.getElementById('item_preview');
    const fileInput = document.getElementById('fileInput');
    const submitItemBtn = document.getElementById('submit_item');
    var removeItemBtn = document.querySelectorAll('.remove-item');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const contractDialog = document.getElementById('contract-dialog');
    const contractBtn = document.getElementById('contract');
    const businessCard = document.querySelector('.business-card');

    const businessAgreement = businessCard.getAttribute('data-user-agreement');

    console.log("Name", businessAgreement);

    if (businessAgreement === 'false') {
        contractDialog.showModal();
    }

    contractBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        window.location.href = '/vendor-contract'
    })

    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'block';
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    function reloadPage() {
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    removeItemBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            // console.log("Item id", userData);

            try {
                // Send registration data to server
                const response = await fetch('/delete-item-off-shelf', {
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
                    success.innerText = "Deletion successful!";
                    reloadPage();
                } else {
                    showFeedback();
                    error.style.display = 'block';
                    error.innerText = "Deleting failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during deletion:", error);
                showFeedback();
                error.style.display = 'block';
                error.innerText = "An error occurred. Please try again later.";
            }

        });
    });

    shelfBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        shelfDialog.showModal();
    });

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
            error.style.display = 'block'
            error.innerText = "All fields are required.";
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
        formData.append('image', selectedFileData);

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
                shelfDialog.close();
                reloadPage();
            } else {
                showFeedback()
                error.style.display = 'block'
                error.innerText = "Shelf update failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during shelf update:", error);
            showFeedback();
            error.style.display = 'block'
            error.innerText = "An error occurred. Please try again later.";
        }
    });

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
            error.style.display = 'block'
            error.innerText = "Title and body are required.";
            return;
        }

        // Create FormData object and append title, body, and selected file
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('image', selectedFileData);

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
                postDialog.close();
            } else {
                showFeedback();
                error.style.display = 'block'
                error.innerHtml = "Post update failed. Please try again.";
            }
        } catch (error) {
            console.error("Error during post update:", error);
            showFeedback();
            error.style.display = 'block'
            error.innerText = "An error occurred. Please try again later.";
        }
    });

    postBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        postDialog.showModal();
    })

    openMenu.addEventListener('click', async (e) => {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
        subMenu.style.display = 'block'; // Show submenu
    });

    closeMenu.addEventListener('click', async (e) => {
        closeMenu.style.display = 'none';
        openMenu.style.display = 'block';
        subMenu.style.display = 'none'; // Hide submenu
    });

    const shelfPreview = document.getElementById('shelf-preview');
    // Infinite scrolling logic
    shelfPreview.addEventListener('scroll', () => {
        if (shelfPreview.scrollLeft + shelfPreview.clientWidth >= shelfPreview.scrollWidth - 10) {
            // Load more products when scrolled near the end
            loadProducts();
        }
    });
});

function showTab(tabId) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => {
        pane.classList.remove('active');
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Show the clicked tab pane
    const activeTabPane = document.getElementById(tabId);
    activeTabPane.classList.add('active');

    // Set the active class on the clicked tab
    const activeTab = [...tabs].find(tab => tab.textContent === activeTabPane.querySelector('h3').textContent);
    if (activeTab) {
        activeTab.classList.add('active');
    }
}

// Initialize to show the first tab
showTab('all-orders'); 