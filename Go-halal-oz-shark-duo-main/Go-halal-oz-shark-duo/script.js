// script.js
import { db } from "./firebase-init.js";
import { addDoc, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// —— RESTAURANT/MOSQUE DATA & MAP ——
// in your restaurant.html / script.js
const halalRestaurants = [
  { name: "Sabri Kitchen",               lat: 44.05,   lon: -91.63   },
  { name: "Halal Bites - Rochester",     lat: 44.013,  lon: -92.475  },
  { name: "Crescent Grill - La Crosse",  lat: 43.812,  lon: -91.252  },
  { name: "Desi Dhaba - Eau Claire",     lat: 44.813,  lon: -91.502  },
  { name: "Muna Halal",                  lat: 44.0168, lon: -92.4783 },
  { name: "Nile Restaurant",             lat: 44.0233, lon: -92.4808 },
  { name: "Abu Huraira Restaurant",      lat: 44.0231, lon: -92.4911 },
];


const masjids = [
  { name: "Winona Islamic Center",       lat: 44.049,  lon: -91.639  },
  { name: "Masjid Al-Taqwa - Rochester", lat: 44.012,  lon: -92.480  },
  { name: "Al-Madina Masjid - La Crosse",lat: 43.810,  lon: -91.251  },
  { name: "Masjid Rawdah - Eau Claire",  lat: 44.814,  lon: -91.501  },
  { name: "Islamic Center of Rochester", lat: 44.0207, lon: -92.4850 },
  { name: "Masjid Abu Bakr",             lat: 44.0210, lon: -92.4830 },
  { name: "Islamic Dawah Center",        lat: 44.0225, lon: -92.4795 },
];

function initMap(mapId, data) {
  const map = L.map(mapId).setView([44.05, -91.63], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  navigator.geolocation.getCurrentPosition(
    pos => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
    () => {}
  );
  data.forEach(item => {
    L.marker([item.lat, item.lon])
      .addTo(map)
      .bindPopup(item.name);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // initialize restaurant page
  if (document.getElementById('restaurantSelect')) {
    initMap('map', halalRestaurants);
    halalRestaurants.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.name;
      opt.textContent = r.name;
      document.getElementById('restaurantSelect').append(opt);
    });
  }
  // initialize masjid page
  if (document.body.dataset.page === 'masjid') {
    initMap('map', masjids);
  }

  // star rating handler
  document.querySelectorAll('.star').forEach(s => {
    s.addEventListener('click', () => {
      const rating = +s.dataset.value;
      s.parentNode.querySelectorAll('.star')
        .forEach((st, i) => st.classList.toggle('active', i < rating));
    });
  });
});

// —— Submit Review (restaurant/masjid) ——
export async function submitReview(page) {
  const name        = document.getElementById('userName').value.trim();
  const text        = document.getElementById('reviewText').value.trim();
  const rating      = document.querySelectorAll('.star.active').length;
  const halalStatus = page === 'restaurant'
    ? document.getElementById('halalStatus').value
    : null;
  const restaurant  = page === 'restaurant'
    ? document.getElementById('restaurantSelect').value
    : null;

  if (!name || !text || rating === 0 || (page==='restaurant' && !halalStatus)) {
    alert('Please fill all fields!');
    return;
  }

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

  // original UI update code here…
}

// expose for inline onclick
window.submitReview = () => submitReview('restaurant');
window.submitReviewMasjid = () => submitReview('masjid');