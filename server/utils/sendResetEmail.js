import { Resend } from "resend";

const sendResetEmail = async (email, resetUrl) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Request",

    html: `
      <h2>Reset Password</h2>

      <p>
        Click the button below to reset
        your password.
      </p>

      <a
        href="${resetUrl}"
        style="
          background:#4f46e5;
          color:white;
          padding:12px 18px;
          text-decoration:none;
          border-radius:8px;
        "
      >
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>
    `,
  });
};

export default sendResetEmail;
