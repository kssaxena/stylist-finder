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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Booking Confirmation</title>
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
                      Booking Notification
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
                      Booking Confirmed
                    </h1>

                    <p
                      style="
                        margin:8px 0 0 0;
                        color:#d1d5db;
                        font-size:13px;
                        line-height:1.5;
                      "
                    >
                      Your service appointment has been successfully confirmed.
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
                        margin:0 0 30px 0;
                        font-size:14px;
                        line-height:1.8;
                        color:#6b7280;
                      "
                    >
                      Thank you for choosing our services. We are pleased to
                      confirm your appointment. The details of your booking are
                      provided below for your reference.
                    </p>


                    <!-- Booking Summary -->
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
                          BOOKING DETAILS
                        </td>
                      </tr>


                      <!-- Service -->
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
                          ${serviceName}
                        </td>

                      </tr>


                      <!-- Date -->
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
                          Appointment
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            border-bottom:1px solid #e5e7eb;
                            color:#111827;
                            font-size:14px;
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
                            border-bottom:1px solid #e5e7eb;
                            color:#6b7280;
                            font-size:12px;
                            font-weight:bold;
                            text-transform:uppercase;
                          "
                        >
                          Service Provider
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
                          ${storeName}
                        </td>

                      </tr>


                      <!-- Contact -->
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
                          Contact
                        </td>

                        <td
                          style="
                            padding:16px 18px;
                            color:#111827;
                            font-size:14px;
                          "
                        >
                          ${storeContactNumber}
                        </td>

                      </tr>

                    </table>


                    <!-- Status -->
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
                            ✓ Booking Status: Confirmed
                          </p>

                          <p
                            style="
                              margin:6px 0 0 0;
                              color:#4b7c5a;
                              font-size:12px;
                              line-height:1.5;
                            "
                          >
                            Your appointment has been successfully scheduled.
                          </p>

                        </td>

                      </tr>
                    </table>


                    <!-- Important Information -->
                    <p
                      style="
                        margin:30px 0 0 0;
                        padding-top:25px;
                        border-top:1px solid #e5e7eb;
                        color:#6b7280;
                        font-size:13px;
                        line-height:1.7;
                      "
                    >
                      Please retain this email for your records. If you have
                      any questions regarding your appointment or require
                      assistance, please contact the service provider using
                      the contact information provided above.
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
                      This is an automated notification. Please do not reply
                      directly to this email.
                    </p>

                    <p
                      style="
                        margin:8px 0 0 0;
                        color:#9ca3af;
                        font-size:11px;
                        line-height:1.6;
                      "
                    >
                      If you did not authorize this booking, please contact
                      the service provider immediately.
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

export default serviceBookingTemplate;
