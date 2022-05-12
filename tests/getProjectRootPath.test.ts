import prompts from 'prompts';

import { getProjectRootPath } from '../src/getProjectRootPath';

describe('getProjectRootPath', () => {
    it('default path', async () => {
        const paths = ['Static/Scripts/components/', 'Static/Scripts/React/components/'];
        prompts.inject(paths[0] as never);
        const res1 = await getProjectRootPath(paths);
        expect(res1).toBe(paths[0]);
        prompts.inject(paths[1] as never);
        const res2 = await getProjectRootPath(paths);
        expect(res2).toBe(paths[1]);
    });
});
