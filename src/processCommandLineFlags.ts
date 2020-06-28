import { program } from 'commander';
import { componentSettingsMap } from './componentSettingsMap';
import { Setting } from './types';

export const processCommandLineFlags = () => {
    program.option('-d, --dist <type>', 'path for creation');
    program.option('-n, --name <type>', 'component name');
    program.parse(process.argv);

    const commandLineKeys: (keyof Setting['commandLineFlags'])[] = ['name', 'dist'];

    const { dist = '', name = '' } = Object.fromEntries(
        // @ts-ignore
        Object.entries(program).filter(([key]) => commandLineKeys.includes(key))
    );

    componentSettingsMap.commandLineFlags = { dist, name };
};
