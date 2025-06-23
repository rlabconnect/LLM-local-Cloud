// Hide animation interface initially
document.getElementById("animationinterface").classList.replace("flex","hidden")

document.getElementById("file").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const box = document.getElementById("box-description");
    const previewPopup = document.getElementById("preview-popup");
    const previewCanvas = document.getElementById("preview-canvas");

    if (file) {
        // More robust PDF file type checking
        const fileName = file.name.toLowerCase();
        const fileType = file.type;
        const isPDF = fileName.endsWith(".pdf") || fileType === "application/pdf";
        
        if (isPDF) {
            box.innerHTML = file.name;
            box.classList.remove("text-red-500");

            // Enable the preview button
            const previewButton = document.getElementById("previewbutton");
            if (previewButton) {
                previewButton.classList.remove("hidden");
            }

            // Show the preview popup
            previewPopup.classList.replace("hidden", "flex");

            // Read and display the PDF using PDF.js with error handling
            const reader = new FileReader();
            reader.onload = function (event) {
                try {
                    const typedarray = new Uint8Array(event.target.result);

                    pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                        return pdf.getPage(1);
                    }).then(page => {
                        const viewport = page.getViewport({ scale: 1 });
                        const maxWidth = 500;
                        const scale = Math.min(1, maxWidth / viewport.width);
                        const scaledViewport = page.getViewport({ scale });
                        const canvas = previewCanvas;
                        const ctx = canvas.getContext("2d");

                        canvas.width = scaledViewport.width;
                        canvas.height = scaledViewport.height;

                        return page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
                    }).catch(error => {
                        console.error("Error rendering PDF:", error);
                        box.innerHTML = "Error previewing PDF";
                        box.classList.add("text-red-500");
                    });
                } catch (error) {
                    console.error("Error processing PDF:", error);
                    box.innerHTML = "Error processing PDF";
                    box.classList.add("text-red-500");
                }
            };
            
            reader.onerror = function() {
                console.error("Error reading file");
                box.innerHTML = "Error reading file";
                box.classList.add("text-red-500");
            };
            
            reader.readAsArrayBuffer(file);
        } else {
            box.innerHTML = "Invalid File type! Please select a PDF file.";
            box.classList.add("text-red-500");
            
            // Hide preview button if not PDF
            const previewButton = document.getElementById("previewbutton");
            if (previewButton) {
                previewButton.classList.add("hidden");
            }
        }
    } else {
        // Clear UI when no file selected
        box.innerHTML = "No file selected";
        box.classList.remove("text-red-500");
        const previewButton = document.getElementById("previewbutton");
        if (previewButton) {
            previewButton.classList.add("hidden");
        }
    }
});

// Function to close the preview popup
function closePreview() {
    const previewPopup = document.getElementById("preview-popup");
    if (previewPopup) {
        previewPopup.classList.replace("flex", "hidden");
    }
}

// For getting the preview popup using the preview button
document.getElementById("previewbutton").addEventListener("click", () => {
    const previewPopup = document.getElementById("preview-popup");
    if (previewPopup) {
        previewPopup.classList.replace("hidden", "flex");
    }
});

// Enhanced form validation 
function validateForm() {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file.");
        return false;
    }

    // More robust PDF validation
    const fileName = file.name.toLowerCase();
    const fileType = file.type;
    const isPDF = fileName.endsWith(".pdf") || fileType === "application/pdf";
    
    if (!isPDF) {
        alert("Please select a valid PDF file.");
        return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        alert("File size exceeds 10MB. Please upload a smaller file.");
        return false;
    }

    return true;
}

document.getElementById("form-submit").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) return;
    
    // Show loading animation
    const animationInterface = document.getElementById("animationinterface");
    if (animationInterface) {
        animationInterface.classList.replace("hidden","flex");
    }

    const form = e.target;
    const fileInput = document.getElementById("file");
    const filterText = document.getElementById("inputForFilter").value || "";
    const formData = new FormData();
    
    formData.append("file", fileInput.files[0]);
    formData.append("filterText", filterText);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Upload failed: ${response.status} ${response.statusText}. ${errorText}`);
        }
        
        const result = await response.json();
        console.log("Upload successful:", result);
        
        // Handle successful response
        const responseTextElement = document.getElementById("responseText");
        const formSubmitParent = document.getElementById("form-submit").parentElement;
        
        if (responseTextElement && result.tempresult) {
            responseTextElement.value = result.tempresult;
            responseTextElement.parentElement.classList.remove("hidden");
        }
        
        if (formSubmitParent) {
            formSubmitParent.classList.replace("flex","hidden");
        }
        
        if (animationInterface) {
            animationInterface.classList.replace("flex","hidden");
        }

    } catch (error) {
        console.error("Error uploading file:", error);
        alert(`Error uploading file: ${error.message}. Please try again.`);
        
        // Hide loading animation on error
        if (animationInterface) {
            animationInterface.classList.replace("flex","hidden");
        }
    }
});

document.getElementById("closeResponseText").addEventListener("click", () => {
    const responseText = document.getElementById("responseText");
    const formSubmitParent = document.getElementById("form-submit").parentElement;
    
    if (responseText) {
        responseText.value = "";
        responseText.parentElement.classList.add("hidden");
    }
    
    if (formSubmitParent) {
        formSubmitParent.classList.replace("hidden","flex");
    }
    
    // Reset file input
    const fileInput = document.getElementById("file");
    if (fileInput) {
        fileInput.value = "";
    }
    
    // Reset description box
    const box = document.getElementById("box-description");
    if (box) {
        box.innerHTML = "No file selected";
        box.classList.remove("text-red-500");
    }
    
    // Hide preview button
    const previewButton = document.getElementById("previewbutton");
    if (previewButton) {
        previewButton.classList.add("hidden");
    }
    
    // Optional: redirect to home page (uncomment if needed)
    // window.location.href = "/";
});