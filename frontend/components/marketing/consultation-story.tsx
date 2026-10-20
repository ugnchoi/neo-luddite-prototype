"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, FileText, MessageCircle, Paperclip } from "lucide-react";
import styles from "./consultation-story.module.css";

// Registering plugins is SSR-safe; all DOM work stays inside useGSAP.
gsap.registerPlugin(useGSAP, ScrollTrigger);

const chapters = [
  { title: <>정리되지 않은<br />질문도 괜찮아요.</>, body: "세무 용어 대신, 사업하며 있었던 일부터.", label: "질문하기" },
  { title: <>놓친 맥락을 짚고,<br />필요한 자료를 모으고.</>, body: "세무사와 이야기할 준비를 대화로 차근차근.", label: "상황 정리" },
  { title: <>마지막은,<br />사람과의 대화로.</>, body: "정리한 질문을 바탕으로 실제 세무사와 이어집니다.", label: "세무사 상담" },
];

function QuestionScene() {
  return <div className={`${styles.scene} ${styles.questionScene}`} data-scene="0">
    <div className={styles.questionMark} aria-hidden="true">?</div>
    <div className={styles.ownerQuestion}><MessageCircle size={22} /><p>리스한 차를 가족도 쓰는데,<br /><strong>비용처리가 될까요?</strong></p></div>
    <div className={styles.followup}><span className={styles.aiMark}>AI</span><p>업무에는 어떻게<br />사용하고 계신가요?</p></div>
    <span className={styles.sceneCaption}>사업자의 말로 시작하는 상담 예시</span>
  </div>;
}

function BriefScene() {
  return <div className={`${styles.scene} ${styles.briefScene}`} data-scene="1">
    <div className={styles.paperBehind} />
    <div className={styles.briefPaper}>
      <div className={styles.paperHeading}><FileText size={22} /><span>세무사와 함께 확인할 내용</span></div>
      <h3>차량 비용, 어디까지?</h3>
      <div className={styles.factRow}><span>이용 목적</span><strong>업무 + 가족 이용</strong><Check size={17} /></div>
      <div className={styles.factRow}><span>확인할 사항</span><strong>업무용 이용 비율</strong><span className={styles.openQuestion}>?</span></div>
      <div className={styles.documentRow}><Paperclip size={17} /><span>운행 기록</span><span>리스 계약서</span></div>
      <div className={styles.paperRule} /><div className={styles.paperRule} />
    </div>
    <span className={styles.sceneCaption}>확인할 사실과 자료를 정리하는 예시</span>
  </div>;
}

function ProfessionalScene() {
  return <div className={`${styles.scene} ${styles.professionalScene}`} data-scene="2">
    <div className={styles.handoff}><FileText size={18} /><span>나의 질문과 상담 맥락</span><ArrowRight size={18} /></div>
    <div className={styles.expertPortrait}><Image src="/experts/preset-1.webp" alt="" width={360} height={440} sizes="(max-width: 899px) 220px, 320px" /><span>샘플 프로필</span></div>
    <div className={styles.expertReply}><MessageCircle size={20} /><p>함께 확인하고,<br /><strong>판단을 이어갑니다.</strong></p></div>
    <span className={styles.sceneCaption}>실제 접수가 아닌 전문가 연결 흐름 예시</span>
  </div>;
}

const Scenes = [QuestionScene, BriefScene, ProfessionalScene];

export function ConsultationStory() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-story-visual] [data-scene]", element);
      element.dataset.enhanced = "true";
      element.dataset.chapter = "0";
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[0], { autoAlpha: 1 });
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: element, start: "top top", end: "bottom bottom", scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (trigger) => { element.dataset.chapter = String(Math.min(2, Math.floor(trigger.progress * 3))); },
      } });
      timeline.to({}, { duration: 0.8 })
        .to(panels[0], { autoAlpha: 0, y: -24, duration: 0.25 })
        .fromTo(panels[1], { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, "<")
        .to({}, { duration: 0.65 })
        .to(panels[1], { autoAlpha: 0, y: -24, duration: 0.25 })
        .fromTo(panels[2], { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35 }, "<")
        .to({}, { duration: 0.65 });
      return () => { delete element.dataset.enhanced; delete element.dataset.chapter; };
    });
    return () => media.revert();
  }, { scope: root });

  return <div ref={root} id="how-it-works" className={styles.story}>
    <div className={styles.visual} data-story-visual aria-hidden="true">
      <div className={styles.visualFrame}>
        {Scenes.map((Scene, index) => <Scene key={index} />)}
        <div className={styles.progress}><span /><span /><span /></div>
      </div>
    </div>
    <div className={styles.chapters}>
      {chapters.map((chapter, index) => {
        const Scene = Scenes[index];
        return <section key={chapter.label} className={styles.chapter} aria-labelledby={`chapter-${index}`} data-story-step={index}>
          <div className={styles.chapterCopy}><span className={styles.chapterNumber}>0{index + 1} / 03</span><h2 id={`chapter-${index}`}>{chapter.title}</h2><p>{chapter.body}</p>{index === 2 && <Link href="/about">서비스 소개 <ArrowRight size={18} /></Link>}</div>
          <div className={styles.inlineVisual} aria-hidden="true"><Scene /></div>
        </section>;
      })}
    </div>
  </div>;
}
