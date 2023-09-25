import async from "async";
import Dataset from "../models/Dataset.js";
import Datapoint from "../models/Datapoint.js";
import Page from "../models/Page.js";
import { uploadBase64ToS3 } from "../../apis/s3.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { datapointList } from "../models/datapointList.js";
import { mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import asyncLoop from "node-async-loop";

const cloudfrontURL = process.env.CLOUDFRONTURL;

// adding or editing a datapoint
export const post__admin_datapoints = (req, res, next) => {
  // get the values from the body
  const body = req.body,
    type = req.body.type,
    name = req.body.name,
    pageId = req.body.pageId,
    _id = req.body.id,
    datapointId = req.body.datapointId,
    global =
      req.body.pageId !== undefined ? req.body.pageId === "global" : undefined,
    active = req.body.active,
    accordionOpen = req.body.accordionOpen;

  // modifiable image
  let imageSrc = body.image; // default to this, but if we need to upload to s3, we'll change it on line 50

  async.waterfall(
    [
      // step 1: upload image to s3 if applicable
      (callback) => {
        // console.log("made it to upload stage");
        if (
          type === "image" &&
          body.image !== undefined &&
          body.image !== "" &&
          body.image.includes("data:image")
        ) {
          // upload via this function
          uploadBase64ToS3(body.image, (err, filename, response) => {
            if (err) {
              console.log(err);
            } else {
              // assign the full path to the image as the src property
              imageSrc = cloudfrontURL + "/" + filename;

              // callback to waterfall
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      },
      // step 2: set up the datapoint object
      (callback) => {
        // console.log("made it to format datapoint stage");
        // base datapoint object
        let datapoint = {};

        if (name !== undefined) {
          datapoint.name = name;
        }

        if (type !== undefined) {
          datapoint.type = type;
        }

        if (active !== undefined) {
          datapoint.active = active !== undefined;
        }

        if (type !== undefined) {
          // next, format the body depending on datapoint type
          switch (type) {
            case "text":
              datapoint.text = body.text;
              break;

            case "link":
              datapoint.link = {
                href: body.href,
                title: body.title,
              };
              break;

            case "html":
              datapoint.html = body.html;
              break;

            case "image":
              datapoint.image = {
                src: imageSrc,
                alt: body.alt,
              };

              break;

            case "person":
              datapoint.person = {
                nickname: body.nickname,
                pronouns: body.pronouns,
                job: body.job,
                description: body.description,
                bio: body.bio,
                playedBy: body.playedBy,
              };
              break;

            case "group":
              datapoint.groupType = body.groupType || "";
              datapoint.groupWildcard = body.groupWildcard || "";
          }

          // if global isn't undefined, then we need
          // to pass the global value
          if (global !== undefined) {
            datapoint.global = global;
          }
        }

        if (accordionOpen !== undefined) {
          datapoint.accordionOpen = accordionOpen;
        }

        callback(null, datapoint);
      },
      // step 3: create or update the datapoint
      (datapoint, callback) => {
        if (_id) {
          // then we are updating a preexisting datapoint
          Datapoint.findOneAndUpdate(
            { _id },
            { $set: datapoint },
            { new: true }
          ).exec((err, newDatapoint) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              // we're done at this point
              return res.status(200).send();
            }
          });
        } else {
          // then we are creating a new datapoint
          Datapoint.create(datapoint, (err, newDatapoint) => {
            if (err) {
              callback(err);
            } else {
              callback(null, newDatapoint);
            }
          });
        }
      },
      // step 4: add the datapoint to a page or group if applicable
      (newDatapoint, callback) => {
        // console.log("made it to updage page or group stage");

        const newDatapointId = newDatapoint._id.toString();

        // temp fix, I'll have to figure this out later
        if (pageId && pageId !== "global") {
          // then this datapoint is being added to a page
          Page.findOneAndUpdate(
            {
              _id: pageId,
            },
            {
              $addToSet: {
                datapoints: newDatapointId,
              },
            },
            {
              new: true,
            }
          ).exec((err, dataset) => {
            if (err) {
              callback(err);
            } else {
              return res.status(200).send();
            }
          });
        } else if (datapointId) {
          // then this datapoint is being added to a group
          Datapoint.findOneAndUpdate(
            {
              _id: datapointId,
            },
            {
              $addToSet: {
                group: newDatapointId,
              },
            },
            {
              new: true,
            }
          ).exec((err, dataset) => {
            if (err) {
              callback(err);
            } else {
              return res.status(200).send();
            }
          });
        } else {
          // then we're just editing an existing datapoint
          return res.status(200).send();
        }
      },
    ],
    (err) => {
      console.log(err);
      return res.status(500).send(err);
    }
  );
};

// remove a datapoint
export const post__admin_datapoints_remove = (req, res, next) => {
  const body = req.body,
    _id = body._id,
    parentId = body.parentId,
    parentModel = body.parentModel;

  if (parentModel !== "global") {
    let Parent;

    if (parentModel === "page") {
      Parent = Page;
    } else if (parentModel === "datapoint") {
      Parent = Datapoint;
    }

    Parent.findOneAndUpdate(
      {
        _id: parentId,
      },
      {
        $pull: {
          datapoints: _id,
          group: _id,
        },
      }
    ).exec((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.status(200).send();
      }
    });
  } else {
    Datapoint.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: {
          global: false,
        },
      }
    ).exec((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      } else {
        return res.status(200).send();
      }
    });
  }
};

