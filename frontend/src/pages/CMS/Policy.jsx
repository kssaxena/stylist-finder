import React from "react";

const Policy = () => {
  const sections = [
    {
      title: "1. Payment Gateway",
      content:
        "Cute & Glow uses Razorpay as its authorized payment gateway to securely process online payments. Payment processing is subject to Razorpay's systems and applicable banking network rules.",
    },

    {
      title: "2. Accepted Payment Methods",
      content: (
        <>
          <p className="mb-3 font-semibold">Customers may pay using:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>UPI</li>
            <li>Credit Cards</li>
            <li>Debit Cards</li>
            <li>Net Banking</li>
            <li>Supported Wallets</li>
            <li>EMI (where offered by the payment provider)</li>
          </ul>
        </>
      ),
    },

    {
      title: "3. Payment Security",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Transactions are encrypted using industry-standard SSL/TLS security.
          </li>

          <li>
            Card authentication may require OTP or 3D Secure verification.
          </li>

          <li>
            Sensitive payment information is securely processed through Razorpay
            and is not intentionally stored by Cute & Glow unless required for
            lawful business purposes.
          </li>
        </ul>
      ),
    },

    {
      title: "4. Payment Confirmation",
      content:
        "A booking or order is confirmed only after successful payment authorization and confirmation received from Razorpay and/or the issuing bank.",
    },

    {
      title: "5. Failed or Pending Transactions",
      content: (
        <>
          <p className="mb-3 font-semibold">
            If payment is deducted but confirmation is not received:
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              The transaction may remain pending until bank reconciliation.
            </li>

            <li>
              Customers should avoid making duplicate payments until the payment
              status is verified.
            </li>

            <li>
              Eligible refunds for failed transactions are processed according
              to Razorpay, the customer's bank, and applicable payment network
              timelines.
            </li>
          </ul>
        </>
      ),
    },

    {
      title: "6. Refund Processing",
      content:
        "Approved refunds will be credited to the original payment method. Processing times may vary depending on the payment instrument and banking systems.It may takes time of 7 to 10 days to process and settle the refund amount.",
    },

    {
      title: "7. Chargebacks & Fraud",
      content:
        "Cute & Glow reserves the right to investigate suspicious or fraudulent transactions and may suspend, cancel, or refuse services or orders where fraud, misuse, or unauthorized activity is reasonably suspected.",
    },

    {
      title: "8. Customer Responsibilities",
      content: (
        <>
          <p className="mb-3">Customers are responsible for:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Entering accurate payment details.</li>

            <li>
              Ensuring sufficient account balance or available credit limit.
            </li>

            <li>Keeping payment credentials confidential.</li>

            <li>
              Promptly reporting any unauthorized transaction to their bank and,
              where relevant, to Cute & Glow.
            </li>
          </ul>
        </>
      ),
    },

    {
      title: "9. Platform Responsibilities",
      content:
        "Cute & Glow will make reasonable efforts to provide secure payment processing and timely order updates. However, we are not responsible for delays caused by banks, payment networks, Razorpay, telecommunications failures, or other circumstances beyond our reasonable control.",
    },

    {
      title: "10. Contact",
      content: (
        <div className="">
          <p className="">
            For payment, booking, or order-related queries, customers may
            contact:
          </p>
          <div className="space-y-1">
            <p>
              <strong>Cute & Glow</strong>
            </p>

            <p>Operated by Clear Craft Pvt. Ltd.</p>

            <p>
              <strong>Website:</strong> https://cuteandglow.com
            </p>

            <p>
              <strong>Email:</strong> support@cuteandglow.com
            </p>

            <p>
              <strong>Phone:</strong> +91-9288225515
            </p>

            <p className="pt-3">
              By using this Platform, you acknowledge that you have read,
              understood, and agreed to these Terms & Conditions and the
              Razorpay Payment Policy.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-gray-100 min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="bg-[#8B2954] rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            Razorpay Payment Policy
          </h1>
        </div>

        {/* Policy Sections */}

        <div className="mt-10 space-y-6">
          {sections.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl duration-300 border-l-[6px] border-[#8B2954] p-6 md:p-8"
            >
              <h2 className="text-xl md:text-2xl font-bold text-[#8B2954] mb-5">
                {item.title}
              </h2>

              <div className="text-gray-700 leading-8 text-[15px] md:text-base">
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Policy;
