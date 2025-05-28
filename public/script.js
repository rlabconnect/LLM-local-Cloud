document.getElementById("animationinterface").classList.replace("flex","hidden")
document.getElementById("file").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];
    const box = document.getElementById("box-description");
    const previewPopup = document.getElementById("preview-popup");
    const previewCanvas = document.getElementById("preview-canvas");

    if (file) {
        if (file.name.endsWith(".pdf")) {
            box.innerHTML = file.name;
            box.classList.remove("text-red-500");

            // to enable the preview button
            previewButton = document.getElementById("previewbutton");
            previewButton.classList.remove("hidden");

            // Show the preview popup
            previewPopup.classList.replace("hidden", "flex");

            // Read and display the PDF using PDF.js
            const reader = new FileReader();
            reader.onload = function (event) {
                const typedarray = new Uint8Array(event.target.result);

                pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        const viewport = page.getViewport({ scale: 1 }); // First, get actual dimensions                        
                        const maxWidth = 500;
                        const scale = Math.min(1, maxWidth / viewport.width); // Limit by max width
                        const scaledViewport = page.getViewport({ scale });
                        const canvas = previewCanvas;
                        const ctx = canvas.getContext("2d");

                        canvas.width = scaledViewport.width;
                        canvas.height = scaledViewport.height;

                        page.render({ canvasContext: ctx, viewport: scaledViewport });
                    });
                });
            };
            reader.readAsArrayBuffer(file);
        } else {
            box.innerHTML = "Invalid File type!";
            box.classList.add("text-red-500");
        }
    }
});

// Function to close the preview popup
function closePreview() {
    document.getElementById("preview-popup").classList.replace("flex", "hidden");
}

// For getting the preview-pop up using the preview button
document.getElementById("previewbutton").addEventListener("click", () => {
    document.getElementById("preview-popup").classList.replace("hidden", "flex");
});

// form validation 
function validateForm() {
    const fileInput = document.getElementById("file");
    const file = fileInput.files[0];

    if (!file) {
        return false;
    }

    if (!file.name.endsWith(".pdf")) {
        return false;
    }

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
        alert("File size exceeds 10MB. Please upload a smaller file.");
        return false;
    }

    return true;
}

document.getElementById("form-submit").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!validateForm()) return;
    document.getElementById("animationinterface").classList.replace("hidden","flex")

    const form = e.target;
    const fileInput = document.getElementById("file");
    const filterText = document.getElementById("inputForFilter").value;
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("filterText", filterText);

    try {
        const response = await fetch(form.action, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }
        const result = await response.json();
        console.log(result)
        document.getElementById("responseText").value=result.tempresult;
        document.getElementById("responseText").parentElement.classList.remove("hidden")
        document.getElementById("form-submit").parentElement.classList.replace("flex","hidden")
        document.getElementById("animationinterface").classList.replace("flex","hidden")

    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
    }
});

document.getElementById("closeResponseText").addEventListener("click",()=>{
    document.getElementById("responseText").value="";
    document.getElementById("responseText").parentElement.classList.add("hidden")
    document.getElementById("form-submit").parentElement.classList.replace("hidden","flex")
    window.location.href="/"
}
)