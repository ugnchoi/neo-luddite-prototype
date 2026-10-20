import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronDown, CornerDownRight, FileText, MessageCircle, MessagesSquare, MoveUpRight, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/design-system/theme-toggle";
import { PublicAccountNav } from "@/components/layout/public-account-nav";
import { LandingChat } from "@/components/chat/landing-chat";
import { ImprintContours, ImprintMark } from "@/components/design-system/imprint";
import styles from "./entry.module.css";
import { isPrototype } from "@/lib/data-mode";

export const metadata: Metadata = {
  title: "세무상담 — 사업자의 질문에서, 세무사와의 상담까지",
  description: "세무 전문가와 함께 만드는 소상공인·중소사업자를 위한 세무상담. 로그인 없이 질문하고, 세무사와 상담을 이어가는 흐름을 샘플로 체험해 보세요.",
};

const steps = [
  { title: "나의 언어로 이야기하기", description: "어려운 용어도, 완벽한 질문도 필요 없어요. 일하다 마주친 상황을 그대로 들려주세요.", Icon: MessageCircle },
  { title: "대화하며 맥락 정리하기", description: "무엇을 했는지, 누구와 관련된 일인지. 답변에 필요한 내용을 하나씩 짚어 봅니다.", Icon: FileText },
  { title: "필요할 때, 실제 세무사와", description: "질문과 확인할 자료를 바탕으로 세무사와 상담을 이어가는 서비스입니다. ", Icon: UserRound },
];

