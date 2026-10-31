import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

// Each process loads the actual client once with build-style environment values.
// Intercept fetch before import so Supabase cannot reach any external service.
function readWithKeys(mode: string, publishable: string, legacy: string) {
  const output = execFileSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", `
    const requests = [];
    globalThis.fetch = async (url, init) => {
      requests.push({ url: String(url), key: new Headers(init?.headers).get("apikey") });
      return Response.json([]);
    };
    const { getSupabase, isSupabaseConfigured } = await import("./lib/supabase/client.ts");
    if (!isSupabaseConfigured) {
      console.log(JSON.stringify({ configured: false, requests }));
    } else {
      const { error } = await getSupabase().from("auditors").select("*");
      if (error) throw error;
      console.log(JSON.stringify({ configured: true, requests }));
    }
  `], {
    cwd: process.cwd(), encoding: "utf8",
    env: { ...process.env, NEXT_PUBLIC_DATA_MODE: mode,
      NEXT_PUBLIC_SUPABASE_URL: "https://database.example.invalid",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: publishable,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: legacy },
    timeout: 15_000,
  });
  return JSON.parse(output.trim());
}

test("live Supabase reads work with only a publishable key", () => {
  const result = readWithKeys("live", "sb_publishable_synthetic", "");
  assert.equal(result.configured, true);
  assert.equal(result.requests.length, 1);
  assert.equal(result.requests[0].key, "sb_publishable_synthetic");
});

test("publishable key takes precedence while legacy anon key remains supported", () => {
  assert.equal(readWithKeys("live", "sb_publishable_synthetic", "legacy-synthetic").requests[0].key, "sb_publishable_synthetic");
  assert.equal(readWithKeys("live", "", "legacy-synthetic").requests[0].key, "legacy-synthetic");
  assert.equal(readWithKeys("live", "", "").configured, false);
});

test("prototype remains offline even when both live keys are provided", () => {
  const result = readWithKeys("prototype", "sb_publishable_synthetic", "legacy-synthetic");
  assert.equal(result.configured, true);
  assert.deepEqual(result.requests, []);
});
