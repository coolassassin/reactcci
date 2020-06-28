import Prompt from 'prompts';
import kleur from 'kleur';
import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';

export const setComponentName = async () => {
    let res = componentSettingsMap.commandLineFlags.name;

    do {
        let componentName = '';

        if (res) {
            componentName = res;
        } else {
            componentName = (
                await Prompt(
                    {
                        type: 'text',
                        name: 'componentName',
                        message: 'What is the component name? (ExampleComponentName)',
                    },
                    getQuestionsSettings()
                )
            ).componentName;
        }

        if (typeof componentName === 'undefined') {
            process.exit();
        }

        if (componentName.length === 0) {
            console.log(kleur.yellow('Component name must have at least one character.\nExample: DocumentModal'));
            res = '';
            continue;
        }

        if (/[^\w\d-_]/g.test(componentName)) {
            console.log(
                kleur.yellow(
                    'Component name must contain only letters, numbers, dashes or underscores.\nExample: DocumentModal'
                )
            );
            res = '';
            continue;
        }

        res = componentName;
    } while (!res);

    componentSettingsMap.componentName = res;
};
