import fs from 'fs';
import path from 'path';

import { getTemplate } from './getTemplate';
import { componentSettingsMap } from './componentSettingsMap';
import { getRelativePath, processPath } from './helpers';
import { templatePlaceholdersData } from './types';

export const generateFiles = async () => {
    const {
        root,
        project,
        componentNames,
        componentFileList,
        projectRootPath,
        resultPath,
        templateName
    } = componentSettingsMap;
    for (const componentName of componentNames) {
        const fileList = componentFileList[componentName];
        const folder = path.join(root, project, projectRootPath, resultPath, componentName);

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
            getRelativePath: (to: string) => getRelativePath(objectFolder, to),
            files: fileList
        };

        for (const [, options] of Object.entries(fileList)) {
            const pathParts = path
                .join(options.name)
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
            const template = options.file ? (await getTemplate(options.file, dataForTemplate)) ?? '' : '';
            await fs.promises.writeFile(path.join(folder, ...subFolders, fileName), template);
        }
    }
};
