import assert from "node:assert/strict";
import { after, test } from "node:test";

process.env.NEXT_PUBLIC_DATA_MODE = "prototype";
process.env.NEXT_PUBLIC_ENTRY_CHAT_MODE = "live";
process.env.NEXT_PUBLIC_API_BASE = "https://api.example.invalid";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://db.example.invalid";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "synthetic";
const originalFetch = globalThis.fetch;
after(() => { globalThis.fetch = originalFetch; });

const answer = {
  id: "server-answer", role: "assistant", order: 7,
  segments: [{ id: "summary", type: "summary", text: "업무 사용 목적을 알려 주세요.", citations: ["reference"], serverHint: { slot: "purpose" } }],
  uiBlocks: [{ kind: "evidence_checklist", title: "확인 자료", items: [{ label: "증빙", required: true, sourceId: "proof" }], serverRevision: 2 }],
  continuation: { retained: true },
};

test("entry-only live mode calls chat while expert Supabase reads stay local", async () => {
  const requests: string[] = [];
  globalThis.fetch = async (url) => {
    requests.push(String(url));
    assert.equal(String(url), "https://api.example.invalid/api/chat");
    return Response.json({ message: answer, meta: {} });
  };
  const { send } = await import("../services/chat");
  const result = await send({ conversationId: "test-chat", occupation: "clinic", history: [], text: "질문" });
  assert.deepEqual(result.message, answer);
  const { getSupabase } = await import("./supabase/client");
  const { error } = await getSupabase().from("auditors").select("*");
  assert.equal(error, null);
  assert.deepEqual(requests, ["https://api.example.invalid/api/chat"]);
});

test("raw assistant fields survive browser reload and the following history request", async () => {
  const { createEntryChatStore, messageText } = await import("./entry-chat");
  const { send } = await import("../services/chat");
  const values = new Map<string, string>();
  const storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); }, removeItem: (k: string) => { values.delete(k); } };
  const bodies: { history: unknown[] }[] = [];
  globalThis.fetch = async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ message: answer, meta: {} });
  };
  const respond: import("./entry-chat").EntryResponder = async (c) => (await send({
    conversationId: c.id, occupation: c.occupation, history: c.messages.slice(0, -1), text: messageText(c.messages.at(-1)!),
  })).message;
  const first = createEntryChatStore(storage, "populated", respond);
  const id = first.getState().create("guest");
  first.getState().setDraft(id, "guest", "첫 질문");
  assert.equal(await first.getState().send(id, "guest"), true);
  const restored = createEntryChatStore(storage, "populated", respond);
  await restored.persist.rehydrate();
  assert.deepEqual(restored.getState().conversations[0].messages[1], answer);
  restored.getState().setDraft(id, "guest", "추가 설명");
  await restored.getState().send(id, "guest");
  assert.deepEqual(bodies[1].history[1], answer);
});

test("congestion retains one unanswered question and explicit retry does not duplicate history", async () => {
  const { entryChatStore } = await import("./entry-chat-store");
  const bodies: { history: unknown[] }[] = [];
  globalThis.fetch = async (_url, init) => {
    bodies.push(JSON.parse(String(init?.body)));
    return Response.json({ message: answer, meta: { congested: bodies.length === 1 } });
  };
  const id = entryChatStore.getState().create("guest");
  entryChatStore.getState().setDraft(id, "guest", "혼잡 확인");
  assert.equal(await entryChatStore.getState().send(id, "guest"), false);
  assert.match(entryChatStore.getState().errors[id] ?? "", /혼잡/);
  assert.equal(entryChatStore.getState().pending[id], false);
  assert.equal(entryChatStore.getState().conversations.find(c => c.id === id)?.messages.length, 1);
  assert.equal(await entryChatStore.getState().retry(id, "guest"), true);
  assert.deepEqual(bodies.map(b => b.history), [[], []]);
});

test("congestion without an answer and HTTP rate limits are recoverable", async () => {
  const { send } = await import("../services/chat");
  const { ChatUnavailableError } = await import("./chat-unavailable");
  for (const response of [Response.json({ meta: { congested: true } }), Response.json({ congested: true }), new Response(null, { status: 429 })]) {
    globalThis.fetch = async () => response;
    await assert.rejects(send({ conversationId: "busy", occupation: "clinic", history: [], text: "질문" }),
      (error: unknown) => error instanceof ChatUnavailableError && error.reason === "congested");
  }
});

test("a timed-out transport yields a recoverable timeout instead of an endless pending turn", async () => {
  const { send } = await import("../services/chat");
  const { ChatUnavailableError } = await import("./chat-unavailable");
  globalThis.fetch = async () => { throw new DOMException("Timed out", "TimeoutError"); };
  await assert.rejects(send({ conversationId: "timeout", occupation: "clinic", history: [], text: "질문" }),
    (error: unknown) => error instanceof ChatUnavailableError && error.reason === "timeout");
});
