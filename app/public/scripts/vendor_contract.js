document.addEventListener('DOMContentLoaded', async () => {
    const downloadBtn = document.getElementById("download");
    const contractBody = document.getElementById("body").innerText.trim();
    const imgElement = document.getElementById('img');

    // Getting the background image URL (or base64 data) from the img element's background
    const backgroundImage = window.getComputedStyle(imgElement).backgroundImage;

    downloadBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Get the contract title and body
        const hustleratiTitle = document.querySelector("h1").innerText;
        const contractTitle = document.querySelector("h2").innerText;
        const contractBody = document.getElementById("body").innerText.trim();

        // Import jsPDF
        const { jsPDF } = window.jspdf;

        // Create a new jsPDF instance
        const doc = new jsPDF();

        // Extract the image URL from the background-image CSS property (remove 'url("...")')
        const imageUrl = backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');

        // If the background image is a URL or base64, we can directly use it in the PDF
        if (imageUrl) {
            // You can use jsPDF's addImage method to insert the image into the PDF
            // If it's a base64 string or URL, you can use it directly.
            doc.addImage(imageUrl, 'JPEG', 85, 0, 40, 40); // Adding the logo centered at the top
        }
        // #5d4037
        // Add the HUSTLERATI title below the logo
        doc.setFont("Verdana", "bold");
        doc.setFontSize(22);
        const hustleratiColor = hexToRgb('#F09819');
        doc.setTextColor(hustleratiColor.r, hustleratiColor.g, hustleratiColor.b);
        const hustleratiTitleWidth = doc.getTextWidth(hustleratiTitle);
        const pageWidth = doc.internal.pageSize.width;
        const centerX = (pageWidth - hustleratiTitleWidth) / 2; // Calculate the center position

        doc.text(hustleratiTitle, centerX, 50);  // Position it 50 units down from the top (just below the logo)

        // Draw a full-width underline below the title
        const underlineY = 55; // The Y-coordinate where the underline will be drawn
        doc.setLineWidth(0.5);
        const underlineColor = hexToRgb('#5d4037');
        doc.setDrawColor(underlineColor.r, underlineColor.g, underlineColor.b);
        doc.line(0, underlineY, pageWidth, underlineY); // Full width line from left to right


        // Add the contract title below the underline, centered
        doc.setFont("Verdana", "bold");
        doc.setFontSize(18);
        const contractTitleColor = hexToRgb('#5d4037');
        doc.setTextColor(contractTitleColor.r, contractTitleColor.g, contractTitleColor.b);
        const contractTitleWidth = doc.getTextWidth(contractTitle);
        const contractTitleX = (pageWidth - contractTitleWidth) / 2; // Center the title

        doc.text(contractTitle, contractTitleX, 70); // Position it just below the underline

        // Add contract body below the title
        doc.setFont("Verdana", "normal");
        doc.setFontSize(14);
        const bodyColor = hexToRgb('#000000');
        doc.setTextColor(bodyColor.r, bodyColor.g, bodyColor.b);

        // Split the body text into lines based on the page width
        const marginLeft = 20;
        const maxWidth = pageWidth - 2 * marginLeft; // Margin on both sides

        // Split the body content into chunks that fit within the page width
        const textLines = doc.splitTextToSize(contractBody, maxWidth);

        let cursorY = 85; // Start writing after the contract title

        // Write each line, and check for page overflow
        for (let i = 0; i < textLines.length; i++) {
            // Check if the line overflows the page
            if (cursorY + 10 > doc.internal.pageSize.height) {
                doc.addPage(); // Add new page if the text exceeds the page height
                cursorY = 20; // Reset Y-position for new page
            }

            doc.text(textLines[i], marginLeft, cursorY);
            cursorY += 10;  // Move cursor down for the next line
        }

        // Save the PDF
        doc.save("contract.pdf");  // This will prompt the user to download the PDF as "contract.pdf"
    });

    function hexToRgb(hex) {
        // Remove the hash at the start if it's there
        hex = hex.replace(/^#/, '');
        // Parse the R, G, and B values from the hex
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    }

    const acceptContractBtn = document.getElementById('accept');
    const backHome = document.getElementById('back-home');
    const backHomeDialog = document.getElementById('back-home-dialog');
    const container = document.querySelector('.contract-container');
   
    acceptContractBtn.addEventListener('click', async (e)=>{
        e.preventDefault();

        const userId = container.getAttribute('data-user-id');

        const userData = {
            userId
        };

        try {
            // Send registration data to server
            const response = await fetch('/update-vendor-agreement', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (response.ok) {
                backHomeDialog.showModal();
            } else {
                alert("Update failed. Please try again");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Something went wrong. Try again later");
        } 
        
    });

    backHome.addEventListener('click', async (e)=>{
        e.preventDefault();
        window.location.href = '/home'
    })
});
