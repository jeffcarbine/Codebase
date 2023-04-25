import * as dotenv from "dotenv";
dotenv.config();

export const fetchYouTubePlaylist = (playlistId, callback) => {
  let videos = [];

  const getPlaylistPage = (nextPageToken = null) => {
    let youtubeUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" +
      playlistId +
      "&key=" +
      process.env.YOUTUBEAPIKEY;

    if (nextPageToken !== null) {
      youtubeUrl = youtubeUrl + "&pageToken=" + nextPageToken;
    }

    fetch(youtubeUrl)
      .then((response) => response.json())
      .then((data) => {
        videos = videos.concat(data.items);

        if (data.nextPageToken) {
          getPlaylistPage(data.nextPageToken);
        } else {
          // we need to remove all private videos
          videos = videos.filter((obj) => {
            return obj.snippet.title !== "Private video";
          });

          callback(videos);
        }
      });
  };

  getPlaylistPage();
};
