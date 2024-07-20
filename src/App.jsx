import React, { useState, useEffect } from "react";
import "./App.css";
import { db, auth } from "./firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import ScoreBoard from "./ScoreBoard";
import SelectionPrompt from "./SelectionPrompt";
import RoundOutcome from "./RoundOutcome";
import GameWinner from "./GameWinner";
import Auth from "./Auth";
import logout from "./assets/logout.svg";
import GameForm from "./GameForm";
import HeadToHead from "./HeadToHead";
import CountDown from "./CountDown";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [oppData, setOppData] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [userSelection, setUserSelection] = useState("");
  const [oppSelection, setOppSelection] = useState("");
  const [winner, setWinner] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [gameWinner, setGameWinner] = useState(null);
  const [oppNotFound, setOppNotFound] = useState(false);
  const [message, setMessage] = useState("");
  const [headToHeadRef, setHeadToHeadRef] = useState(null);
  const [headToHeadData, setHeadToHeadData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [promptMessage, setPromptMessage] = useState(false);

  const generateDocId = (user1, user2) => {
    return user1.userid < user2.userid
      ? `${user1.userid}_${user2.userid}`
      : `${user2.userid}_${user1.userid}`;
  };

  useEffect(() => {
    const fetchOrCreateHeadToHeadData = async () => {
      const docId = generateDocId(userData, oppData);
      const docRef = doc(db, "HeadToHead", docId);

      try {
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          // If the document does not exist, create a new one with initial data
          const newHeadToHeadData = {
            user1: { id: userData.userid, name: userData.name, score: 0 },
            user2: { id: oppData.userid, name: oppData.name, score: 0 },
            message: "",
            date: getTomorrow(),
          };

          await setDoc(docRef, newHeadToHeadData);
          await updateDoc(doc(db, "User", userData.userid), {
            headToHeads: [...userData.headToHeads, docRef],
          });
          await updateDoc(doc(db, "User", oppData.userid), {
            headToHeads: [...oppData.headToHeads, docRef],
          });
        }

        // Set up a real-time listener for the head-to-head document
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            setHeadToHeadData(doc.data());
          } else {
            console.error("Head-to-head document does not exist!");
          }
        });

        // Store the unsubscribe function so it can be called on cleanup
        setHeadToHeadRef(docRef);

        // Cleanup function to unsubscribe from the listener when component unmounts or dependencies change
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
      } catch (error) {
        console.error("Error fetching or creating head-to-head data:", error);
      }
    };

    // Run the effect if userData and oppData are available
    if (userData && oppData) {
      fetchOrCreateHeadToHeadData();
    }
  }, [userData, oppData]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserData(null);
        setOppNotFound(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const userDoc = await getDoc(doc(db, "User", uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserData(data);
    }
  };

  const createGame = async () => {
    if (!userData) return;

    const newGame = await addDoc(collection(db, "Games"), {
      user1: { name: userData.name, userid: userData.userid },
      user2: null,
      user1Selection: null,
      user2Selection: null,
      user1Score: 0,
      user2Score: 0,
      gameWinner: null,
    });

    setGameId(newGame.id);
    listenToGame(newGame.id);
  };

  const joinGame = async (gameId) => {
    try {
      const gameDoc = await getDoc(doc(db, "Games", gameId));
      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        if (!gameData.user2 && userData) {
          await updateDoc(doc(db, "Games", gameId), {
            user2: { name: userData.name, userid: userData.userid },
          });
          setGameId(gameId);
          listenToGame(gameId);
          setOppData(gameDoc.data().user1);
        }
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  const listenToGame = (gameId) => {
    const gameDocRef = doc(db, "Games", gameId);

    const unsubscribe = onSnapshot(gameDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setGameData(data);
        setUserSelection(
          data.user1.userid === userData.userid
            ? data.user1Selection
            : data.user2Selection
        );
        setOppSelection(
          data.user1.userid === userData.userid
            ? data.user2Selection
            : data.user1Selection
        );
        setUserScore(
          data.user1.userid === userData.userid
            ? data.user1Score
            : data.user2Score
        );
        setOppScore(
          data.user1.userid === userData.userid
            ? data.user2Score
            : data.user1Score
        );
        setGameWinner(data.gameWinner);

        // Check if user1 is updated with user2 data
        if (!oppData && data.user2) {
          userData.userid === data.user2.userid
            ? setOppData(data.user1)
            : setOppData(data.user2);
        }
      }
    });

    return unsubscribe;
  };

  const handleSelection = async (selection) => {
    if (!gameId || !userData) return;

    const gameDocRef = doc(db, "Games", gameId);
    const gameData = (await getDoc(gameDocRef)).data();

    if (gameData.user1.userid === userData.userid) {
      await updateDoc(gameDocRef, { user1Selection: selection });
    } else {
      await updateDoc(gameDocRef, { user2Selection: selection });
    }
  };

  useEffect(() => {
    if (winner && !gameWinner) {
      const timer = setTimeout(() => {
        resetRound();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [winner, gameWinner]);

  const resetRound = async () => {
    setUserSelection(null);
    setOppSelection(null);
    setWinner(null);
    setGameData({ ...gameData, user1Selection: null, user2Selection: null });
    const gameDocRef = doc(db, "Games", gameId);
    await updateDoc(gameDocRef, { user1Selection: null, user2Selection: null });
  };

  const getTomorrow = () => {
    const now = new Date();
    const tmr = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return tmr;
  };

  const resetGame = async (message) => {
    if (userData.name === gameWinner) {
      updateHeadToHead(message);
    }

    // setUserSelection(null);
    // setOppSelection(null);
    // setWinner(null);
    // setUserScore(0);
    // setOppScore(0);
    // setGameWinner(null);
    // setPromptMessage(false);
    // const gameDocRef = doc(db, "Games", gameId);
    // await updateDoc(gameDocRef, {
    //   user1Selection: null,
    //   user2Selection: null,
    //   user1Score: 0,
    //   user2Score: 0,
    //   gameWinner: null,
    // });
    // setGameData({
    //   ...gameData,
    //   user1Selection: null,
    //   user2Selection: null,
    //   user1Score: 0,
    //   user2Score: 0,
    //   gameWinner: null,
    // });
  };

  useEffect(() => {
    if (userSelection && oppSelection) {
      const roundWinner = determineWinner(userSelection, oppSelection);
      setWinner(roundWinner);
      updateScore(roundWinner);
    }
  }, [userSelection, oppSelection]);

  const updateScore = async (roundWinner) => {
    if (!gameId) return;

    const gameDocRef = doc(db, "Games", gameId);
    const gameData = (await getDoc(gameDocRef)).data();

    if (roundWinner === userData.name) {
      if (gameData.user1.userid === userData.userid) {
        await updateDoc(gameDocRef, { user1Score: gameData.user1Score + 1 });
      } else {
        await updateDoc(gameDocRef, { user2Score: gameData.user2Score + 1 });
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(gameId)
      .then(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  useEffect(() => {
    if (userScore === 3 || oppScore === 3) {
      if (userScore === 3) {
        setGameWinner(userData.name);
        setPromptMessage(true);
      } else if (oppScore === 3) {
        setGameWinner(oppData.name);
      }
    }
  }, [userScore, oppScore]);

  const updateHeadToHead = async (message) => {
    const docSnapshot = await getDoc(headToHeadRef);
    const data = docSnapshot.data();

    if (userData.userid === data.user1.id) {
      data.user1.score = data.user1.score + 1;
    } else {
      data.user2.score = data.user2.score + 1;
    }
    console.log("updating Head to Head");
    await updateDoc(headToHeadRef, {
      "user1.score": data.user1.score,
      "user2.score": data.user2.score,
      message: message,
    });
  };

  function determineWinner(userSelection, oppSelection) {
    if (userSelection === oppSelection) {
      return "Tie";
    }

    if (
      (userSelection === "rock" && oppSelection === "scissors") ||
      (userSelection === "scissors" && oppSelection === "paper") ||
      (userSelection === "paper" && oppSelection === "rock")
    ) {
      return userData.name;
    }

    return oppData.name;
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-[#93A87E] overflow-hidden text-[#313036]'>
      <div className='absolute top-5 right-5 w-8'>
        {user && (
          <button onClick={() => signOut(auth)}>
            <img src={logout} alt='logout' />
          </button>
        )}
      </div>
      {!user ? (
        <Auth />
      ) : (
        <div className='flex flex-col items-center'>
          <h1 className='text-center text-6xl font-bold font-SIL'>
            Rock Paper Scissors
          </h1>
          {!gameId ? (
            <GameForm createGame={createGame} joinGame={joinGame} />
          ) : (
            <>
              {headToHeadData && (
                <HeadToHead
                  headToHeadData={headToHeadData}
                  isFirst={headToHeadData.user1.id === userData.userid}
                />
              )}
              {!(userData && oppData) && (
                <div className='relative'>
                  <div
                    className='text-xl mb-4 cursor-pointer hover:bg-[#b4ce9b] bg-inherit rounded p-1'
                    onClick={copyToClipboard}
                    title='Click to copy Game ID'
                  >
                    {gameId}
                  </div>
                  {showPopup && (
                    <div
                      className='absolute bottom-[12px] right-[-84px] p-2 bg-[#313036] text-[#93A87E] rounded hover:brightness-110 cursor-pointer'
                      onClick={() => setShowPopup(false)}
                    >
                      Copied!
                    </div>
                  )}
                </div>
              )}
              {gameWinner ? (
                <CountDown date={getTomorrow()} />
              ) : (
                <SelectionPrompt
                  userScore={userScore}
                  oppScore={oppScore}
                  userData={userData}
                  oppData={oppData}
                  handleSelection={handleSelection}
                  userSelection={userSelection}
                  oppSelection={oppSelection}
                />
              )}
            </>
          )}
          {winner && !gameWinner && <RoundOutcome winner={winner} />}
          {gameWinner && (
            <GameWinner
              gameWinner={gameWinner}
              resetGame={resetGame}
              message={message}
              handleMessageChange={handleMessageChange}
              promptMessage={promptMessage}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
