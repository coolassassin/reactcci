import kleur from 'kleur';
import Prompt from 'prompts';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import { isDirectory, writeToConsole } from './helpers';
import { CommandLineFlags, Config, Project } from './types';

const typeAboutSelectedProject = (project: Project) => {
    writeToConsole(`${kleur.green('√')} Selected project ${kleur.gray(`»`)} ${project}`);
};

type Properties = {
    project: Project;
    root: string;
    commandLineFlags: CommandLineFlags;
    config: Config;
    templateName: string;
};

export const setProject = async ({
    project: inputProject,
    root,
    commandLineFlags,
    config: { multiProject, folderPath },
    templateName
}: Properties): Promise<Project> => {
    let project = '';

    if (inputProject) {
        typeAboutSelectedProject(inputProject);
        return inputProject;
    }

    if (commandLineFlags.dest || !multiProject) {
        return '';
    }

    if (commandLineFlags.project) {
        project = commandLineFlags.project;
        typeAboutSelectedProject(project);
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
            return '';
        }

        if (projectList.length === 1) {
            writeToConsole(`Creating ${templateName} for ${kleur.yellow(projectList[0])} project`);
            return projectList[0];
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
        return project;
    }

    console.error(
        kleur.red(`Error: There is no folder for ${templateName} in ${kleur.yellow(project)} project`),
        folderPath
    );
    process.exit();
    return '';
};
