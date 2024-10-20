document.addEventListener("DOMContentLoaded", function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const addDialog = document.getElementById('add-member');
    const closeAddDialog = document.getElementById('close-add');
    const submitMember = document.getElementById('submit-member');
    const addButton = document.getElementById('add');
    const memberImage = document.getElementById('member-image');
    const fileInput = document.getElementById('fileInput');
    const previewDiv = document.getElementById('preview');
    const editDialog = document.getElementById('edit-group');
    const closeEditDialog = document.getElementById('close-edit');
    const submitEdit = document.getElementById('submit-edit');
    const editButton = document.getElementById('edit');
    const groupName = document.getElementById('group');
    const groupId = document.getElementById('groupId');
    const editBusinessDescription = document.getElementById('edit-business-description');
    const loader = document.getElementById('loader');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const groupError = document.getElementById('group-error');
    const groupSuccess = document.getElementById('group-success');
    const deleteMemberButton = document.querySelectorAll('.delete-member');
    const generalError = document.getElementById('general-error');
    const generalSuccess = document.getElementById('general-success');


    // Function to show the loader
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

    async function showGroupError() {
        groupError.style.display = 'block'
    }

    async function showGroupSuccess() {
        groupSuccess.style.display = 'block'
    }

    function showFeedback() {
        const feedbackDiv = document.getElementById('feedback-div');
        feedbackDiv.style.display = 'flex'; 
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 2000);
    }

    deleteMemberButton.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var userId = this.getAttribute('data-member-id');
            const userData = {
                userId,
            }

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/delete-group-member', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    generalSuccess.innerText = "Deletion successful!";
                } else {
                    showFeedback();
                    generalError.style.display = 'flex';
                    generalError.innerText = "Deleting failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during deletion:", error);
                showFeedback();
                generalError.style.display = 'flex';
                generalError.innerText = "An error occurred. Please try again later.";
            }finally{
                hideLoader();
                location.reload()
            }

        });
    });

    editBusinessDescription.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();

        // Get the value from the Quill editor
        const description = quill.root.innerHTML;

        // Get the group ID from the button's data attribute
        const groupId = e.target.getAttribute('data-group-id');

        // Prepare the data to be sent
        const data = {
            groupId: groupId,
            description: description
        };

        console.log(data);

        try {
            const response = await fetch('/edit-business-description', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Handle successful response
                const result = await response.json();
                console.log('Success:', result);
            } else {
                // Handle error response
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            hideLoader();
        }
    });


    addButton.addEventListener('click', async (e) => {
        addDialog.showModal();
        const group = addButton.getAttribute('data-group');
        console.log(group);
        groupId.value = group;
    });

    editButton.addEventListener('click', async (e) => {
        editDialog.showModal();
        const group = editButton.getAttribute('data-group');
        console.log(group);
        groupName.value = group;
    });

    submitEdit.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const name = document.getElementById('group-name').value.trim();
        const phone = document.getElementById('group-phone').value.trim();
        const leader = document.getElementById('group-leader').value.trim();

        if (!name || !phone || !leader) {
            showError();
            error.innerText = 'All fields are required';
            hideLoader();
        } else {

            const data = {
                name,
                phone,
                leader
            }

            console.log(data);

            try {
                // Send post data to server
                const response = await fetch('/update-group', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccess();
                    success.innerText = "Group data updated";
                    // Clear selected file data
                    selectedFileData = null;
                    editDialog.close();
                    window.location.href = "/hustlers/group/home"
                } else {
                    showError();
                    error.innerText = "Post update failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during post update:", error);
                showError();
                error.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        }
    })

    closeAddDialog.addEventListener('click', async (e) => {
        e.preventDefault();
        addDialog.close();
    });

    closeEditDialog.addEventListener('click', async (e) => {
        e.preventDefault();
        editDialog.close();
    });

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
    // Show initial content (Group tab) and underline
    document.getElementById('group').style.display = 'block';
    updateUnderline();

    memberImage.addEventListener("click", async (e) => {
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
                previewDiv.style.backgroundImage = `url('${event.target.result}')`;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    submitMember.addEventListener('click', async (e) => {
        e.preventDefault();
        showLoader();
        const name = document.getElementById('member-name').value.trim();
        const email = document.getElementById('member-email').value.trim();
        const phone = document.getElementById('member-phone').value.trim();
        const group = document.getElementById('groupId').value.trim();

        if (!name || !email || !phone || !group) {
            showGroupError()
            groupError.innerText = "All fields are required";
            hideLoader();
        }

        const selectedFile = fileInput.files[0];
        if (selectedFile) {
            const formData = new FormData();
            formData.append('memberImage', selectedFile);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('group', group);
            console.log(formData);

            try {
                const response = await fetch('/submit-member', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    const data = await response.json();
                    showGroupSuccess();
                    groupSuccess.innerText = 'Member added successfully';
                    window.location.href = "/hustlers/group/home"
                } else {
                    console.error('Failed to upload image');
                    showGroupError()
                    groupError.innerText = "Something went wrong. try again";
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                showGroupError()
                groupError.innerText = "Something went wrong. try again";
            } finally {
                hideLoader();
            }
        } else {
            console.error('No file selected');
        }
    });

    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'], // Text formatting
                ['blockquote', 'code-block'], // Block formatting

                [{ 'header': [1, 2, false] }], // Headers
                [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Lists

                [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript and superscript
                [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent
                [{ 'direction': 'rtl' }], // Text direction

                [{ 'color': [] }, { 'background': [] }], // Text and background color

                ['link', 'image', 'video'], // Insert link, image, video
                ['clean'] // Clear formatting
            ]
        }
    });

    const membersList = document.querySelector('.members-list');

    membersList.addEventListener('scroll', () => {
        // Check if we're near the right edge of the list
        if (membersList.scrollLeft + membersList.clientWidth >= membersList.scrollWidth - 10) {
            // Load more members
            loadMoreMembers();
        }
    });

    async function loadMoreMembers() {
        // Fetch more members from the server
        try {
            const response = await fetch('/get-more-members'); // Adjust this endpoint as necessary
            const members = await response.json();

            members.forEach(member => {
                if (member.pic !== null) {
                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = `
                    <img src="/uploads/${member.pic}" alt="Post Image">
                    <div class="text">
                        <h1>${member.name}</h1>
                        <p>${member.phone}</p>
                        <p>${member.email}</p>
                    </div>
                    <button class="delete-member" data-member-id="${member.id}">Remove</button>
                `;
                    membersList.appendChild(card);
                }
            });
        } catch (error) {
            console.error('Error loading more members:', error);
        }
    }

});

