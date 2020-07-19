import fs from 'fs';

export const isDirectory = (source) => fs.lstatSync(source).isDirectory();
export const capitalizeName = (value: string) => value.replace(/^./g, value[0].toUpperCase());
