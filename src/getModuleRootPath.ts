import path from 'path';
import { MODULE_NAME } from './constants';

export const getModuleRootPath = () => {
    const executableFilePathParts = process.argv[1].split(path.sep);
    const nodeModulesFolderIndex = executableFilePathParts.findIndex((part) => part === 'node_modules');
    if (nodeModulesFolderIndex === -1) {
        return executableFilePathParts.slice(0, executableFilePathParts.length - 1).join(path.sep);
    }
    return [...executableFilePathParts.slice(0, nodeModulesFolderIndex + 1), MODULE_NAME].join(path.sep);
};
