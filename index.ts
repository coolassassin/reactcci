#!/usr/bin/env node

import kleur from 'kleur';

import { checkComponentExistence } from './src/checkComponentExistence';
import { setPath } from './src/setPath';
import { setConfig } from './src/setConfig';
import { setProject } from './src/setProject';
import { initialize } from './src/initialize';
import { checkConfig } from './src/checkConfig';
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

        const parsedPath = await parseDestinationPath({
            root,
            commandLineFlags,
            config
        });
        const project = await setProject({ project: parsedPath.project, root, commandLineFlags, config, templateName });

        const { componentNames, resultPath, projectRootPath } = await setPath({
            root,
            commandLineFlags,
            config,
            project,
            templateName,
            resultPathInput: parsedPath.resultPath,
            projectRootPathInput: parsedPath.projectRootPath
        });

        await checkComponentExistence({ componentNames, commandLineFlags, resultPath, projectRootPath, config });

        await buildComponent({
            root,
            moduleRoot,
            commandLineFlags,
            config,
            project,
            templateName,
            componentNames,
            resultPath,
            projectRootPath
        });
    } catch (e) {
        console.error(kleur.red('Unexpected error'), e);
        process.exit();
    }
})();
