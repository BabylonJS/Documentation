import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";

export const markdownDirectory = "content/";

export const getAllFiles = (dirPath: string, arrayOfFiles?: string[], extension = ".md"): string[] => {
    const files = readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = join(dirPath, "/", file);
        if (statSync(fullPath).isDirectory()) {
            // arrayOfFiles.push(fullPath);
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles, extension);
        } else {
            if (!extension) {
                arrayOfFiles.push(fullPath);
            }
            if (extension && file.endsWith(extension)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
};