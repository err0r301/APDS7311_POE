import React, { useState } from "react";

const PaymentForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [provider, setProvider] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset any previous error messages

    // Basic validation
    if (!amount || !currency || !provider || !recipientAccount || !swiftCode) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Retrieve the auth token from localStorage
      const token = localStorage.getItem("token");

      // Send payment details to the backend
      const response = await fetch(
        "https://localhost:4000/api/payment/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            currency,
            provider,
            recipientAccount,
            swiftCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit payment details");
      }

      // Log payment details on successful submission
      console.log("Payment details submitted:", {
        amount,
        currency,
        provider,
        recipientAccount,
        swiftCode,
      });

      // Clear the form
      setAmount("");
      setCurrency("");
      setProvider("");
      setRecipientAccount("");
      setSwiftCode("");
      setError("");
      setCurrentStep(0); // Reset to the first step of the form
    } catch (error) {
      setError(error.message);
    }
  };

  const steps = [
    {
      title: "Payment Info",
      subtitle: "Enter your payment details",
      fields: (
        <>
          <div>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Currency:
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Provider:
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                required
              />
            </label>
          </div>
        </>
      ),
      isValid: () => amount && currency && provider,
    },
    {
      title: "Recipient Info",
      subtitle: "Enter recipient details",
      fields: (
        <>
          <div>
            <label>
              Recipient account number:
              <input
                type="text"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Swift Code:
              <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                required
              />
            </label>
          </div>
        </>
      ),
      isValid: () => recipientAccount && swiftCode,
    },
    {
      title: "Checkout",
      subtitle: "Confirm your details",
      fields: (
        <>
          <p>Amount paid: {amount}</p>
          <p>Currency: {currency}</p>
          <p>Provider: {provider}</p>
          <p>Recipient account number: {recipientAccount}</p>
          <p>Swift Code: {swiftCode}</p>
        </>
      ),
      isValid: () => true, // No additional validation needed for checkout
    },
  ];

  const nextStep = () => {
    if (!animating && currentStep < steps.length - 1) {
      setAnimating(true);
      const nextStep = currentStep + 1;

      setTimeout(() => {
        setCurrentStep(nextStep);
        setAnimating(false);
      });
    }
  };

  const prevStep = () => {
    if (!animating && currentStep > 0) {
      setAnimating(true);
      const prevStep = currentStep - 1;

      setTimeout(() => {
        setCurrentStep(prevStep);
        setAnimating(false);
      });
    }
  };

  return (
    <form
      id="msform"
      onSubmit={
        currentStep === steps.length - 1
          ? handleSubmit
          : (e) => e.preventDefault()
      }
    >
      <ul id="progressbar">
        {steps.map((step, index) => (
          <li key={index} className={index <= currentStep ? "active" : ""}>
            {step.title}
          </li>
        ))}
      </ul>
      <fieldset className={`fieldset ${animating ? "animating" : ""}`}>
        <h2 className="fs-title">{steps[currentStep].title}</h2>
        <h3 className="fs-subtitle">{steps[currentStep].subtitle}</h3>
        {steps[currentStep].fields}
        <input
          type="button"
          value="Previous"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="previous action-button"
        />
        {currentStep === steps.length - 1 ? (
          <input
            type="submit" // Change Next button to submit button on the last step
            value="Confirm"
            className="next action-button"
          />
        ) : (
          <input
            type="button"
            value="Next"
            onClick={nextStep}
            disabled={!steps[currentStep].isValid()}
            className="next action-button"
          />
        )}
      </fieldset>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
    </form>
  );
};

export default PaymentForm;
