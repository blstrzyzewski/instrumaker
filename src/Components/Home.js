import React, { Fragment, useState } from "react";
import { Button } from "semantic-ui-react";
import Loader from "./loader";
import Track from "./track";
import Navbar from "./navbar";
import {
  getMelody,
  getDrums,
  unzipTracks,
  createMaster,
} from "./track-handler";
import ReactDOM from "react-dom";

function Home() {
  async function runButton() {
    setLoading(true);
    setButtonText("Generating lead");
    const res = await getMelody();
    console.log("res", res);
    const melody = res.data;
    let key = res.headers.key;
    let tempo = res.headers.tempo;
    setButtonText("Generating drums");
    const files = await getDrums(key, tempo);

    let tracks = await unzipTracks(files);
    tracks.melody = melody;
    tracks.master = await createMaster(melody, tracks.drums);
    tracks.key = key;
    tracks.tempo = tempo;
    ReactDOM.render(<Track props={tracks} />, document.getElementById("root"));
  }
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Make instrumental");
  return (
    <div style={{ overflow: "hidden", width: "100vw" }}>
      <Navbar />
      <div style={{ width: "80vw", marginLeft: "10vw" }}>
        <h1
          id="title-h1"
          style={{
            color: "white",
            fontSize: "6em",
            marginTop: "calc(50vh - 1.7em)",
          }}
        >
          Instru-maker
        </h1>
      </div>

      <Button
        outline
        secondary
        size="massive"
        style={{
          marginTop: "10vh",
          maxHeight: 62,
        }}
        onClick={() => {
          runButton();
        }}
      >
        {loading ? <Loader /> : <Fragment />}
        {buttonText}
      </Button>
    </div>
  );
}

export default Home;
