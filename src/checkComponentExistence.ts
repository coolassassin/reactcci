import Prompt from 'prompts';

import fs from 'fs';
import path from 'path';

import { getQuestionsSettings } from './getQuestionsSettings';
import { CommandLineFlags, Config } from './types';

type Properties = {
    componentNames: string[];
    projectRootPath: string;
    resultPath: string;
    commandLineFlags: CommandLineFlags;
    config: Config;
};

export const checkComponentExistence = async ({
    componentNames,
    projectRootPath,
    resultPath,
    commandLineFlags: { update },
    config: { checkExistenceOnCreate }
}: Properties) => {
    if (!checkExistenceOnCreate || update) {
        return;
    }
    const components = componentNames.map((name) => ({
        name,
        exist: fs.existsSync(path.resolve(projectRootPath, resultPath, name))
    }));
    const existComponentCount = components.reduce((acc, { exist }) => acc + (exist ? 1 : 0), 0);

    if (existComponentCount <= 0) {
        return;
    }

    const { agree } = await Prompt(
        {
            type: 'toggle',
            name: 'agree',
            message: `Component${existComponentCount > 1 ? 's' : ''} ${components
                .filter((t) => t.exist)
                .map((t) => t.name)
                .join(', ')} ${existComponentCount > 1 ? 'are' : 'is'} already exist. Do you want to replace?`,
            initial: false,
            active: 'Yes',
            inactive: 'No'
        },
        getQuestionsSettings()
    );

    if (!agree) {
        process.exit();
    }
};
