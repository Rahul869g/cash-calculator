import React, { useState } from "react";

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

  const handleChange = (index, value) => {
    const newCounts = [...counts];
    newCounts[index] = value;
    setCounts(newCounts);
  };

  const resetCounts = () => {
    setCounts(denominations.map(() => ""));
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
        .then(() => alert("Details copied to clipboard"))
        .catch((err) => console.error("Error copying text: ", err));
    } else {
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = details;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Details copied to clipboard");
      } catch (err) {
        console.error("Error copying text: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-2xl font-bold">Cash Calculator</h1>
        <div className="flex space-x-2">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={resetCounts}
          >
            Reset
          </button>
          <button
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={copyDetails}
          >
            Copy
          </button>
        </div>
      </div>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="border border-gray-700 px-2 py-2">Denomination</th>
            <th className="border border-gray-700 px-2 py-2">Count</th>
            <th className="border border-gray-700 px-8 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {denominations.map((denomination, index) => (
            <tr key={denomination.value} className="hover:bg-gray-800">
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
                ₹{(parseInt(counts[index], 10) || 0) * denomination.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mb-4">
        <div>
          <strong>Total Notes :</strong> {totalNotes}
        </div>
        <div>
          <strong>Total Amount :</strong> ₹{totalAmount}
        </div>
      </div>
    </div>
  );
};

export default CashCalculator;
