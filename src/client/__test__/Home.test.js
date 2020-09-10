import React from "react";
import { render } from "@testing-library/react";
import Home from "../Components/Home";
test("renders home button", () => {
  const { getByText } = render(<Home />);
  const linkElement = getByText(/Make Instrumental/i);
  expect(linkElement).toBeInTheDocument();
});
