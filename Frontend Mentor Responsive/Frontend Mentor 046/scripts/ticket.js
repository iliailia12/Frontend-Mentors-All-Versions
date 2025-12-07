const fullname = document.getElementById("fullname");
const emailElement = document.getElementById("attendant--email");
const avatarElement = document.getElementById("ticketAvatar");
const githubUsername = document.getElementById("githubUsername");
const ticketName = document.getElementById("ticketName");
const url = window.location.href;
const params = new URLSearchParams(url.split("?")[1]);

function loadData() {
  fullname.textContent = params.get("name");
  emailElement.textContent = params.get("email");
  ticketName.textContent = params.get("name");
  githubUsername.textContent = params.get("github");
  loadImageFromStorage();
}

function loadImageFromStorage() {
  const uploadedImage = localStorage.getItem("uploadedAvatar");
  if (uploadedImage != null) {
    avatarElement.src = uploadedImage;
  } else {
    alert(
      "Image hasn't been uploaded. Go back to the first page to upload it there"
    );
    window.location.href = "index.html";
  }
}

loadData();
console.log(
  params,
  params.get("avatar"),
  params.get("name"),
  params.get("avatar"),
  params.get("email"),
  params.get("github")
);
