import request from "supertest";
import { GenericContainer } from "testcontainers";
import app from "../../src/app.js";

let pg, redis, server;

beforeAll(async () => {
  pg = await new GenericContainer("postgres", "15-alpine")
          .withEnv("POSTGRES_PASSWORD", "postgres")
          .withEnv("POSTGRES_DB", "dungeondirectory_test")
          .withExposedPorts(5432).start();

  redis = await new GenericContainer("redis", "7-alpine")
            .withExposedPorts(6379).start();

  process.env.DATABASE_URL = `postgres://postgres:postgres@localhost:${pg.getMappedPort(5432)}/dungeondirectory_test`;
  process.env.REDIS_URL    = `redis://localhost:${redis.getMappedPort(6379)}`;

  server = app.listen(0);
});

afterAll(async () => {
  await pg.stop();
  await redis.stop();
  server.close();
});

test("GET /api/status returns 200", async () => {
  const res = await request(server).get("/api/status");
  expect(res.statusCode).toBe(200);
});
