export default function LoadingCard({ label = 'Loading focused practice bank…' }) {
  return <div className="glass loading-card"><span className="loader-dot"></span>{label}</div>;
}
