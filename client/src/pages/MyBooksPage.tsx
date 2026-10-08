import { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";
import type { BorrowRecord } from "../types";
import Alert from "../components/Alert";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils";

function MyBooksPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState("");

  // Load this user's borrow records
  useEffect(() => {
    async function loadRecords() {
      try {
        const response = await api.get("/borrow/my");
        setRecords(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [reloadKey]);

  async function handleReturn(recordId: string) {
    setError("");
    setSuccess("");
    setBusyId(recordId);
    try {
      await api.put("/borrow/" + recordId + "/return");
      setSuccess("Book returned. Thank you!");
      setReloadKey(reloadKey + 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">My Books</h1>

      <Alert message={error} type="error" />
      <Alert message={success} type="success" />

      {loading && <p>Loading your books...</p>}
      {!loading && records.length === 0 && !error && (
        <p>You haven't borrowed any books yet.</p>
      )}

      {records.length > 0 && (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Book</th>
                <th className="hidden p-3 sm:table-cell">Borrowed</th>
                <th className="p-3">Due</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">
                      {record.book ? record.book.title : "(deleted book)"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.book ? record.book.author : ""}
                    </div>
                  </td>
                  <td className="hidden p-3 sm:table-cell">
                    {formatDate(record.borrowDate)}
                  </td>
                  <td className="p-3">{formatDate(record.dueDate)}</td>
                  <td className="p-3">
                    <StatusBadge
                      returnDate={record.returnDate}
                      dueDate={record.dueDate}
                    />
                  </td>
                  <td className="p-3">
                    {/* Only books not yet returned get a Return button */}
                    {!record.returnDate && (
                      <button
                        onClick={() => handleReturn(record._id)}
                        disabled={busyId === record._id}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:bg-gray-400"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBooksPage;
