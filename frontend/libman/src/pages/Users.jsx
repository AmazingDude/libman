import { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", phone: "" });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("backend not ready yet");
        setLoading(false);
      });
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/api/users", newUser)
      .then((res) => {
        // Refresh the users list
        return axios.get("http://localhost:5000/api/users");
      })
      .then((res) => {
        setUsers(res.data);
        setShowAddForm(false);
        setNewUser({ name: "", phone: "" });
      })
      .catch((err) => {
        console.error("Failed to add user:", err);
        alert("Failed to add user. Please try again.");
      });
  };

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

  // Filter users by search query
  const displayedUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery))
  );

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
        />
      </div>

      {/* Add User Button */}
      <div className="mb-6 flex justify-between items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-100">
          {displayedUsers.length} users {searchQuery && `(of ${users.length})`}
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
            showAddForm
              ? "bg-red-950/30 text-red-400 border border-red-900/50"
              : "bg-green-950/30 text-green-400 border border-green-900/50 hover:bg-green-950/50"
          }`}
        >
          {showAddForm ? "cancel" : "+ add user"}
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <form onSubmit={handleAddUser} className="space-y-4">
            <input
              type="text"
              placeholder="name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
            <input
              type="tel"
              placeholder="phone"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              required
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-950/30 text-green-400 border border-green-900/50 rounded-lg text-sm font-medium hover:bg-green-950/50 transition-all"
            >
              add user
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
        {displayedUsers.length === 0 ? (
          <div className="py-12 text-center text-neutral-600">
            {searchQuery ? "no users match your search" : "no users found"}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-800">
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user, idx) => (
                    <tr
                      key={user.id || idx}
                      className={
                        idx < displayedUsers.length - 1
                          ? "border-b border-neutral-800/50"
                          : ""
                      }
                    >
                      <td className="px-4 py-4 text-sm text-neutral-400">
                        {user.id}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-neutral-100">
                        {user.name}
                      </td>
                      <td className="px-4 py-4 text-sm font-mono text-neutral-400">
                        {user.phone || user.contact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden">
              {displayedUsers.map((user, idx) => (
                <div
                  key={user.id || idx}
                  className={`p-4 ${
                    idx < displayedUsers.length - 1
                      ? "border-b border-neutral-800/50"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-medium text-neutral-100">
                      {user.name}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      ID: {user.id}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-neutral-400">
                    <span className="text-neutral-500">Contact: </span>
                    {user.phone || user.contact}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
