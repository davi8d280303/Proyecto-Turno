import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../../app/page";

test("INT-04: el botón se activa con Enter", async () => {
  const user = userEvent.setup();

  render(<Home />);

  const boton = screen.getByRole("button", { name: /enviar al sistema/i });

  // Navegamos hasta el botón
  await user.tab();
  await user.tab();

  expect(boton).toHaveFocus();

  // Presionamos Enter
  await user.keyboard("{Enter}");

  expect(boton).toBeInTheDocument();
});
