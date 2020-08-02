import fs from 'fs';
import path from 'path';

import { componentSettingsMap } from './componentSettingsMap';

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
