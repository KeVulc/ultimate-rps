import React, { useState } from "react";

const GameForm = ({ createGame, joinGame }) => {
  const [gameIdInput, setGameIdInput] = useState("");

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (gameIdInput.trim()) {
      joinGame(gameIdInput.trim());
    } else {
      console.error("Game ID input is empty");
    }
  };

  return (
    <div className='flex flex-col items-center p-6 border-2 border-[#313036] rounded-lg m-6'>
      <form onSubmit={handleJoinGame} className='flex flex-col justify-end'>
        <input
          type='text'
          placeholder='Enter Game ID'
          onChange={(e) => setGameIdInput(e.target.value)}
          className='bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:outline-none focus:border-[#313036]'
          value={gameIdInput}
        />
        <div className='flex justify-between w-full mt-6'>
          <button
            type='button'
            onClick={createGame}
            className='p-2 bg-[#313036] rounded-lg border border-[#313036] text-[#93A87E] hover:brightness-105'
          >
            Create Game
          </button>
          <button
            type='submit'
            className='p-2 bg-[#313036] rounded-lg border border-[#313036] text-[#93A87E] hover:brightness-105'
          >
            Join Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameForm;
