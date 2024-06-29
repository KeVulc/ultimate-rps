import React, { useState, useEffect } from "react";

function GameWinner({
  gameWinner,
  resetGame,
  message,
  handleMessageChange,
  promptMessage,
}) {
  return (
    <div className='text-center p-4 bg-[#93A87E] text-[#313036] rounded-lg shadow-lg border-2 border-[#313036] mt-6'>
      <p className='text-[#313036] text-2xl font-bold text-center mt-4'>
        {gameWinner} wins the game!
      </p>
      {promptMessage && (
        <>
          <input
            type='text'
            value={message}
            onChange={handleMessageChange}
            placeholder='Enter a message'
            className='mt-4 px-4 py-2 w-full border border-[#313036] rounded text-[#313036]'
          />
          <button
            onClick={() => resetGame(message)}
            className='mt-4 px-4 py-2 bg-[#93A87E] text-[#313036] border-2 rounded border-[#313036] hover:brightness-95 active:brightness-90'
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

export default GameWinner;
