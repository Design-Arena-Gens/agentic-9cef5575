## Instagram → Canva Automation Agent

This project delivers an end-to-end web automation stack that:

1. Accepts an Instagram Reel URL.
2. Downloads the underlying video (Graph API with a resilient fallback).
3. Uploads the asset to Canva via the Connect API.
4. Creates or rehydrates a Canva design, injects the reel, and positions it on the canvas.
5. Triggers a Canva export and exposes the generated download URL.

The UI is tailored for Vercel deployment and surfaces live execution logs for every step of the pipeline so you can trace each automation run.

---

### Prerequisites

| Secret | Description |
| --- | --- |
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived Instagram Graph token with permissions to query the reel. May also be provided per-request from the UI. |
| `CANVA_ACCESS_TOKEN` | Canva Connect API token (Client Credentials). Can be overridden per-request. |
| `CANVA_TEAM_ID` | Target Canva team identifier. |
| `CANVA_TEMPLATE_ID` _(optional)_ | Template to clone before inserting the video. |
| `CANVA_PAGE_ID` _(optional)_ | Force a specific page when duplicating designs. |
| `DEFAULT_DESIGN_TITLE` _(optional)_ | Title fallback when none is provided from the UI. |
| `EXPORT_FORMAT` _(optional)_ | Canva export format (`mp4`, `gif`, `mov`, ...). |

Copy `.env.example` to `.env.local` and populate the variables that should be server defaults:

```bash
cp .env.example .env.local
```

Any field left blank can be supplied at runtime through the web form.

---

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and submit a reel URL. Execution logs will render beneath the form, ending with a downloadable Canva export link when the pipeline succeeds.

---

### Production build

```bash
npm run build
npm start
```

---

### Deployment

1. Ensure the required environment variables are set within your Vercel project:
   - `vercel env pull` (optional) to sync locally.
   - `vercel env add` for each secret shown above.
2. Deploy with the provided command:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-9cef5575
```

3. After deployment propagates, verify:

```bash
curl https://agentic-9cef5575.vercel.app
```

---

### Testing philosophy

This automation depends on third-party APIs, so unit tests focus on deterministic utilities (e.g. URL parsing). Integration tests require mocked Canva/Instagram endpoints or live credentials, which are not executed by default.
