import { Slider, Switch } from "antd";
import React from "react";
import "antd/dist/antd.css";
class Slider2 extends React.Component {
  state = {
    disabled: false,
  };

  handleDisabledChange = (disabled) => {
    this.setState({ disabled });
  };
  handleChange = (input) => {
    console.log(input);
  };
  render() {
    const { disabled } = this.state;
    return (
      <>
        <Slider range />
      </>
    );
  }
}
export default Slider2;
