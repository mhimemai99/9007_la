# Health Balance Explorer — CLC9007

Interactive classroom activity exploring the Four Dimensions of Health.  
Students complete a questionnaire, receive a health personality type + badges, play Balance Bingo, and submit anonymous aggregate data.

## Structure

```
├── public/
│   ├── index.html        ← Student app (scan QR to access)
│   └── dashboard.html    ← Instructor dashboard (projector)
├── api/
│   ├── submit.js         ← POST: anonymous data submission
│   ├── data.js           ← GET: aggregate data for dashboard
│   └── reset.js          ← POST: clear session between tutorials
├── package.json
└── vercel.json
```

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Health Balance Explorer"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import the GitHub repo
- Click **Deploy** (no build settings needed)

### 3. Add Blob Storage
- In your Vercel project dashboard → **Storage** tab
- Click **Create Database** → Select **Blob**
- Follow prompts to create a Blob store
- It will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables

### 4. (Optional) Set Reset Key
- Go to **Settings** → **Environment Variables**
- Add `RESET_KEY` with a custom password (default: `clc9007reset`)

### 5. Redeploy
After adding storage, redeploy for env vars to take effect.

## Usage

### Student URL
```
https://your-app.vercel.app/
```
Share this via QR code. Students complete questionnaire → see results → play bingo → submit data.

### Instructor Dashboard
```
https://your-app.vercel.app/dashboard.html
```
Open on projector. Auto-refreshes every 15 seconds. Shows:
- Class average radar chart
- Dimension score bars
- Score distribution heatmap
- Health type distribution
- Badge frequency cloud
- Individual anonymous profiles overlay

### Between Tutorial Sections
1. Open dashboard
2. Click **Reset Session**
3. Enter reset key (default: `clc9007reset`)
4. All submissions are cleared for next group

## Activity Flow (30 min)

| Phase | Time | Description |
|-------|------|-------------|
| Questionnaire | 5 min | Students scan QR, answer 14 items |
| Results | 2 min | View personal radar, type, badges |
| Bingo | 15 min | Walk around, complete 3 social tasks |
| Submit | 1 min | Tap submit for anonymous data |
| Debrief | 7 min | Instructor shows class dashboard |

## Anonymous by Design
- No name, student ID, or device ID collected
- Only 4 dimension averages + health type + top 3 badge names stored
- Cannot trace back to individual students
- Data cleared between sessions
