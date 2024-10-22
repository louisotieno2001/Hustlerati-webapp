document.addEventListener('DOMContentLoaded', async function () {
    const closeMenu = document.getElementById('close-menu');
    const openMenu = document.getElementById('open-menu');
    const subMenu = document.getElementById('sub-menu');
    const loader = document.getElementById('loader');
    const errorParagraph = document.getElementById('error');
    const success = document.getElementById('success');
    const cartNumber = document.getElementById('cart-numbers');
    const removeItemBtn = document.querySelectorAll('.remove')
    const addIcon = document.querySelectorAll('.add');
    const subtractIcon = document.querySelectorAll('.subtract');
    const checkoutBtn = document.querySelectorAll('.checkout');
    const cancelBtn = document.querySelectorAll('.cancel');
    const clearItemBtn = document.querySelectorAll('.clear');
    const addItemBtn = document.querySelectorAll('.add');
    const subtractItemBtn = document.querySelectorAll('.subtract');


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
            showLoader()
            location.reload();
        }, 1000);
    }

    removeItemBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/delete-item-off-cart', {
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
            } finally {
                hideLoader();
            }

        });
    });

    clearItemBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/clear-cancelled-order', {
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
            } finally {
                hideLoader();
            }

        });
    });

    checkoutBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/checkout', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    var productId = this.getAttribute('data-product-id');
                    
                    const updateQuantity = {
                        productId
                    };

                    const updateResponse = await fetch('/update-quantity', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateQuantity)
                    });

                    const updateResult = await updateResponse.json();

                    if (updateResponse.ok) {
                        showFeedback();
                        success.style.display = 'flex';
                        success.innerText = "Purchase successful!";
                        reloadPage();
                    } else {
                        showFeedback();
                        errorParagraph.style.display = 'flex';
                        errorParagraph.innerText = "Failed to purrchase. Try again later. Please try again.";
                    }
                } else {
                    showFeedback();
                    error.style.display = 'block';
                    error.innerText = "Purchase failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during Purchase:", error);
                showFeedback();
                error.style.display = 'block';
                error.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        });
    });

    addItemBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/add-item-to-cart', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    var productId = this.getAttribute('data-product-id');
                    
                    const updateQuantity = {
                        productId
                    };

                    const updateResponse = await fetch('/update-quantity', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateQuantity)
                    });

                    const updateResult = await updateResponse.json();

                    if (updateResponse.ok) {
                        showFeedback();
                        success.style.display = 'flex';
                        success.innerText = "Purchase successful!";
                        reloadPage();
                    } else {
                        showFeedback();
                        errorParagraph.style.display = 'flex';
                        errorParagraph.innerText = "Failed to purrchase. Try again later. Please try again.";
                    }
                } else {
                    showFeedback();
                    error.style.display = 'block';
                    error.innerText = "Purchase failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during Purchase:", error);
                showFeedback();
                error.style.display = 'block';
                error.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        });
    });

    subtractItemBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/subtract-item-to-cart', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    var productId = this.getAttribute('data-product-id');
                    
                    const updateQuantity = {
                        productId
                    };

                    const updateResponse = await fetch('/update-cancelled-quantity', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateQuantity)
                    });

                    const updateResult = await updateResponse.json();

                    if (updateResponse.ok) {
                        showFeedback();
                        success.style.display = 'flex';
                        success.innerText = "Purchase successful!";
                        reloadPage();
                    } else {
                        showFeedback();
                        errorParagraph.style.display = 'flex';
                        errorParagraph.innerText = "Failed to purrchase. Try again later. Please try again.";
                    }
                } else {
                    showFeedback();
                    error.style.display = 'block';
                    error.innerText = "Purchase failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during Purchase:", error);
                showFeedback();
                error.style.display = 'block';
                error.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        });
    });


    cancelBtn.forEach(async function (button) {
        button.addEventListener('click', async function () {
            var itemId = this.getAttribute('data-card-id');
            const userData = {
                itemId,
            }

            console.log("Item id", userData);

            try {
                // Send registration data to server
                showLoader();
                const response = await fetch('/cancel-order', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    var productId = this.getAttribute('data-product-id');
                    
                    const updateQuantity = {
                        productId
                    };

                    const updateResponse = await fetch('/update-cancelled-quantity', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateQuantity)
                    });

                    const updateResult = await updateResponse.json();

                    if (updateResponse.ok) {
                        showFeedback();
                        success.style.display = 'flex';
                        success.innerText = "Cancelled successfully!";
                        reloadPage();
                    } else {
                        showFeedback();
                        errorParagraph.style.display = 'flex';
                        errorParagraph.innerText = "Failed to cancel order. Try again later. Please try again.";
                    }
                } else {
                    showFeedback();
                    errorParagraph.style.display = 'block';
                    errorParagraph.innerText = "Order cancelling failed. Please try again.";
                }
            } catch (error) {
                console.error("Error during Purchase:", error);
                showFeedback();
                errorParagraph.style.display = 'block';
                errorParagraph.innerText = "An error occurred. Please try again later.";
            } finally {
                hideLoader();
            }

        });
    });

    cart.addEventListener('click', async (e) => {
        window.location.href = '/cart'
    });

    openMenu.addEventListener('click', () => {
        openMenu.style.display = 'none';
        closeMenu.style.display = 'block';
        subMenu.style.display = 'block';
    });

    closeMenu.addEventListener('click', () => {
        closeMenu.style.display = 'none';
        openMenu.style.display = 'block';
        subMenu.style.display = 'none';
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
showTab('cart-items'); 
