import Prompt from 'prompts';
import kleur from 'kleur';

import { getQuestionsSettings } from './getQuestionsSettings';
import { capitalizeName, mapNameToCase, processComponentNameString, writeToConsole } from './helpers';
import { CommandLineFlags } from './types';

type Properties = {
    templateName: string;
    commandLineFlags: CommandLineFlags;
};

export const setComponentNames = async ({ templateName, commandLineFlags }: Properties): Promise<string[]> => {
    if (commandLineFlags.update) {
        return [];
    }

    let res: string[] = [commandLineFlags.name];

    do {
        let componentName: string[] | undefined = [''];

        if (res[0]) {
            componentName = processComponentNameString(res[0]);
        } else {
            componentName = (
                await Prompt(
                    {
                        type: 'text',
                        name: 'componentName',
                        message: `What is the ${templateName} name? (ExampleName)`,
                        format: (input: string) => processComponentNameString(input)
                    },
                    getQuestionsSettings()
                )
            ).componentName;
        }

        if (typeof componentName === 'undefined') {
            process.exit();
            return [];
        }

        if (componentName.some((name) => name.length === 0)) {
            writeToConsole(
                kleur.yellow(
                    `${capitalizeName(templateName)} name must have at least one character.\nExample: DocumentModal`
                )
            );
            continue;
        }

        const componentNameRegularExpression = /[^\w\d-_]/g;

        if (componentName.some((name) => componentNameRegularExpression.test(name))) {
            writeToConsole(
                kleur.yellow(
                    `${capitalizeName(
                        templateName
                    )} name must contain only letters, numbers, dashes or underscores.\nExample: DocumentModal`
                )
            );
            continue;
        }

        res = componentName;
    } while (!res[0]);

    return res.map((name) => mapNameToCase(name, 'PascalCase'));
};
