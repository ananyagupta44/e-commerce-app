import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import API_URL from "@/config/api";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${API_URL}/api/users/reset-password/${token}`,
        { password },
      );

      console.log(response.data);
      alert("Password changed successfully");
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Update Password</button>
    </form>
  );
}

export default ResetPassword;
