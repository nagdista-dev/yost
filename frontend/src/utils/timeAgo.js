import { t } from '../i18n';

export default function timeAgo(iso, lang = 'en') {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return t(lang, 'timeJustNow');
  const min = Math.floor(sec / 60);
  if (min < 60) return t(lang, 'timeMinute', min);
  const hr = Math.floor(min / 60);
  if (hr < 24) return t(lang, 'timeHour', hr);
  const day = Math.floor(hr / 24);
  if (day < 7) return t(lang, 'timeDay', day);
  const week = Math.floor(day / 7);
  if (week < 5) return t(lang, 'timeWeek', week);
  const month = Math.floor(day / 30);
  if (month < 12) return t(lang, 'timeMonth', month);
  const year = Math.floor(day / 365);
  return t(lang, 'timeYear', year);
}

export function formatDuration(seconds) {
  if (!seconds) return '';
  const s = parseInt(seconds, 10);
  if (!s || isNaN(s)) return '';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function engagementRate(likes, views) {
  const l = parseInt(likes, 10);
  const v = parseInt(views, 10);
  if (!v || !l) return null;
  return ((l / v) * 100).toFixed(1);
}

export function dislikePercentage(likes, dislikes) {
  const l = parseInt(likes, 10);
  const d = parseInt(dislikes, 10);
  if (!l && !d) return null;
  const total = l + d;
  if (!total) return null;
  return ((d / total) * 100).toFixed(1);
}
