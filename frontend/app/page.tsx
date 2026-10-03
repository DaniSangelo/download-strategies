"use client";

import { useState } from "react";
import ExportButton from "./_components/export-button";
import { triggerDownload } from "./lib/download";

const API = process.env.NEXT_PUBLIC_API_URL!;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Strategy = "sync" | "s3" | "sse";

export default function Home() {
  const [loading, setLoading] = useState<Strategy | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(strategy: Strategy, fn: () => Promise<void>) {
    setLoading(strategy);
    setProgress(null);
    setError(null);

    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(null);
    }
  }

  const downloadSync = () =>
    run("sync", async () => {
      const res = await fetch(`${API}/exports/sync`);
      if (!res.ok) throw new Error("Error on sync download");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

  const downloadS3 = () =>
    run("s3", async () => {
      const start = await fetch(`${API}/exports/s3`, { method: "POST" });
      if (!start.ok) throw new Error("Error on export");
      const { jobId } = await start.json();

      while (true) {
        await sleep(1000);
        const res = await fetch(`${API}/exports/s3/${jobId}`);
        const status = await res.json();
        setProgress(status.progress);
        if (status.status === "error") throw new Error(status.error);
        if (status.status === "done") {
          triggerDownload(status.downloadUrl);
          return;
        }
      }
    });

  const downloadSse = () => {
    run("sse", async () => {
      const start = await fetch(`${API}/exports/sse`, { method: "POST" });
      if (!start.ok) throw new Error("Error on export");
      const { jobId } = await start.json();
      await new Promise<void>((resolve, reject) => {
        const es = new EventSource(`${API}/exports/sse/${jobId}/events`);

        es.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setProgress(data.progress);

          if (data.status === "done") {
            es.close();
            triggerDownload(`${API}/exports/sse/${jobId}/download`);
            resolve();
          }
          if (data.status === "error") {
            es.close();
            reject(new Error(data.error));
          }
        };

        es.onerror = () => {
          es.close();
          reject(new Error("SSE conection lost"));
        };
      });
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex py-32 px-16 max-w-3xl flex-col items-center justify-between bg-white dark:bg-black sm:items-start space-y-10">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-black dark:text-white sm:text-4xl">
          Exportar Excel
        </h1>
        <div className="flex w-full flex-col items-center gap-4">
          <ExportButton
            label="Síncrono"
            active={loading === "sync"}
            disabled={!!loading}
            onClick={downloadSync}
          />
          <ExportButton
            label="Assíncrono (S3)"
            active={loading === "s3"}
            progress={loading === "s3" ? progress : null}
            disabled={!!loading}
            onClick={downloadS3}
          />
          <ExportButton
            label="Assíncrono (SSE)"
            active={loading === "sse"}
            progress={loading === "sse" ? progress : null}
            disabled={!!loading}
            onClick={downloadSse}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </main>
    </div>
  );
}
