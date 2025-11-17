import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/transactions")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("backend not ready yet");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-neutral-600">loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-950/20 rounded-xl border border-red-900/30">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "borrowed") return !t.returned;
    if (filter === "returned") return t.returned;
    return true;
  });

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-neutral-900/50 rounded-lg border border-neutral-800 w-fit">
          {["all", "borrowed", "returned"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-md text-xs font-medium capitalize transition-all ${
                filter === tab
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-neutral-600">
            no {filter !== "all" ? filter : ""} transactions found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Book ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Borrow Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id || idx}
                      className={
                        idx < filteredTransactions.length - 1
                          ? "border-b border-neutral-800/50"
                          : ""
                      }
                    >
                      <td className="px-4 py-4 text-sm text-neutral-400">
                        {transaction.id || transaction.transactionId}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-neutral-400">
                        {transaction.bookId}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-neutral-400">
                        {transaction.userId}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-400">
                        {transaction.borrowDate
                          ? new Date(
                              transaction.borrowDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-400">
                        {transaction.returnDate
                          ? new Date(
                              transaction.returnDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-medium ${
                            transaction.returned
                              ? "bg-blue-950/30 text-blue-400 border border-blue-900/50"
                              : "bg-yellow-950/30 text-yellow-400 border border-yellow-900/50"
                          }`}
                        >
                          {transaction.returned ? "returned" : "borrowed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden">
              {filteredTransactions.map((transaction, idx) => (
                <div
                  key={transaction.id || idx}
                  className={`p-4 ${
                    idx < filteredTransactions.length - 1
                      ? "border-b border-neutral-800/50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex gap-2 text-xs text-neutral-500 mb-1">
                        <span>
                          Trans #{transaction.id || transaction.transactionId}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400">
                        <span>Book: </span>
                        <span className="font-mono">{transaction.bookId}</span>
                        <span className="mx-2">•</span>
                        <span>User: </span>
                        <span className="font-mono">{transaction.userId}</span>
                      </div>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                        transaction.returned
                          ? "bg-blue-950/30 text-blue-400 border border-blue-900/50"
                          : "bg-yellow-950/30 text-yellow-400 border border-yellow-900/50"
                      }`}
                    >
                      {transaction.returned ? "returned" : "borrowed"}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    <span>
                      {transaction.borrowDate
                        ? new Date(transaction.borrowDate).toLocaleDateString()
                        : "-"}
                    </span>
                    {transaction.returnDate && (
                      <>
                        <span className="mx-2">→</span>
                        <span>
                          {new Date(
                            transaction.returnDate
                          ).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 text-center text-xs text-neutral-600">
        showing {filteredTransactions.length} of {transactions.length}{" "}
        transactions
      </div>
    </div>
  );
}

export default Transactions;
