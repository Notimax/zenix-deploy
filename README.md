# Zenix Stream

Frontend Zenix de streaming gratuit avec lecture directe.

## Lancer en local

```powershell
cd "C:\Users\user\Desktop\Bot osint\site\Zenix Stream"
npm start
```

Ouvre ensuite:

`http://localhost:10000`

## Notes

- Interface 100% gratuite (aucun paywall).
- Lecture directe avec un lecteur video HTML5.
- Sauvegarde locale de reprise de lecture (`localStorage`).
- Service worker nettoye pour eviter les caches herites.

## Deploiement Render

`render.yaml` deploie le service web `zenix` sur le plan free.

### Update en ligne (automatique a chaque push)

Le service Render est configure avec `autoDeploy: true`.

Pour publier les changements locaux sur les remotes de deploiement:

```powershell
cd "C:\Users\user\Desktop\Bot osint\site\Zenix Stream"
powershell -ExecutionPolicy Bypass -File .\publish-online.ps1 -Message "feat: update zenix"
```

Notes:

- Le script commit les changements suivis (`git add -u`) puis push sur `origin` et `deploypublic`.
- Si `RENDER_DEPLOY_HOOK_URL` est defini en variable d'environnement, le script appelle aussi le hook Render.

### Domaine custom (zenix.best)

- Le front declare `https://zenix.best/` en canonical (`index.html`), et `robots.txt` expose `sitemap.xml`.
- La redirection vers le domaine canonique est supportee cote serveur via:
  - `CANONICAL_HOST` (ex: `zenix.best`)
  - `CANONICAL_SCHEME` (defaut: `https`)
- Pour eviter toute coupure, `CANONICAL_HOST` est laisse non renseigne par defaut dans `render.yaml`.
  Active-le dans Render seulement apres validation DNS/certificat.

## Suggestions utilisateurs (Info)

Un formulaire est disponible dans la section `Info` du front.

- Endpoint: `POST /api/suggestions`
- Destination email par defaut: `seekosint@gmail.com`
- Transport par defaut: relay HTTP FormSubmit (`https://formsubmit.co/ajax`)

Variables d'environnement optionnelles:

- `SUGGESTIONS_EMAIL_TO` (defaut: `seekosint@gmail.com`)
- `SUGGESTIONS_RELAY_BASE` (defaut: `https://formsubmit.co/ajax`)
- `SUGGESTIONS_RATE_LIMIT_MS` (defaut: `45000`)

Note:

- Au premier usage FormSubmit, un email d'activation peut etre necessaire.
- Si tu ne recois rien, verifie aussi le dossier spam/indesirables.

## Source Zenix (legale)

Tu peux forcer des sources que tu controles via le fichier:

- `zenix-owned-sources.json`

Format:

- `movies.<mediaId>.sources[]` pour un film.
- `tv.<mediaId>.<season>.<episode>.sources[]` pour un episode.
- `tv.<mediaId>.<season>.default.sources[]` fallback de saison.
- `tv.<mediaId>.default.sources[]` fallback global serie.

Champs supportes par source:

- `stream_url` (obligatoire, URL publique HTTPS),
- `format` (`hls`, `mp4`, `embed`, etc.),
- `quality` (`1080p`, `720p`, etc.),
- `language` (`VF`, `VOSTFR`, `MULTI`, `VO`),
- `source_name` (ex: `Zenix CDN`),
- `priority` (plus haut = plus prioritaire).

Le lecteur ajoute automatiquement ces sources en priorite avant les sources externes.

Variable optionnelle:

- `ZENIX_OWNED_SOURCES_FILE` pour changer le chemin du JSON.

Mode auto (active par defaut):

- Le lecteur cree aussi automatiquement une source `Zenix Source` pour les flux libres detectes (film/serie/anime), sans configuration manuelle titre par titre.
- Le JSON `zenix-owned-sources.json` reste prioritaire si tu veux forcer des sources precises.

## Webhook Discord (stats live)

Le webhook Discord reste **strictement cote serveur**.

Variables d'environnement:

- `DISCORD_WEBHOOK_URL` : URL webhook Discord.
- `DISCORD_WEBHOOK` ou `WEBHOOK_DISCORD_URL` : aliases acceptes si `DISCORD_WEBHOOK_URL` n'est pas defini.
- `DISCORD_PUSH_INTERVAL_MS` : frequence d'envoi des stats (defaut `60000`).

Diagnostic:

- `GET /api/analytics/webhook-status` renvoie l'etat webhook (configure, dernier envoi, dernier statut HTTP, prochaine tentative).

Stats envoyees:

- connectes actuellement (fenetre active courte),
- visiteurs uniques sur 24h,
- heartbeats sur 24h,
- uptime serveur et total visiteurs depuis lancement.
