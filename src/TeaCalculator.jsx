import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion"; // For animation
import App from "./App";

const TeaCalculator = () => {
  const [showCashCalculator, setShowCashCalculator] = useState(false); // Manage TeaCalculator visibility
  const [cups, setCups] = useState(6); // Default to 6 cups

  // Constants for tea preparation
  const milkPerCup = 2 / 3; // 2/3 cup of milk per person
  const waterPerCup = 1 / 3; // 1/3 cup of water per person
  const teaLeavesPerCup = 1 / 2; // 1/2 tablespoon of tea leaves per person
  const sugarPerCup = 1.25; // 1 1/4 tablespoons of sugar per person

  // Conversion constants
  const cupToMl = 125; // 1 cup = 125 ml
  const tbspToG = 8; // 1 tbsp = 8 g

  // Calculations for the required ingredients
  const totalMilk = (parseInt(cups, 10) || 0) * milkPerCup;
  const totalWater = (parseInt(cups, 10) || 0) * waterPerCup;
  const totalTeaLeaves = (parseInt(cups, 10) || 0) * teaLeavesPerCup;
  const totalSugar = (parseInt(cups, 10) || 0) * sugarPerCup;

  // Unit conversion calculations
  const totalMilkMl = totalMilk * cupToMl;
  const totalWaterMl = totalWater * cupToMl;
  const totalTeaLeavesG = totalTeaLeaves * tbspToG;
  const totalSugarG = totalSugar * tbspToG;

  const copyDetails = () => {
    const details = `For ${cups} cup(s) of tea:\n- ${totalMilk.toFixed(
      2
    )} cups (${totalMilkMl.toFixed(0)} ml) milk\n- ${totalWater.toFixed(
      2
    )} cups (${totalWaterMl.toFixed(0)} ml) water\n- ${totalTeaLeaves.toFixed(
      2
    )} tablespoons (${totalTeaLeavesG.toFixed(
      0
    )} g) tea leaves\n- ${totalSugar.toFixed(
      2
    )} tablespoons (${totalSugarG.toFixed(0)} g) sugar`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(details)
        .then(() => toast.success("Details copied to clipboard"))
        .catch((err) => toast.error("Error copying text: " + err));
    } else {
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

  if (showCashCalculator) {
    return <App />; // Show TeaCalculator if the button is clicked
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg font-sans transition-all duration-300">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-3xl font-bold text-yellow-300">Tea Calculator</h1>
        <div className="space-x-3">
          <button
            className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-200"
            onClick={() => setShowCashCalculator(!showCashCalculator)}
          >
            Cash
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-200"
            onClick={copyDetails}
          >
            Copy
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg mb-2 font-medium">
          Number of cups: {cups}
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={cups}
          className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          onChange={(e) => setCups(e.target.value)}
        />
        {/* Progress Indicator */}
        <motion.div
          className="bg-yellow-400 h-4 rounded-lg mt-2"
          initial={{ width: `${(cups / 20) * 100}%` }}
          animate={{ width: `${(cups / 20) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-300">
          Ingredients for {cups} cup(s) of tea:
        </h2>
        <ul className="list-disc list-inside space-y-3 text-lg">
          <li>
            <strong>Milk:</strong> {totalMilk.toFixed(2)} cups (
            {totalMilkMl.toFixed(0)} ml)
          </li>
          <li>
            <strong>Water:</strong> {totalWater.toFixed(2)} cups (
            {totalWaterMl.toFixed(0)} ml) + a little more
          </li>
          <li>
            <strong>Tea Leaves:</strong> {totalTeaLeaves.toFixed(2)} tablespoons
            ({totalTeaLeavesG.toFixed(0)} g)
          </li>
          <li>
            <strong>Sugar:</strong> {totalSugar.toFixed(2)} tablespoons (
            {totalSugarG.toFixed(0)} g)
          </li>
        </ul>
      </div>
      <Toaster />
    </div>
  );
};

export default TeaCalculator;
