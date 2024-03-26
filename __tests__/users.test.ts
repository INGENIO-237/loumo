import apiClient from ".";

describe("GET /api/users", () => {
  it("should return an array of users or an empty array", async () => {
    const response = await apiClient.get("/api/users");
    expect(response.status).toBe(200);
  });
});
