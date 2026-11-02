# 실제 기능 연동 준비 — 2026-10-31

## 기준과 작업 범위

- 프로토타입 기준: `origin/main`의 `5e06bb29f79654142afe1c84b096a2c44e17d860`.
- 원본 비교 기준: `upstream/main`의 `b8509a98ddfbbc2d1579f692131d33a3efdaf20b`.
- 작업 브랜치: `feat/live-integration-preparation`. 기존 수정 중인 작업 공간은 그대로 보존한다.
- 중은 님에게 연결 환경, 배포 커밋·DB 버전, 테스트 계정·쓰기 범위, CORS·로그인 콜백, 역할 분담을 이메일로 확인 요청한 상태다.
- 이번 단계는 로컬 코드와 합성 응답으로 검증한다. 운영 서버 호출, DB 마이그레이션, 실제 모델 호출, 실제 자격 증명 설정, 배포는 하지 않는다.

## 이전 설명의 정정

오래된 로컬 체크아웃과 `data-mode.ts` 주석만 보면 모든 전문가 설정이 브라우저 저장처럼 보이지만, 최신 원격 프로토타입에는 10월 6일 S0/S1 통합이 이미 포함되어 있다. 기존 설계는 [live-prototype-integration.md](live-prototype-integration.md)를 참고한다.

`frontend/services/expert-agents.ts`는 질문·운영 원칙을 포함한 에이전트 객체를 `expert_agents`에 저장한다. `frontend/components/audit/agents/agent-library.tsx`가 live 모드에서 이 서비스를 사용한다. 원본 `backend/api/room_agent.py`는 해당 설정을 읽어 `AGENT_PRINCIPLES`와 `AGENT_QUESTIONS`에 전달한다. 따라서 이 기능은 전부 신규 구현할 대상이 아니다. 다만 일반 채팅·전문가 미리보기·상담방의 설정 적용 범위가 같다고 가정해서는 안 되며, 운영 배포와 실제 반영은 아직 검증하지 않았다.

## 화면·서비스·백엔드 대응표

아래의 ‘있음’은 소스 코드 존재를 뜻한다. 운영 환경 작동 보증이 아니다.

| 사용자 흐름 | 프로토타입의 기존 접점 | 원본·DB 계약 | 다음 작업 또는 확인 |
| --- | --- | --- | --- |
| 실제 로그인·역할 복원 | `lib/account-store.ts`, `components/auth/session-provider.tsx` | 원본 `lib/live-auth.ts`, `profiles`, Auth; migration 0047 | 현재 포크 로그인은 데모 자격 증명을 먼저 검사한다. 원본의 서버 사용자·프로필 확인, 세션 동기화, 로그인 화면을 묶어서 이식해야 한다. 키 지원만으로 실제 가입·로그인이 완성되지는 않는다. |
| 질문·AI 답변 | `services/chat.ts`, `lib/entry-chat-store.ts`, `lib/runtime/remote-chat-send.ts` | `POST /api/chat`: conversationId, occupation, history, userInput; 응답 message/meta | 이번 단계에서 `summary` 유형 호환. 일반 채팅에는 전문가 개인 지식 접근을 임의로 추가하지 않는다. |
| 대화 저장·상담 연결 | `services/conversation.ts`, `lib/entry-chat-owner.ts` | Supabase conversations 및 연결 RPC | 테스트 계정과 RLS 적용 상태 확인 후 실제 저장·다른 계정 접근·재접속 검증. |
| 에이전트 설정·방 배정 | `services/expert-agents.ts`, `components/audit/agents/agent-library.tsx` | expert_agents, migration 0044/0045; 원본 room_agent.py | 설정 저장과 실제 답변 반영을 구분하여 검증. 저장 서비스는 목록에서 사라진 에이전트를 삭제하므로 승인된 테스트 범위가 필요하다. |
| 사례 조회·초안 저장 | `services/expert-kb3.ts`의 listMyCases/saveCase | `GET/POST /api/kb3/expert/cases`; 0042/0043 | GET도 인증 필요. 이 서비스는 직접 Authorization 헤더를 추가한다. 저장은 임베딩 호출을 동반하므로 단순 읽기 검증에 포함하지 않는다. |
| 사례 게시·내리기 | 같은 서비스의 setPublished | `POST /api/kb3/expert/cases/{docId}/publish`, body `{ published }` | 초안 저장 성공과 RAG 게시 성공을 별도로 확인. |
| 실제 답변 미리보기 | 같은 서비스의 previewAgent | `POST /api/kb3/expert/preview`, body `{ text }` | 모델 호출 및 계측 기록이 발생한다. 서버 승인 후 검증. |
| 공동 지식 공유·관리자 검토 | 같은 서비스의 shareCases/listShareQueue/reviewShare | `/api/kb3/expert/share`, `/api/kb3/share-queue`, `/admin/kb3/share/{id}/review` | 원본에는 withdrawn 상태·관리자 철회 API·0056 기여 원장 동기화가 추가됐다. 상태 표시와 관리자 화면을 함께 반영할 후속 범위. |
| 상담방 AI | `services/room.ts`, `components/room/room-view.tsx` | `/api/rooms/{roomId}/agent-greet`, `/agent-reply`; 0044/0045/0054 | 참여자 권한, 중복 응답 방지, 즉시 연결 흐름의 원본 변경을 확인하고 묶어서 반영. |
| 상담에서 배우기·확장된 공유 제안 | `lib/session-learning-schema.ts`, `lib/contribution-store.ts`, 관련 전문가 화면 | 기존 S2/S3 설계는 아직 별도 계약 필요 | 고객·전문가·AI 발화 매핑, 제출 당시 버전, 개인정보 제외, 검토·철회 규칙을 합의한 뒤 live 활성화. |
| 옛 KB2·검수 화면 | `services/kb2.ts`, audit/review 관련 화면 | 원본 0053은 KB2 삭제, 0057~0060은 옛 검수·RAG 정리 | 최신 DB에 연결하기 전에 메뉴와 호출 경로를 정리한다. 마이그레이션 전체를 기존 DB에 그대로 적용하지 않는다. |

