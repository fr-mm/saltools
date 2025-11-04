export default function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds());

  return `${day}-${month}-${year}-${hours}h-${minutes}m-${seconds}s-${milliseconds}ms`;
}
