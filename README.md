# Lettre de Change

Landing page statique présentant un service de rédaction, de suivi et de consultation des lettres de change.

## Aperçu
- Hero avec appels à l'action pour créer une lettre ou planifier une démonstration.
- Sections détaillant les fonctionnalités, le parcours en trois étapes, les abonnements, la sécurité et la FAQ.
- Palette sombre avec accents verts et bleus pour souligner la confiance et la modernité.

## Utilisation
Ouvrez `index.html` dans votre navigateur ou servez le répertoire via un serveur HTTP local, par exemple :

```bash
python -m http.server 8000
```

Puis consultez http://localhost:8000/

## Configuration Supabase (optionnelle)
Si vous devez consommer une API Supabase côté client, ne placez jamais directement vos clés publiques dans le dépôt. Copiez `config.example.js` en `config.js`, renseignez vos valeurs Supabase et gardez ce fichier hors du contrôle de version (il est déjà ignoré via `.gitignore`).