## 이번 단계 변경

1. `lib/conversation-schema.ts`: 원본의 `summary` 답변 문단을 허용한다. 알려지지 않은 유형은 계속 거부하고, 출처·ID·내용은 그대로 유지한다. 없는 판정 카드를 임의 생성하지 않는다.
2. `lib/supabase/client.ts`: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 우선 사용하고 기존 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 지원한다. 프로토타입은 계속 로컬 전송 어댑터를 사용한다. OAuth 콜백 구현과 함께 이식해야 하는 PKCE 설정 변경은 이 단계에 섞지 않는다.
3. `.env.example`: 기본 prototype 모드, 실제 연결 시 remote 설정, 공개 키 선택과 재빌드 필요성을 명시한다. 실제 시트 값은 복사하지 않는다.
4. 회귀 테스트: 합성 응답을 실제 chat 서비스에 통과시키고, 실제 Supabase 클라이언트의 HTTP 경계만 가로채 키 선택과 prototype 외부 호출 0회를 검사한다.

## 승인 이후 실행 순서와 완료 기준

1. 중은 님의 답변으로 연결할 환경·배포 커밋·적용 DB 버전·계정·쓰기 범위를 확정한다. GitHub 최신 커밋을 운영 배포 버전으로 간주하지 않는다.
2. 원본의 인증 기능을 관련 화면·프로필 검증·세션 처리·콜백과 함께 반영한다. 사용자 입력이나 브라우저 저장값을 권한의 근거로 삼지 않는다.
3. 합성 전송으로 로그인·채팅·저장·실패 후 재시도를 검증한 뒤, 승인된 테스트 환경에서 실제 로그인 → 답변 → 저장 → 재접속을 확인한다.
4. 전문가 사례는 초안 저장 → 게시 → 전문가 상담방 답변에 반영 → 내리기 순서로 확인한다. 일반 채팅에 비공개 사례가 나오지 않는지도 확인한다.
5. 공유 승인·철회와 기여 원장, 상담 학습의 확장된 흐름은 별도 기능 묶음으로 진행한다.

## 로컬 검증 명령

`frontend/`에서 실행한다. 기본 `npm test`는 단위·서비스 테스트다. E2E 전체 실행은 실제 DB를 수정하는 옛 스펙을 포함하므로 아래 합성 전송 스펙만 지정한다.

```bash
npm test
npx eslint lib/conversation-schema.ts lib/supabase/client.ts lib/live-chat-contract.test.ts lib/supabase-key.test.ts
NEXT_PUBLIC_DATA_MODE=prototype npm run build

# 별도 live 빌드. 아래 값은 로컬 테스트 전용이며 실제 서비스 자격 증명이 아니다.
NEXT_PUBLIC_DATA_MODE=live NEXT_PUBLIC_CHAT_MODE=remote \
  NEXT_PUBLIC_API_BASE=http://localhost:8799 \
  NEXT_PUBLIC_SUPABASE_URL=http://localhost:8799 \
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_synthetic \
  NEXT_PUBLIC_SUPABASE_ANON_KEY= npm run build
npx next start --port 3026
# 별도 터미널
E2E_BASE_URL=http://localhost:3026 npx playwright test \
  e2e/entry-response.spec.ts e2e/live-agent-integration.spec.ts
```

로컬 테스트 결과는 운영 권한, 모델 품질, 실제 DB 호환성의 검증과 구분한다.

## 이번 실행 결과

- 수정 전 재현: 새 테스트 5개 중 3개 실패. `summary` 계약 거부, publishable-only 설정 미인식, 두 키가 있을 때 legacy 키 사용을 각각 확인했다.
- 수정 후 `npm test`: 118개 통과, 실패 0개. 새 5개 테스트 포함.
- 변경 TypeScript 파일 ESLint 및 `git diff --check`: 통과.
- prototype production build: 통과.
- 합성 publishable key만 사용한 live production build: 통과.
- 기존 Chromium E2E 두 파일: 5개 통과. 출처·카드·재접속, 저장 실패·재시도, 선택 메타데이터 부재, 전문가 설정·방 배정·사례 저장·게시·공유·미리보기, 관리자 기존 승인 화면을 확인했다.
- live 브라우저 테스트는 HTTP 응답과 로그인 세션을 합성한다. 실제 로그인 서버·배포 API·DB 권한·유료 추론은 검증하지 않았다.
