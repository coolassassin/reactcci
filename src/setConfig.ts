import path from 'path';
import fs from 'fs';

import { CONFIG_FILE_NAME } from './constants';
import { Config } from './types';

const prepareFolderPath = (path: string): string => {
    return `${path.replace(/(^\/|^\\|\/$|\\$)/g, '')}/`;
};

type Properties = {
    root: string;
};

export const setConfig = async ({ root }: Properties): Promise<Config> => {
    // @ts-ignore
    let res: Config = (await import('../defaultConfig.js')).default;
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        const manualConfig: Config = (await import(localConfigPath)).default;
        res = { ...res, ...manualConfig, placeholders: { ...res.placeholders, ...manualConfig.placeholders } };
        if (Array.isArray(res.folderPath)) {
            res.folderPath = res.folderPath.map((p) => prepareFolderPath(p));
        } else {
            res.folderPath = prepareFolderPath(res.folderPath);
        }
    }
    return res;
};
