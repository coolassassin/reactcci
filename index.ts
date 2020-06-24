#!/usr/bin/env node

import chalk from 'chalk';
import { program } from 'commander';
import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { checkConfig } from './src/checkConfig';
import { setComponentName } from './src/setComponentName';
import { buildComponent } from './src/buildComponent';
import { componentSettingsMap } from './src/componentSettingsMap';

program.option('-d, --dist <type>', 'path for creation');
program.parse(process.argv);

(async () => {
    try {
        componentSettingsMap.root = process.cwd();
        await setConfig();
        await checkConfig();
        if (program.dist) {
            componentSettingsMap.project = '';
            await setPath(program.dist);
        } else {
            await setProject();
            await setPath();
        }
        await setComponentName();

        await buildComponent();
    } catch (e) {
        console.error(chalk.red('Unexpected error'), e);
        process.exit();
    }
})();
