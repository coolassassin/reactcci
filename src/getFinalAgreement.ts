import Prompt from 'prompts';
import { getQuestionsSettings } from './getQuestionsSettings';

export const getFinalAgreement = async () => {
    const { agree } = await Prompt(
        {
            type: 'toggle',
            name: 'agree',
            message: 'Is everything correct?',
            initial: true,
            active: 'Yes',
            inactive: 'No',
        },
        getQuestionsSettings()
    );

    return agree;
};
