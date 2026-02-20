import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

test("INT-01: el input de correo tiene foco al cargar", () => {
  render(<Home />);

  const emailInput = screen.getByLabelText(/correo electrónico/i);
  expect(emailInput).toHaveFocus();
});
