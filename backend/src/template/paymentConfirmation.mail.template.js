const paymentConfirmationTemplate = ({
  name,
  amount,
  moduleName,
  transactionNumber,
  paymentDate,
}) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>Payment Confirmation</title>
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
                    padding:32px 40px;
                    text-align:left;
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
                    Payment Notification
                  </p>

                  <h1
                    style="
                      margin:10px 0 0 0;
                      color:#ffffff;
                      font-size:24px;
                      line-height:1.3;
                      font-weight:600;
                    "
                  >
                    Payment Confirmed
                  </h1>

                  <p
                    style="
                      margin:8px 0 0 0;
                      color:#d1d5db;
                      font-size:13px;
                      line-height:1.5;
                    "
                  >
                    Your payment has been successfully processed.
                  </p>

                </td>
              </tr>


              <!-- Content -->
              <tr>
                <td style="padding:40px;">

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
                      margin:0 0 28px 0;
                      font-size:14px;
                      line-height:1.8;
                      color:#6b7280;
                    "
                  >
                    Thank you for your payment. We are pleased to confirm
                    that your payment for
                    <strong style="color:#374151;">
                      ${moduleName}
                    </strong>
                    has been successfully received and processed.
                  </p>


                  <!-- Payment Status -->
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
                          padding:16px 18px;
                          background:#f0fdf4;
                          border:1px solid #bbf7d0;
                          border-radius:8px;
                        "
                      >

                        <p
                          style="
                            margin:0;
                            color:#166534;
                            font-size:13px;
                            font-weight:bold;
                          "
                        >
                          ✓ Payment Status: Successful
                        </p>

                        <p
                          style="
                            margin:6px 0 0 0;
                            color:#4b7c5a;
                            font-size:12px;
                            line-height:1.5;
                          "
                        >
                          Your payment has been successfully captured.
                        </p>

                      </td>
                    </tr>
                  </table>


                  <!-- Payment Details -->
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      border:1px solid #e5e7eb;
                      border-radius:8px;
                      overflow:hidden;
                    "
                  >

                    <!-- Section Header -->
                    <tr>
                      <td
                        colspan="2"
                        style="
                          padding:15px 18px;
                          background:#f9fafb;
                          border-bottom:1px solid #e5e7eb;
                          color:#111827;
                          font-size:13px;
                          font-weight:bold;
                          letter-spacing:0.3px;
                        "
                      >
                        PAYMENT DETAILS
                      </td>
                    </tr>


                    <!-- Module -->
                    <tr>

                      <td
                        width="38%"
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#6b7280;
                          font-size:12px;
                          font-weight:bold;
                          text-transform:uppercase;
                        "
                      >
                        Service
                      </td>

                      <td
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#111827;
                          font-size:14px;
                          font-weight:600;
                        "
                      >
                        ${moduleName}
                      </td>

                    </tr>


                    <!-- Transaction -->
                    <tr>

                      <td
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#6b7280;
                          font-size:12px;
                          font-weight:bold;
                          text-transform:uppercase;
                        "
                      >
                        Transaction ID
                      </td>

                      <td
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#111827;
                          font-size:14px;
                          word-break:break-all;
                        "
                      >
                        ${transactionNumber}
                      </td>

                    </tr>


                    <!-- Amount -->
                    <tr>

                      <td
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#6b7280;
                          font-size:12px;
                          font-weight:bold;
                          text-transform:uppercase;
                        "
                      >
                        Amount Paid
                      </td>

                      <td
                        style="
                          padding:16px 18px;
                          border-bottom:1px solid #e5e7eb;
                          color:#111827;
                          font-size:16px;
                          font-weight:bold;
                        "
                      >
                        ₹${Number(amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                    </tr>


                    <!-- Payment Date -->
                    <tr>

                      <td
                        style="
                          padding:16px 18px;
                          color:#6b7280;
                          font-size:12px;
                          font-weight:bold;
                          text-transform:uppercase;
                        "
                      >
                        Payment Date
                      </td>

                      <td
                        style="
                          padding:16px 18px;
                          color:#111827;
                          font-size:14px;
                        "
                      >
                        ${new Date(paymentDate).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>

                    </tr>

                  </table>


                  <!-- Record Notice -->
                  <p
                    style="
                      margin:30px 0 0 0;
                      padding-top:25px;
                      border-top:1px solid #e5e7eb;
                      color:#6b7280;
                      font-size:12px;
                      line-height:1.7;
                    "
                  >
                    Please retain this email as confirmation of your
                    transaction. If you have any questions regarding this
                    payment, please contact our support team and provide the
                    transaction ID mentioned above.
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
                    This is an automated payment notification.
                    Please do not reply directly to this email.
                  </p>

                  <p
                    style="
                      margin:8px 0 0 0;
                      color:#9ca3af;
                      font-size:11px;
                      line-height:1.6;
                    "
                  >
                    If you believe this transaction was not authorized by you,
                    please contact our support team immediately.
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
              © ${new Date().getFullYear()} Cue and Glow. All Rights Reserved.
            </p>

          </td>
        </tr>
      </table>

    </body>
  </html>
`;

export default paymentConfirmationTemplate;
