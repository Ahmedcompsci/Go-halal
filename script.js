// script.js

// Import initialized Firestore database instance
import { db } from "./Go-halal-oz-shark-duo/firebase-init.js";
// Import Firestore functions for adding documents and timestamps
import { addDoc, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// —— RESTAURANT/MOSQUE DATA & MAP ——

/** List of halal restaurants with their coordinates */
const halalRestaurants = [
  { name: "Sabri Kitchen",               lat: 44.05,   lon: -91.63   },
  { name: "Halal Bites - Rochester",     lat: 44.013,  lon: -92.475  },
  { name: "Crescent Grill - La Crosse",  lat: 43.812,  lon: -91.252  },
  { name: "Desi Dhaba - Eau Claire",     lat: 44.813,  lon: -91.502  },
  { name: "Muna Halal",                  lat: 44.0168, lon: -92.4783 },
  { name: "Nile Restaurant",             lat: 44.0233, lon: -92.4808 },
  { name: "Abu Huraira Restaurant",      lat: 44.0231, lon: -92.4911 },
];

        /** List of mosques with their coordinates */
const masjids = [
  { name: "Winona Islamic Center",       lat: 44.049,  lon: -91.639  },
  { name: "Masjid Al-Taqwa - Rochester", lat: 44.012,  lon: -92.480  },
  { name: "Al-Madina Masjid - La Crosse",lat: 43.810,  lon: -91.251  },
  { name: "Masjid Rawdah - Eau Claire",  lat: 44.814,  lon: -91.501  },
  { name: "Islamic Center of Rochester", lat: 44.0207, lon: -92.4850 },
  { name: "Masjid Abu Bakr",             lat: 44.0210, lon: -92.4830 },
  { name: "Islamic Dawah Center",        lat: 44.0225, lon: -92.4795 },
];

/**
 * Initializes a Leaflet map in the given element and plots markers
 * @param {string} mapId  - ID of the HTML element to attach the map
 * @param {Array}  data   - Array of locations ({ name, lat, lon })
 */
function initMap(mapId, data) {
  // Create map centered on default coords
  const map = L.map(mapId).setView([44.05, -91.63], 11);

    // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

      // If user grants location access, recenter the map on their position
  navigator.geolocation.getCurrentPosition(
    pos => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
    () => {}
  );

          // Plots  each location as a clickable marker
  data.forEach(item => {
    L.marker([item.lat, item.lon])
      .addTo(map)
      .bindPopup(item.name);
  });
}

    // Waits until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // If we're on the restaurant page, it sets up map and dropdown
  if (document.getElementById('restaurantSelect')) {
    initMap('map', halalRestaurants);
    halalRestaurants.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.name;
      opt.textContent = r.name;
      document.getElementById('restaurantSelect').append(opt);
    });
  }

  // If data-page="masjid",  then initialize the mosque map
  if (document.body.dataset.page === 'masjid') {
    initMap('map', masjids);
  }

  // Handles the  star-rating clicks: toggles 'active' class up to selected value
  document.querySelectorAll('.star').forEach(s => {
    s.addEventListener('click', () => {
      const rating = +s.dataset.value;
      s.parentNode.querySelectorAll('.star')
        .forEach((st, i) => st.classList.toggle('active', i < rating));
    });
  });
});

        // —— Submits the Review (restaurant/masjid) ——

/**
 * Gathers review form data, validates it, and writes to Firestore
 * @param {string} page - "restaurant" or "masjid"
 */
export async function submitReview(page) {
  // Read user inputs
  const name        = document.getElementById('userName').value.trim();
  const text        = document.getElementById('reviewText').value.trim();
  const rating      = document.querySelectorAll('.star.active').length;
  const halalStatus = page === 'restaurant'
    ? document.getElementById('halalStatus').value
    : null;
  const restaurant  = page === 'restaurant'
    ? document.getElementById('restaurantSelect').value
    : null;

  // Basic form validation
  if (!name || !text || rating === 0 || (page==='restaurant' && !halalStatus)) {
    alert('Please fill all fields!');
    return;
  }

  // Writes the  review document to Firestore
  try {
    await addDoc(collection(db, 'reviews'), {
      name,
      text,
      rating,
      halalStatus,
      restaurant,
      page,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error(err);
    alert('Could not save review.');
    return;
  }

}

// Makes the  functions available for inline onclick handlers
window.submitReview          = () => submitReview('restaurant');
window.submitReviewMasjid    = () => submitReview('masjid');
