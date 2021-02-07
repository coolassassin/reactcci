import { getQuestionsSettings } from '../src/getQuestionsSettings';

import { mockProcess } from './testUtils';

describe('getQuestionsSettings', () => {
    const { exitMock } = mockProcess();

    it('onCancel call', async () => {
        const settings = getQuestionsSettings();
        settings.onCancel();
        expect(exitMock).toHaveBeenCalledTimes(1);
    });
});
