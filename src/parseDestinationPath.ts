import kleur from 'kleur';

import path from 'path';
import fs from 'fs';

import { processPath } from './helpers';
import { CommandLineFlags, Config, Project } from './types';

type Properties = {
    root: string;
    commandLineFlags: CommandLineFlags;
    config: Config;
};

type Output = {
    project: Project;
    projectRootPath?: string;
    resultPath?: string;
};

export const parseDestinationPath = async ({
    root,
    commandLineFlags: { dest },
    config: { folderPath, multiProject }
}: Properties): Promise<Output> => {
    if (!dest) {
        return { project: '' };
    }

    const absolutePath = path.isAbsolute(dest) ? dest : path.resolve(root, dest);

    if (!fs.existsSync(absolutePath)) {
        console.error(kleur.red("Error: Path doesn't exist:"));
        console.error(kleur.yellow(absolutePath));
        process.exit();
        return { project: '' };
    }

    let relativePath = path.relative(root, absolutePath);

    if (relativePath === absolutePath || relativePath.startsWith('..')) {
        console.error(kleur.red('Error: component destination must be in project'));
        process.exit();
        return { project: '' };
    }

    let project = '';

    if (multiProject) {
        const [projectName, ...pathParts] = relativePath.split(path.sep);
        project = projectName;
        relativePath = pathParts.join(path.sep);
    }

    const potentialFolders = (typeof folderPath === 'string' ? [folderPath] : folderPath).map((f) =>
        path.join(f).replace(/[\\/]$/, '')
    );
    const availableFolders = potentialFolders.filter((folder) => fs.existsSync(path.resolve(root, project, folder)));
    const currentProjectRootPath = availableFolders.find((folder) => relativePath.startsWith(folder));

    if (!currentProjectRootPath) {
        console.error(kleur.red('Error: component destination must match to folderPath configuration parameter'));
        process.exit();
        return { project: '' };
    }

    const destinationPath = path.relative(path.resolve(root, project, currentProjectRootPath), absolutePath);

    return {
        project,
        projectRootPath: processPath(currentProjectRootPath),
        resultPath: processPath(destinationPath)
    };
};
