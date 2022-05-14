#!/usr/bin/env node

import kleur from 'kleur';

import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { initialize } from './src/initialize';
import { checkConfig } from './src/checkConfig';
import { setComponentNames } from './src/setComponentNames';
import { buildComponent } from './src/buildComponent';
import { processCommandLineFlags } from './src/processCommandLineFlags';
import { getModuleRootPath } from './src/getModuleRootPath';
import { setComponentTemplate } from './src/setComponentTemplate';
import { parseDestinationPath } from './src/parseDestinationPath';

(async () => {
    try {
        const root = process.cwd();
        const moduleRoot = getModuleRootPath();
        const commandLineFlags = processCommandLineFlags();

        await initialize({ root, moduleRoot, commandLineFlags });

        let config = await setConfig({ root });
        await checkConfig({ config });
        const { config: newConfig, templateName } = await setComponentTemplate({ commandLineFlags, config });
        config = newConfig;

        let project = await parseDestinationPath({ root, commandLineFlags, config });
        project = await setProject({ project, root, commandLineFlags, config, templateName });

        await setPath({ root, commandLineFlags, config, project, templateName });

        const componentNames = await setComponentNames({ commandLineFlags, templateName });

        await buildComponent({ root, moduleRoot, commandLineFlags, config, project, templateName, componentNames });
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
