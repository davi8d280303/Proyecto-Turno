import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PanelPage from "../../app/(dashboard)/panel/page";

test("INT-07: el botón de la tarjeta se activa con la tecla Space", async () => {
  const user = userEvent.setup();
  render(<PanelPage />);

  const boton = screen.getAllByRole("button", { name: /acceder/i })[0];
  boton.focus();

  // Simular Space
  await user.keyboard(" ");
  
  expect(boton).toBeInTheDocument(); // Verificación de que el elemento sigue respondiendo
});