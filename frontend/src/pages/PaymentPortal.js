import { useEffect, useState } from "react";

const PaymentPortal = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://localhost:4000/api/payment/payments",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPayments(data); // Set state with all payment data
      } else {
        console.error("Failed to fetch payments");
      }
    };

    fetchPayments();
  }, []);

  const handleVerifyPayment = async (paymentId) => {
    const token = localStorage.getItem("token");

    // Optimistically update the status in the UI
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment._id === paymentId ? { ...payment, status: "Verified" } : payment
      )
    );

    const response = await fetch(
      `https://localhost:4000/api/payment/payments/verify/${paymentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to verify payment");
      // Optionally, revert the optimistic update in case of an error
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: "Pending" }
            : payment
        )
      );
    }
  };

  const handleRevertToPending = async (paymentId) => {
    const token = localStorage.getItem("token");

    // Optimistically update the status in the UI
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment._id === paymentId ? { ...payment, status: "Pending" } : payment
      )
    );

    const response = await fetch(
      `https://localhost:4000/api/payment/payments/revert/${paymentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to revert payment to pending");
      // Optionally, revert the optimistic update in case of an error
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: "Verified" }
            : payment
        )
      );
    }
  };

  const handleSubmitToSwift = async () => {
    const token = localStorage.getItem("token");
    const verifiedPayments = payments.filter(
      (payment) => payment.status === "Verified"
    );

    const response = await Promise.all(
      verifiedPayments.map((payment) =>
        fetch(
          `https://localhost:4000/api/payment/payments/submit/${payment._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
      )
    );

    if (response.every((res) => res.ok)) {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.status === "Verified"
            ? { ...payment, status: "Submitted" }
            : payment
        )
      );
    } else {
      console.error("Failed to submit verified payments");
    }
  };

  // Get only the pending payments for the first table
  const filteredPayments = payments.filter(
    (payment) => payment.status === "Pending"
  );

  // Get all verified payments for the second table
  const verifiedPayments = payments.filter(
    (payment) => payment.status === "Verified"
  );

  return (
    <div>
      <h2>Payment Portal</h2>
      <div className="group">
        <h3>Pending Payments</h3>

        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Recipient Account</th>
              <th>Swift Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.amount}</td>
                  <td>{payment.currency}</td>
                  <td>{payment.provider}</td>
                  <td>{payment.accountInfo.recipientAccount}</td>
                  <td>{payment.accountInfo.swiftCode}</td>
                  <td>
                    <button onClick={() => handleVerifyPayment(payment._id)}>
                      Verify
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No pending payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="group">
        <h3>Verified Payments</h3>
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Currency</th>
              <th>Provider</th>
              <th>Recipient Account</th>
              <th>Swift Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {verifiedPayments.length > 0 ? (
              verifiedPayments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.amount}</td>
                  <td>{payment.currency}</td>
                  <td>{payment.provider}</td>
                  <td>{payment.accountInfo.recipientAccount}</td>
                  <td>{payment.accountInfo.swiftCode}</td>
                  <td>
                    <button onClick={() => handleRevertToPending(payment._id)}>
                      Revert to Pending
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No verified payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {verifiedPayments.length > 0 && (
        <button onClick={handleSubmitToSwift}>Submit to Swift</button>
      )}
    </div>
  );
};

export default PaymentPortal;
