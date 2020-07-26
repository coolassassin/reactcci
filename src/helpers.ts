import fs from 'fs';

export const isDirectory = (source) => fs.lstatSync(source).isDirectory();

export const capitalizeName = (value: string) => value.replace(/^./g, value[0].toUpperCase());

export const makePathShort = (path: string): string => {
    const sourcePath = path.replace(/[\\/]$/, '').replace(/\\/g, '/');
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
