import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TeaTimer = () => {
  const [minutes, setMinutes] = useState(6);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [alert, setAlert] = useState(false);

  // Audio alert (sound) when the timer finishes
  const audio = new Audio(
    "https://www.soundjay.com/buttons/sounds/beep-15.mp3"
  ); // MP3 format, widely supported

  useEffect(() => {
    let timer;
    if (isRunning && (minutes > 0 || seconds > 0)) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0) {
      setIsRunning(false);
      setAlert(true); // Trigger visual alert
      audio.play(); // Play the sound
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds]);

  const incrementTime = () => setMinutes((prev) => prev + 1);
  const decrementTime = () => setMinutes((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col items-center">
      {/* <h2 className="text-xl font-semibold text-yellow-300 mb-3">Tea Timer</h2> */}

      {/* Circular Timer */}
      <motion.div
        className="relative w-40 h-40 rounded-full border-8 border-gray-700 flex items-center justify-center cursor-pointer"
        onClick={() => setIsRunning(!isRunning)}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          ease: "linear",
          duration: isRunning ? (minutes * 60 + seconds) / 60 : 0
        }}
      >
        <div className="absolute w-40 h-40 rounded-full border-2 border-yellow-300" />
        <div className="relative z-10 text-2xl font-bold text-white">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </motion.div>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={decrementTime}
          className="border rounded-3xl text-white px-4 py-2"
        >
          -1 min
        </button>
        <button
          onClick={incrementTime}
          className="border rounded-3xl text-white px-4 py-2"
        >
          +1 min
        </button>
      </div>

      {/* Visual Alert */}
      {alert && (
        <div className="mt-4 text-xl font-semibold text-red-500">
          Time's up!
        </div>
      )}
    </div>
  );
};

export default TeaTimer;