const questions = [
  { question: "세무 지식이 없어도 시작할 수 있나요?", answer: "네. 세무 용어 대신 실제로 있었던 일을 적어 주세요. 질문 예시를 고른 뒤 내 상황에 맞게 바꿔도 됩니다." },
  { question: "로그인이 필요한가요?", answer: "이 프로토타입에서는 로그인 없이 첫 대화를 시작할 수 있어요. 전문가 상담 요청 등 계정이 필요한 기능은 로그인 후 이어서 이용할 수 있습니다." },
  { question: "실제 세무 상담을 받을 수 있나요?", answer: "현재 제공 범위는 서비스 소개에서 확인해 주세요. 체험 모드의 응답과 전문가 연결은 샘플 데이터로 동작하며 실제 상담 접수를 제공하지 않습니다." },
  { question: "작성한 대화는 어디에 보관되나요?", answer: "대화는 현재 브라우저에 보관됩니다. 브라우저 데이터를 삭제하거나 다른 기기를 사용하면 이전 대화를 불러올 수 없어요. 브라우저 저장이 차단된 환경에서는 새로고침 후 대화가 유지되지 않을 수 있습니다." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <a href="#main" className={styles.skipLink}>본문으로 이동</a>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="세무상담 홈"><span className={styles.brandMark}><ImprintMark /></span>세무상담</Link>
        <nav className={styles.navigation} aria-label="서비스 안내"><Link href="/about">서비스 소개</Link><a href="#consultation">질문하기</a></nav>
        <div className={styles.account}><PublicAccountNav /><ThemeToggle /></div>
      </header>
      <main id="main" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.story}>
            <h1 id="hero-title">세무 고민,<br />바로 물어보세요.</h1>
            <p>세무 전문가와 함께 만드는<br className={styles.desktopBreak} /> 소상공인·중소사업자를 위한 세무상담.<br />질문부터 실제 세무사와의 상담까지 이어갑니다.</p>
            <a className={styles.primaryAction} href="#consultation">{isPrototype ? "질문하고 체험하기" : "첫 질문 시작하기"} <ArrowRight size={18} aria-hidden="true" /></a>
            <span className={styles.actionNote}>{isPrototype ? "로그인 없이 · 현재는 샘플 상담 체험" : "로그인 없이, 나의 이야기부터"}</span>
          </div>
          <div className={styles.consultationStage}>
            <div className={styles.stageHeading}><span><span className={styles.statusDot} />첫 질문부터, 함께</span><span>{isPrototype ? "병의원 사례 기반 데모" : "사업자를 위한 세무상담"}</span></div>
            <LandingChat />
            <div className={styles.stageJourney} aria-label="상담 단계">
              <span><MessageCircle size={15} aria-hidden="true" />나의 상황</span><ArrowRight size={14} aria-hidden="true" />
              <span><FileText size={15} aria-hidden="true" />함께 정리</span><ArrowRight size={14} aria-hidden="true" />
              <span><UserRound size={15} aria-hidden="true" />{isPrototype ? "세무사 연결 체험" : "세무사 연결"}</span>
            </div>
          </div>
          <div className={styles.heroFoot}><p>어려운 세무 용어 대신, 사업하며 겪은 일부터.</p><a href="#how-it-works">어떻게 시작하나요? <ArrowDown size={16} aria-hidden="true" /></a></div>
        </section>

        <section className={styles.process} id="how-it-works" aria-labelledby="process-title">
          <div className={styles.sectionHeading}><h2 id="process-title">막연한 고민이<br />명확한 질문이 되도록.</h2><p>사업자의 말로 시작해, 상담에 필요한 내용을 정리하고<br />세무사에게 질문을 이어가는 흐름입니다.</p></div>
          <ol className={styles.steps}>{steps.map(({ title, description, Icon }, index) => (
            <li key={title}><div className={styles.stepTop}><span className={styles.stepNumber}>0{index + 1}</span><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></div><h3>{title}</h3><p>{description}</p></li>
          ))}</ol>
        </section>

        <section className={styles.professionalIntro} aria-labelledby="professional-title">
          <h2 id="professional-title">세무 전문가와 함께 만들고,<br />사람과의 상담으로 이어갑니다.</h2>
          <div><p>사업자의 상황을 이해하는 데서 시작해, 전문가의 검토가 필요한 순간을 놓치지 않도록. 세무 전문가와 함께 상담의 흐름을 만들어 갑니다.</p><Link href="/about">어떤 서비스인가요? <ArrowRight size={18} aria-hidden="true" /></Link></div>
        </section>

        <section className={styles.contextSection} aria-labelledby="context-title">
          <div className={styles.contextStory}>
            <span className={styles.contextSymbol} aria-hidden="true"><MessagesSquare size={38} strokeWidth={1.3} /></span>
            <h2 id="context-title">같은 질문도,<br />상황에 따라<br />다르니까.</h2>
            <p>누가, 어떤 목적으로, 어떻게 사용했는지.<br />답변에 필요한 맥락을 먼저 살펴봅니다.<br />혼자서 질문을 완성하지 않아도 괜찮아요.</p>
            <a href="#consultation">내 상황 이야기하기 <MoveUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className={styles.contextPreview} aria-label="상황을 정리하는 대화 예시">
            <div className={styles.previewHeader}><span>대화 속에서 맥락 찾기</span><span>상담 예시</span></div>
            <div className={styles.sampleQuestion}>리스한 차를 가족도 쓰는데,<br />비용처리가 될까요?</div>
            <div className={styles.sampleResponse}><span className={styles.responseIcon}><MessagesSquare size={18} aria-hidden="true" /></span><p>차량을 어떻게 이용하고 계신지<br />조금 더 이야기해 주시겠어요?</p></div>
            <div className={styles.contextDetails}>
              <div className={styles.contextDetailsTitle}><CornerDownRight size={17} aria-hidden="true" /><span>함께 확인할 내용</span></div>
              <div><span>이용 목적</span><span>업무용과 개인용 구분<Check size={15} aria-hidden="true" /></span></div>
              <div><span>사용 내역</span><span>운행 기록 확인<Check size={15} aria-hidden="true" /></span></div>
              <div><span>관련 자료</span><span>계약서와 지출 증빙<Check size={15} aria-hidden="true" /></span></div>
            </div>
            <p className={styles.previewNote}>상담 흐름을 설명하기 위한 예시입니다.</p>
          </div>
        </section>

        <section className={styles.faq} id="questions" aria-labelledby="faq-title">
          <div className={styles.faqIntro}><h2 id="faq-title">시작 전, <br />궁금한 점.</h2><p>부담 없이 둘러보세요.</p></div>
          <div className={styles.faqList}>{questions.map(({ question, answer }) => (
            <details key={question}><summary>{question}<ChevronDown size={19} aria-hidden="true" /></summary><p>{answer}</p></details>
          ))}</div>
        </section>
        <section className={styles.closing} aria-labelledby="closing-title">
          <div><h2 id="closing-title">사업하며 생긴 질문,<br />지금 이야기해 주세요.</h2><p>세무 용어를 몰라도 괜찮아요.</p></div>
          <ImprintContours className={styles.closingImprint} />
          <a className={styles.primaryAction} href="#consultation">{isPrototype ? "질문하고 체험하기" : "첫 질문 시작하기"} <ArrowRight size={18} aria-hidden="true" /></a>
        </section>
      </main>
      <footer className={styles.footer}>
        <div><Link href="/" className={styles.brand}><ImprintMark size={26} />세무상담</Link><p><Link href="/about">서비스 소개</Link></p></div>
        <p>{isPrototype ? <>병의원 상담 흐름을 체험하는 프로토타입<br />샘플 응답이며, 실제 세무 판단을 제공하지 않습니다.</> : <>AI 안내와 실제 세무사 상담을 연결합니다.<br />최종 세무 판단은 세무사와 확인해 주세요.</>}</p>
        <a href="#main">맨 위로 <ArrowRight size={15} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
