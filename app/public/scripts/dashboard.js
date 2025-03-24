document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const postBtn = document.getElementById('post');
    const submitItemBtn = document.getElementById('submit_item');
    var removeItemBtn = document.querySelectorAll('.remove-item');
    const error = document.getElementById('error');
    const success = document.getElementById('success');
    const businessCard = document.querySelector('.business-card');
    const shelfBtn = document.getElementById('add_to_shelf');
    const contractDialog = document.getElementById('contract-dialog');
    const contractBtn = document.getElementById('contract');
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

    shelfBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        window.location.href = '/upload-to-your-shelf'
    });

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

    postBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        window.location.href = '/upload-business-ad'
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
        pane.classList.remove('active'); // Remove active class to hide
    });

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active'); // Remove active class from tabs
    });

    // Show the clicked tab pane
    const activeTabPane = document.getElementById(tabId);
    
    // Check if the activeTabPane exists
    if (activeTabPane) {
        activeTabPane.classList.add('active'); // Add active class to show

        // Set the active class on the clicked tab
        const activeTab = [...tabs].find(tab => tab.getAttribute('onclick').includes(tabId));
        if (activeTab) {
            activeTab.classList.add('active'); // Add active class to the clicked tab
        }
    } else {
        console.error(`Tab pane with ID "${tabId}" not found.`);
    }
}

// Initialize to show the first tab
showTab('all-orders');