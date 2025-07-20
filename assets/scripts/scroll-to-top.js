document.addEventListener("scroll", () => {
  const toTopButton = document.querySelector("#to-top");

  if (window.scrollY > 200) {
    toTopButton.classList.add("show");
  } else {
    toTopButton.classList.remove("show");
  }
});