export const post__admin_datapoints_addExisting = (req, res) => {
  const body = req.body,
    _id = body._id,
    parentId = body.parentId,
    parentModel = body.parentModel;

  console.log(parentModel);
  console.log(parentId);

  if (parentModel === "page") {
    Page.findOneAndUpdate(
      {
        _id: parentId,
      },
      {
        $addToSet: {
          datapoints: _id,
        },
      }
    ).exec((err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send();
      }
    });
  } else {
    Datapoint.findOneAndUpdate(
      {
        _id: parentId,
      },
      {
        $addToSet: {
          group: _id,
        },
      }
    ).exec((err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(200).send();
      }
    });
  }
};

export const post__admin_datapoints_retrieve = (req, res) => {
  const body = req.body,
    datapoints = [];

  // check to see whether we are getting global datapoints
  // or we are getting page datapoints
  const type = body.type,
    _id = body.pageId;

  if (type === "global") {
    // to make this play nice with the rest of the code,
    // we need to retrieve all the global datapoints, get
    // their ids, and then request them AGAIN below
    Datapoint.find({ global: true }).exec((err, datapoints) => {
      // create an array of all the datapoint ids
      const globalDatapointIds = datapoints.map((datapoint) => {
        return datapoint._id;
      });

      retrieveDatapoints(globalDatapointIds, datapoints, () => {
        return res.status(200).send(datapoints);
      });
    });
  } else if (type === "page") {
    Page.findOne({
      _id,
    }).exec((err, page) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        const pageDatapointIds = page.datapoints;

        retrieveDatapoints(pageDatapointIds, datapoints, () => {
          return res.status(200).send(datapoints);
        });
      }
    });
  }

  const retrieveDatapoints = (ids, parent, callback) => {
    if (ids.length === 0) {
      callback();
    } else {
      asyncLoop(
        ids,
        (datapointId, next) => {
          Datapoint.findOne({ _id: datapointId }).exec(
            (err, originalDatapoint) => {
              const datapoint = { ...originalDatapoint._doc };
              parent.push(datapoint);

              // check if the datapoint is a group
              if (datapoint.type === "group") {
                datapoint.datapoints = [];

                if (datapoint.group.length > 0) {
                  // then we need to retrieve the children datapoints
                  retrieveDatapoints(
                    datapoint.group,
                    datapoint.datapoints,
                    next
                  );
                } else {
                  next();
                }
              } else {
                next();
              }
            }
          );
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            callback();
          }
        }
      );
    }
  };
};

export const post__admin_datapoints_retrieve_all = (req, res) => {
  Datapoint.find({}).exec((err, datapoints) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(datapoints);
    }
  });
};
