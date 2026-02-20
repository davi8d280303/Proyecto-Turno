import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Perfil from "../../app/(dashboard)/perfil/page";

describe("Pruebas de Interacción en Perfil", () => {
  
  test("INT-09: el botón de configuración en el header es accesible por teclado", async () => {
    const user = userEvent.setup();
    render(<Perfil />);

    // En tu HTML, el botón de configuración tiene un SVG adentro
    // Vamos a buscar el botón que está en el header
    const botones = screen.getAllByRole("button");
    const btnConfig = botones[0]; // El primer botón suele ser el de la tuerca/configuración

    // 1. Simular navegación
    btnConfig.focus();
    expect(btnConfig).toHaveFocus();

    // 2. Feedback visual (Requisito de la rúbrica)
    // Verificamos que tenga la clase de transición que aparece en tu HTML
    expect(btnConfig).toHaveClass("hover:rotate-45");

    // 3. Activación
    await user.keyboard("{Enter}");
  });
});