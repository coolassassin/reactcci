import fs from 'fs';
import path from 'path';
import { componentSettingsMap } from './componentSettingsMap';

export const getTemplate = async (fileName, insertionData) => {
    const {
        root,
        config: { templatesFolder, placeholders },
    } = componentSettingsMap;

    const defaultTemplatesFolder = path.resolve(process.argv[1], '../../templates');
    const templatesPath = (await fs.existsSync(path.join(root, templatesFolder)))
        ? path.resolve(root, templatesFolder)
        : defaultTemplatesFolder;

    const templateFilePath = path.resolve(templatesPath, fileName);

    if (!fs.existsSync(templateFilePath)) {
        return '';
    }

    let templateData = (await fs.promises.readFile(templateFilePath)).toString();
    Object.entries(placeholders).forEach(([placeholder, replacer]) => {
        templateData = templateData.replace(new RegExp(`#${placeholder}#`, 'gim'), replacer(insertionData));
    });

    return templateData;
};
