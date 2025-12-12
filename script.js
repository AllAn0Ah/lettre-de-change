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
  // Supabase init
  // ===============================
  const SUPABASE_URL = "https://cumlqklyrzqubawwnnf.supabase.co";
  const SUPABASE_ANON_KEY = "COLLE_ICI_TA_PUBLISHABLE_KEY";

  window.supabaseClient = window.supabase.createClient(
    "https://cumlqklryzqubwawnnnf.supabase.co",
    "sb_publishable_93FBSHTNiuYW9HpWwPHadQ_dpQ5Qilu"
  );

  // ===============================
  // Boutons
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
            prompt: "select_account" // 🔑 FORCE le choix du compte
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
  // Session existante au chargement
  // ===============================
  const {
    data: { session }
  } = await window.supabaseClient.auth.getSession();

  updateUI(session?.user);

  // ===============================
  // Écoute changements auth
  // ===============================
  window.supabaseClient.auth.onAuthStateChange((_event, session) => {
    updateUI(session?.user);
  });
});

// ===============================
// UI helpers
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

    // 🔐 Affiche l’espace lettres
    if (appSection) appSection.style.display = "block";

    // Charge les lettres de l’utilisateur
    loadLetters(user.id);

  } else {
    if (googleBtn) googleBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userName) userName.textContent = "";

    if (appSection) appSection.style.display = "none";
  }
}

//chargement des lettres de change( lié à l'utilisateur)

async function loadLetters(userId) {
  const container = document.getElementById("letters-list");
  if (!container) return;

  container.innerHTML = "";

  const { data, error } = await window.supabaseClient
    .from("letters")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = "<p>Erreur de chargement des lettres.</p>";
    console.error(error);
    return;
  }

  if (!data.length) {
    container.innerHTML = "<p>Aucune lettre de change pour le moment.</p>";
    return;
  }

  data.forEach(letter => {
    const card = document.createElement("div");
    card.className = "feature";

    card.innerHTML = `
      <h3>${letter.tire || "Tiré non défini"}</h3>
      <p><strong>Montant :</strong> ${letter.montant} €</p>
      <p><strong>Échéance :</strong> ${letter.date_echeance}</p>
      <p><strong>Statut :</strong> ${letter.statut}</p>
      <div class="card-actions">
        <button class="ghost">✏️ Éditer</button>
        <button class="ghost">👁 Suivi</button>
      </div>
    `;

    container.appendChild(card);
  });
}


