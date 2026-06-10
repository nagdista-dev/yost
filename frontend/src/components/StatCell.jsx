export default function StatCell({ icon, value, label, highlight, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <span className={`text-xs font-bold ${highlight ? 'text-yt-accent' : 'text-yt-text'}`}>
        {value}
      </span>
      <span className="text-[10px] text-yt-text-muted flex items-center gap-0.5 whitespace-nowrap">
        {icon}
      </span>
    </div>
  );
}
