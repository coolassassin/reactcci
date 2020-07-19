#!/usr/bin/env node

import kleur from 'kleur';

import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { initialize } from './src/initialize';
import { checkConfig } from './src/checkConfig';
import { setComponentName } from './src/setComponentName';
import { buildComponent } from './src/buildComponent';
import { componentSettingsMap } from './src/componentSettingsMap';
import { processCommandLineFlags } from './src/processCommandLineFlags';
import { getModuleRootPath } from './src/getModuleRootPath';
import { setComponentTemplate } from './src/setComponentTemplate';

(async () => {
    try {
        componentSettingsMap.root = process.cwd();
        componentSettingsMap.moduleRoot = getModuleRootPath();

        processCommandLineFlags();

        if (componentSettingsMap.commandLineFlags.init) {
            await initialize();
            return;
        }

        await setConfig();
        await checkConfig();
        await setComponentTemplate();
        await setProject();
        await setPath();
        await setComponentName();

        await buildComponent();
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
