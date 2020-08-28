import ReactDOM from "react-dom";
import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import Home from "./Home";
import Settings from "./settings";
export default function Navbar() {
  const [activePage, setActivePage] = useState("instrumaker");
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
        active={"instrumaker" === activePage}
        onClick={() => {
          setActivePage("instrumaker");
          ReactDOM.render(<Home />, document.getElementById("root"));
        }}
      >
        Instrumaker
      </Menu.Item>
      <Menu.Item floated="right" name="About">
        About
      </Menu.Item>

      <Menu.Item
        name="settings"
        active={"settings" === activePage}
        onClick={() => {
          setActivePage("settings");
          ReactDOM.render(<Settings />, document.getElementById("root"));
        }}
      >
        Settings
      </Menu.Item>
    </Menu>
  );
}
