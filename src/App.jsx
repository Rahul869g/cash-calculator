import React, { useState, useEffect } from "react";
import { Coffee, Files, History, Trash2 } from "lucide-react";

import { Toaster, toast } from "react-hot-toast";
import { ToWords } from "to-words";
import TeaCalculator from "./TeaCalculator"; // Import the TeaCalculator component

// Configure ToWords instance for Indian currency
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
      fractionalUnit: {
        name: "Paisa",
        plural: "Paise",
        symbol: ""
      }
    }
  }
});
const denominations = [
  { value: 500, label: "₹500" },
  { value: 200, label: "₹200" },
  { value: 100, label: "₹100" },
  { value: 50, label: "₹50" },
  { value: 20, label: "₹20" },
  { value: 10, label: "₹10" }
];

const CashCalculator = () => {
  const [counts, setCounts] = useState(denominations.map(() => ""));
  const [tally, setTally] = useState(""); // New state for tally
  const [showTeaCalculator, setShowTeaCalculator] = useState(false); // Manage TeaCalculator visibility
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleChange = (index, value) => {
    const newCounts = [...counts];
    newCounts[index] = value;
    setCounts(newCounts);
  };

  const resetCounts = () => {
    setCounts(denominations.map(() => ""));
    setTally(""); // Reset tally as well
  };

  const totalAmount = counts.reduce(
    (sum, count, index) =>
      sum + (parseInt(count, 10) || 0) * denominations[index].value,
    0
  );
  const totalNotes = counts.reduce(
    (sum, count) => sum + (parseInt(count, 10) || 0),
    0
  );

  const amountInWords = toWords.convert(totalAmount, { currency: true });

  // Calculate the difference between tally and total
  const tallyDifference = (Number(tally) || 0) - totalAmount;

  // Function to capitalize the first letter of a string
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const copyDetails = () => {
    let details = "";
    counts.forEach((count, index) => {
      if (parseInt(count, 10) > 0) {
        const denomination = denominations[index];
        details += `${denomination.value}×${count}=${
          denomination.value * count
        }\n`;
      }
    });
    details += "=============\n";
    details += `Total ₹${totalAmount}\n`;
    details += `[Total ${totalNotes} Notes]`;

    const newEntry = {
      id: Date.now(),
      timestamp: new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      }).format(new Date()),
      counts,
      totalAmount,
      totalNotes,
      tally,
      details
    };
    const updatedHistory = [newEntry, ...history]; // use existing state variable
    localStorage.setItem("cashHistory", JSON.stringify(updatedHistory));
    setHistory(updatedHistory); // update React state immediately

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(details)
        .then(() => toast.success("Details copied to clipboard"))
        .catch((err) => toast.error("Error copying text: " + err));
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = details;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Details copied to clipboard");
      } catch (err) {
        toast.error("Error copying text: " + err);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    const savedCounts = JSON.parse(localStorage.getItem("cashCounts"));
    const savedTally = localStorage.getItem("cashTally");
    if (savedCounts) setCounts(savedCounts);
    if (savedTally) setTally(savedTally);
  }, []);

  useEffect(() => {
    localStorage.setItem("cashCounts", JSON.stringify(counts));
    localStorage.setItem("cashTally", tally);
  }, [counts, tally]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("cashHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const deleteEntry = (id) => {
    const updated = history.filter((entry) => entry.id !== id);
    localStorage.setItem("cashHistory", JSON.stringify(updated));
    setHistory(updated);
  };

  const deleteAll = () => {
    localStorage.removeItem("cashHistory");
    setHistory([]);
  };

  const copyEntry = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch((err) => toast.error("Error copying: " + err));
  };

  if (showTeaCalculator) {
    return <TeaCalculator />; // Show TeaCalculator if the button is clicked
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg font-sans">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-2xl font-bold">Cash Counter</h1>
        <div className="flex space-x-2">
          <button
            className="bg-[#eab16b] hover:bg-[#c18a45] text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={() => setShowTeaCalculator(!showTeaCalculator)} // Toggle TeaCalculator visibility
          >
            <Coffee size={20} />
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={resetCounts}
          >
            <Trash2 size={20} />
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={copyDetails}
          >
            <Files size={20} />
          </button>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={() => setShowHistory(!showHistory)}
            title="Toggle History"
          >
            <History size={20} />
          </button>
        </div>
      </div>

      {/* Tally Input box */}
      <div className="mb-4 w-full flex justify-between items-center">
        <input
          type="number"
          className="w-1/2 p-2 border rounded bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          value={tally}
          placeholder="Enter tally amount"
          onChange={(e) => setTally(e.target.value)}
        />
        <div className="ml-4 mt-1 text-lg flex items-center  gap-2">
          <strong>Difference:</strong>
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-500 flex self-end">
              {tallyDifference < 0
                ? "+ greater by"
                : tallyDifference > 0
                ? "- less by"
                : ""}
            </span>
            <span
              className={`font-semibold text-xl ${
                tallyDifference < 0
                  ? "text-green-600"
                  : tallyDifference > 0
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              ₹ {Math.abs(tallyDifference).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Denomination input table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-700 px-2 py-2">Denomination</th>
            <th className="border border-gray-700 px-2 py-2">Count</th>
            <th className="border border-gray-700 px-8 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((denomination, index) => (
            <tr key={denomination.value} className="hover:bg-gray-700">
              <td className="border border-gray-700 px-4 py-2 text-center">
                {denomination.label}
              </td>
              <td className="border border-gray-700 px-4 py-2">
                <input
                  type="number"
                  className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white"
                  value={counts[index]}
                  placeholder="0"
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </td>
              <td className="border border-gray-700 px-4 py-2">
                ₹
                {(parseInt(counts[index], 10) || 0) *
                  denomination.value.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg">
          <strong>Total Notes:</strong> {totalNotes}
        </div>
        <div className="text-lg">
          <strong>Total Amount:</strong> ₹{totalAmount.toLocaleString("en-IN")}
        </div>
      </div>
      <div className="text-center text-xl font-semibold">
        {capitalize(amountInWords)}
      </div>
      {showHistory && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between px-5 items-center mb-2">
            <h2 className="text-lg  font-bold">History</h2>
            {history.length > 0 && (
              <button
                className="text-red-500 flex  items-center text-sm hover:underline"
                onClick={deleteAll}
              >
                {/* <Trash2 size={16} /> */}
                Delete All
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-gray-500 italic text-sm">No history yet.</p>
          ) : (
            <div className="max-w-md mx-auto px-5 py-2">
              <div className="space-y-3 max-h-64 hide-scrollbar overflow-y-auto">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 hover:shadow-sm transition-shadow"
                  >
                    <div className="text-gray-400 text-xs italic mb-1">
                      {entry.timestamp}
                    </div>
                    <pre className="whitespace-pre-wrap text-white text-sm mb-2">
                      {entry.details}
                    </pre>
                    <div className="flex justify-end gap-2">
                      <button
                        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition"
                        onClick={() => copyEntry(entry.details)}
                      >
                        <Files size={16} />
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition"
                        onClick={() => deleteEntry(entry.id)}
                      >
                        <Trash2 size={16} />{" "}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default CashCalculator;
