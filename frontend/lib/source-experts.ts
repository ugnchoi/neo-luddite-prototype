/** Snapshot of 세무사 정보.xlsx, Sheet1; source modified 2026-10-23.
 * Provenance and image anchors: design/source-expert-directory.md.
 * Separate from account IDs and the simulated expert/booking service.
 */
export type SourceExpert = {
  id: string;
  name: string;
  specialties: readonly string[];
  note?: string;
};
export const sourceExperts: readonly SourceExpert[] = [
  { id: 'seo-yujin', name: '서유진', specialties: ['기장 및 신고대리', '재산제세', '세무조사 대응', '토지 보상 대응'] },
  { id: 'kim-jaegwang', name: '김재광', specialties: ['기장 및 신고대리', '재산제세', '조세불복'] },
  { id: 'lee-ran', name: '이란', specialties: ['재산제세', '조세불복', '기업 컨설팅'] },
  { id: 'shin-hyojeong', name: '신효정', specialties: ['병의원 기장 및 신고대리', '재산제세', '가업승계'] },
  { id: 'baek-jongho', name: '백종호', specialties: ['병의원 전문', '광고대행 전문', '엔터테인먼트 전문'], note: '세무 전반 대응 · 세무대리 실무 경력 26년 (제공 자료 기준)' },
  { id: 'jin-hyogeun', name: '진효근', specialties: ['기업컨설팅 전문', '토지 보상 재산제세', '조세불복', '세무조사 대응'] },
];
const normalize = (text: string) => text.normalize('NFKC').replace(/\s/g, '').toLocaleLowerCase('ko');
export function searchSourceExperts(query: string): readonly SourceExpert[] {
  const needle = normalize(query);
  return sourceExperts.filter(expert => normalize([expert.name, '세무사', ...expert.specialties, expert.note ?? ''].join(' ')).includes(needle));
}
