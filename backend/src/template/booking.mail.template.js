const serviceBookingTemplate = (
  name,
  serviceName,
  dateOfBooking,
  storeName,
  storeContactNumber,
) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Booking Confirmation</title>
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background-color:#f4f6f8;
          font-family:Arial, Helvetica, sans-serif;
          color:#1f2937;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="background-color:#f4f6f8;padding:40px 15px;"
        >
          <tr>
            <td align="center">

              <!-- Main Container -->
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  max-width:620px;
                  background:#ffffff;
                  border-radius:10px;
                  overflow:hidden;
                  border:1px solid #e5e7eb;
                "
              >

                <!-- Header -->
                <tr>
                  <td
                    style="
                      background:#0f172a;
                      padding:28px 35px;
                      text-align:center;
                    "
                  >
                    <div
                      style="
                        color:#ffffff;
                        font-size:22px;
                        font-weight:bold;
                        letter-spacing:0.5px;
                      "
                    >
                      Booking Confirmation
                    </div>

                    <div
                      style="
                        color:#cbd5e1;
                        font-size:13px;
                        margin-top:7px;
                      "
                    >
                      Your appointment has been successfully confirmed
                    </div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:35px;">

                    <p
                      style="
                        margin:0 0 8px 0;
                        font-size:15px;
                        color:#374151;
                      "
                    >
                      Dear ${name},
                    </p>

                    <p
                      style="
                        margin:0 0 25px 0;
                        font-size:15px;
                        line-height:1.7;
                        color:#4b5563;
                      "
                    >
                      Thank you for choosing our services. We are pleased to
                      confirm that your booking has been successfully scheduled.
                      Please find the booking details below.
                    </p>

                    <!-- Booking Details -->
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

                      <!-- Service -->
                      <tr>
                        <td
                          style="
                            padding:16px 18px;
                            background:#f8fafc;
                            border-bottom:1px solid #e5e7eb;
                            width:40%;
                            font-size:13px;
                            font-weight:bold;
                            color:#64748b;
                          "
                        >
                          SERVICE
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            border-bottom:1px solid #e5e7eb;
                            font-size:15px;
                            font-weight:bold;
                            color:#0f172a;
                          "
                        >
                          ${serviceName}
                        </td>
                      </tr>

                      <!-- Date -->
                      <tr>
                        <td
                          style="
                            padding:16px 18px;
                            background:#f8fafc;
                            border-bottom:1px solid #e5e7eb;
                            font-size:13px;
                            font-weight:bold;
                            color:#64748b;
                          "
                        >
                          DATE & TIME
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            border-bottom:1px solid #e5e7eb;
                            font-size:15px;
                            color:#1f2937;
                          "
                        >
                          ${dateOfBooking}
                        </td>
                      </tr>

                      <!-- Store -->
                      <tr>
                        <td
                          style="
                            padding:16px 18px;
                            background:#f8fafc;
                            border-bottom:1px solid #e5e7eb;
                            font-size:13px;
                            font-weight:bold;
                            color:#64748b;
                          "
                        >
                          LOCATION
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            border-bottom:1px solid #e5e7eb;
                            font-size:15px;
                            color:#1f2937;
                          "
                        >
                          ${storeName}
                        </td>
                      </tr>

                      <!-- Contact -->
                      <tr>
                        <td
                          style="
                            padding:16px 18px;
                            background:#f8fafc;
                            font-size:13px;
                            font-weight:bold;
                            color:#64748b;
                          "
                        >
                          CONTACT
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            font-size:15px;
                            color:#1f2937;
                          "
                        >
                          ${storeContactNumber}
                        </td>
                      </tr>

                    </table>

                    <!-- Confirmation Notice -->
                    <div
                      style="
                        margin-top:28px;
                        padding:18px 20px;
                        background:#f8fafc;
                        border-left:4px solid #0f172a;
                        border-radius:4px;
                      "
                    >
                      <p
                        style="
                          margin:0;
                          font-size:14px;
                          line-height:1.6;
                          color:#475569;
                        "
                      >
                        <strong style="color:#0f172a;">
                          Booking Status:
                        </strong>
                        Confirmed
                      </p>
                    </div>

                    <p
                      style="
                        margin:28px 0 0 0;
                        font-size:14px;
                        line-height:1.7;
                        color:#64748b;
                      "
                    >
                      We kindly request you to retain this email for your
                      records. Should you require any assistance regarding your
                      booking, please contact the service provider using the
                      contact information provided above.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td
                    style="
                      padding:24px 35px;
                      background:#f8fafc;
                      border-top:1px solid #e5e7eb;
                      text-align:center;
                    "
                  >

                    <p
                      style="
                        margin:0;
                        font-size:12px;
                        line-height:1.6;
                        color:#94a3b8;
                      "
                    >
                      This is an automated booking confirmation.
                      Please do not reply directly to this email.
                    </p>

                    <p
                      style="
                        margin:10px 0 0 0;
                        font-size:12px;
                        color:#94a3b8;
                      "
                    >
                      If you did not make this booking, please contact
                      the service provider immediately.
                    </p>

                  </td>
                </tr>

              </table>

              <!-- Copyright -->
              <p
                style="
                  margin:18px 0 0 0;
                  font-size:11px;
                  color:#94a3b8;
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

export default serviceBookingTemplate;