function updateUnderline() {
    var activeTab = document.querySelector('.tablinks.active');
    var activeTab = document.querySelector('.bottom-tab.active');
    var underline = document.querySelector('.underline');
    underline.style.left = activeTab.offsetLeft + "px";
    underline.style.width = activeTab.offsetWidth + "px";
}

function openTab(event, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Deactivate all tab links
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show the selected tab content
    document.getElementById(tabName).style.display = "block";

    // Add an "active" class to the button that opened the tab
    event.currentTarget.classList.add("active");

    // Move the underline to the active tab
    updateUnderline();

    // Update bottom tab active state and underline
    updateBottomTabs(tabName);
}

function updateBottomTabs(tabName) {
    var bottomTabs = document.querySelectorAll('.bottom-tab');
    for (var i = 0; i < bottomTabs.length; i++) {
        var tab = bottomTabs[i];
        var tabText = tab.querySelector('span.material-symbols-outlined');
        var tabUnderline = tab.querySelector('.underline');

        if (tab.getAttribute('onclick').includes(tabName)) {
            tab.classList.add('active');
            tabUnderline.style.width = '100%'; // Ensure full width underline for active tab
        } else {
            tab.classList.remove('active');
            tabUnderline.style.width = '0'; // Hide underline for inactive tabs
        }
    }
}