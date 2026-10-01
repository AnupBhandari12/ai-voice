export default function RecordingTimer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return (
    <p className="text-sm font-medium">
      Recording: {formattedTime} / 05:00
    </p>
  );
}