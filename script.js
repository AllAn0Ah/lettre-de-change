// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

  // ===============================
  // Menu mobile
  // ===============================
  const toggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.hidden = expanded;
    });
  }

  // ===============================
  // Supabase init (CORRIGÉ)
  // ===============================
  const SUPABASE_URL = "https://cumlqklryzqubwawnnnf.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_93FBSHTNiuYW9HpWwPHadQ_dpQ5Qilu";

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  // ===============================
  // Boutons auth
  // ===============================
  const googleBtn = document.getElementById("google-login");
  const logoutBtn = document.getElementById("logout");

  if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
      const { error } = await window.supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: "select_account"
          }
        }
      });

      if (error) {
        console.error(error);
        alert("Erreur lors de la connexion Google");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await window.supabaseClient.auth.signOut();
    });
  }

  // ===============================
  // Session au chargement
  // ===============================
  const {
    data: { session }
  } = await window.supabaseClient.auth.getSession();

  updateUI(session?.user);

  // ===============================
  // Écoute auth (login / logout)
  // ===============================
  window.supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateUI(session?.user);
  });
});


// ===============================
// UI HELPERS
// ===============================
function updateUI(user) {
  const googleBtn = document.getElementById("google-login");
  const logoutBtn = document.getElementById("logout");
  const userName = document.getElementById("user-name");
  const appSection = document.getElementById("app");

  if (user) {
    if (googleBtn) googleBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userName) {
      userName.textContent =
        user.user_metadata.full_name || user.email;
    }

    if (appSection) appSection.style.display = "block";

    // 🔄 Charger les lettres de l'utilisateur
    loadLetters(user.id);

  } else {
    if (googleBtn) googleBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userName) userName.textContent = "";

    if (appSection) appSection.style.display = "none";
  }
}


// ===============================
// CHARGEMENT DES LETTRES
// ===============================
async function loadLetters(userId) {
  const container = document.getElementById("letters-list");
  if (!container) return;

  container.innerHTML = "<p>Chargement...</p>";

  const { data, error } = await window.supabaseClient
    .from("letters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    container.innerHTML = "<p>Erreur de chargement des lettres.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Aucune lettre de change pour le moment.</p>";
    return;
  }

  container.innerHTML = "";

  data.forEach(letter => {
    const card = document.createElement("div");
    card.className = "feature";

    card.innerHTML = `
      <h3>${letter.tire || "Tiré non défini"}</h3>
      <p><strong>Montant :</strong> ${letter.montant} €</p>
      <p><strong>Échéance :</strong> ${letter.date_echeance}</p>
      <p><strong>Statut :</strong> ${letter.statut}</p>
      <div class="card-actions">
        <button class="ghost" data-id="${letter.id}">✏️ Éditer</button>
        <button class="ghost" data-id="${letter.id}">👁 Suivi</button>
      </div>
    `;

    container.appendChild(card);
  });
}


// ===============================
// CRÉATION D'UNE LETTRE
// ===============================
const form = document.getElementById("letter-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const {
      data: { user }
    } = await window.supabaseClient.auth.getUser();

    if (!user) {
      alert("Vous devez être connecté");
      return;
    }

    const newLetter = {
      user_id: user.id,
      tireur: document.getElementById("tireur").value,
      tire: document.getElementById("tire").value,
      montant: parseFloat(document.getElementById("montant").value),
      date_echeance: document.getElementById("date_echeance").value,
      commentaire: document.getElementById("commentaire").value,
      statut: "brouillon"
    };

    const { error } = await window.supabaseClient
      .from("letters")
      .insert(newLetter);

    if (error) {
      console.error(error);
      alert("Erreur lors de la création");
      return;
    }

    alert("Lettre créée avec succès ✅");
    form.reset();

    // 🔄 Recharge les lettres
    loadLetters(user.id);
  });
}
