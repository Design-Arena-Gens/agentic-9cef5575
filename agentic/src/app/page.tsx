"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import type { StepLog } from "@/lib/types";

type ApiResponse =
  | {
      success: true;
      logs: StepLog[];
      downloadUrl?: string;
      designId?: string;
      exportId?: string;
      assetId?: string;
    }
  | {
      success: false;
      error: string;
    };

const initialFormState = {
  reelUrl: "",
  designTitle: "",
  instagramAccessToken: "",
  canvaAccessToken: "",
  canvaTeamId: "",
  canvaTemplateId: "",
  canvaPageId: "",
  exportFormat: "mp4",
};

const readableStep = (step: StepLog["step"]) => {
  switch (step) {
    case "instagram:resolve":
      return "Resolve Instagram metadata";
    case "instagram:download":
      return "Download reel";
    case "canva:upload":
      return "Upload to Canva";
    case "canva:design":
      return "Create Canva design";
    case "canva:place-video":
      return "Place video element";
    case "canva:export":
      return "Export design";
    case "complete":
      return "Complete";
    default:
      return step;
  }
};

export default function Home() {
  const [form, setForm] = useState(initialFormState);
  const [logs, setLogs] = useState<StepLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    downloadUrl?: string;
    designId?: string;
    exportId?: string;
    assetId?: string;
  } | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setLogs([]);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reelUrl: form.reelUrl,
          designTitle: form.designTitle || undefined,
          instagramAccessToken: form.instagramAccessToken || undefined,
          canvaAccessToken: form.canvaAccessToken || undefined,
          canvaTeamId: form.canvaTeamId || undefined,
          canvaTemplateId: form.canvaTemplateId || undefined,
          canvaPageId: form.canvaPageId || undefined,
          exportFormat: form.exportFormat || undefined,
        }),
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      setLogs(data.logs);
      setResult({
        downloadUrl: data.downloadUrl,
        designId: data.designId,
        exportId: data.exportId,
        assetId: data.assetId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-24">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Instagram → Canva Automation Agent
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Provide a Reel URL and the agent will download the video, add it to
            your Canva design, and export the finished project.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl shadow-blue-900/20 backdrop-blur"
        >
          <div className="grid gap-2">
            <label htmlFor="reelUrl" className="text-sm font-medium text-slate-200">
              Instagram Reel URL
            </label>
            <input
              id="reelUrl"
              name="reelUrl"
              type="url"
              required
              value={form.reelUrl}
              onChange={handleChange}
              placeholder="https://www.instagram.com/reel/XXXXXXXX/"
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="designTitle"
              className="text-sm font-medium text-slate-200"
            >
              Canva Design Title (optional)
            </label>
            <input
              id="designTitle"
              name="designTitle"
              value={form.designTitle}
              onChange={handleChange}
              placeholder="My Reel Campaign"
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
          >
            {showAdvanced ? "Hide advanced settings" : "Show advanced settings"}
          </button>

          {showAdvanced && (
            <div className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
              <p className="text-sm text-slate-400">
                Override environment variables for tokens, team, template, and export
                format. Leave empty to fall back to server defaults.
              </p>

              <div className="grid gap-2">
                <label
                  htmlFor="instagramAccessToken"
                  className="text-sm font-medium text-slate-200"
                >
                  Instagram Access Token
                </label>
                <input
                  id="instagramAccessToken"
                  name="instagramAccessToken"
                  value={form.instagramAccessToken}
                  onChange={handleChange}
                  placeholder="IGQVJ..."
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="canvaAccessToken"
                  className="text-sm font-medium text-slate-200"
                >
                  Canva Access Token
                </label>
                <input
                  id="canvaAccessToken"
                  name="canvaAccessToken"
                  value={form.canvaAccessToken}
                  onChange={handleChange}
                  placeholder="canva_live_..."
                  className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="canvaTeamId"
                    className="text-sm font-medium text-slate-200"
                  >
                    Canva Team ID
                  </label>
                  <input
                    id="canvaTeamId"
                    name="canvaTeamId"
                    value={form.canvaTeamId}
                    onChange={handleChange}
                    placeholder="team_123..."
                    className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="canvaTemplateId"
                    className="text-sm font-medium text-slate-200"
                  >
                    Canva Template ID
                  </label>
                  <input
                    id="canvaTemplateId"
                    name="canvaTemplateId"
                    value={form.canvaTemplateId}
                    onChange={handleChange}
                    placeholder="template_abc..."
                    className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="canvaPageId"
                    className="text-sm font-medium text-slate-200"
                  >
                    Canva Page ID
                  </label>
                  <input
                    id="canvaPageId"
                    name="canvaPageId"
                    value={form.canvaPageId}
                    onChange={handleChange}
                    placeholder="page_1"
                    className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="exportFormat"
                    className="text-sm font-medium text-slate-200"
                  >
                    Export Format
                  </label>
                  <select
                    id="exportFormat"
                    name="exportFormat"
                    value={form.exportFormat}
                    onChange={handleChange}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="mp4">MP4</option>
                    <option value="gif">GIF</option>
                    <option value="mov">MOV</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Running agent…" : "Run agent"}
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        )}

        {logs.length > 0 && (
          <section className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
            <h2 className="text-xl font-semibold text-slate-100">Execution log</h2>
            <ol className="space-y-3">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-200">
                      {readableStep(log.step)}
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase ${
                        log.status === "success"
                          ? "text-emerald-400"
                          : log.status === "error"
                            ? "text-red-400"
                            : "text-slate-400"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{log.message}</p>
                  {log.meta && (
                    <pre className="mt-2 overflow-auto rounded-lg bg-slate-950/60 p-3 text-xs text-slate-400">
                      {JSON.stringify(log.meta, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {result && (
          <section className="grid gap-4 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-8">
            <h2 className="text-xl font-semibold text-emerald-100">
              Export ready
            </h2>
            <div className="grid gap-2 text-sm text-emerald-100">
              {result.downloadUrl && (
                <a
                  href={result.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-emerald-950 transition hover:bg-emerald-400"
                >
                  Download exported video
                </a>
              )}
              {result.designId && <p>Design ID: {result.designId}</p>}
              {result.exportId && <p>Export ID: {result.exportId}</p>}
              {result.assetId && <p>Asset ID: {result.assetId}</p>}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
