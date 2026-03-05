# Zenix Stream

Clone statique local de `https://purstream.co` (front build).

## Lancer en local

```powershell
cd "C:\Users\user\Desktop\Bot osint\site\Zenix Stream"
npm start
```

Puis ouvre:

`http://localhost:4173`

## Notes

- Les routes SPA sont gerees (fallback `index.html`).
- Les appels `/api` et `/socket` sont proxifies vers `https://purstream.co`.
- Pour retelecharger les fichiers distants:

```powershell
powershell -ExecutionPolicy Bypass -File ".\fetch.ps1"
```

## Deploiement Render

Le blueprint Render est dans [render.yaml](C:\Users\user\Desktop\Bot osint\site\Zenix Stream\render.yaml) avec le service `zenix`.
