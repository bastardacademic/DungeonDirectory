import { validatePassword } from "../../utils/passwordPolicy.js";

describe("validatePassword", () => {
  it("rejects weak password", async () => {
    await expect(validatePassword("abc123")).rejects.toThrow();
  });

  it("accepts strong password", async () => {
    await expect(validatePassword("Str0ng&UniquePassw0rd!")).resolves.toBe(true);
  });
});
