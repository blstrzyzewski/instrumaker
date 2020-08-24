import ReactDOM from "react-dom";
import React from "react";
import { Menu } from "semantic-ui-react";
import Home from "./Home";
export default function Navbar() {
  return (
    <Menu
      pointing
      secondary
      style={{
        backgroundColor: "#121212",
        borderBottom: "2px solid #000000",
      }}
      inverted={true}
    >
      <Menu.Item
        style={{ fontColor: "white !important" }}
        name="Instrumaker"
        active="Instrumaker"
        onClick={() => {
          ReactDOM.render(<Home />, document.getElementById("root"));
        }}
      >
        Instrumaker
      </Menu.Item>
      <Menu.Item floated="right" name="About">
        About
      </Menu.Item>
      <Menu.Item name="Settings">Settings</Menu.Item>
    </Menu>
  );
}
