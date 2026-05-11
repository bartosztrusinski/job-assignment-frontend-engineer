import { render, screen } from "@testing-library/react";
import { useAuth } from "contexts/AuthContext";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "components/Navbar";

jest.mock("contexts/AuthContext", () => ({ useAuth: jest.fn() }));

describe("Navbar", () => {
  it("shows guest navigation when user is not logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({ currentUser: null });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("shows authenticated navigation when user is logged in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: {
        username: "jake",
        image: "",
      },
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("jake")).toBeInTheDocument();
  });
});
