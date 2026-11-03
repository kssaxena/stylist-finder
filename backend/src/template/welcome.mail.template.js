const welcomeTemplate = (name) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Welcome to Cute and Glow</title>
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
                max-width:620px;
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
                    padding:36px 40px;
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
                    Account Registration
                  </p>

                  <h1
                    style="
                      margin:10px 0 0 0;
                      color:#ffffff;
                      font-size:25px;
                      line-height:1.3;
                      font-weight:600;
                    "
                  >
                    Welcome to Cute and Glow
                  </h1>

                  <p
                    style="
                      margin:9px 0 0 0;
                      color:#d1d5db;
                      font-size:13px;
                      line-height:1.5;
                    "
                  >
                    Your account has been successfully created.
                  </p>

                </td>
              </tr>


              <!-- Content -->
              <tr>
                <td style="padding:42px 40px;">

                  <!-- Greeting -->
                  <p
                    style="
                      margin:0 0 10px 0;
                      font-size:16px;
                      color:#374151;
                    "
                  >
                    Dear <strong>${name}</strong>,
                  </p>

                  <p
                    style="
                      margin:0 0 25px 0;
                      font-size:14px;
                      line-height:1.8;
                      color:#6b7280;
                    "
                  >
                    We are pleased to welcome you to
                    <strong style="color:#374151;">Cute and Glow</strong>.
                    Your account has been successfully registered and is
                    ready to use.
                  </p>


                  <!-- Welcome Message -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="margin-bottom:28px;"
                  >
                    <tr>
                      <td
                        style="
                          padding:20px;
                          background:#f9fafb;
                          border:1px solid #e5e7eb;
                          border-radius:8px;
                        "
                      >

                        <p
                          style="
                            margin:0 0 8px 0;
                            color:#111827;
                            font-size:14px;
                            font-weight:bold;
                          "
                        >
                          Your account is ready
                        </p>

                        <p
                          style="
                            margin:0;
                            color:#6b7280;
                            font-size:13px;
                            line-height:1.7;
                          "
                        >
                          You can now access the services and features
                          available through your Cute and glow account.
                        </p>

                      </td>
                    </tr>
                  </table>


                  <!-- Closing -->
                  <p
                    style="
                      margin:0;
                      font-size:14px;
                      line-height:1.8;
                      color:#6b7280;
                    "
                  >
                    Thank you for choosing Cute and Glow. We look forward to
                    providing you with a seamless and reliable experience.
                  </p>

                  <p
                    style="
                      margin:25px 0 0 0;
                      font-size:14px;
                      line-height:1.7;
                      color:#374151;
                    "
                  >
                    Regards,<br />
                    <strong>Team Cute and Glow</strong>
                  </p>

                </td>
              </tr>


              <!-- Footer -->
              <tr>
                <td
                  style="
                    padding:25px 40px;
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
                    This is an automated account notification.
                    Please do not reply directly to this email.
                  </p>

                  <p
                    style="
                      margin:8px 0 0 0;
                      color:#9ca3af;
                      font-size:11px;
                    "
                  >
                    If you did not create this account, please contact
                    our support team immediately.
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
              © ${new Date().getFullYear()} Cute and Glow. All Rights Reserved.
            </p>

          </td>
        </tr>
      </table>

    </body>
  </html>
`;

export default welcomeTemplate;
