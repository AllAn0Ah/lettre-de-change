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

  if (user) {
    if (googleBtn) googleBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userName) {
      userName.textContent =
        user.user_metadata.full_name || user.email;
    }
  } else {
    if (googleBtn) googleBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userName) userName.textContent = "";
  }
}
