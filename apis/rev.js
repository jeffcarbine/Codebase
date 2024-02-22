import * as dotenv from "dotenv";
dotenv.config();
import request from "request";

const revClientKey = process.env.REVCLIENTAPIKEY,
  revUserKey = process.env.REVUSERAPIKEY,
  revWorkspaceId = process.env.REVWORKSPACEID;

const revRequest = ({ url, callback, form, sandbox = true }) => {
  request.post(
    {
      url: `https://api.rev.com/api/v1/${url}${
        sandbox ? "?sandbox_mode=true" : ""
      }`,
      headers: {
        Authorization: `Rev ${revClientKey}:${revUserKey}`,
      },
      form,
    },
    (err, httpResponse, str) => {
      if (err) {
        callback(err);
      } else {
        const response = JSON.parse(str);
        callback(null, response);
      }
    }
  );
};

export const revPlaceOrder = ({
  client_ref,
  audio_length_seconds,
  external_link,
}) => {
  revRequest({
    url: "orders",
    form: {
      client_ref,
      automated_transcription_options: {
        inputs: [
          {
            audio_length_seconds,
            external_link,
          },
        ],
      },
      workspace_id: revWorkspaceId,
    },
    callback: (err, response) => {},
  });
};

export const revRetrieveOrder = {};

export const get__episodes_transcript = (req, res) => {
  // get the transcript value from query string
  const attachment = req.query.attachment;

  request.get(
    {
      url: `https://api.rev.com/api/v1/attachments/${attachment}/content.pdf`,
      headers: {
        Authorization: `Rev ${revClientKey}:${revUserKey}`,
      },
    },
    (err, http, response) => {
      if (err) {
        callback(err);
      } else {
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=some_file.pdf",
          "Content-Length": response.length,
        });
        res.end(response);
      }
    }
  );
};
