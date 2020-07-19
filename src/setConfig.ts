import path from 'path';
import fs from 'fs';

import { componentSettingsMap } from './componentSettingsMap';
import { CONFIG_FILE_NAME } from './constants';

const prepareFolderPath = (path: string): string => {
    return `${path.replace(/(^\/|^\\|\/$|\\$)/g, '')}/`;
};

export const setConfig = async () => {
    const { root } = componentSettingsMap;
    let res = require('../defaultConfig.js');
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        const manualConfig = require(localConfigPath);
        res = Object.assign(res, manualConfig);
        if (Array.isArray(res.folderPath)) {
            res.folderPath = res.folderPath.map((p) => prepareFolderPath(p));
        } else {
            res.folderPath = prepareFolderPath(res.folderPath);
        }
    }
    componentSettingsMap.config = res;
};
