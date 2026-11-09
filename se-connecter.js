// 1. BURGER MENU
const bg = document.getElementById("bg"),
  nv = document.getElementById("nv");
bg.onclick = () => {
  nv.classList.toggle("open");
  bg.setAttribute("aria-expanded", nv.classList.contains("open"));
};

// 2. DONNEES DE BASE - 3 conducteurs exemples, 9rab l Aourir / Drarga
const seedTrips = [
  {
    id: 1,
    name: "Yassine",
    tel: "0612345678",
    from: "Aourir",
    to: "CMC Drarga",
    heure: "07:30",
    vehicule: "Voiture",
    places: 3,
    prix: 10,
    rating: 4.5,
    votes: 12,
  },
  {
    id: 2,
    name: "Salma",
    tel: "0698765432",
    from: "Drarga",
    to: "CMC Drarga",
    heure: "07:45",
    vehicule: "Moto",
    places: 1,
    prix: 5,
    rating: 4.8,
    votes: 8,
  },
  {
    id: 3,
    name: "Omar",
    tel: "0655554433",
    from: "Inezgane",
    to: "CMC Drarga",
    heure: "08:00",
    vehicule: "Voiture",
    places: 2,
    prix: 15,
    rating: 4.2,
    votes: 20,
  },
];
if (!localStorage.getItem("rm_trips"))
  localStorage.setItem("rm_trips", JSON.stringify(seedTrips));
const getTrips = () => JSON.parse(localStorage.getItem("rm_trips") || "[]");
const getUsers = () => JSON.parse(localStorage.getItem("rm_users") || "[]");
const getCurrent = () =>
  JSON.parse(localStorage.getItem("rm_current") || "null");

// Ordre: la9rab lik l-ouwel
const order = {
  Aourir: 1,
  Drarga: 2,
  Tamraght: 3,
  Taghazout: 4,
  Inezgane: 5,
  "Agadir centre": 6,
  Autre: 7,
};

// 3. AFFICHER TRAJETS
function renderTrips() {
  const q = document.getElementById("filterQuartier").value;
  const v = document.getElementById("filterVehicule").value;
  const cur = getCurrent();
  let list = getTrips().slice();
  if (q) list = list.filter((t) => t.from === q);
  if (v) list = list.filter((t) => t.vehicule === v);
  if (cur && cur.quartier)
    list.sort(
      (a, b) =>
        Math.abs((order[a.from] || 7) - (order[cur.quartier] || 7)) -
        Math.abs((order[b.from] || 7) - (order[cur.quartier] || 7)),
    );
  const box = document.getElementById("trajetList");
  document.getElementById("noTrajet").style.display = list.length
    ? "none"
    : "block";
  box.innerHTML = list
    .map((t) => {
      const wa =
        "https://wa.me/212" +
        t.tel.slice(1) +
        "?text=" +
        encodeURIComponent(
          "Salam " +
            t.name +
            ", ana bghit n-mchi m3ak men " +
            t.from +
            " l CMC Drarga, f " +
            t.heure +
            ", b " +
            t.prix +
            " DH. Ba9a blassa?",
        );
      const isNear = cur && cur.quartier === t.from;
      return `<article class="card">
      <h3>${t.name} ${isNear ? '<span class="badge">📍 9rib lik</span>' : ""}</h3>
      <p class="route">${t.from} → ${t.to}</p>
      <p>🕗 ${t.heure} • ${t.vehicule} • ${t.places} place(s) • WhatsApp: ${t.tel}</p>
      <p>⭐ ${t.rating} / 5 (${t.votes} t9yim)</p>
      <p><span class="price">${t.prix} DH</span> / personne</p>
      <div class="actions">
        <a class="pill wa" href="${wa}" target="_blank" rel="noopener">WhatsApp</a>
        <button class="ratebtn" onclick="openRate(${t.id},'${t.name}')">⭐ 9eyyem</button>
      </div>
    </article>`;
    })
    .join("");
}
document.getElementById("filterBtn").onclick = renderTrips;
renderTrips();

// 4. LOGIN / SIGN UP
let mode = "login",
  rateId = null,
  rateVal = 0;
const authModal = document.getElementById("authModal"),
  tripModal = document.getElementById("tripModal"),
  rateModal = document.getElementById("rateModal");
function openAuth(m) {
  mode = m || "login";
  authModal.classList.add("open");
  const s = mode === "signup";
  document.getElementById("authTitle").textContent = s
    ? "Créer un compte"
    : "Se connecter";
  document.getElementById("authSubmit").textContent = s
    ? "Créer compte"
    : "Dkhol";
  document.getElementById("switchAuth").textContent = s
    ? "3endi compte? Login hna"
    : "Ma 3endich compte? Sign Up hna";
  document.getElementById("nameField").style.display = s ? "block" : "none";
  document.getElementById("roleField").style.display = s ? "block" : "none";
  document.getElementById("quartierField").style.display = s ? "block" : "none";
  document.getElementById("authMsg").textContent = "";
}
document.getElementById("authBtn").onclick = () => openAuth("login");
document.getElementById("closeAuth").onclick = () =>
  authModal.classList.remove("open");
authModal.onclick = (e) => {
  if (e.target === authModal) authModal.classList.remove("open");
};
document.getElementById("switchAuth").onclick = () =>
  openAuth(mode === "login" ? "signup" : "login");

