import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    await axios.put(`/api/users/reset-password/${token}`, { password });

    alert("Password changed successfully");
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
