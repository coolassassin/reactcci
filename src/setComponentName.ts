import Prompt from 'prompts';
import chalk from 'chalk';
import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';

export const setComponentName = async () => {
    let res = null;

    while (res === null) {
        const { componentName } = await Prompt(
            {
                type: 'text',
                name: 'componentName',
                message: 'What is the component name? (ExampleComponentName)',
            },
            getQuestionsSettings()
        );

        if (typeof componentName === 'undefined') {
            process.exit();
        }

        if (componentName.length < 4) {
            console.log(
                chalk.yellow('Length of component name must be longer than 3.\nExample: DocumentModal')
            );
            continue;
        }

        res = componentName;
    }

    componentSettingsMap.componentName = res;
};
