import { DownloadIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex py-32 px-16 max-w-3xl flex-col items-center justify-between bg-white dark:bg-black sm:items-start space-y-10">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter text-black dark:text-white sm:text-4xl">
          Exportar XML
        </h1>
        <div className="flex w-full flex-col items-center gap-4">
          <button className="flex items-center min-w-42 gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <DownloadIcon className="h-4 w-4" />
            Síncrono
          </button>
          <button className="flex items-center gap-2 min-w-42 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <DownloadIcon className="h-4 w-4" />
            Assíncrono (S3)
          </button>
          <button className="flex items-center gap-2 min-w-42 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            <DownloadIcon className="h-4 w-4" />
            Assíncrono (SSE)
          </button>
        </div>
      </main>
    </div>
  );
}
