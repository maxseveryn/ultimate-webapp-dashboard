export async function getLocation() {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.hamlet ||
            "Unknown";

          const country = data.address.country || "";

          resolve({ city, country, lat, lon });
        } catch (error) {
          reject("Could not fetch city name");
        }
      },
      () => {
        reject("Could not get coordinates");
      }
    );
  });
}
