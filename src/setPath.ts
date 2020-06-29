import { getQuestionsSettings } from './getQuestionsSettings';
import fs from 'fs';
import path from 'path';
import kleur from 'kleur';
import Prompt from 'prompts';
import { isDirectory } from './helpers';
import { componentSettingsMap } from './componentSettingsMap';
import { getProjectRootPath } from './getProjectRootPath';

const makePathShort = (path: string): string => {
    return path
        .replace(/\\$/, '')
        .split('\\')
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
        commandLineFlags: { dest },
    } = componentSettingsMap;

    let projectRootPath = dest;
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
                          description: makePathShort(path.join(project, projectRootPath, relativePath, '../')),
                      },
                  ]
                : []),
            {
                title: '>> Here <<',
                value: 1,
                description: path.join(project, projectRootPath, relativePath),
            },
            ...folders.map((f) => ({
                title: f,
                value: f,
                description: makePathShort(path.join(project, projectRootPath, relativePath, f)),
            })),
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
                },
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
