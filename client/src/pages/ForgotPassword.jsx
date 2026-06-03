import { useState } from "react";
import axios from "axios";
import API_URL from "@/config/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.post(`${API_URL}/api/users/forgot-password`, { email });

    alert("Reset email sent successfully");
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button type="submit">Send Reset Link</button>
    </form>
  );
}

export default ForgotPassword;
