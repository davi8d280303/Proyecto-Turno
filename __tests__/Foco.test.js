import { render, screen } from "@testing-library/react";
import Home from "../app/page";
jest.mock("next/navigation");

test("el foco puede llegar al input de correo", () => {
  render(<Home />);
  const emailInput = screen.getByLabelText(/correo electrónico/i);
  emailInput.focus();
  expect(emailInput).toHaveFocus();
});
