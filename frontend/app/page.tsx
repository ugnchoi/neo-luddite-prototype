import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, FileText, MessagesSquare } from "lucide-react";
import { ThemeToggle } from "@/components/design-system/theme-toggle";
import { PublicAccountNav } from "@/components/layout/public-account-nav";
import { LandingChat } from "@/components/chat/landing-chat";
import { ConsultationStory } from "@/components/marketing/consultation-story";
import { ImprintMark } from "@/components/design-system/imprint";
import { isPrototype } from "@/lib/data-mode";
import styles from "./entry.module.css";

export const metadata: Metadata = {
  title: "세무상담 — 사업자의 질문에서, 세무사와의 상담까지",
  description: "세무 전문가와 함께 만드는 소상공인·중소사업자를 위한 세무상담. 나의 질문에서 실제 세무사와의 상담까지 이어지는 흐름을 만나 보세요.",
};

export default function Home() {
  return <div className={styles.page}>
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
          <p>사업자의 질문에서 실제 세무사와의 상담까지.<br />세무 전문가와 함께 만듭니다.</p>
          <span className={styles.audience}>소상공인·중소사업자를 위한 세무상담</span>
        </div>
        <div className={styles.consultationStage}>
          <LandingChat compact />
        </div>
        <div className={styles.heroFoot}><span>{isPrototype ? "로그인 없이 · 샘플 상담 체험" : "로그인 없이, 첫 질문부터"}</span><a href="#how-it-works">질문 다음에는? <ArrowDown size={16} aria-hidden="true" /></a></div>
      </section>

      <ConsultationStory />

      <section className={styles.collaboration} aria-labelledby="together-title">
        <div className={styles.collaborationVisual} aria-hidden="true">
          <div className={styles.knowledgeInput}><FileText size={28} strokeWidth={1.5} /><span>상담 사례</span></div>
          <div className={styles.connection} />
          <div className={styles.expertGroup}>
            {[1, 2, 3].map(index => <Image key={index} src={`/experts/preset-${index}.webp`} width={100} height={120} alt="" sizes="90px" />)}
            <span>전문가 검토</span>
          </div>
          <div className={styles.connection} />
          <div className={styles.knowledgeOutput}><MessagesSquare size={28} strokeWidth={1.5} /><span>질문과 답변</span></div>
          <span className={styles.visualNote}>전문가 협업 구조를 설명하는 예시 · 샘플 프로필</span>
        </div>
        <div className={styles.collaborationCopy}><h2 id="together-title">전문가의 경험이,<br />서비스의 바탕이 됩니다.</h2><p>사례와 지식을 함께 쌓고, 상담으로 이어갑니다.</p><Link href="/about">함께 만드는 방식 <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <h2 id="closing-title">이제, 내 질문으로.</h2>
        <a className={styles.primaryAction} href="#consultation">{isPrototype ? "질문하고 체험하기" : "첫 질문 시작하기"} <ArrowRight size={18} aria-hidden="true" /></a>
      </section>
    </main>
    <footer className={styles.footer}>
      <div><Link href="/" className={styles.brand}><ImprintMark size={26} />세무상담</Link><p><Link href="/about">서비스 소개 · 이용 안내</Link></p></div>
      <p>{isPrototype ? <>병의원 사례 기반 프로토타입입니다.<br />샘플 응답이며 실제 세무 판단·상담 접수를 제공하지 않습니다.</> : "최종 세무 판단은 세무사와 확인해 주세요."}</p>
      <a href="#main">맨 위로 <ArrowRight size={15} aria-hidden="true" /></a>
    </footer>
  </div>;
}
