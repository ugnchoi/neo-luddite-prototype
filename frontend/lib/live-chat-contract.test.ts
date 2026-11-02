import assert from "node:assert/strict";
import { after, test } from "node:test";

// Synthetic transport only: exercise the real service and Zod contract, never a server.
process.env.NEXT_PUBLIC_DATA_MODE = "live";
process.env.NEXT_PUBLIC_API_BASE = "https://api.example.invalid";
const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });

test("live chat accepts upstream summary segments and preserves evidence without inventing cards", async () => {
  const payload = {
    message: {
      id: "answer-1", role: "assistant", order: 1,
      segments: [{ id: "summary-1", type: "summary", text: "확인이 필요한 답변입니다.", citations: ["source-1"] }],
    },
    meta: { engine: "synthetic", ragCaseRefs: ["source-1"], ragHits: 1, ragSource: "kb3" },
  };
  let calls = 0;
  globalThis.fetch = async (url, init) => {
    calls++;
    assert.equal(String(url), "https://api.example.invalid/api/chat?rag=false");
    assert.equal(init?.method, "POST");
    assert.deepEqual(JSON.parse(String(init?.body)), {
      conversationId: "chat-1", occupation: "general", history: [], userInput: { text: "테스트 질문" },
    });
    return Response.json(payload);
  };
  const { send } = await import("../services/chat");
  const answer = await send({ conversationId: "chat-1", occupation: "general", history: [], text: "테스트 질문", rag: false });
  assert.equal(calls, 1);
  assert.deepEqual(answer.message, payload.message);
  assert.equal(answer.message.uiBlocks, undefined);
  assert.equal(answer.meta.ragSource, "kb3");
});

test("live chat still rejects unknown segment types and reports server failures", async () => {
  const { send } = await import("../services/chat");
  const input = { conversationId: "chat-2", occupation: "general" as const, history: [], text: "테스트" };
  globalThis.fetch = async () => Response.json({
    message: { id: "a", role: "assistant", order: 1, segments: [{ id: "s", type: "unsupported", text: "text" }] }, meta: {},
  });
  await assert.rejects(send(input), /계약/);
  globalThis.fetch = async () => new Response("Service unavailable", { status: 503 });
  await assert.rejects(send(input), /503/);
});
