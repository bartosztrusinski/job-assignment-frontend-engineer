import { apiFetch } from "utils/apiFetch";

describe("apiFetch", () => {
  beforeEach(() => (global.fetch = jest.fn().mockResolvedValue({ ok: true })));
  afterEach(() => jest.resetAllMocks());

  it("adds API prefix and Authorization header when token is provided", async () => {
    await apiFetch("articles", { method: "GET" }, "auth-token");

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] = (global.fetch as jest.Mock).mock.calls[0];

    expect(requestUrl).toContain("/api/articles");
    expect(requestInit).toEqual(
      expect.objectContaining({
        method: "GET",
        headers: expect.any(Headers),
      })
    );

    const headers = requestInit.headers;
    expect(headers.get("Authorization")).toBe("Token auth-token");
  });

  it("does not overwrite existing Authorization header", async () => {
    const headers = new Headers({ Authorization: "Token some-token" });

    await apiFetch("/articles", { headers }, "auth-token");

    const [, requestInit] = (global.fetch as jest.Mock).mock.calls[0];
    expect(requestInit.headers.get("Authorization")).toBe("Token some-token");
  });
});
