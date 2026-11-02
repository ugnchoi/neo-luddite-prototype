import assert from 'node:assert/strict';
import test from 'node:test';
import { searchSourceExperts } from './source-experts';

test('searches the supplied roster by name, specialty and normalized whitespace', () => {
  assert.deepEqual(searchSourceExperts(' 신 효 정 ').map(e => e.name), ['신효정']);
  assert.deepEqual(searchSourceExperts('병의원').map(e => e.name), ['신효정', '백종호']);
  assert.deepEqual(searchSourceExperts('기업 컨설팅').map(e => e.name), ['이란', '진효근']);
});
test('blank search shows the full roster and an unknown name returns no invented match', () => {
  assert.equal(searchSourceExperts('  ').length, 6);
  assert.deepEqual(searchSourceExperts('없는세무사'), []);
});
