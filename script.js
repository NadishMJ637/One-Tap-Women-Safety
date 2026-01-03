// ================= CONTACT MANAGEMENT =================
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

function addContact() {
  let nameInput = document.getElementById("name");
  let phoneInput = document.getElementById("phone");

  if (!nameInput || !phoneInput) return;

  let name = nameInput.value.trim();
  let phone = phoneInput.value.trim();

  if (!name || !phone) {
    alert("Please fill all fields");
    return;
  }

  // First contact becomes primary
  let isPrimary = contacts.length === 0;

  contacts.push({ name, phone, primary: isPrimary });
  localStorage.setItem("contacts", JSON.stringify(contacts));

  nameInput.value = "";
  phoneInput.value = "";

  displayContacts();
}

function displayContacts() {
  let list = document.getElementById("contactList");
  if (!list) return;

  list.innerHTML = "";

  contacts.forEach((c, index) => {
    list.innerHTML += `
      <li>
        <strong>${c.name}</strong> - ${c.phone} ${c.primary ? "⭐" : ""}
        <br>
        <button onclick="setPrimary(${index})">Set Primary</button>
      </li>
    `;
  });
}

function setPrimary(index) {
  contacts.forEach(c => c.primary = false);
  contacts[index].primary = true;
  localStorage.setItem("contacts", JSON.stringify(contacts));
  displayContacts();
}

// ================= SOS + LOCATION + WHATSAPP =================
const sosBtn = document.getElementById("sosBtn");

if (sosBtn) {
  sosBtn.onclick = () => {
    const status = document.getElementById("status");
    const siren = document.getElementById("siren");

    if (contacts.length === 0) {
      alert("Please add an emergency contact first");
      return;
    }

    let primaryContact = contacts.find(c => c.primary);
    if (!primaryContact) primaryContact = contacts[0];

    // Play siren
    siren.currentTime = 0;
    siren.play();

    status.innerText = "📍 Fetching live location...";

    if (!navigator.geolocation) {
      status.innerText = "❌ Location not supported";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;

        let locationLink = `https://maps.google.com/?q=${lat},${lon}`;

        let message =
          `🚨 EMERGENCY ALERT!\n` +
          `I am in danger.\n\n` +
          `Live Location:\n${locationLink}`;

        status.innerText = "🚨 SOS sent to primary contact";

        // Open WhatsApp (PRIMARY CONTACT)
        window.open(
          `https://wa.me/${primaryContact.phone}?text=${encodeURIComponent(message)}`,
          "_blank"
        );
      },
      () => {
        status.innerText = "❌ Unable to get location. Enable GPS.";
      }
    );
  };
}

// ================= FAKE CALL =================
function startFakeCall() {
  const screen = document.getElementById("fakeCallScreen");
  const ringtone = document.getElementById("ringtone");

  if (!screen || !ringtone) return;

  screen.classList.remove("hidden");

  ringtone.pause();
  ringtone.currentTime = 0;

  ringtone.play().catch(() => {
    console.log("Audio blocked until user interaction");
  });
}

function endFakeCall() {
  const screen = document.getElementById("fakeCallScreen");
  const ringtone = document.getElementById("ringtone");

  if (!screen || !ringtone) return;

  ringtone.pause();
  ringtone.currentTime = 0;
  screen.classList.add("hidden");
}

// ================= INITIAL LOAD =================
displayContacts();

