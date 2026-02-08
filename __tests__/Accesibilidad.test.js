import { render, screen } from "@testing-library/react";
jest.mock("next/navigation");
import Home from "../app/page";

test("el input de correo tiene label accesible", () => {
  render(<Home />);
  const emailInput = screen.getByLabelText(/correo electrónico/i);
  expect(emailInput).toBeInTheDocument();
});
