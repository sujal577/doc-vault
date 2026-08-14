# How to run Doc Vault (local)

## One command

1. Start **Docker Desktop**
2. In PowerShell:

```powershell
cd C:\Users\sujal\Projects\doc-vault
pnpm start:app
```

3. Wait ~10 seconds → open http://localhost:3000  
4. Login: `demo@docvault.local` / `demo1234`

## What should work

| Feature | How |
|---------|-----|
| Dashboard | Missing docs, expiring, counts |
| Persons | Add family members |
| Documents | Create with type, number, expiry, tags, favorite, travel pack |
| Upload | On document page — PNG/JPG (OCR) or PDF (encrypted store) |
| Download | Button on each version |
| Search | Title / type / person / tags / OCR text |
| Travel pack | Documents flagged for travel |
| Compare | Pick 2 documents side by side |

## If something fails

| Symptom | Fix |
|---------|-----|
| Cannot reach API | API window must show `API listening on http://localhost:4000` |
| Invalid credentials | `pnpm db:seed` |
| Database unreachable | Docker Desktop + `pnpm docker:up` |
| Upload error | Use API direct URL (already fixed); restart API + web |

Do **not** run `docker compose build` for daily use.
