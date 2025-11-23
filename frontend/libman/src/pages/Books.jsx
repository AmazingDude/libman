import { useEffect, useState } from "react";
import axios from "axios";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("none");

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

  // Filter and sort books
  const displayedBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "availability")
        return (b.available ? 1 : 0) - (a.available ? 1 : 0);
      return 0;
    });

  return (
    <div>
      {/* Search and Sort Controls */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-100 text-sm focus:outline-none focus:border-neutral-600 cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23737373' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 1rem center",
          }}
        >
          <option value="none" className="bg-neutral-800 text-neutral-100">
            No Sort
          </option>
          <option value="title" className="bg-neutral-800 text-neutral-100">
            Sort by Title (A-Z)
          </option>
          <option value="author" className="bg-neutral-800 text-neutral-100">
            Sort by Author (A-Z)
          </option>
          <option
            value="availability"
            className="bg-neutral-800 text-neutral-100"
          >
            Sort by Availability
          </option>
        </select>
      </div>

      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
        {displayedBooks.length === 0 ? (
          <div className="py-12 text-center text-neutral-600">
            {searchQuery ? "no books match your search" : "no books found"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
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
                  {displayedBooks.map((book, idx) => (
                    <tr
                      key={book.id || idx}
                      className={
                        idx < displayedBooks.length - 1
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

            {/* Mobile Cards */}
            <div className="md:hidden">
              {displayedBooks.map((book, idx) => (
                <div
                  key={book.id || idx}
                  className={`p-4 ${
                    idx < displayedBooks.length - 1
                      ? "border-b border-neutral-800/50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-neutral-100 flex-1">
                      {book.title}
                    </h3>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                        book.available
                          ? "bg-green-950/30 text-green-400 border border-green-900/50"
                          : "bg-red-950/30 text-red-400 border border-red-900/50"
                      }`}
                    >
                      {book.available ? "available" : "borrowed"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mb-1">{book.author}</p>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span className="font-mono">{book.isbn}</span>
                    <span>ID: {book.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-center text-xs text-neutral-600">
        showing {displayedBooks.length} of {books.length} books
      </div>
    </div>
  );
}

export default Books;
