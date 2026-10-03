export function triggerDownload(url: string, fileName?: string) {
  const a = document.createElement('a');
  a.href = url;
  if (fileName) a.download = fileName
  document.body.appendChild(a)
  a.click();
  a.remove();
}