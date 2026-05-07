export default function ProgressBar({ value }: { value: Number }) {
  const style = {
    width: `${value}%`,
  };

  return (
    <div className="progress-bar">
      <div className="progress" style={style}></div>
    </div>
  );
}
