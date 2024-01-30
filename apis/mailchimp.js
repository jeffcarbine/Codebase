import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMPAPIKEY,
  server: process.env.MAILCHIMPSERVER,
});

const listId = process.env.MAILCHIMPLISTID;

export const addSubscribingUser = async (
  FNAME,
  LNAME,
  email,
  tags = [],
  callback
) => {
  const email_address = email.toLowerCase();

  const response = await mailchimp.lists.setListMember(listId, email_address, {
    email_address,
    status_if_new: "subscribed",
    tags,
    merge_fields: {
      FNAME,
      LNAME,
    },
  });

  callback(response.id);
};
