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

function parseSettings() {
  let output = {};
  if (sessionStorage.getItem("key")) {
    output.key = sessionStorage.getItem("key");
  } else {
    output.key = "random";
  }
  if (sessionStorage.getItem("tempo")) {
    output.tempoMin = parseInt(sessionStorage.getItem("tempo").split(",")[0]);
    output.tempoMax = parseInt(sessionStorage.getItem("tempo").split(",")[1]);
  } else {
    output.tempoMin = 110;
    output.tempoMax = 150;
  }
  if (sessionStorage.getItem("simple")) {
    output.simple = sessionStorage.getItem("simple") === "true";
  }
  return output;
}
function Home() {
  async function runButton() {
    const settings = parseSettings();
    setLoading(true);
    setButtonText("Generating lead");
    const res =
      settings.key != "random"
        ? await getMelody(
            settings.key,
            settings.tempoMin,
            settings.tempoMax,
            true
          )
        : await getMelody("", settings.tempoMin, settings.tempoMax);

    // const res = await getMelody();
    console.log("res", res);
    const melody = res.data;
    let key = res.headers.key;
    let tempo = res.headers.tempo;
    setButtonText("Generating drums");
    let files, tracks;
    if (settings.simple) {
      tracks = {};
      tracks.drums = await getDrums(key, tempo, true);
      tracks.simple = true;
    } else {
      try {
        files = await getDrums(key, tempo);
        tracks = await unzipTracks(files);
      } catch (error) {
        alert(error);
      }
    }
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
      <Navbar props={"instrumaker"} />
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
