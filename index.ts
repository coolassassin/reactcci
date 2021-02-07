#!/usr/bin/env node

import kleur from 'kleur';

import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { initialize } from './src/initialize';
import { checkConfig } from './src/checkConfig';
import { setComponentNames } from './src/setComponentNames';
import { buildComponent } from './src/buildComponent';
import { componentSettingsMap } from './src/componentSettingsMap';
import { processCommandLineFlags } from './src/processCommandLineFlags';
import { getModuleRootPath } from './src/getModuleRootPath';
import { setComponentTemplate } from './src/setComponentTemplate';
import { parseDestinationPath } from './src/parseDestinationPath';

(async () => {
    try {
        componentSettingsMap.root = process.cwd();
        componentSettingsMap.moduleRoot = getModuleRootPath();

        processCommandLineFlags();

        await initialize();
        await setConfig();
        await checkConfig();

        await setComponentTemplate();
        await parseDestinationPath();
        await setProject();
        await setPath();

        await setComponentNames();

        await buildComponent();
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
