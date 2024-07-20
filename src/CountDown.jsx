import React, { useState, useEffect } from "react";

const CountDown = ({ date }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval, index, array) => {
    if (timeLeft[interval] !== undefined) {
      timerComponents.push(
        <span key={interval}>
          {String(timeLeft[interval]).padStart(2, "0")}
          {index < array.length - 1 ? ":" : ""}
        </span>
      );
    }
  });

  return (
    <div className='bg-[#93A87E] text-[#a55246] p-6 rounded-lg shadow-lg w-full max-w-md my-6 border-2 border-[#313036] font-SIL text-5xl text-center tracking-wider font-bold'>
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

export default CountDown;
