import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PanelPage from "../../app/(dashboard)/panel/page";

test("INT-06: el foco recorre las tarjetas del panel principal correctamente", async () => {
  render(<PanelPage />);
  const user = userEvent.setup();

  // El error nos dijo que hay 4 botones llamados "Acceder →"
  const botonesAcceder = screen.getAllByRole("button", { name: /acceder/i });

  // 1. Primer Tab: Debe ir al primer botón (Inventario)
  await user.tab(); 
  expect(botonesAcceder[0]).toHaveFocus();

  // 2. Segundo Tab: Debe ir al segundo botón (Préstamos)
  await user.tab();
  expect(botonesAcceder[1]).toHaveFocus();

  // 3. Verificación de Feedback Visual (Requisito de la actividad)
  // Asegúrate de que tus botones tengan clases como 'focus:ring'
  expect(botonesAcceder[0]).toHaveClass("text-blue-600"); 
});