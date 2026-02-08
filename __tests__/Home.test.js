import { render, screen } from "@testing-library/react";

// Mock del router de Next.js
jest.mock("next/navigation");

import Home from "../app/page";

describe("Home page", () => {
  test("renderiza el contenido principal", () => {
    render(<Home />);
    const text = screen.getByText(/bienvenido de nuevo/i);
    expect(text).toBeInTheDocument();
  });
});
