import fs from 'fs';
import path from 'path';

import { getTemplate } from './getTemplate';
import { componentSettingsMap } from './componentSettingsMap';

export const generateFiles = async () => {
    const { root, project, componentName, projectRootPath, resultPath, fileList } = componentSettingsMap;
    const folder = path.join(root, project, projectRootPath, resultPath, componentName);

    if (!fs.existsSync(folder)) {
        await fs.promises.mkdir(folder);
    }

    const dataForTemplate = {
        project,
        componentName,
        files: fileList
    };

    for (const [, options] of Object.entries(fileList)) {
        const template = options.file ? (await getTemplate(options.file, dataForTemplate)) ?? '' : '';
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
        }
        await fs.promises.writeFile(path.join(folder, ...subFolders, fileName), template);
    }
};
