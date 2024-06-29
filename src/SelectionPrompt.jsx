import React, { useState, useEffect } from "react";
import rock from "./assets/rock.svg";
import paper from "./assets/paper.svg";
import scissors from "./assets/scissors.svg";
import loadingSpinner from "./assets/loading-spinner.svg";
import checkmark from "./assets/checkmark.svg";
import ScoreBoard from "./ScoreBoard";

function SelectionPrompt({
  userData,
  oppData,
  userScore,
  oppScore,
  handleSelection,
  userSelection,
  oppSelection,
}) {
  const [loadingOpponent, setLoadingOpponent] = useState(true);
  const handleUserSelection = (selection) => {
    handleSelection(selection, oppSelection);
  };

  useEffect(() => {
    setLoadingOpponent(oppSelection === null);
  });

  return (
    <div className='flex flex-col md:flex-row md:items-start md:justify-around'>
      {/* User Section */}
      <div className='flex flex-col items-center md:mr-32'>
        <ScoreBoard data={userData} score={userScore} />
        <p className='text-center text-xl font-bold mb-2'>{userData.name}</p>
        <div className='flex items-center'>
          {userSelection ? (
            <img
              src={
                userSelection === "rock"
                  ? rock
                  : userSelection === "paper"
                  ? paper
                  : scissors
              }
              className='min-w-24 max-w-32'
              alt={userSelection}
            />
          ) : (
            <>
              <img
                src={rock}
                className='min-w-24 max-w-32 cursor-pointer'
                alt='rock'
                onClick={() => handleUserSelection("rock")}
              />
              <img
                src={paper}
                className='min-w-24 max-w-32 cursor-pointer ml-8'
                alt='paper'
                onClick={() => handleUserSelection("paper")}
              />
              <img
                src={scissors}
                className='min-w-24 max-w-32 cursor-pointer ml-8'
                alt='scissors'
                onClick={() => handleUserSelection("scissors")}
              />
            </>
          )}
        </div>
      </div>

      {/* Opponent Section */}
      <div className='flex flex-col items-center mt-4 md:mt-0'>
        <ScoreBoard data={oppData} score={oppScore} />
        <p className='text-center text-xl font-bold mb-2'>
          {oppData && oppData.name}
        </p>
        <div className='flex items-center'>
          {loadingOpponent ? (
            <img
              src={loadingSpinner}
              className='max-w-32 min-w-24 animate-spin'
              alt='loading'
            />
          ) : (
            <img
              src={
                userSelection
                  ? oppSelection === "rock"
                    ? rock
                    : oppSelection === "paper"
                    ? paper
                    : scissors
                  : checkmark
              }
              className='max-w-32 min-w-24'
              alt={oppSelection || "checkmark"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectionPrompt;
