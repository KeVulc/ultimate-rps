import React from "react";

function RoundOutcome({ winner }) {
  return (
    <div className='text-center'>
      <p className='text-[#313036] text-2xl font-bold text-center mt-4'>
        {winner !== "Tie" ? `${winner} wins this round!` : "It's a tie!"}
      </p>
    </div>
  );
}

export default RoundOutcome;
