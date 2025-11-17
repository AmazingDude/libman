import { useEffect, useState } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/books")
      .then((res) => {
        setBooks(res.data);
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

  return (
    <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
      {books.length === 0 ? (
        <div className="py-12 text-center text-neutral-600">no books found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  ISBN
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr
                  key={book.id || idx}
                  className={
                    idx < books.length - 1
                      ? "border-b border-neutral-800/50"
                      : ""
                  }
                >
                  <td className="px-4 py-4 text-sm text-neutral-400">
                    {book.id}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-neutral-100">
                    {book.title}
                  </td>
                  <td className="px-4 py-4 text-sm text-neutral-400">
                    {book.author}
                  </td>
                  <td className="px-4 py-4 text-sm font-mono text-neutral-400">
                    {book.isbn}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        book.available
                          ? "bg-green-950/30 text-green-400 border border-green-900/50"
                          : "bg-red-950/30 text-red-400 border border-red-900/50"
                      }`}
                    >
                      {book.available ? "available" : "borrowed"}
                    </span>
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

export default Books;
