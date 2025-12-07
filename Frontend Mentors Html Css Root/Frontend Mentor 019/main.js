const links = document.querySelectorAll(".links li");
const menuBtn = document.querySelector(".icon-menu");
const menu = document.querySelector(".menu");

links.forEach(function (ele) {
  ele.onclick = function (e) {
    links.forEach(function (ele) {
      ele.classList.remove("active");
    });
    this.classList.add("active");
  };
});

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("show");
});

window.addEventListener("DOMContentLoaded", () => {
  gsap.from("header", {
    opacity: 0,
    y: -50,
    duration: 1,
  });
  const tl = gsap.timeline();

  tl.from(".hero-info h1", {
    opacity: 0,
    y: -50,
    duration: 1,
  })
    .from(
      ".hero-info p",
      {
        opacity: 0,
        y: -20,
        duration: 1,
      },
      "-=0.5"
    )

    .from(
      ".hero-image img",
      {
        opacity: 0,
        x: 100,
        duration: 1,
      },
      "-=0.8"
    );
});

window.onload = function () {
  const loader = document.querySelector("#loader");
  loader.style.display = "none";
};
