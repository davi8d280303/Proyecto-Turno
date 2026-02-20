import { render, screen } from "@testing-library/react";
import PanelPage from "../../app/(dashboard)/panel/page";

test("INT-08: el botón muestra feedback visual al recibir foco", () => {
  render(<PanelPage />);
  const boton = screen.getAllByRole("button", { name: /acceder/i })[0];

  boton.focus();

  // Cambia 'text-blue-600' por la clase que uses para el foco (ej. 'focus:ring-2')
  expect(boton).toHaveClass("text-blue-600"); 
});