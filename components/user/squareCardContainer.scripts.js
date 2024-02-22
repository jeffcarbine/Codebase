import style from "../../../styles/_squareCardContainer.css.js";

import("https://web.squarecdn.com/v1/square.js").then(() => {
  const appId = "sq0idp-h35ZHdbbUCIUT1ozPQaBWQ",
    locationId = "SAD2S9F6HV32Z";

  // initialize the card
  async function initializeCard(payments) {
    const card = await payments.card({
      style,
    });
    await card.attach("#card-renderer");

    // remove the loading class from the card container
    const cardContainer = document.getElementById("card-renderer");
    cardContainer.classList.remove("initializing");

    return card;
  }

  // create the payment
  async function createPayment(token) {
    // this is where we send the token to the server

    const body = JSON.stringify({
      token,
    });

    // now, check to see that the fields are valid before sending
    if (true) {
      // await the payment response
      const paymentResponse = await fetch("/test-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      // if the response is ok, return the json
      if (paymentResponse.ok) {
        return paymentResponse;
      } else {
        // set the errorBody
        const errorBody = await paymentResponse.text();
        // throw error in event of an error
        throw new Error(errorBody);
      }
    } else {
      throw new Error(
        "Please make sure that all the input fields are filled out correctly and try again."
      );
    }
  }

  // tokenize the payment method
  async function tokenize(paymentMethod) {
    const tokenResult = await paymentMethod.tokenize();
    if (tokenResult.status === "OK") {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
      }

      throw new Error(errorMessage);
    }
  }

  if (!window.Square) {
    throw new Error("Square.js failed to load properly");
  }

  let payments;

  try {
    payments = window.Square.payments(appId, locationId);
  } catch {
    console.error("Square credentials are invalid. Please try again later.");
    return;
  }

  let card;

  try {
    card = initializeCard(payments);
  } catch (e) {
    console.error("Initializing Card failed", e);
    return;
  }

  // Checkpoint 2.
  async function handlePaymentMethodSubmission(event, paymentMethod) {
    event.preventDefault();

    try {
      const token = await tokenize(paymentMethod);
      const paymentResults = await createPayment(token);

      console.debug("Payment Success", paymentResults);
    } catch (e) {
      console.error(e.message);
    }
  }

  // card button for disabling/enabling
  const submit = document.getElementById("submitCardData");
  submit.addEventListener("click", async function (event) {
    await handlePaymentMethodSubmission(event, card);
  });
});
