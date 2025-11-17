import { useState } from "react";
import axios from "axios";

function Borrow() {
  const [userId, setUserId] = useState("");
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleBorrow = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await axios.post("http://localhost:5000/api/borrow", {
        userId: parseInt(userId),
        bookId: parseInt(bookId),
      });

      setMessage({ type: "success", text: "book borrowed successfully" });
      setUserId("");
      setBookId("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "backend not ready yet",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-neutral-100">
          borrow book
        </h2>
        <p className="text-neutral-600 text-xs sm:text-sm mb-6 sm:mb-8">
          enter user id and book id to borrow
        </p>

        <form onSubmit={handleBorrow} className="space-y-4">
          <div>
            <label className="block mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              User ID
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              min="1"
              placeholder="e.g., 1"
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Book ID
            </label>
            <input
              type="number"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
              min="1"
              placeholder="e.g., 42"
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium cursor-pointer transition-all ${
              loading
                ? "bg-neutral-800/50 text-neutral-600 cursor-not-allowed"
                : "bg-green-950/30 text-green-400 border border-green-900/50 hover:bg-green-950/50"
            }`}
          >
            {loading ? "borrowing..." : "borrow book"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm text-center ${
              message.type === "success"
                ? "bg-green-950/20 border border-green-900/30 text-green-400"
                : "bg-red-950/20 border border-red-900/30 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      <div className="mt-6 p-6 bg-neutral-900/30 rounded-xl border border-neutral-800/50">
        <p className="text-xs text-neutral-600">
          <strong className="text-neutral-500">tip:</strong> check the books and
          users pages for valid IDs
        </p>
      </div>
    </div>
  );
}

export default Borrow;
