import React, { useState, useEffect } from "react";
import randomEmoji from "./randomEmoji";

function ScoreBoard({ data, score }) {
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    if (score > emojis.length) {
      const newEmoji = randomEmoji();
      setEmojis((prevEmojis) => [...prevEmojis, newEmoji]);
    }
  }, [score, emojis.length]);

  if (!data) return null;

  // Calculate the minimum height based on the number of emojis to maintain spacing
  const minContainerHeight = emojis.length === 0 ? "2rem" : "auto";

  return (
    <div style={{ minHeight: minContainerHeight }}>
      <div className='flex justify-center mt-2'>
        {emojis.map((emoji, index) => (
          <span key={index} className='text-2xl'>
            {emoji}
          </span>
        ))}
        {/* Render an empty span to maintain height when emojis list is empty */}
        {emojis.length === 0 && <span style={{ visibility: "hidden" }}>.</span>}
      </div>
    </div>
  );
}

export default ScoreBoard;
