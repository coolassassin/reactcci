import { getQuestionsSettings } from '../src/getQuestionsSettings';

describe('getQuestionsSettings', () => {
    const exitMock = jest.fn();
    const realProcess = process;

    beforeEach(() => {
        jest.clearAllMocks();
        global.process = { ...realProcess, exit: exitMock } as any;
    });

    it('onCancel call', async () => {
        const settings = getQuestionsSettings();
        settings.onCancel();
        expect(exitMock).toHaveBeenCalledTimes(1);
    });
});
