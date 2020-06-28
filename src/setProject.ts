import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Prompt from 'prompts';
import { getQuestionsSettings } from './getQuestionsSettings';
import { isDirectory } from './helpers';
import { componentSettingsMap } from './componentSettingsMap';

export const setProject = async () => {
    let project = '';
    const {
        root,
        config: { multiProject, folderPath },
        commandLineFlags,
    } = componentSettingsMap;

    if (commandLineFlags.dist) {
        componentSettingsMap.project = project;
        return;
    }

    if (commandLineFlags.project) {
        project = commandLineFlags.project;
        console.log(`${chalk.green('√')} Selected project ${chalk.gray(`»`)} ${project}`);
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
                `${chalk.red('There is no projects with the following path:\n')}${chalk.yellow(
                    Array.isArray(folderPath) ? folderPath.join('\n') : folderPath
                )}`
            );
            process.exit();
        }

        if (projectList.length === 1) {
            console.log(`Creating component for ${chalk.yellow(projectList[0])} project`);
            componentSettingsMap.project = projectList[0];
            return;
        }

        const { selectedProject } = await Prompt(
            {
                type: 'select',
                name: 'selectedProject',
                message: 'Please, select the project',
                choices: projectList.map((p) => ({ title: p, value: p })),
                initial: 0,
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
            chalk.red(`Error: There is no folder for components in ${chalk.yellow(project)} project`),
            folderPath
        );
        process.exit();
    }
};
