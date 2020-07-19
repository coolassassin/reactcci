import kleur from 'kleur';
import Prompt from 'prompts';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import { isDirectory } from './helpers';
import { componentSettingsMap } from './componentSettingsMap';
import { getProjectRootPath } from './getProjectRootPath';

const makePathShort = (path: string): string => {
    const sourcePath = path.replace(/\\$/, '');
    const pathArray = sourcePath.split('\\');
    if (pathArray.length <= 4) {
        return sourcePath;
    }
    return pathArray
        .reduce((acc: string[], value, index, arr) => {
            if (index < 1 || index > arr.length - 4) {
                if (index === arr.length - 3) {
                    acc.push('...');
                }
                acc.push(value);
            }
            return acc;
        }, [])
        .join('\\');
};

export const setPath = async () => {
    const {
        root,
        project,
        config: { folderPath },
        commandLineFlags: { dest }
    } = componentSettingsMap;

    let projectRootPath = dest;
    if (!projectRootPath) {
        if (Array.isArray(folderPath)) {
            const availablePaths = folderPath.filter((folder) => fs.existsSync(path.resolve(root, project, folder)));
            if (availablePaths.length === 0) {
                console.error(kleur.red(`Error: There is no any folder for components from the list below`));
                console.error(kleur.yellow(folderPath.map((f) => path.resolve(root, project, f)).join('\n')));
                process.exit();
            } else if (availablePaths.length === 1) {
                projectRootPath = availablePaths[0];
            } else {
                projectRootPath = await getProjectRootPath(availablePaths);
            }
        } else {
            projectRootPath = folderPath;
        }
    }
    let relativePath = '.';
    let resultPath: string | null = null;
    while (resultPath === null) {
        const currentFolder = path.resolve(project, projectRootPath, relativePath);
        try {
            await fs.promises.stat(currentFolder);
        } catch (e) {
            console.error(kleur.red(`Error: There is no folder for components`), kleur.yellow(currentFolder));
            console.error(e);
            process.exit();
        }

        const folders = (
            await fs.promises.readdir(path.resolve(project, projectRootPath, relativePath))
        ).filter((item) => isDirectory(path.resolve(project, projectRootPath, relativePath, item)));

        if (folders.length === 0) {
            resultPath = path.join(relativePath);
            continue;
        }
        const isRoot = ['.', './', '.\\'].includes(relativePath);
        const choices = [
            ...(!isRoot
                ? [
                      {
                          title: '< Back',
                          value: -1,
                          description: makePathShort(path.join(project, projectRootPath, relativePath, '../'))
                      }
                  ]
                : []),
            {
                title: '>> Here <<',
                value: 1,
                description: makePathShort(path.join(project, projectRootPath, relativePath))
            },
            ...folders.map((f) => ({
                title: f,
                value: f,
                description: makePathShort(path.join(project, projectRootPath, relativePath, f))
            }))
        ];

        const { folder } = await Prompt(
            {
                type: 'autocomplete',
                name: 'folder',
                message: `Select destination folder for component`,
                hint: 'Select using arrows and press Enter',
                choices: choices.map((choice) => ({ ...choice, description: kleur.yellow(choice.description) })),
                initial: isRoot ? 0 : 1,
                suggest: (text, choices) => {
                    const filteredChoices = choices.filter(
                        (choice, index) =>
                            index < (isRoot ? 1 : 2) ||
                            choice.title.toLocaleLowerCase().includes(text.toLocaleLowerCase())
                    );
                    return Promise.resolve(filteredChoices);
                }
            },
            getQuestionsSettings()
        );

        if (folder === 1) {
            resultPath = relativePath;
        } else if (folder === -1) {
            relativePath = path.join(relativePath, '../');
        } else {
            relativePath = path.join(relativePath, folder);
        }
    }

    componentSettingsMap.projectRootPath = projectRootPath;
    componentSettingsMap.resultPath = resultPath;
};
