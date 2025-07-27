import { getLocation } from "./current-location.js";

const currentLocationBtn = document.querySelector(".current-location-btn");
const searchInput = document.getElementById("search-input");

currentLocationBtn.addEventListener("click", async () => {
  try {
    const result = await getLocation();
    searchInput.value = `${result.city}, ${result.country}`;
  } catch (err) {
    console.error("Error getting location:", err);
    searchInput.value = "Location error";
  }
});
