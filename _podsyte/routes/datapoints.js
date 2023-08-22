import async from "async";
import Dataset from "../models/Dataset.js";
import Datapoint from "../models/Datapoint.js";
import Page from "../models/Page.js";
import { uploadBase64ToS3 } from "../../apis/s3.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { datapointList } from "../models/datapointList.js";
import { mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const cloudfrontURL = process.env.CLOUDFRONTURL;

export const post__admin_datapoints = (req, res, next) => {
  // get the values from the body
  const body = req.body,
    type = req.body.type,
    name = req.body.name,
    pageId = req.body.pageId,
    _id = req.body.id,
    datapointId = req.body.datapointId,
    global = req.body.global,
    active = req.body.active,
    accordionOpen = req.body.accordionOpen;

  // handle sending image to s3
  const uploadToS3 = (body, callback) => {
    // generate a unique filename string
    const uniqueString = uuidv4();

    // upload via this function
    uploadBase64ToS3(
      body.base64Image,
      uniqueString,
      (err, filename, response) => {
        if (err) {
          console.log(err);
        } else {
          // assign the full path to the image as the src property
          body.image = { src: cloudfrontURL + filename };

          // callback to waterfall
          callback(null);
        }
      }
    );
  };

  async.waterfall(
    [
      // step 1: upload image to s3 if applicable
      (callback) => {
        // console.log("made it to upload stage");
        if (
          type === "image" &&
          body.base64Image !== undefined &&
          body.base64Image !== "" &&
          body.base64Image.includes("data:image")
        ) {
          uploadToS3(body, callback);
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
              if (
                body.base64Image !== undefined &&
                body.base64Image !== "" &&
                body.base64Image.includes("data:image")
              ) {
                datapoint.image = body.image;
              } else {
                datapoint.image = { src: body.base64Image };
              }

              datapoint.image.alt = body.alt;
              break;
            case "group":
              datapoint.groupType = body.groupType || "";
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
          console.log(_id);
          console.log(datapoint);
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
          console.log(datapoint);
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

  // start by creating the datapoint so we have access
  // to its id at point of file upload, if applicable
  // async.waterfall(
  //   [
  //     (callback) => {
  //       let datapoint = {
  //         name,
  //         type,
  //       };

  //       // start by formatting the body
  //       switch (type) {
  //         case "text":
  //           datapoint.text = body.text;
  //           break;
  //         case "html":
  //           datapoint.html = body.html;
  //           break;
  //         case "image":
  //           datapoint.image = {
  //             alt: body.alt,
  //           };
  //           break;
  //       }

  //       // if global isn't undefined, then we need
  //       // to pass the global value
  //       if (global !== undefined) {
  //         datapoint.global = global;
  //       }

  //       // note: groups don't have any special
  //       // values outside of name upon creation,
  //       // so we don't need to modify the datapoint variable

  //       callback(null, datapoint);
  //     },
  //     (datapoint, callback) => {
  //       if (_id) {
  //         // then we are updating a preexisting datapoint
  //         Datapoint.findOneAndUpdate(
  //           { _id },
  //           { $set: datapoint },
  //           { new: true }
  //         ).exec((err, newDatapoint) => {
  //           console.log(newDatapoint);

  //           if (err) {
  //             return res.status(500).send(err);
  //           } else {
  //             callback(null, newDatapoint);
  //           }
  //         });
  //       } else {
  //         // then we are creating a new datapoint
  //         Datapoint.create(datapoint, (err, newDatapoint) => {
  //           if (err) {
  //             callback(err);
  //           } else {
  //             callback(null, newDatapoint);
  //           }
  //         });
  //       }
  //     },
  //     (newDatapoint, callback) => {
  //       if (body.type === "image") {
  //         uploadToS3(body, newDatapoint._id, (path) => {
  //           // then we need to add the src to this datapoint
  //           Datapoint.findOneAndUpdate(
  //             { _id: newDatapoint._id },
  //             { $set: { image: { src: path } } },
  //             { new: true }
  //           ).exec((err, newNewDatapoint) => {
  //             console.log(newNewDatapoint);
  //             callback(null, newNewDatapoint);
  //           });
  //         });
  //       } else {
  //         callback(null, newDatapoint);
  //       }
  //     },
  //     (newDatapoint, callback) => {
  //       const newDatapointId = newDatapoint._id.toString();

  //       if (pageId) {
  //         // then this datapoint is being added to a page
  //         Page.findOneAndUpdate(
  //           {
  //             _id: pageId,
  //           },
  //           {
  //             $addToSet: {
  //               datapoints: newDatapointId,
  //             },
  //           },
  //           {
  //             new: true,
  //           }
  //         ).exec((err, dataset) => {
  //           if (err) {
  //             callback(err);
  //           } else {
  //             return res.status(200).send();
  //           }
  //         });
  //       } else if (datapointId) {
  //         // then this datapoint is being added to a group
  //         Datapoint.findOneAndUpdate(
  //           {
  //             _id: datapointId,
  //           },
  //           {
  //             $addToSet: {
  //               group: newDatapointId,
  //             },
  //           },
  //           {
  //             new: true,
  //           }
  //         ).exec((err, dataset) => {
  //           if (err) {
  //             callback(err);
  //           } else {
  //             return res.status(200).send();
  //           }
  //         });
  //       } else {
  //         // then it's a global datapoint and we can
  //         // just return 200
  //         return res.status(200).send();
  //       }
  //     },
  //   ],
  //   (err) => {
  //     return res.status(500).send(err);
  //   }
  // );
};

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
