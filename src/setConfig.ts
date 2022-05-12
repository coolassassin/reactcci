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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let res: Config = require('../defaultConfig.js');
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const manualConfig: Config = require(localConfigPath);
        res = { ...res, ...manualConfig, placeholders: { ...res.placeholders, ...manualConfig.placeholders } };
        if (Array.isArray(res.folderPath)) {
            res.folderPath = res.folderPath.map((p) => prepareFolderPath(p));
        } else {
            res.folderPath = prepareFolderPath(res.folderPath);
        }
    }
    return res;
};
