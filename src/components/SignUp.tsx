import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";

export default function SignUp({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [hospital, setHospital] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await set(ref(db, "doctors/" + user.uid), {
        name,
        hospital,
        email,
      });

    //   alert("Signup successful");
    onBack();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <h2>Doctor Signup</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Hospital" onChange={(e) => setHospital(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}   