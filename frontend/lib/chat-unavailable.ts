/** A recoverable transport status with copy safe to display to the customer. */
export class ChatUnavailableError extends Error {
  constructor(public readonly reason: "congested" | "timeout") {
    super(reason === "congested"
      ? "현재 상담 요청이 많아 혼잡합니다. 질문은 보관되어 있으니 잠시 후 다시 시도해 주세요."
      : "답변을 기다리는 시간이 길어져 연결을 종료했습니다. 질문은 보관되어 있으니 다시 시도해 주세요.");
    this.name = "ChatUnavailableError";
  }
}
