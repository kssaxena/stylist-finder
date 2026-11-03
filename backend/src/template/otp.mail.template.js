const otpTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>OTP Verification</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background-color:#f3f4f6;
          font-family:Arial, Helvetica, sans-serif;
          color:#111827;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            background-color:#f3f4f6;
            padding:45px 15px;
          "
        >
          <tr>
            <td align="center">

              <!-- Main Card -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width:520px;
                  width:100%;
                  background:#ffffff;
                  border:1px solid #e5e7eb;
                  border-radius:12px;
                  overflow:hidden;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background:#111827;
                      padding:30px 35px;
                      text-align:center;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#9ca3af;
                        font-size:11px;
                        font-weight:bold;
                        letter-spacing:1.5px;
                        text-transform:uppercase;
                      "
                    >
                      Security Verification
                    </p>

                    <h1
                      style="
                        margin:10px 0 0 0;
                        color:#ffffff;
                        font-size:23px;
                        line-height:1.3;
                        font-weight:600;
                      "
                    >
                      One-Time Password
                    </h1>

                  </td>
                </tr>


                <!-- Content -->
                <tr>
                  <td style="padding:40px 35px;">

                    <!-- Greeting -->
                    <p
                      style="
                        margin:0 0 8px 0;
                        font-size:15px;
                        color:#374151;
                      "
                    >
                      Dear <strong>${name}</strong>,
                    </p>

                    <p
                      style="
                        margin:0;
                        font-size:14px;
                        line-height:1.8;
                        color:#6b7280;
                      "
                    >
                      We received a request to verify your identity.
                      Please use the following One-Time Password to
                      complete the verification process.
                    </p>


                    <!-- OTP Label -->
                    <p
                      style="
                        margin:30px 0 10px 0;
                        text-align:center;
                        color:#6b7280;
                        font-size:12px;
                        font-weight:bold;
                        letter-spacing:1px;
                        text-transform:uppercase;
                      "
                    >
                      Verification Code
                    </p>


                    <!-- OTP -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>
                        <td align="center">

                          <div
                            style="
                              display:inline-block;
                              padding:18px 30px;
                              background:#111827;
                              border-radius:8px;
                              color:#ffffff;
                              font-size:30px;
                              line-height:1;
                              font-weight:bold;
                              letter-spacing:8px;
                            "
                          >
                            ${otp}
                          </div>

                        </td>
                      </tr>
                    </table>


                    <!-- Expiry Notice -->
                    <table
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin-top:28px;"
                    >
                      <tr>
                        <td
                          style="
                            padding:15px 18px;
                            background:#f9fafb;
                            border:1px solid #e5e7eb;
                            border-radius:7px;
                            text-align:center;
                          "
                        >

                          <p
                            style="
                              margin:0;
                              color:#374151;
                              font-size:13px;
                              line-height:1.6;
                            "
                          >
                            This verification code will expire in
                            <strong>5 minutes</strong>.
                          </p>

                        </td>
                      </tr>
                    </table>


                    <!-- Security Notice -->
                    <p
                      style="
                        margin:28px 0 0 0;
                        padding-top:25px;
                        border-top:1px solid #e5e7eb;
                        color:#6b7280;
                        font-size:12px;
                        line-height:1.7;
                        text-align:center;
                      "
                    >
                      For your security, do not share this code with anyone.
                      Our team will never ask you to disclose your OTP.
                    </p>

                  </td>
                </tr>


                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding:23px 35px;
                      background:#f9fafb;
                      border-top:1px solid #e5e7eb;
                      text-align:center;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        color:#9ca3af;
                        font-size:11px;
                        line-height:1.6;
                      "
                    >
                      If you did not request this verification code,
                      you may safely ignore this email.
                    </p>

                    <p
                      style="
                        margin:8px 0 0 0;
                        color:#9ca3af;
                        font-size:11px;
                      "
                    >
                      This is an automated security notification.
                    </p>

                  </td>
                </tr>

              </table>


              <!-- Copyright -->
              <p
                style="
                  margin:18px 0 0 0;
                  color:#9ca3af;
                  font-size:10px;
                  text-align:center;
                "
              >
                © ${new Date().getFullYear()} All Rights Reserved.
              </p>

            </td>
          </tr>
        </table>

      </body>
    </html>
  `;
};

export default otpTemplate;
