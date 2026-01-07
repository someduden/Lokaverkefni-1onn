import "./style.css";

type Error = {
  message: string;
  onRetry: () => void;
};

export default function ErrorState({ message, onRetry }: Error) {
  return (
    <div className="error-state">
      <p>{message}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}
