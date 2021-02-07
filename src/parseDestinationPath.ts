import kleur from 'kleur';

import path from 'path';
import fs from 'fs';

import { componentSettingsMap } from './componentSettingsMap';
import { processPath } from './helpers';

export const parseDestinationPath = async () => {
    const {
        root,
        config: { folderPath, multiProject },
        commandLineFlags: { dest, update, skipSearch }
    } = componentSettingsMap;

    if (!dest) {
        return false;
    }

    const absolutePath = path.isAbsolute(dest) ? dest : path.resolve(root, dest);

    if (!fs.existsSync(absolutePath)) {
        console.error(kleur.red("Error: Path doesn't exist:"));
        console.error(kleur.yellow(absolutePath));
        process.exit();
        return;
    }

    let relativePath = path.relative(root, absolutePath);

    if (relativePath === absolutePath || relativePath.startsWith('..')) {
        console.error(kleur.red('Error: component destination must be in project'));
        process.exit();
        return;
    }

    let project = '';

    if (multiProject) {
        const [projectName, ...pathParts] = relativePath.split(path.sep);
        project = projectName;
        relativePath = pathParts.join(path.sep);
    }

    const potentialFolders = (typeof folderPath === 'string' ? [folderPath] : folderPath).map((f) => path.join(f));
    const availableFolders = potentialFolders.filter((folder) => fs.existsSync(path.resolve(root, project, folder)));
    const currentProjectRootPath = availableFolders.find((folder) => relativePath.startsWith(folder));

    if (!currentProjectRootPath) {
        console.error(kleur.red('Error: component destination must match to folderPath configuration parameter'));
        process.exit();
        return;
    }

    const destinationPath = path.relative(path.resolve(root, project, currentProjectRootPath), absolutePath);

    componentSettingsMap.project = project;
    componentSettingsMap.projectRootPath = processPath(currentProjectRootPath);
    componentSettingsMap.resultPath = processPath(destinationPath);

    return true;
};
