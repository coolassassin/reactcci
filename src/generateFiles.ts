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
        files: fileList,
    };

    for (const [, options] of Object.entries(fileList)) {
        const template = options.file ? (await getTemplate(options.file, dataForTemplate) ?? '') : '';
        await fs.promises.writeFile(path.join(folder, options.name), template);
    }
};
