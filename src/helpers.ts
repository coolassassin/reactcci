import fs from 'fs';
import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';
import { ProcessFileAndFolderName } from './types';

export const isDirectory = (source) => fs.lstatSync(source).isDirectory();

export const capitalizeName = (value: string) => value.replace(/^./g, value[0].toUpperCase());

export const processPath = (path: string): string => {
    return path.replace(/(^[\\/]|[\\/]$)/g, '').replace(/\\/g, '/');
};

export const makePathShort = (path: string): string => {
    const sourcePath = processPath(path);
    const pathArray = sourcePath.split('/');
    if (pathArray.length <= 4) {
        return sourcePath;
    }
    return pathArray
        .reduce((acc: string[], value, index, arr) => {
            if (index < 1 || index > arr.length - 4) {
                if (index === arr.length - 3) {
                    acc.push('...');
                }
                acc.push(value);
            }
            return acc;
        }, [])
        .join('/');
};

export const writeToConsole = (str: string) => {
    process.stdout.write(`${str}\n`);
};

export const getRelativePath = (from: string, to: string): string => {
    const { root } = componentSettingsMap;
    const destination = path.isAbsolute(to) ? processPath(to) : processPath(path.resolve(root, processPath(to)));
    return processPath(path.relative(from, destination));
};

export const processCommandLineArguments = (args: string[]): string[] => {
    let isCollecting = false;
    return args.reduce((acc: string[], value, index, arr) => {
        if (['-n', '--name', '-f', '--files'].includes(arr[index - 1])) {
            isCollecting = true;
            acc.push(value);
            return acc;
        } else if (value.startsWith('-')) {
            isCollecting = false;
        }
        if (isCollecting) {
            acc[acc.length - 1] += ` ${value}`;
            return acc;
        }
        acc.push(value);
        return acc;
    }, []);
};

export const processComponentNameString = (name: string | undefined): string[] | undefined => {
    if (typeof name === 'undefined') {
        return;
    }

    if (!name.includes(' ')) {
        return [name];
    }

    return name
        .trim()
        .replace(/\s{1,}/g, ' ')
        .split(' ')
        .reduce((acc: string[], value) => {
            if (!acc.some((v) => v === value)) {
                acc.push(value);
            }
            return acc;
        }, []);
};

export const splitStringByCapitalLetter = (value?: string): string[] | undefined => {
    if (!value || value.length === 0) {
        return undefined;
    }
    return value.split('').reduce((acc: string[], letter) => {
        if (acc.length === 0 || (letter === letter.toUpperCase() && /\w/.test(letter))) {
            acc.push(letter);
            return acc;
        }
        acc[acc.length - 1] += letter;
        return acc;
    }, []);
};

export const getObjectNameParts = (name: string): string[] => {
    return name
        .replace(/([A-Z])/g, '-$1')
        .replace(/[^a-zA-Z0-9]/g, '-')
        .split('-')
        .filter((l) => l);
};

export const processObjectName = (name: string, isFolder = false): string => {
    const {
        config: { processFileAndFolderName }
    } = componentSettingsMap;
    return processFileAndFolderName ? processFileAndFolderName(name, getObjectNameParts(name), isFolder) : name;
};

export const generateFileName = (fileNameTemplate: string, objectName: string) => {
    return fileNameTemplate.replace('[name]', processObjectName(objectName));
};

export const getIsFileAlreadyExists = (fileNameTemplate: string, objectName: string) => {
    const { root, project, projectRootPath, resultPath } = componentSettingsMap;
    const folder = path.join(root, project, projectRootPath, resultPath, objectName);
    const fileName = generateFileName(fileNameTemplate, objectName);
    return fs.existsSync(path.resolve(folder, fileName));
};
