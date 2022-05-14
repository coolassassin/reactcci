import fs from 'fs';
import path from 'path';

import { getTemplate } from './getTemplate';
import { getRelativePath, processPath, processObjectName, mapNameToCase } from './helpers';
import { ComponentFileList, Config, isTypingCase, Project, templatePlaceholdersData } from './types';

type Properties = {
    root: string;
    moduleRoot: string;
    config: Config;
    project: Project;
    componentNames: string[];
    templateName: string;
    projectRootPath: string;
    resultPath: string;
    componentFileList: ComponentFileList;
};

export const generateFiles = async ({
    root,
    moduleRoot,
    config,
    project,
    templateName,
    componentNames,
    projectRootPath,
    resultPath,
    componentFileList
}: Properties) => {
    const { processFileAndFolderName } = config;

    for (const componentName of componentNames) {
        const fileList = componentFileList[componentName];
        const folder = path.join(
            root,
            project,
            projectRootPath,
            resultPath,
            processObjectName({ name: componentName, isFolder: true, processFileAndFolderName })
        );

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
            filePrefix: processObjectName({ name: componentName, isFolder: false, processFileAndFolderName }),
            folderName: processObjectName({ name: componentName, isFolder: true, processFileAndFolderName }),
            files: fileList,
            getRelativePath: (to: string) => getRelativePath({ root, from: objectFolder, to }),
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
                    getRelativePath({ root, from: path.resolve(objectFolder, subFolders.join('/')), to });
            }
            const template = fileOptions.file
                ? (await getTemplate({
                      root,
                      moduleRoot,
                      fileName: fileOptions.file,
                      insertionData: dataForTemplate,
                      config
                  })) ?? ''
                : '';
            await fs.promises.writeFile(path.join(folder, ...subFolders, fileName), template);
        }
    }
};
