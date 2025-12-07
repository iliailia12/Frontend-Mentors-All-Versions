const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("photo");
const uploadBtn = document.getElementById("upload-btn");
const previewImg = document.getElementById("photo-preview");
const uploadText = document.querySelector(".upload-text");
const actionBtns = document.querySelectorAll(".action-btn");
const uploadNote = document.getElementById("upload-note");

// Prevent default drag behavior
["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  });
});

uploadBtn.addEventListener("click", () => {
  fileInput.click();
});

dropArea.addEventListener("dragenter", () => {
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  dropArea.classList.remove("dragover");
  handleFile(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (!file || !file.type.match(/^image\/(jpeg|png)$/)) {
    uploadNote.innerHTML = "File type not supported!";
    uploadNote.classList.add("error");
    return;
  }

  if (file.size > 500 * 1024) {
    uploadNote.innerHTML = "File too large. Please upload a photo under 500KB.";
    uploadNote.classList.add("error");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewImg.src = reader.result;
    previewImg.classList.remove("hidden");
    uploadBtn.classList.add("hidden");
    uploadText.classList.add("hidden");
    actionBtns.forEach(btn => btn.classList.remove("hidden"));
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  e.preventDefault();
  previewImg.src = "";
  previewImg.classList.add("hidden");
  uploadBtn.classList.remove("hidden");
  uploadText.classList.remove("hidden");
  actionBtns.forEach(btn => btn.classList.add("hidden"));
  fileInput.value = "";
}

function changeImage(e) {
  e.preventDefault();
  fileInput.click();
}


// Handling form submission
const submitBtn = document.querySelector(".submit-btn");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Get form input values
  const photo = document.getElementById("photo-preview").src;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const github = document.getElementById("github-username").value.trim();

  const nameInfo = document.getElementById("name-info");
  const emailInfo = document.getElementById("email-info");
  const githubInfo = document.getElementById("github-info");

  // Reset previous error
  nameInfo.innerHTML = '';
  nameInfo.classList.remove("error");

  // Validate name
  if (!name) {
    nameInfo.innerHTML = '<img src="assets/images/icon-info.svg" alt="Info Icon" /> Please provide full name!';
    nameInfo.classList.add("error");
    return;
  }

  // Validate email
  if (!email) {
    emailInfo.innerHTML = '<img src="assets/images/icon-info.svg" alt="Info Icon" /> Please provide your email!';
    emailInfo.classList.add("error");
    return;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailInfo.innerHTML = '<img src="assets/images/icon-info.svg" alt="Info Icon" /> Please Enter a valid email address!';
    emailInfo.classList.add("error");
    return;
  }

  // Validate GitHub username
  if (!github) {
    githubInfo.innerHTML = '<img src="assets/images/icon-info.svg" alt="Info Icon" /> Please provide your GitHub username!';
    githubInfo.classList.add("error");
    return;
  } else if (!github.startsWith("@")) {
    githubInfo.innerHTML = '<img src="assets/images/icon-info.svg" alt="Info Icon" /> GitHub username must start with "@"!';
    githubInfo.classList.add("error");
    return;
  }

  // Validate the image
  if (!photo) {
    uploadNote.innerHTML = "Please upload a jpg or png file!";
    uploadNote.classList.add("error")
    return
  }

  // Save data
  const formData = {
    name,
    email,
    github,
    photo
  };

  localStorage.setItem("ticketData", JSON.stringify(formData));
  window.location.href = "ticket.html";
});

