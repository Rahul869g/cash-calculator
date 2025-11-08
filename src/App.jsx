import React, { useState } from "react";
import CashCalculator from "./CashCalculator";
import TeaCalculator from "./TeaCalculator";

const App = () => {
  const [view, setView] = useState("cash");

  return (
    <div className="min-h-screen bg-gray-900  font-sans text-white flex items-start justify-center">
      {/* <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Counter & Tea Tools</h1>
          <div className="flex gap-2">
            <button
              aria-pressed={view === "cash"}
              onClick={() => setView("cash")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-shadow ${
                view === "cash" ? "bg-yellow-600" : "bg-gray-700"
              }`}
            >
              Cash
            </button>
            <button
              aria-pressed={view === "tea"}
              onClick={() => setView("tea")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-shadow ${
                view === "tea" ? "bg-yellow-600" : "bg-gray-700"
              }`}
            >
              Tea
            </button>
          </div>
        </div>

      </div> */}
      {view === "cash" ? <CashCalculator /> : <TeaCalculator />}
    </div>
  );
};

export default App;
