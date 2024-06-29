// src/Auth.js
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { db } from "./firebaseConfig"; // Import Firestore database
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions

function Auth({ onUserAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // New state for name
  const [isRegistering, setIsRegistering] = useState(false);

  const createUserDocument = async (user) => {
    try {
      await setDoc(doc(db, "User", user.uid), {
        userid: user.uid,
        name: name,
        headToHeads: [],
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await createUserDocument(userCredential.user);
      } else {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      onUserAuthenticated(userCredential.user);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className='text-[#313036] bg-[#93A87E] border-2 rounded-2xl border-[#313036] p-6 shadow-md w-96'>
      <form onSubmit={handleAuth} className=''>
        <h2 className='text-2xl font-bold mb-4'>
          {isRegistering ? "Sign Up" : "Login"}
        </h2>
        {isRegistering && (
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Name'
            required
            className='w-full p-2 mb-4 border border-[#313036] rounded'
          />
        )}
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
          className='w-full p-2 mb-4 border border-[#313036] rounded'
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
          className='w-full p-2 mb-4 border border-[#313036] rounded'
        />
        <div className='flex flex-row justify-between font-bold'>
          <button
            type='submit'
            className='p-2 mb-4 bg-[#313036] rounded-lg border border-[#313036] text-[#93A87E] hover:brightness-105'
          >
            {isRegistering ? "Sign Up" : "Login"}
          </button>
          <button
            type='button'
            onClick={() => setIsRegistering(!isRegistering)}
            className='p-2 mb-4 bg-[#93A87E] rounded-lg border border-transparent text-[#313036]'
          >
            {isRegistering ? "Switch to Login" : "Switch to Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
