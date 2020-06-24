import { getQuestionsSettings } from './getQuestionsSettings';
import fs from 'fs';
import path from 'path';
import chalk from "chalk";
import Prompt from 'prompts';
import { isDirectory } from './helpers';
import { componentSettingsMap } from './componentSettingsMap';
import {getProjectRootPath} from "./getProjectRootPath";

export const setPath = async (initialPath: string = '') => {
    const { root, project, config: {folderPath} } = componentSettingsMap;

    let projectRootPath = initialPath;
    if (!projectRootPath) {
        if (Array.isArray(folderPath)) {
            const availablePaths = folderPath.filter((folder) => fs.existsSync(path.resolve(root, project, folder)));
            if (availablePaths.length === 1) {
                projectRootPath = availablePaths[0];
            } else {
                projectRootPath = await getProjectRootPath(availablePaths);
            }
        } else {
            projectRootPath = folderPath;
        }
    }
    let relativePath = '.\\';
    let resultPath: string | null = null;
    while (resultPath === null) {
        const folders = (
            await fs.promises.readdir(path.resolve(project, projectRootPath, relativePath))
        ).filter((item) => isDirectory(path.resolve(project, projectRootPath, relativePath, item)));

        if (folders.length === 0) {
            resultPath = path.join(relativePath);
            continue;
        }

        const isRoot = relativePath === '.\\';
        const choices = [
            ...(!isRoot
                ? [
                      {
                          title: '< Back',
                          value: -1,
                          description: path.join(project, projectRootPath, relativePath, '../'),
                      },
                  ]
                : []),
            {
                title: '>> Here <<',
                value: null,
                description: path.join(project, projectRootPath, relativePath),
            },
            ...folders.map((f) => ({
                title: f,
                value: f,
                description: path.join(project, projectRootPath, relativePath, f),
            })),
        ];
        const { folder } = await Prompt(
            {
                type: 'select',
                name: 'folder',
                message: `Select destination folder for component`,
                hint: 'Select using arrows and press Enter',
                choices: choices.map(choice => ({...choice, description: chalk.yellow(choice.description)})),
                initial: isRoot ? 0 : 1,
            },
            getQuestionsSettings()
        );

        if (folder) {
            relativePath = path.join(relativePath, folder === -1 ? '../' : folder);
        } else {
            resultPath = relativePath;
        }
    }

    componentSettingsMap.projectRootPath = projectRootPath;
    componentSettingsMap.resultPath = resultPath;
};
