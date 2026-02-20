import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

test("INT-02: Tab mueve el foco al campo contraseña", async () => {
  render(<Home />);
  const user = userEvent.setup();

  const emailInput = screen.getByLabelText(/correo electrónico/i);
  expect(emailInput).toHaveFocus();

  await user.tab();

  const passwordInput = screen.getByLabelText(/contraseña/i);
  expect(passwordInput).toHaveFocus();
});
