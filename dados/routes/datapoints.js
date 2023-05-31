import async from "async";
import Dataset from "../models/Dataset.js";
import Datapoint from "../models/Datapoint.js";
import Page from "../models/Page.js";
import { uploadBase64ToS3 } from "../../apis/s3.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { datapointList } from "../models/Datapoint.js";
import { mongoose } from "mongoose";

const cloudfrontURL = process.env.CLOUDFRONTURL;

export const post__admin_datapoints = (req, res, next) => {
  console.log(req.body);

  // get the values from the body
  const body = req.body,
    type = req.body.type,
    name = req.body.name,
    pageId = req.body.pageId,
    _id = req.body._id,
    datapointId = req.body.datapointId;

  // get the value from the datapointList
  const datapointValid = datapointList.includes(type);

  if (datapointValid) {
    // handle sending image to s3
    const uploadToS3 = (body, callback) => {
      uploadBase64ToS3(
        body.src,
        body.pageId,
        camelize(body.name),
        (err, fileName, response) => {
          if (err) {
            console.log(err);
          } else {
            body.src = cloudfrontURL + fileName;
            callback(null);
          }
        }
      );
    };

    // start by creating the datapoint so we have access
    // to its id at point of file upload, if applicable
    async.waterfall(
      [
        (callback) => {
          let datapoint = {
            name,
            type,
          };

          // start by formatting the body
          switch (type) {
            case "text":
              datapoint.text = body.text;
              break;
            case "html":
              datapoint.html = body.html;
              break;
            case "image":
              datapoint.image = {
                src: body.src,
                alt: body.alt,
              };
              break;
          }

          // note: groups don't have any special
          // values outside of name upon creation,
          // so we don't need to modify the datapoint variable

          callback(null, datapoint);
        },
        (datapoint, callback) => {
          console.log(datapoint);

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
                callback(null, newDatapoint);
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
        (newDatapoint, callback) => {
          if (body.type === "image") {
            uploadToS3(body, newDatapoint._id, callback);
          } else {
            callback(null, newDatapoint);
          }
        },
        (newDatapoint, callback) => {
          const newDatapointId = newDatapoint._id.toString();

          if (pageId) {
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
            console.log("adding to group!");
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
          }
        },
      ],
      (err) => {
        return res.status(500).send(err);
      }
    );
  } else {
    return res.status(500).send("Datapoint type is invalid");
  }
};

export const post__admin_datapoints_remove = (req, res, next) => {
  const body = req.body,
    _id = body._id,
    pageId = body.pageId;

  console.log(body);

  Page.findOneAndUpdate(
    {
      _id: pageId,
    },
    {
      $pull: {
        datapoints: _id,
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
};

// export const post__admin_datapoints_retrieve = (req, res, next) => {
//   const datapointIds = req.body;

//   Datapoint.find({
//     _id: {
//       $in: datapointIds,
//     },
//   }).exec((err, datapoints) => {
//     if (err) {
//       return res.status(500).send(err);
//     } else {
//       return res.status(200).send(datapoints);
//     }
//   });
// };

// export const post__admin_datapoints_edit = (req, res, next) => {
//   const body = req.body,
//     type = body.type,
//     datasetId = body.datasetId,
//     name = body.name,
//     _id = body._id;

//   const newDatapoint = {
//     type,
//     datasetId,
//     name,
//   };

//   newDatapoint[type] = {};

//   for (let key in body) {
//     if (key !== "datasetId" && key !== "type") {
//       newDatapoint[type][key] = body[key];
//     }
//   }

//   async.waterfall(
//     [
//       (callback) => {
//         Datapoint.findOneAndUpdate(
//           {
//             _id,
//           },
//           {
//             $set: newDatapoint,
//           }
//         ).exec((err, datapoint) => {
//           if (err) {
//             callback(err);
//           } else {
//             callback(null, datapoint);
//           }
//         });
//       },
//       (datapoint) => {
//         Dataset.findOneAndUpdate(
//           {
//             _id: datasetId,
//           },
//           {
//             $addToSet: {
//               datapoints: datapoint._id,
//             },
//           },
//           {
//             new: true,
//           }
//         ).exec((err, dataset) => {
//           if (err) {
//             callback(err);
//           } else {
//             return res.status(200).send(dataset.datapoints);
//           }
//         });
//       },
//     ],
//     (err) => {
//       return res.status(500).send(err);
//     }
//   );
// };
