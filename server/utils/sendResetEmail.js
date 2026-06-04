import nodemailer from "nodemailer";

const sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",

    html: `
      <div style="
        max-width:600px;
        margin:auto;
        padding:30px;
        font-family:Arial,sans-serif;
      ">
        <h2>Password Reset Request</h2>

        <p>
          We received a request to reset your password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            background:#4f46e5;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you didn't request this,
          you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendResetEmail;
