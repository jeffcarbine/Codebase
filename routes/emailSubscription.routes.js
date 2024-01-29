import { addSubscribingUser } from "../apis/mailchimp.js";

export const post__emailSubscription = (req, res) => {
  const { firstName, lastName, email, tag } = req.body,
    tags = [tag];

  addSubscribingUser(firstName, lastName, email, tags, () => {
    res.status(200).send("Thank you! You have been subscribed.");
  });
};
