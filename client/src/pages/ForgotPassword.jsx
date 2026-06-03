import { useState } from "react";
import axios from "axios";
import API_URL from "@/config/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/users/forgot-password`,
        { email },
      );

      console.log("SUCCESS:", response.data);

      alert("Reset email sent successfully");
    } catch (error) {
      console.log("SERVER ERROR:", error.response?.data);

      alert(error.response?.data?.message || error.message);
    }
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
