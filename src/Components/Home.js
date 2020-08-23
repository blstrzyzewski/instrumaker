import React, { Fragment } from "react";
import { Button } from "semantic-ui-react";
import Track from "./track";
import {
  getMelody,
  getDrums,
  unzipTracks,
  createMaster,
} from "./track-handler";
import ReactDOM from "react-dom";

async function runButton() {
  const res = await getMelody();
  console.log("res", res);
  const melody = res.data;
  let key = res.headers.key;
  let tempo = res.headers.tempo;

  const files = await getDrums(key, tempo);

  let tracks = await unzipTracks(files);
  tracks.melody = melody;
  tracks.master = await createMaster(melody, tracks.drums);
  tracks.key = key;
  tracks.tempo = tempo;
  ReactDOM.render(<Track props={tracks} />, document.getElementById("root"));
}
function Home() {
  return (
    <div style={{ overflow: "hidden" }}>
      <h1
        style={{
          color: "white",
          fontSize: "6em",
          marginTop: "30vh",
          marginLeft: "calc(50% - 3.2em)",
        }}
      >
        Instru-maker
      </h1>
      {
        <Button
          outline
          secondary
          color="purple"
          size="massive"
          style={{ marginTop: "10vh", marginLeft: "40vw" }}
          onClick={runButton}
        >
          Make Intrumental
        </Button>
      }
    </div>
  );
}

export default Home;
