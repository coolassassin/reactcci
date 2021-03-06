import kleur from 'kleur';
import Prompt from 'prompts';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import {
    isDirectory,
    makePathShort,
    processObjectName,
    processPath,
    splitStringByCapitalLetter,
    writeToConsole
} from './helpers';
import { componentSettingsMap } from './componentSettingsMap';
import { getProjectRootPath } from './getProjectRootPath';

export const filterChoicesByText = (choices: { title: string }[], query: string, isRoot: boolean) =>
    choices.filter((choice, index) => {
        if (query === '') {
            return true;
        }
        if (index === 0 || (!isRoot && index === 1)) {
            return false;
        }
        return (
            choice.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
            splitStringByCapitalLetter(query)?.every((part) =>
                splitStringByCapitalLetter(choice.title)?.some((substr) => substr.startsWith(part))
            )
        );
    });

export const setPath = async () => {
    const {
        root,
        project,
        templateName,
        config: { folderPath },
        commandLineFlags: { dest, update, skipSearch }
    } = componentSettingsMap;

    const potentialFolders = typeof folderPath === 'string' ? [folderPath] : folderPath;
    const availableFolders = potentialFolders.filter((folder) => fs.existsSync(path.resolve(root, project, folder)));

    let projectRootPath = componentSettingsMap.projectRootPath ?? dest;

    if (!projectRootPath) {
        if (availableFolders.length === 0) {
            console.error(kleur.red(`Error: There is no any folder for ${templateName} from the list below`));
            console.error(kleur.yellow(potentialFolders.map((f) => path.resolve(root, project, f)).join('\n')));
            process.exit();
            return;
        } else if (availableFolders.length === 1) {
            projectRootPath = availableFolders[0];
        } else {
            projectRootPath = await getProjectRootPath(availableFolders);
        }
    }

    if (componentSettingsMap.resultPath) {
        componentSettingsMap.resultPath.split('/').forEach((part) => {
            writeToConsole(`${kleur.green('√')} Select destination folder for component ${kleur.gray(`»`)} ${part}`);
        });
    }

    let resultPath: string | null = null;
    let relativePath = componentSettingsMap.resultPath ?? '.';
    if (skipSearch) {
        resultPath = relativePath;
    } else {
        while (resultPath === null) {
            const currentFolder = path.resolve(project, projectRootPath, relativePath);
            try {
                await fs.promises.stat(currentFolder);
            } catch (e) {
                console.error(kleur.red(`Error: There is no folder for ${templateName}`), kleur.yellow(currentFolder));
                console.error(e);
                process.exit();
                return;
            }

            const folders = (
                await fs.promises.readdir(path.resolve(project, projectRootPath, relativePath))
            ).filter((item) => isDirectory(path.resolve(project, projectRootPath, relativePath, item)));

            if (folders.length === 0) {
                resultPath = path.join(relativePath);
                continue;
            }
            const isRoot = ['.', './', '.\\'].includes(relativePath);

            type Choice = {
                title: string;
                value: string | number;
                description: string;
            };

            const choices: Choice[] = folders.map((f) => ({
                title: f,
                value: f,
                description: makePathShort(path.join(project, projectRootPath, relativePath, f))
            }));

            if (!(update && isRoot)) {
                choices.unshift({
                    title: update ? '>> This <<' : '>> Here <<',
                    value: 1,
                    description: makePathShort(path.join(project, projectRootPath, relativePath))
                });
            }

            if (!isRoot) {
                choices.unshift({
                    title: '< Back',
                    value: -1,
                    description: makePathShort(path.join(project, projectRootPath, relativePath, '../'))
                });
            }

            let searching = false;
            const { folder } = await Prompt(
                {
                    type: 'autocomplete',
                    name: 'folder',
                    message: update
                        ? `Select ${templateName} to update`
                        : `Select destination folder for ${templateName}`,
                    hint: 'Select using arrows and press Enter',
                    choices: choices.map((choice) => ({ ...choice, description: kleur.yellow(choice.description) })),
                    initial: isRoot ? 0 : 1,
                    onState() {
                        if (this.input === '' && searching) {
                            this.select = isRoot ? 0 : 1;
                            searching = false;
                        } else if (this.input !== '' && !searching) {
                            this.select = 0;
                            searching = true;
                        }
                    },
                    suggest: (text, choices) => {
                        return Promise.resolve(filterChoicesByText(choices, text, isRoot));
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
    }

    componentSettingsMap.projectRootPath = processPath(projectRootPath);
    componentSettingsMap.resultPath = processPath(resultPath);

    if (update) {
        const pathParts = componentSettingsMap.resultPath.split('/');
        componentSettingsMap.resultPath = pathParts.slice(0, pathParts.length - 1).join('/');
        componentSettingsMap.componentNames = [processObjectName(pathParts[pathParts.length - 1], true, true)];
    }
};
