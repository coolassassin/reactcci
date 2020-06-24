import path from 'path';
import fs from 'fs';
import { componentSettingsMap } from './componentSettingsMap';

const CONFIG_FILE_NAME = 'rcci.config.js';

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
