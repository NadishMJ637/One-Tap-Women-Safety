let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

/* ---------- ADD CONTACT ---------- */
function addContact() {
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Please fill all fields");
    return;
  }

  contacts.push({ name, phone });
  localStorage.setItem("contacts", JSON.stringify(contacts));

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";

  displayContacts();
}

/* ---------- DISPLAY CONTACTS ---------- */
function displayContacts() {
  let list = document.getElementById("contactList");
  list.innerHTML = "";

  contacts.forEach((c, index) => {
    list.innerHTML += `
      <li>
        ${c.name} - ${c.phone}
        <a href="tel:${c.phone}">📞</a>
        <button onclick="deleteContact(${index})">❌</button>
      </li>
    `;
  });
}

/* ---------- DELETE CONTACT ---------- */
function deleteContact(index) {
  contacts.splice(index, 1);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
}

/* ---------- SOS BUTTON ---------- */
document.getElementById("sosBtn").onclick = () => {
  const siren = document.getElementById("siren");
  siren.currentTime = 0;
  siren.play();

  if (contacts.length === 0) {
    alert("Add emergency contacts first!");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  document.getElementById("status").innerText =
    "📍 Fetching live location...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      let lat = pos.coords.latitude;
      let lon = pos.coords.longitude;

      let message = `🚨 EMERGENCY ALERT!
I am in danger.
Live location:
https://maps.google.com/?q=${lat},${lon}`;

      // ✅ WhatsApp to PRIMARY contact only (reliable)
      let primaryPhone = contacts[0].phone;

      document.getElementById("status").innerText =
        "🚨 SOS activated. Alert prepared.";

      window.open(
        `https://wa.me/${primaryPhone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    },
    () => {
      document.getElementById("status").innerText =
        "⚠️ Unable to fetch location. Enable GPS.";
    }
  );
};

/* ---------- INITIAL LOAD ---------- */
displayContacts();
