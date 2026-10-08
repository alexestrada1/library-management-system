interface AlertProps {
  message: string;
  type: "error" | "success";
}

// Shows a colored message box. Shows nothing if the message is empty.
function Alert({ message, type }: AlertProps) {
  if (!message) return null;

  const colors =
    type === "error"
      ? "border-red-300 bg-red-100 text-red-800"
      : "border-green-300 bg-green-100 text-green-800";

  return (
    <p role="alert" className={"mb-4 rounded border p-3 " + colors}>
      {message}
    </p>
  );
}

export default Alert;
