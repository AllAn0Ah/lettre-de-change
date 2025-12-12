// ===============================
// Menu mobile
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
      mobileMenu.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // ===============================
  // Supabase init
  // ===============================
  const SUPABASE_URL = "https://xxxx.supabase.co";
  const SUPABASE_ANON_KEY = "PUBLIC_ANON_KEY";

  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
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
          redirectTo: window.location.origin
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
  // Écoute des changements d'auth
  // ===============================
  window.supabaseClient.auth.onAuthStateChange((event, session) => {
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
    console.log("Utilisateur connecté :", user);

    if (googleBtn) googleBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userName) userName.textContent = user.user_metadata.full_name || user.email;
  } else {
    if (googleBtn) googleBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userName) userName.textContent = "";
  }
}
