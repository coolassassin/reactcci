import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';

import { CONFIG_FILE_NAME } from './constants';
import { Config } from './types';

const prepareFolderPath = (path: string): string => {
    return `${path.replace(/(^\/|^\\|\/$|\\$)/g, '')}/`;
};

// This dynamic import is using because without "file://" prefix module can't be imported by Windows
const dynamicImport = async (pathToModule: string) => {
    return import(path.isAbsolute(pathToModule) ? pathToFileURL(pathToModule).toString() : pathToModule);
};

type Properties = {
    root: string;
};

export const setConfig = async ({ root }: Properties): Promise<Config> => {
    // @ts-ignore
    let res: Config = (await dynamicImport(path.resolve(__dirname, '../defaultConfig.cjs'))).default;
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        const manualConfig: Config = (await dynamicImport(localConfigPath)).default;
        res = { ...res, ...manualConfig, placeholders: { ...res.placeholders, ...manualConfig.placeholders } };
        if (Array.isArray(res.folderPath)) {
            res.folderPath = res.folderPath.map((p) => prepareFolderPath(p));
        } else {
            res.folderPath = prepareFolderPath(res.folderPath);
        }
    }
    return res;
};
