const imagePreview = document.getElementById("imagePreview");
const dragLabel = document.getElementById("dragLabel");
const avatarInput = document.getElementById("avatar");
const activeBtns = document.querySelector(".active--image--btns");
const imageDrop = document.getElementById("image-drop");
const form = document.querySelector("form");
const infoText = document.getElementById("info--text");
const infoWrapper = document.getElementById("image--upload--label");

const events = ["dragenter", "dragover", "dragleave", "drop"];
let btnChange, btnRemove;

events.forEach((eventName) => {
    imageDrop.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

imageDrop.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files && files.length > 0) {
        handleFiles(files);

        // Create a new DataTransfer to set the files on the input
        const dataTransfer = new DataTransfer();
        for (let file of files) {
            dataTransfer.items.add(file);
        }
        avatarInput.files = dataTransfer.files;
    } else {
        console.error("Dropped items are not files.");
    }
}

function handleFiles(files) {
    let file = files[0];
    createPreview(file);
}

function createPreview(file) {
    let objectURL = URL.createObjectURL(file);
    imagePreview.src = objectURL;
    dragLabel.style.display = "none";
    activeBtns.style.display = "flex";

    if (!btnChange || !btnRemove) {
        btnChange = document.getElementById("btnChange");
        btnRemove = document.getElementById("btnRemove");

        btnChange.addEventListener("click", changeImage);
        btnRemove.addEventListener("click", removeImage);
    }
}

form.addEventListener("submit", (e) => {
    const reader = new FileReader();
    let error = false;
    let file = avatarInput.files[0];

    //checking valid file type
    if (file.type !== "image/png" && file.type !== "image/jpg") {
        error = true;
        infoWrapper.classList.add("error");

        infoText.textContent =
            "File is of the incorrect type. Please upload .png or .jpg files.";
    } else if (file.size > 512000) {
        //checking file size 512000bytes == 500KB
        error = true;
        infoWrapper.classList.add("error");
        infoText.textContent =
            "File too large. Please upload a photo under 500KB.";
    } else {
        error = false;
        infoWrapper.classList.remove("error");
        infoText.textContent =
            "Upload your photo (JPG or PNG, max size: 500KB).";
    }

    if (error) {
        //prevents form submission which was the default action
        //when there is an error not detected by inputs:required
        //and stop it so it doesnt uplaod image
        e.preventDefault();
        return;
    } else {
        reader.onload = function (event) {
            console.log(event.target);
            localStorage.setItem("uploadedAvatar", event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

avatarInput.addEventListener("change", (e) => {
    let file = avatarInput.files[0];
    createPreview(file);
});

//clicks the input:file button so it reopens the UI for selecting a file/image
function changeImage() {
    avatarInput.click();
}

//removes image and resets to default styling
function removeImage() {
    avatarInput.value = "";
    imagePreview.src = "./assets/images/icon-upload.svg";
    btnRemove.removeEventListener("click", removeImage);
    btnChange.removeEventListener("click", changeImage);
    activeBtns.style.display = "none";
    dragLabel.style.display = "block";
    btnChange = undefined;
    btnRemove = undefined;
}
