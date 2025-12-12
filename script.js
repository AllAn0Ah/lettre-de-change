document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggle || !mobileMenu) return;

  const updateState = () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.hidden = expanded;
    mobileMenu.setAttribute('aria-expanded', String(!expanded));
  };

  toggle.addEventListener('click', updateState);
});

// 🔐 Supabase config
const SUPABASE_URL = "https://xxxx.supabase.co";
const SUPABASE_ANON_KEY = "PUBLIC_ANON_KEY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Bouton Google
const googleBtn = document.getElementById("google-login");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });

    if (error) {
      console.error(error);
      alert("Erreur connexion Google");
    }
  });
}
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    console.log("Utilisateur connecté :", session.user);

    alert(`Bienvenue ${session.user.user_metadata.full_name}`);
  }
});
