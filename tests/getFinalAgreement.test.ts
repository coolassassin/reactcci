import prompts from 'prompts';

import { getFinalAgreement } from '../src/getFinalAgreement';

describe('getFinalAgreement', () => {
    it('yes', async () => {
        prompts.inject([true]);
        const res = await getFinalAgreement();
        expect(res).toBe(true);
    });
    it('no', async () => {
        prompts.inject([false]);
        const res = await getFinalAgreement();
        expect(res).toBe(false);
    });
});
