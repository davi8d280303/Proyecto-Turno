import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

test("INT-03: Tab mueve el foco al botón enviar", async () => {
  render(<Home />);
  const user = userEvent.setup();

  const emailInput = screen.getByLabelText(/correo electrónico/i);
  expect(emailInput).toHaveFocus();

  await user.tab(); // contraseña
  await user.tab(); // botón

  const boton = screen.getByRole("button", { name: /enviar al sistema/i });
  expect(boton).toHaveFocus();
});
