interface StatusBadgeProps {
  returnDate: string | null;
  dueDate: string;
}

function StatusBadge({ returnDate, dueDate }: StatusBadgeProps) {
  if (returnDate) {
    return (
      <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
        Returned
      </span>
    );
  }
  if (new Date(dueDate) < new Date()) {
    return (
      <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
        Overdue
      </span>
    );
  }
  return (
    <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
      On loan
    </span>
  );
}

export default StatusBadge;
