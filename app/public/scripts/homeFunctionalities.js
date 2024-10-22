document.addEventListener('DOMContentLoaded', function () {
    const menuIcon = document.getElementById('menu-icon');
    const menuItems = document.getElementById('menu-items');
    const middleTab = document.getElementById('middle-tab');
    const menuTab = document.getElementById('menu-tab');
    const businessBtn = document.getElementById('businessBtn');
    const logoutBtn = document.getElementById('logout');
    const profilePic = document.getElementById('profile-pic');
    const editProfileBtn = document.getElementById('edit-profile');
    const editProfileDialog = document.getElementById('edit-profile-dialog');
    const profileSubmit = document.getElementById('profile-edit-submit');
    const previewDiv = document.getElementById('preview');
    const submitPic = document.getElementById('edit-pic');
    const mindBtn = document.getElementById('mindBtn');
    // const moreButton = document.querySelectorAll('#read-more');
    const moreDialog = document.getElementById('more');
    const exitBtn = document.getElementById('exit');
    const exitPost = document.getElementById('exit-post');
    const fileInput = document.getElementById('fileInput');
    const moreItems = document.getElementsByClassName('more-items');
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
            location.reload();
        }, 1000);
    }

    for (let i = 0; i < moreItems.length; i++) {
        moreItems[i].addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = "/marketplace";
        });
    }

    exitPost.addEventListener('click', async (e) => {
        e.preventDefault();
        postDialog.close();
    })

    exitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        moreDialog.close();
    })

    mindBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        window.location.href = '/hustler/dashboard'
    })

    profileSubmit.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const firstname = document.getElementById('fname').value;
        const lastname = document.getElementById('lname').value;
        const phone = document.getElementById('phone').value;

        // Validate input (you may want to implement more robust validation)
        if (!firstname || !lastname || !phone) {
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "All fields are required.";
            hideLoader();
            return;
        }

        // Create user data object
        const userData = {
            firstname: firstname,
            lastname: lastname,
            phone: phone,
        };

        console.log(userData)
        try {
            // Send registration data to server
            showLoader();
            const response = await fetch('/update-profile', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback();
                success.style.display = 'flex';
                success.innerText = "Updated succesfully.";
                reloadPage();
                editProfileDialog.close();
            } else {
                showFeedback();
                errorParagraph.style.display = 'flex';
                errorParagraph.innerText = "Update failed. Please try again";
            }
        } catch (error) {
            console.error("Error during registration:", error);
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "Something went wrong. Try again later";
        } finally{
            hideLoader();
        }

    })

    editProfileBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        editProfileDialog.showModal();
    })

    profilePic.addEventListener("click", async (e) => {
        e.preventDefault();
        fileInput.click();
        previewDiv.style.display = 'block'; // Display the preview div
    });

    fileInput.addEventListener('change', (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                // Set the background image of the profilePic element
                profilePic.style.backgroundImage = `url('${event.target.result}')`;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    submitPic.addEventListener('click', async (e) => {
        e.preventDefault();
        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append('profilePic', selectedFile);
            console.log(formData)

            try {
                showLoader();
                const response = await fetch('/update-pic', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    const data = await response.json();
                    showFeedback();
                    success.style.display = 'flex';
                    success.innerText = "Profile uploaded successfully.";
                    reloadPage();
                } else {
                    console.error('Failed to upload image');
                    showFeedback();
                    errorParagraph.style.display = 'flex';
                    errorParagraph.innerText = "Failed to upload the profile.";
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                showFeedback();
                errorParagraph.style.display = 'flex';
                errorParagraph.innerText = "Something went wrong. Try again later.";
            }finally{
                hideLoader();
            }
        } else {
            console.error('No file selected');
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "No file has been selected. Select a fle to proceed";
        } 
    });

    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        window.location.href = '/login';
    });

    businessBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        window.location.href = '/register-your-business';
    });

    let isMenuOpen = false;

    function toggleMenu() {
        menuIcon.addEventListener('click', async (e) => {
            e.preventDefault();

            // Toggle menu tab
            if (isMenuOpen) {
                menuTab.style.display = 'none';
                isMenuOpen = false;
            } else {
                menuTab.style.display = 'block';
                isMenuOpen = true;
            }

        });
    }

    // Added event listeners for menu links
    function addMenuLinkListeners() {
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = e.currentTarget.getAttribute('href').substring(1);
                toggleTabs(targetId);

                // Remove the 'clicked-link' class from all links
                menuLinks.forEach(link => {
                    link.classList.remove('clicked-link');
                });

                // Add the 'clicked-link' class to the clicked link
                e.currentTarget.classList.add('clicked-link');
                if (isMenuOpen) {
                    menuTab.style.display = 'none';
                    isMenuOpen = false;
                } else {
                    menuTab.style.display = 'block';
                    isMenuOpen = true;
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Function to toggle tabs based on targetId
    function toggleTabs(targetId) {
        const tabs = document.querySelectorAll('.display');
        tabs.forEach(tab => {
            tab.classList.remove('active-tab');
        });

        const targetTab = document.getElementById(targetId);
        if (targetTab) {
            targetTab.classList.add('active-tab');
        }
    }

    toggleMenu();
    addMenuLinkListeners();

    //Carosel stuff
    let currentIndex = 0;
    const totalSlides = document.querySelectorAll('.carousel-item').length;
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    function showSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        const translateValue = -currentIndex * 100 + '%';
        carouselWrapper.style.transform = 'translateX(' + translateValue + ')';
    }

    function nextSlide() {
        if (currentIndex === totalSlides - 1) {
            // If at the last slide, hide the transition for a moment
            carouselWrapper.style.transition = 'none';
            showSlide(currentIndex + 1);
            setTimeout(() => {
                // Move to the first slide without transition
                carouselWrapper.style.transition = 'transform 0.5s ease-in-out';
                showSlide(0);
            });
        } else {
            showSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Automatically move to the next slide every 3 seconds
    setInterval(nextSlide, 3000);

    const paragraph = document.getElementById('content');

    var readMoreButtons = document.querySelectorAll('.read-more');

    readMoreButtons.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var body = this.getAttribute('data-post-body');
            paragraph.textContent = body;
            moreDialog.showModal();
        });
    });

    const postDialog = document.getElementById('post-dialog');
    const submitPostBtn = document.getElementById('post-submit');
    const previewdiv = document.getElementById('add-preview');
    const pickImage = document.getElementById('pick-image');
    const postBtn = document.getElementById('add');


    postBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        postDialog.showModal();
    })

    pickImage.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.click();
        previewdiv.style.display = 'block';
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
                previewdiv.appendChild(imgPreview);

                // Store the selected file
                selectedFileData = selectedFile;
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

        // Create FormData object and append title, body, and selected file
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('image', selectedFileData);

        console.log(formData);

        try {
            // Send post data to server
            showLoader();
            const response = await fetch('/update-news', {
                method: "POST",
                body: formData// Send FormData instead of JSON
            });

            const result = await response.json();

            if (response.ok) {
                showFeedback();
                success.style.display = 'flex';
                success.innerText = "Posted successfully.";
                reloadPage();
                // Clear selected file data
                selectedFileData = null;
                postDialog.close();
            } else {
                showFeedback();
                errorParagraph.style.display = 'flex';
                errorParagraph.innerText = "Post update failed. Please try again..";
            } 
        } catch (error) {
            console.error("Error during post update:", error);
            showFeedback();
            errorParagraph.style.display = 'flex';
            errorParagraph.innerText = "An error occurred. Please try again later.";
        }finally{
            hideLoader();
        }
    });
});