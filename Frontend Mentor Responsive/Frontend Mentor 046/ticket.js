window.addEventListener("DOMContentLoaded", () => {
     const data = JSON.parse(localStorage.getItem("ticketData"));
     const name = document.getElementById("name");
     const email = document.getElementById("email");

     console.log(data);
     
     if (!data) {
          window.location.href = "index.html";
          return;
     }

     name.textContent = data.name
     name.classList.add("gradient")
     email.textContent = data.email
     email.classList.add("error")

     document.getElementById("display-name").textContent = data.name;
     document.getElementById("display-github").textContent = data.github;
     document.getElementById("display-image").src = data.photo;
});
