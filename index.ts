#!/usr/bin/env node

import kleur from 'kleur';
import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { checkConfig } from './src/checkConfig';
import { setComponentName } from './src/setComponentName';
import { buildComponent } from './src/buildComponent';
import { componentSettingsMap } from './src/componentSettingsMap';
import { processCommandLineFlags } from './src/processCommandLineFlags';

(async () => {
    try {
        componentSettingsMap.root = process.cwd();
        processCommandLineFlags();
        await setConfig();
        await checkConfig();
        await setProject();
        await setPath();
        await setComponentName();

        await buildComponent();
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
