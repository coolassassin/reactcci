import path from 'path';
import fs from 'fs';
import { componentSettingsMap } from './componentSettingsMap';
import { CONFIG_FILE_NAME } from './constants';

export const setConfig = async () => {
    const { root } = componentSettingsMap;
    let res = require('../defaultConfig.js');
    const localConfigPath = path.resolve(root, CONFIG_FILE_NAME);
    if (fs.existsSync(localConfigPath)) {
        const manualConfig = require(localConfigPath);
        res = Object.assign(res, manualConfig);
    }
    componentSettingsMap.config = res;
};
