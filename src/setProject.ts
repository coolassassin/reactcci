import kleur from 'kleur';
import Prompt from 'prompts';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import { isDirectory } from './helpers';
import { componentSettingsMap } from './componentSettingsMap';

export const setProject = async () => {
    let project = '';
    const {
        root,
        config: { multiProject, folderPath },
        commandLineFlags,
        templateName
    } = componentSettingsMap;

    if (commandLineFlags.dest || !multiProject) {
        componentSettingsMap.project = '';
        return;
    }

    if (commandLineFlags.project) {
        project = commandLineFlags.project;
        console.log(`${kleur.green('√')} Selected project ${kleur.gray(`»`)} ${project}`);
    }

    if (!project && multiProject) {
        const projectList = await fs.promises.readdir(path.resolve(root)).then((items) => {
            return items
                .filter((item) => isDirectory(path.join(root, item)))
                .filter((folder) => {
                    if (Array.isArray(folderPath)) {
                        return folderPath.some((fp) => fs.existsSync(path.resolve(root, folder, fp)));
                    }
                    return fs.existsSync(path.resolve(root, folder, folderPath));
                });
        });

        if (projectList.length === 0) {
            console.error(
                `${kleur.red('There is no projects with the following path:\n')}${kleur.yellow(
                    Array.isArray(folderPath) ? folderPath.join('\n') : folderPath
                )}`
            );
            process.exit();
        }

        if (projectList.length === 1) {
            console.log(`Creating ${templateName} for ${kleur.yellow(projectList[0])} project`);
            componentSettingsMap.project = projectList[0];
            return;
        }

        const { selectedProject } = await Prompt(
            {
                type: 'select',
                name: 'selectedProject',
                message: 'Please, select the project',
                choices: projectList.map((p) => ({ title: p, value: p })),
                initial: 0
            },
            getQuestionsSettings()
        );

        project = selectedProject;
    }

    if (
        (Array.isArray(folderPath) && folderPath.some((fp) => fs.existsSync(path.resolve(root, project, fp)))) ||
        (!Array.isArray(folderPath) && fs.existsSync(path.resolve(root, project, folderPath)))
    ) {
        componentSettingsMap.project = project;
    } else {
        console.error(
            kleur.red(`Error: There is no folder for ${templateName} in ${kleur.yellow(project)} project`),
            folderPath
        );
        process.exit();
    }
};
