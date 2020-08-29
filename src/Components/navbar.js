import ReactDOM from "react-dom";
import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import Home from "./Home";
import Settings from "./settings";
import About from "./about";
export default function Navbar(props) {
  console.log("gggggggg", props);
  const [activePage, setActivePage] = useState(props.props);
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
          ReactDOM.render(<Home />, document.getElementById("root"));
          setActivePage("instrumaker");
        }}
      >
        Instrumaker
      </Menu.Item>
      <Menu.Item
        floated="right"
        name="About"
        name="about"
        active={"about" === activePage}
        onClick={() => {
          setActivePage("about");
          ReactDOM.render(<About />, document.getElementById("root"));
        }}
      >
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
