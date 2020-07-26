import Prompt from 'prompts';
import kleur from 'kleur';

import { getQuestionsSettings } from './getQuestionsSettings';
import { componentSettingsMap } from './componentSettingsMap';
import { capitalizeName, writeToConsole } from './helpers';

export const setComponentName = async () => {
    const { commandLineFlags, templateName } = componentSettingsMap;

    let res = commandLineFlags.name;

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
                        message: `What is the ${templateName} name? (ExampleName)`
                    },
                    getQuestionsSettings()
                )
            ).componentName;
        }

        if (typeof componentName === 'undefined') {
            process.exit();
            return;
        }

        if (componentName.length === 0) {
            writeToConsole(
                kleur.yellow(
                    `${capitalizeName(templateName)} name must have at least one character.\nExample: DocumentModal`
                )
            );
            res = '';
            continue;
        }

        if (/[^\w\d-_]/g.test(componentName)) {
            writeToConsole(
                kleur.yellow(
                    `${capitalizeName(
                        templateName
                    )} name must contain only letters, numbers, dashes or underscores.\nExample: DocumentModal`
                )
            );
            res = '';
            continue;
        }

        res = componentName;
    } while (!res);

    componentSettingsMap.componentName = res;
};
