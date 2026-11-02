"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { searchSourceExperts, sourceExperts } from "@/lib/source-experts";
import styles from "./source-expert-directory.module.css";

/** Read-only roster: opening/searching never calls auth, likes or booking services. */
export function SourceExpertDirectory() {
  const [query, setQuery] = useState("");
  const id = useId();
  const experts = searchSourceExperts(query);
  return <Dialog onOpenChange={(open) => { if (!open) setQuery(""); }}>
    <DialogTrigger render={<Button variant="outline" />}>전문가 목록 보기</DialogTrigger>
    <DialogContent className={styles.dialog}>
      <DialogHeader>
        <DialogTitle className={styles.title}>세무 전문가를 만나보세요</DialogTitle>
        <DialogDescription>전문 분야를 살펴보세요. 현재는 목록 열람만 제공하며, 상담 신청은 준비 중입니다.</DialogDescription>
      </DialogHeader>
      <div className={styles.search}>
        <label htmlFor={id}>이름·전문 분야 검색</label>
        <div><Search size={18} aria-hidden="true" /><input id={id} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="예: 신효정, 병의원, 조세불복" /></div>
      </div>
      <p className={styles.count} role="status">{query.trim() ? `검색 결과 ${experts.length}명` : `전체 ${sourceExperts.length}명`}</p>
      <ul className={styles.list} aria-label="전문가 목록">
        {experts.map(expert => <li key={expert.id} className={styles.expert}>
          <Image src={`/experts/roster/${expert.id}.webp`} alt={`${expert.name} 세무사 프로필`} width={96} height={128} className={styles.portrait} />
          <div className={styles.details}>
            <h3>{expert.name} <span>세무사</span></h3>
            <p>{expert.specialties.join(" · ")}</p>
            {expert.note && <p className={styles.note}>{expert.note}</p>}
          </div>
        </li>)}
      </ul>
      {experts.length === 0 && <div className={styles.empty}><p>일치하는 전문가가 없습니다.</p><Button variant="outline" onClick={() => setQuery("")}>전체 목록 보기</Button></div>}
      <p className={styles.footnote}>제공된 전문가 소개 자료 기준 · 2026.10.23</p>
    </DialogContent>
  </Dialog>;
}
