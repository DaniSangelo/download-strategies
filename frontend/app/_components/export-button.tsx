'use client';

import { Loader2Icon } from "lucide-react";
import { DownloadIcon } from "lucide-react";

const ExportButton = ({ label, active, disabled, progress, onClick }: {
  label: string;
  active: boolean;
  disabled: boolean;
  progress?: number | null;
  onClick: () =>void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center min-w-42 gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
    >
      {active ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
      {label}
      {active && progress != null && ` (${progress}%)`}
    </button>
  );
}
 
export default ExportButton

