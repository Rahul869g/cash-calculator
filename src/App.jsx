import React, { useState } from "react";
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
  const tallyDifference = parseInt(tally, 10) - totalAmount;

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
            Tea
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={resetCounts}
          >
            Reset
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            onClick={copyDetails}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Tally Input box */}
      <div className="mb-4 w-full flex justify-between items-center">
        <input
          type="number"
          className="w-1/2 p-2 border rounded bg-gray-800 border-gray-700 text-white"
          value={tally}
          placeholder="Enter tally amount"
          onChange={(e) => setTally(e.target.value)}
        />
        <div className="ml-4 text-lg">
          <strong>Difference:</strong>{" "}
          {tallyDifference > 0
            ? `+${tallyDifference.toLocaleString("en-IN")}`
            : tallyDifference.toLocaleString("en-IN")}{" "}
          ₹
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
      <Toaster />
    </div>
  );
};

export default CashCalculator;
