// Initialize Leaflet map
function locate(mapId, markerLabel = "You are here") {
    const map = L.map(mapId).setView([44.05, -91.63], 13); // Default: Winona
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      map.setView([lat, lon], 15);
      L.marker([lat, lon]).addTo(map).bindPopup(markerLabel).openPopup();
    });
  
    // Optional sample markers
    if (mapId === "mosque-map") {
      L.marker([44.048, -91.63]).addTo(map).bindPopup("Islamic Center of Winona");
      L.marker([44.06, -91.64]).addTo(map).bindPopup("Nearby Mosque");
    } else if (mapId === "restaurant-map") {
      L.marker([44.05, -91.62]).addTo(map).bindPopup("Halal Restaurant");
      L.marker([44.053, -91.631]).addTo(map).bindPopup("Another Halal Spot");
    }
  }
  
  // Handle star rating click
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".stars").forEach((starContainer) => {
      const stars = starContainer.querySelectorAll("span");
      stars.forEach((s, idx) =>
        s.addEventListener("click", () => {
          stars.forEach((st, i) =>
            st.style.color = i <= idx ? "gold" : "gray"
          );
          starContainer.setAttribute("data-rating", idx + 1);
        })
      );
    });
  });
  
  // Handle review submission
  function submitReview(type) {
    const name = document.getElementById(`${type}-name`).value;
    const review = document.getElementById(`${type}-review`).value;
    const rating = document
      .getElementById(`${type}-stars`)
      .getAttribute("data-rating");
  
    const halal =
      type === "restaurant"
        ? document.getElementById("halal-status").value
        : null;
  
    if (!name || !review || !rating) {
      alert("Please fill in all fields and select a star rating.");
      return;
    }
  
    const container = document.getElementById(`${type}-review-list`);
    const newReview = document.createElement("div");
    newReview.className = "review-item";
    newReview.innerHTML = `
      <p><strong>${name}</strong> (${rating}★)</p>
      <p>${review}</p>
      ${halal ? `<p>Halal Status: ${halal}</p>` : ""}
      <hr/>
    `;
    container.appendChild(newReview);
  
    // Reset form
    document.getElementById(`${type}-name`).value = "";
    document.getElementById(`${type}-review`).value = "";
    const stars = document.querySelectorAll(`#${type}-stars span`);
    stars.forEach((s) => (s.style.color = "gray"));
    document.getElementById(`${type}-stars`).removeAttribute("data-rating");
  }
  