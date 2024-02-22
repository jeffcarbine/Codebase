import async from "async";
import request from "request";
import Member from "../../../premmio/models/Member.js";
import { getPatreonToken } from "../../apis/patreon.js";

export const archiveMembers = (campaignId, archiveAll = false) => {
  console.info("Beginning archive of Patreon patrons (this takes a while)");

  let count = 0;

  // get the current year and current month (zero-index) of today
  const today = new Date(),
    year = today.getFullYear(),
    month = today.getMonth();

  async.waterfall(
    [
      // step 1: get patreon access_token
      (callback) => {
        getPatreonToken(callback);
      },
      // step 5: get patreon members
      (patreon_access_token, callback) => {
        const getPatreonMembers = (patreonUrl) => {
          count = count + 1;

          console.info(`Pulling patrons from Patreon: page ${count}`);

          request(
            {
              url: patreonUrl,
              headers: {
                Authorization: "Bearer " + patreon_access_token,
              },
            },
            (err, result, body) => {
              if (err) {
                console.error(err);
              } else {
                body = JSON.parse(body);

                body.data.forEach((member) => {
                  const email = member.attributes.email;

                  const last_charge_date = new Date(
                      member.attributes.last_charge_date
                    ),
                    now = new Date();

                  // check to see if this member's pledge has been updated in the past hour
                  // or if we're archiving all members
                  if (
                    last_charge_date.getTime() >
                      now.getTime() - 60 * 60 * 1000 ||
                    archiveAll
                  ) {
                    console.info("Pledge charge detected, updating member");
                    // this is so we can blank out addresses if anyone removes their address
                    // from patreon ie: they don't want physical rewards
                    let address = {
                        addressee: "",
                        city: "",
                        country: "",
                        line_1: "",
                        line_2: "",
                        phone_number: "",
                        postal_code: "",
                        state: "",
                      },
                      phone;

                    if (member.relationships?.address?.data !== undefined) {
                      const addressId = member.relationships.address.data.id;

                      body.included.filter((obj) => {
                        if (obj.id === addressId) {
                          address = obj.attributes;
                          phone = obj.attributes.phone_number;
                        }
                      });
                    }

                    Member.findOneAndUpdate(
                      {
                        email,
                      },
                      {
                        $set: {
                          email,
                          phone,
                          address,
                          currentPledge:
                            member.attributes.currently_entitled_amount_cents,
                        },
                        $addToSet: {
                          pledgeHistory: {
                            year,
                            month,
                            pledge:
                              member.attributes.currently_entitled_amount_cents,
                          },
                        },
                      },
                      {
                        upsert: true,
                      }
                    ).exec((err) => {
                      if (err) {
                        console.error(err);
                      }
                    });
                  }
                });

                // // check to see if there is a next value
                if (body.links !== undefined && body.links.next !== undefined) {
                  getPatreonMembers(body.links.next);
                } else {
                  console.info(
                    `Finished pulling and archiving all Members from Patreon`
                  );
                }
              }
            }
          );
        };

        getPatreonMembers(
          `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=address&fields%5Bmember%5D=email,full_name,currently_entitled_amount_cents,last_charge_date&fields%5Btier%5D=amount_cents,created_at,description,discord_role_ids,edited_at,patron_count,published,published_at,requires_shipping,title,url&fields%5Baddress%5D=addressee,city,line_1,line_2,phone_number,postal_code,state,country&page%5Bcount%5D=1000`
        );
      },
    ],
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
};
