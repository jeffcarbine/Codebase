import { addSubscribingUser } from "../apis/mailchimp.js";

export const post__emailSubscription = (req, res) => {
  const { firstName, lastName, email } = req.body;

  addSubscribingUser(firstName, lastName, email, () => {
    res.status(200).send("Thank you! You have been subscribed.");
  });
};
