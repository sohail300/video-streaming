import React from "react";
import "./App.css";
import VideoJS from "./VideoJS";

const App = () => {
  const playerRef = React.useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        // src: "http://localhost:3002/video",
        // type: "video/mp4",
        src: "http://localhost:3002/uploads/courses/b84663d2-632b-42a2-b512-9cb73e09b571/index.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  return (
    <>
      <h2 style={{ width: "100%", textAlign: "center" }}>Video Player</h2>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
      {/* <video controls src='http://localhost:3000/video'/> */}
    </>
  );
};

export default App;
