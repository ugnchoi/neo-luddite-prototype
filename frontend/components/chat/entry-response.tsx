"use client";

import type { ComponentProps } from "react";
import { isPrototype, isEntryChatLive } from "@/lib/data-mode";
import { SourceExpertDirectory } from "@/components/expert/source-expert-directory";
import { ChatResponse } from "./chat-response";
import { LiveEntryResponse } from "./live-entry-response";
import { PrototypeEntryResponse } from "./prototype-entry-response";

export function EntryResponse(props: ComponentProps<typeof LiveEntryResponse>) {
  if (isPrototype && isEntryChatLive) {
    return <ChatResponse message={props.message} handoff={props.showHandoff && props.message.uiBlocks?.some((b) => b.kind === "expert_handoff")
      ? <div><p>전문가의 확인이 필요한 내용입니다. 전문 분야를 살펴보세요.</p><SourceExpertDirectory /></div> : null} />;
  }
  return isPrototype ? <PrototypeEntryResponse {...props} /> : <LiveEntryResponse {...props} />;
}
