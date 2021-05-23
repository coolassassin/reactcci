import { program } from 'commander';

import { componentSettingsMap } from './componentSettingsMap';
import { processCommandLineArguments } from './helpers';

export const processCommandLineFlags = () => {
    program.option('-u, --update', 'update mode, to add or replace files in existent object');
    program.option('-n, --name <type>', 'object name');
    program.option('-t, --template <type>', 'template name');
    program.option('-d, --dest <type>', 'path for creation');
    program.option('-s, --skip-search', 'skip search (default or destination folder)');
    program.option('-p, --project <type>', 'project name');
    program.option('-f, --files <type>', 'file types (style, test, stories)');
    program.option('--sls', 'skip last step');
    program.option('--nfc', 'without first component after initialization');
    program.parse(processCommandLineArguments(process.argv));

    const {
        update = false,
        skipSearch = false,
        sls = false,
        nfc = false,
        dest = '',
        name = '',
        template = '',
        project = '',
        files = ''
    } = program.opts() || {};

    componentSettingsMap.commandLineFlags = {
        update,
        skipSearch,
        sls,
        nfc,
        dest,
        name,
        template,
        project,
        files
    };
};
