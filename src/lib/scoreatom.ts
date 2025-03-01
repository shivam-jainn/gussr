import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const scoreAtom = atom<number>(0);
export const highScoreAtom = atomWithStorage<number>('gussr_high_score', 0);