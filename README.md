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

## Webhook Discord (stats live)

Le webhook Discord reste **strictement cote serveur**.

Variables d'environnement:

- `DISCORD_WEBHOOK_URL` : URL webhook Discord.
- `DISCORD_PUSH_INTERVAL_MS` : frequence d'envoi des stats (defaut `60000`).

Stats envoyees:

- connectes actuellement (fenetre active courte),
- visiteurs uniques sur 24h,
- heartbeats sur 24h,
- uptime serveur et total visiteurs depuis lancement.
