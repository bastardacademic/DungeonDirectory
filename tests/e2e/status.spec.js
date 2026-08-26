import { test, expect, request } from "@playwright/test";

test("GET /api/status returns 200", async () => {
  const req = await request.newContext();
  const res = await req.get("/api/status");
  expect(res.status()).toBe(200);
});
