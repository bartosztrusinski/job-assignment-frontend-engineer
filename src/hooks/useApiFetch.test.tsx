import { fireEvent, render, screen } from "@testing-library/react";
import { useAuth } from "contexts/AuthContext";
import { useApiFetch } from "hooks/useApiFetch";
import { apiFetch } from "utils/apiFetch";

jest.mock("contexts/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("utils/apiFetch", () => ({ apiFetch: jest.fn() }));

function TestComponent() {
  const apiFetch = useApiFetch();

  return (
    <button onClick={() => apiFetch("/profile", { method: "POST" })} type="button">
      Trigger
    </button>
  );
}

describe("useApiFetch", () => {
  afterEach(() => jest.resetAllMocks());

  it("forwards request details and current auth token to apiFetch", () => {
    (useAuth as jest.Mock).mockReturnValue({
      currentUser: { token: "auth-token" },
    });

    render(<TestComponent />);
    fireEvent.click(screen.getByRole("button", { name: "Trigger" }));
    expect(apiFetch).toHaveBeenCalledWith("/profile", { method: "POST" }, "auth-token");
  });
});
