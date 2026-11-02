"use client";

import type { ComponentProps } from "react";
import { isPrototype, isEntryChatLive } from "@/lib/data-mode";
import { ChatResponse } from "./chat-response";
import { LiveEntryResponse } from "./live-entry-response";
import { PrototypeEntryResponse } from "./prototype-entry-response";

export function EntryResponse(props: ComponentProps<typeof LiveEntryResponse>) {
  if (isPrototype && isEntryChatLive) {
    return <ChatResponse message={props.message} handoff={props.showHandoff && props.message.uiBlocks?.some((b) => b.kind === "expert_handoff")
      ? <p>전문가의 확인이 필요한 내용입니다. 이 버전의 전문가 연결은 샘플 체험이며 실제 상담을 접수하지 않습니다.</p> : null} />;
  }
  return isPrototype ? <PrototypeEntryResponse {...props} /> : <LiveEntryResponse {...props} />;
}
