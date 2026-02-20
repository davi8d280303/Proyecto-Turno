import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

test("INT-05: el formulario no se envía si los campos están vacíos", async () => {
  const user = userEvent.setup();
  render(<Home />);

  const boton = screen.getByRole("button", { name: /enviar al sistema/i });

  await user.click(boton);

  const emailInput = screen.getByLabelText(/correo electrónico/i);
  const passwordInput = screen.getByLabelText(/contraseña/i);

  expect(emailInput).toBeInvalid();
  expect(passwordInput).toBeInvalid();
});
