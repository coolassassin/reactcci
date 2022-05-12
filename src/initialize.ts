import Prompt from 'prompts';
import kleur from 'kleur';

import fs from 'fs';
import path from 'path';

import { CONFIG_FILE_NAME } from './constants';
import { getQuestionsSettings } from './getQuestionsSettings';
import { writeToConsole } from './helpers';
import { CommandLineFlags } from './types';

type Properties = {
    root: string;
    moduleRoot: string;
    commandLineFlags: CommandLineFlags;
};

export const initialize = async ({ root, moduleRoot, commandLineFlags }: Properties) => {
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        return;
    }

    writeToConsole(`Hello!\nWe haven't find configuration file (${kleur.yellow(CONFIG_FILE_NAME)}).`);
    writeToConsole("It seems like a first run, doesn't it?");

    const { agree } = await Prompt(
        {
            type: 'toggle',
            name: 'agree',
            message: `Would you like to start configuration? It will be quick!`,
            initial: true,
            active: 'Yes',
            inactive: 'No'
        },
        getQuestionsSettings()
    );

    if (!agree) {
        writeToConsole('See you next time!');
        process.exit();
        return;
    }

    writeToConsole(`${kleur.gray('By default, CLI use basic templates to create a component.')}`);
    const { templatesAgreement } = await Prompt(
        {
            type: 'toggle',
            name: 'templatesAgreement',
            message: 'Would you like to create a template folder to set them up?',
            initial: true,
            active: 'Yes',
            inactive: 'No'
        },
        getQuestionsSettings()
    );
    let templateFolderName = 'templates';

    if (templatesAgreement) {
        templateFolderName = (
            await Prompt(
                {
                    type: 'text',
                    name: 'templateFolderName',
                    message: 'What is a template folder name?',
                    initial: templateFolderName
                },
                getQuestionsSettings()
            )
        ).templateFolderName;
    }

    const defaultConfigPath = path.resolve(moduleRoot, 'defaultConfig.js');
    const defaultConfig = (await fs.promises.readFile(defaultConfigPath)).toString();
    await fs.promises.writeFile(
        path.join(root, CONFIG_FILE_NAME),
        defaultConfig.replace(/(templatesFolder: ')(\w*?)(')/g, `$1${templateFolderName}$3`)
    );
    writeToConsole(`Config file ${kleur.yellow(CONFIG_FILE_NAME)} is created.`);

    if (templatesAgreement) {
        const templateFolderPath = path.resolve(root, templateFolderName);
        if (!fs.existsSync(templateFolderPath)) {
            await fs.promises.mkdir(templateFolderPath);
        }
        const defaultTempleFolder = path.resolve(moduleRoot, 'templates');
        const templateNames = await fs.promises.readdir(defaultTempleFolder);
        writeToConsole('Generated templates:');
        for (const templateName of templateNames) {
            const tmp = (await fs.promises.readFile(path.join(defaultTempleFolder, templateName))).toString();
            await fs.promises.writeFile(path.join(templateFolderPath, templateName), tmp);
            writeToConsole(` - ${templateFolderName}/${templateName}`);
        }
    }

    writeToConsole(kleur.green(`Well done! Configuration is finished!`));

    if (!commandLineFlags.nfc) {
        const { firstComponentAgreement } = await Prompt(
            {
                type: 'toggle',
                name: 'firstComponentAgreement',
                message: `Would you like to create your first component?`,
                initial: true,
                active: 'Yes',
                inactive: 'No'
            },
            getQuestionsSettings()
        );

        if (!firstComponentAgreement) {
            writeToConsole('Well, see you next time!');
            writeToConsole(`You can set up everything you need in the ${kleur.yellow(CONFIG_FILE_NAME)} file.`);
            writeToConsole('After configuration just run me again (◉ ◡ ◉ )');
            process.exit();
            return;
        }
    } else {
        process.exit();
        return;
    }

    return;
};
