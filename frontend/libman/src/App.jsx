import { useState } from "react";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Borrow from "./pages/Borrow";
import Return from "./pages/Return";
import Transactions from "./pages/Transactions";

function App() {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-neutral-100 to-neutral-500 bg-clip-text text-transparent">
          libman
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm tracking-wide">
          simple & minimal library management
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
        <div className="flex gap-1 sm:gap-2 p-1 bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-x-auto">
          {["books", "users", "borrow", "return", "transactions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-fit px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium capitalize cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-neutral-800 text-neutral-100"
                  : "text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        {activeTab === "books" && <Books />}
        {activeTab === "users" && <Users />}
        {activeTab === "borrow" && <Borrow />}
        {activeTab === "return" && <Return />}
        {activeTab === "transactions" && <Transactions />}
      </div>
    </div>
  );
}

export default App;
