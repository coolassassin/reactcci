import fs from "fs";

export const isDirectory = (source) => fs.lstatSync(source).isDirectory();