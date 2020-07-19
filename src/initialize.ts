import Prompt from 'prompts';
import kleur from 'kleur';

import fs from 'fs';
import path from 'path';

import { CONFIG_FILE_NAME } from './constants';
import { componentSettingsMap } from './componentSettingsMap';
import { getQuestionsSettings } from './getQuestionsSettings';

export const initialize = async () => {
    const { root, moduleRoot } = componentSettingsMap;
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        const { agree } = await Prompt(
            {
                type: 'toggle',
                name: 'agree',
                message: `Configuration file ${kleur
                    .reset()
                    .yellow(CONFIG_FILE_NAME)} is detected! Would you like to reset it?`,
                initial: true,
                active: 'Yes',
                inactive: 'No'
            },
            getQuestionsSettings()
        );

        if (!agree) {
            process.exit();
        }
    }

    console.log(`${kleur.gray('By default, CLI use basic templates to create component.')}`);
    const { templatesAgreement } = await Prompt(
        {
            type: 'toggle',
            name: 'templatesAgreement',
            message: 'Would you like to create template folder to set them up?',
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
        defaultConfig.replace(/(templatesFolder: ')(\w*?)(',)/g, `$1${templateFolderName}$3`)
    );
    console.log(`Config file ${kleur.yellow(CONFIG_FILE_NAME)} is created.`);

    if (templatesAgreement) {
        const templateFolderPath = path.resolve(root, templateFolderName);
        if (!fs.existsSync(templateFolderPath)) {
            await fs.promises.mkdir(templateFolderPath);
        }
        const defaultTempleFolder = path.resolve(moduleRoot, 'templates');
        const templateNames = await fs.promises.readdir(defaultTempleFolder);
        console.log('Templates generated:');
        for (const templateName of templateNames) {
            const tmp = (await fs.promises.readFile(path.join(defaultTempleFolder, templateName))).toString();
            await fs.promises.writeFile(path.join(templateFolderPath, templateName), tmp);
            console.log(` - ${templateFolderName}/${templateName}`);
        }
    }

    process.exit();
};
