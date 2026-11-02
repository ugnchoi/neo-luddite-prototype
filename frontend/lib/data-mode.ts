/** The fork is local by default. Live integration must be deliberately enabled. */
export const isPrototype = process.env.NEXT_PUBLIC_DATA_MODE !== "live";
/** Customer entry chat may use the API while expert/admin/auth remain local demos. */
export const isEntryChatLive = !isPrototype || process.env.NEXT_PUBLIC_ENTRY_CHAT_MODE === "live";

export function getChatApiBase(): string {
  if (!isEntryChatLive) return prototypeOrigin;
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE is required for live chat.");
  return base;
}
/** 고급 그래프·새 대시보드·상담 허브 등 확장 흐름은 프로토타입 전용. 기존 live 가르치기와 구분한다. */
export const agentStudioEnabled = isPrototype;
/** 내 에이전트(가르치기·지식 모음·운영 원칙·미리보기)는 live에서도 연다. 사례는 KB3에 저장·게시하고,
 * 질문·원칙은 expert-agents 서비스가 서버에 저장한다. 실제 배포·답변 반영 범위는 별도 검증한다. */
export const expertTeachingEnabled = true;
export const prototypeOrigin = "https://prototype.invalid";

export function getApiBase(): string {
  if (isPrototype) return prototypeOrigin;
  const base = process.env.NEXT_PUBLIC_API_BASE;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE is required in live mode.");
  return base;
}
