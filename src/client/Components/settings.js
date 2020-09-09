import React, { Fragment, useState, useEffect } from "react";

import { Grid } from "semantic-ui-react";
import Navbar from "./navbar";
import { Button } from "semantic-ui-react";
import "rc-slider/assets/index.css";
import { Switch, Slider } from "antd";
import "antd/dist/antd.css";

const keys = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
export default function Settings() {
  function resetSettings() {
    sessionStorage.removeItem("tempo");
    sessionStorage.removeItem("key");
    sessionStorage.removeItem("simple");
    setTempo([110, 150]);
    setSimple(false);
    setKey("random");
  }
  function Sliders() {
    return (
      <Fragment>
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
        <h2
          className="settings-h3"
          style={{ color: "white", marginLeft: "5%" }}
        >
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

  const [key, setKey] = useState(
    sessionStorage.getItem("key") == null
      ? "random"
      : sessionStorage.getItem("key")
  );
  const [tempo, setTempo] = useState(
    sessionStorage.getItem("tempo") == null
      ? [110, 150]
      : [
          parseInt(sessionStorage.getItem("tempo").split(",")[0]),
          parseInt(sessionStorage.getItem("tempo").split(",")[1]),
        ]
  );
  const [simple, setSimple] = useState(
    sessionStorage.getItem("simple") == null
      ? false
      : sessionStorage.getItem("simple") === "true"
  );

  function selectHandler(event) {}
  console.log("here", sessionStorage.getItem("key") == null);
  useEffect(() => {
    sessionStorage.setItem("tempo", tempo);
    sessionStorage.setItem("simple", simple);
    sessionStorage.setItem("key", key);
    console.log(tempo);
  }, [key, tempo, simple]);

  return (
    <Fragment>
      <Navbar props={"settings"} />

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

      <Sliders />
      <Button
        primary
        style={{
          marginLeft: "calc(50% - 75px)",
          marginTop: "50px",
          marginBottom: "20px",
        }}
        color="purple"
        size="large"
        onClick={() => {
          resetSettings();
        }}
      >
        {" "}
        Reset Settings
      </Button>
    </Fragment>
  );
}
