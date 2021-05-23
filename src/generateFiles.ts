import fs from 'fs';
import path from 'path';

import { getTemplate } from './getTemplate';
import { componentSettingsMap } from './componentSettingsMap';
import { getRelativePath, processPath, processObjectName, mapNameToCase } from './helpers';
import { isTypingCase, templatePlaceholdersData } from './types';

export const generateFiles = async () => {
    const { root, project, componentNames, componentFileList, projectRootPath, resultPath, templateName } =
        componentSettingsMap;

    for (const componentName of componentNames) {
        const fileList = componentFileList[componentName];
        const folder = path.join(root, project, projectRootPath, resultPath, processObjectName(componentName, true));

        if (!fs.existsSync(folder)) {
            await fs.promises.mkdir(folder);
        }

        const objectFolder = processPath(path.resolve(root, project, projectRootPath, resultPath, componentName));

        const dataForTemplate: templatePlaceholdersData = {
            project,
            componentName, // backward compatibility name
            objectName: componentName,
            objectType: templateName,
            pathToObject: processPath(path.join(project, projectRootPath)),
            destinationFolder: processPath(resultPath),
            objectFolder,
            relativeObjectFolder: processPath(path.join(project, projectRootPath, resultPath, componentName)),
            filePrefix: processObjectName(componentName, false),
            folderName: processObjectName(componentName, true),
            files: fileList,
            getRelativePath: (to: string) => getRelativePath(objectFolder, to),
            join: (...parts: string[]) => processPath(path.join(...parts)),
            stringToCase: (str: string, toCase: string) => {
                if (isTypingCase(toCase)) {
                    return mapNameToCase(str, toCase);
                }
                throw new Error('Unknown case');
            }
        };

        for (const fileOptions of Object.values(fileList)) {
            if (!fileOptions.selected) {
                continue;
            }
            const pathParts = path
                .join(fileOptions.name)
                .split(path.sep)
                .filter((part) => part);
            const fileName = pathParts[pathParts.length - 1];
            const subFolders = pathParts.slice(0, pathParts.length - 1);
            if (subFolders.length > 0) {
                for (let index = 0; index < subFolders.length; index++) {
                    const currentFolder = path.join(folder, ...subFolders.slice(0, index + 1));
                    if (!fs.existsSync(currentFolder)) {
                        await fs.promises.mkdir(currentFolder);
                    }
                }
                dataForTemplate.getRelativePath = (to: string) =>
                    getRelativePath(path.resolve(objectFolder, subFolders.join('/')), to);
            }
            const template = fileOptions.file ? (await getTemplate(fileOptions.file, dataForTemplate)) ?? '' : '';
            await fs.promises.writeFile(path.join(folder, ...subFolders, fileName), template);
        }
    }
};
