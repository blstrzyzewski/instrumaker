import React, { Fragment, useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Navbar from "./navbar";

import "rc-slider/assets/index.css";
import { Switch, Slider } from "antd";
import "antd/dist/antd.css";

const keys = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
export default function Settings() {
  console.log(localStorage.getItem("tempo"));
  const [key, setKey] = useState(
    localStorage.getItem("key") == null ? "random" : localStorage.getItem("key")
  );
  const [tempo, setTempo] = useState(
    localStorage.getItem("tempo") == null
      ? [110, 150]
      : [
          parseInt(localStorage.getItem("tempo").split(",")[0]),
          parseInt(localStorage.getItem("tempo").split(",")[1]),
        ]
  );
  const [simple, setSimple] = useState(
    localStorage.getItem("simple") == null
      ? false
      : localStorage.getItem("simple") === "true"
  );

  function selectHandler(event) {}
  console.log("here", localStorage.getItem("key") == null);
  useEffect(() => {
    localStorage.setItem("tempo", tempo);
    localStorage.setItem("simple", simple);
    localStorage.setItem("key", key);
    console.log(tempo);
  }, [key, tempo, simple]);

  return (
    <Fragment>
      <Navbar />

      <h2 className="settings-h3" style={{ color: "white", marginLeft: "5%" }}>
        Keys
      </h2>
      <div className="settings-div">
        <Grid doubling columns={13} className="key-grid">
          {keys.map((item) => {
            return (
              <Grid.Column key={item} onClick={selectHandler}>
                <h3
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "10px",
                  }}
                  className={key == item ? "bordered" : "unbordered"}
                  onClick={() => {
                    setKey(item);
                  }}
                >
                  {item}
                </h3>
              </Grid.Column>
            );
          })}
        </Grid>
      </div>
      <h2 className="settings-h3" style={{ color: "white", marginLeft: "5%" }}>
        Tempo
      </h2>

      <div className="settings-div">
        {" "}
        <Slider
          range
          max={150}
          min={110}
          defaultValue={tempo}
          onAfterChange={(input) => {
            setTempo(input);
          }}
        />
      </div>
      <h2 className="settings-h3" style={{ color: "white", marginLeft: "5%" }}>
        Simple mode
      </h2>
      <div className="settings-div">
        <Switch
          size="large"
          defaultChecked={simple}
          onClick={() => setSimple(!simple)}
        />
      </div>
    </Fragment>
  );
}
