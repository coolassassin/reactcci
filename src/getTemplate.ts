import fs from 'fs';
import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';
import { templatePlaceholdersData } from './types';

type Properties = {
    root: string;
    moduleRoot: string;
    fileName: string;
    insertionData: templatePlaceholdersData;
};

export const getTemplate = async ({ root, moduleRoot, fileName, insertionData }: Properties) => {
    const {
        config: { templatesFolder, placeholders }
    } = componentSettingsMap;

    const defaultTemplatesFolder = path.resolve(moduleRoot, 'templates');
    const templatesPath = (await fs.existsSync(path.join(root, templatesFolder)))
        ? path.resolve(root, templatesFolder)
        : defaultTemplatesFolder;

    const templateFilePath = path.resolve(templatesPath, fileName);

    if (!fs.existsSync(templateFilePath)) {
        return '';
    }

    let templateData = (await fs.promises.readFile(templateFilePath)).toString();
    Object.entries(placeholders).forEach(([placeholder, replacer]) => {
        const placeholderRegular = new RegExp(`#${placeholder}#`, 'gim');
        if (placeholderRegular.test(templateData)) {
            templateData = templateData.replace(new RegExp(`#${placeholder}#`, 'gim'), replacer(insertionData));
        }
    });

    return templateData;
};
