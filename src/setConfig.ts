import path from 'path';
import fs from 'fs';

import { componentSettingsMap } from './componentSettingsMap';
import { CONFIG_FILE_NAME } from './constants';
import { Setting } from './types';

const prepareFolderPath = (path: string): string => {
    return `${path.replace(/(^\/|^\\|\/$|\\$)/g, '')}/`;
};

type Properties = {
    root: string;
};

export const setConfig = async ({ root }: Properties) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    let res: Setting['config'] = require('../defaultConfig.js');
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const manualConfig: Setting['config'] = require(localConfigPath);
        res = { ...res, ...manualConfig, placeholders: { ...res.placeholders, ...manualConfig.placeholders } };
        if (Array.isArray(res.folderPath)) {
            res.folderPath = res.folderPath.map((p) => prepareFolderPath(p));
        } else {
            res.folderPath = prepareFolderPath(res.folderPath);
        }
    }
    componentSettingsMap.config = res;
};
