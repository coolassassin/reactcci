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

        config = await setComponentTemplate({ commandLineFlags, config });
        await parseDestinationPath({ root, commandLineFlags, config });
        await setProject({ root, commandLineFlags, config });
        await setPath({ root, commandLineFlags, config });

        await setComponentNames({ commandLineFlags });

        await buildComponent({ root, moduleRoot, commandLineFlags, config });
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