document.getElementById("authForm").onsubmit = (e) => {
  e.preventDefault();
  const tel = document.getElementById("authTel").value.trim();
  const pass = document.getElementById("authPass").value;
  const msg = document.getElementById("authMsg");
  let users = getUsers();
  if (mode === "signup") {
    const name = document.getElementById("authName").value.trim();
    if (!name) {
      msg.textContent = "Kteb smiytek";
      return;
    }
    if (users.find((u) => u.tel === tel)) {
      msg.textContent = "Had numra deja kayn, dir Login";
      return;
    }
    const user = {
      name,
      tel,
      pass,
      role: document.getElementById("authRole").value,
      quartier: document.getElementById("authQuartier").value,
    };
    users.push(user);
    localStorage.setItem("rm_users", JSON.stringify(users));
    localStorage.setItem("rm_current", JSON.stringify(user));
    msg.textContent = "Mabrouk " + name + " ! Compte t-sawb";
  } else {
    const user = users.find((u) => u.tel === tel && u.pass === pass);
    if (!user) {
      msg.textContent = "Numra wla mot de passe ghalat";
      return;
    }
    localStorage.setItem("rm_current", JSON.stringify(user));
  }
  showUser();
  setTimeout(() => authModal.classList.remove("open"), 500);
  renderTrips();
};
function showUser() {
  const cur = getCurrent();
  if (cur) {
    document.getElementById("authBtn").style.display = "none";
    document.getElementById("userBox").style.display = "flex";
    document.getElementById("userName").textContent =
      "Salam, " +
      cur.name.split(" ")[0] +
      " • " +
      cur.quartier +
      " • " +
      cur.role;
    document.getElementById("helloMsg").textContent =
      "Salam " +
      cur.name +
      " ! Nti f " +
      cur.quartier +
      ", la9rab conducteurs kay-banou lik l-ouwel.";
  }
}
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("rm_current");
  location.reload();
};
showUser();

// 5. PROPOSER UN TRAJET
function needLogin() {
  if (!getCurrent()) {
    openAuth("signup");
    document.getElementById("authMsg").textContent =
      "Dkhol wla dir compte 3ad kemmel";
    return false;
  }
  return true;
}
document.getElementById("btnProposer").onclick = () => {
  if (needLogin()) tripModal.classList.add("open");
};
document.getElementById("closeTrip").onclick = () =>
  tripModal.classList.remove("open");
tripModal.onclick = (e) => {
  if (e.target === tripModal) tripModal.classList.remove("open");
};
document.getElementById("tripForm").onsubmit = (e) => {
  e.preventDefault();
  const cur = getCurrent();
  const trips = getTrips();
  trips.unshift({
    id: Date.now(),
    name: cur.name,
    tel: cur.tel,
    from: document.getElementById("tripFrom").value,
    to: document.getElementById("tripTo").value,
    heure: document.getElementById("tripHeure").value,
    vehicule: document.getElementById("tripVehicule").value,
    places: +document.getElementById("tripPlaces").value,
    prix: +document.getElementById("tripPrix").value,
    rating: 5,
    votes: 1,
  });
  localStorage.setItem("rm_trips", JSON.stringify(trips));
  document.getElementById("tripMsg").textContent =
    "Trajet t-publia ! S7abek ghadi y-choufouk daba.";
  renderTrips();
  setTimeout(() => {
    tripModal.classList.remove("open");
    document.getElementById("trajets").scrollIntoView({ behavior: "smooth" });
  }, 600);
};
document.getElementById("btnTrouver").onclick = () => {
  if (needLogin())
    document.getElementById("trajets").scrollIntoView({ behavior: "smooth" });
};

// 6. T9YIM B NJOUM
function openRate(id, name) {
  if (!needLogin()) return;
  rateId = id;
  rateVal = 0;
  document.getElementById("rateName").textContent = "Kifach kan " + name + " ?";
  document
    .querySelectorAll("#stars button")
    .forEach((b) => b.classList.remove("on"));
  document.getElementById("rateMsg").textContent = "";
  rateModal.classList.add("open");
}
document.querySelectorAll("#stars button").forEach((b) => {
  b.onclick = () => {
    rateVal = +b.dataset.star;
    document
      .querySelectorAll("#stars button")
      .forEach((x) => x.classList.toggle("on", +x.dataset.star <= rateVal));
  };
});
document.getElementById("closeRate").onclick = () =>
  rateModal.classList.remove("open");
rateModal.onclick = (e) => {
  if (e.target === rateModal) rateModal.classList.remove("open");
};
document.getElementById("saveRate").onclick = () => {
  if (!rateVal) {
    document.getElementById("rateMsg").textContent =
      "Khtar ch7al men nejma, 1 7etta 5";
    return;
  }
  const trips = getTrips();
  const t = trips.find((x) => x.id === rateId);
  if (t) {
    t.rating =
      Math.round(((t.rating * t.votes + rateVal) / (t.votes + 1)) * 10) / 10;
    t.votes++;
    localStorage.setItem("rm_trips", JSON.stringify(trips));
  }
  document.getElementById("rateMsg").textContent =
    "Choukran ! T9yim dyalek t-7fed: " + rateVal + " ⭐";
  renderTrips();
  setTimeout(() => rateModal.classList.remove("open"), 600);
};

// 7. CONTACT
document.getElementById("cf").onsubmit = (e) => {
  e.preventDefault();
  document.getElementById("cs").textContent =
    "Choukran ! Message wsel, ghadi n-jawbouk dghya.";
  e.target.reset();
};
