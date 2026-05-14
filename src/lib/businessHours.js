// Живой статус открыто/закрыто по расписанию из content.json.
// Используется в Hero.astro для индикатора с пульсирующей точкой.

const DOW_KEYS = ['sun','mon','tue','wed','thu','fri','sat'];

export function computeStatus(hours) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
  const dow = DOW_KEYS[now.getDay()];
  const todayCfg = hours[dow];

  const toMin = (str) => { const [h,m] = str.split(':').map(Number); return h*60+m; };
  const nowMin = now.getHours()*60 + now.getMinutes();

  if (todayCfg && !todayCfg.closed) {
    const open  = toMin(todayCfg.open);
    const close = toMin(todayCfg.close);
    if (nowMin >= open && nowMin < close) {
      const h = String(Math.floor((close - nowMin - 1) / 60 + now.getHours())).padStart(2,'0');
      return { open: true, until: todayCfg.close };
    }
  }

  // Ищем следующий рабочий день
  for (let i = 1; i <= 7; i++) {
    const idx = (now.getDay() + i) % 7;
    const key = DOW_KEYS[idx];
    const cfg = hours[key];
    if (cfg && !cfg.closed) {
      return { open: false, opensAt: cfg.open, opensDayKey: key, opensInDays: i };
    }
  }
  return { open: false, opensAt: null };
}
