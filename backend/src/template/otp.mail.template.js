const otpTemplate = (name, otp) => {
  return `
    <div style="font-family:Arial;padding:30px">
        <h2>Hello ${name}</h2>

        <p>Your OTP is</p>

        <h1
            style="
                background:#0f172a;
                color:white;
                padding:15px;
                width:180px;
                text-align:center;
                border-radius:8px;
            "
        >
            ${otp}
        </h1>

        <p>This OTP will expire in 5 minutes.</p>

        <br>

        <small>
            If you didn't request this OTP,
            please ignore this email.
        </small>

    </div>
    `;
};

export default otpTemplate;
