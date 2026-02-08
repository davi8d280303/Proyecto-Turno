import { fireEvent, render, screen } from "@testing-library/react";
import Home from "../app/page";
jest.mock("next/navigation");

test("el botón se puede presionar", () => {
  render(<Home />);
  const button = screen.getByRole("button", {
    name: /enviar al sistema/i,
  });
  fireEvent.click(button);
  expect(button).toBeEnabled();
});
