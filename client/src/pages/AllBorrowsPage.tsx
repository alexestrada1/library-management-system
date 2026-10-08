import { useState, useEffect } from "react";
import api, { getErrorMessage } from "../api";
import type { BorrowRecord } from "../types";
import Alert from "../components/Alert";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../utils";

// Admin view: every borrow record from every user
function AllBorrowsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecords() {
      try {
        const response = await api.get("/borrow");
        setRecords(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">All Borrow Records</h1>

      <Alert message={error} type="error" />

      {loading && <p>Loading records...</p>}
      {!loading && records.length === 0 && !error && (
        <p>No borrow records yet.</p>
      )}

      {records.length > 0 && (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Book</th>
                <th className="hidden p-3 sm:table-cell">Borrowed</th>
                <th className="p-3">Due</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">
                      {record.user ? record.user.name : "(deleted user)"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.user ? record.user.email : ""}
                    </div>
                  </td>
                  <td className="p-3">
                    {record.book ? record.book.title : "(deleted book)"}
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
                    {record.returnDate && (
                      <div className="mt-1 text-xs text-gray-500">
                        on {formatDate(record.returnDate)}
                      </div>
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

export default AllBorrowsPage;
