import React from "react";
import { render } from "@testing-library/react";
import About from "../Components/about";
test("renders about", () => {
  const { getAllByText } = render(<About />);
  const linkElements = getAllByText(/About/i);
  linkElements.forEach((linkElement) => {
    expect(linkElement).toBeInTheDocument();
  });
});
