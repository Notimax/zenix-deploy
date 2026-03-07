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
