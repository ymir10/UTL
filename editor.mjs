// prodduction ready editor
// use for editing files with support for syntax highlighting, auto-completion and error checking
// can be extended to support multiple file types and languages

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const CONFIG = {
    overWrite: true,
    createDirectory: true,
    backupBeforeEdit: true,
    allowFileRemoval: true,
    deleteAfterBackup: true,
    maxBackupFiles: 5
}

function setConfig(config) {
  Object.assign(CONFIG, config);
}



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const Editor = {
    createDirectory: async function (dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },
    backupFile: async function (filePath) {
        if (fs.existsSync(filePath)) {
            const backupDir = path.join(__dirname, 'backups');
            this.createDirectory(backupDir);
            const backupFileName = `${path.basename(filePath)}.bak`;
            const backupFilePath = path.join(backupDir, backupFileName);
            fs.copyFileSync(filePath, backupFilePath);
            this.cleanupBackups(backupDir);
        }
    },
    cleanupBackups: function (backupDir) {
        const files = fs.readdirSync(backupDir).filter(file => file.endsWith('.bak'));
        if (files.length > CONFIG.maxBackupFiles) {
            const filesToDelete = files.sort((a, b) => fs.statSync(path.join(backupDir, a)).ctime - fs.statSync(path.join(backupDir, b)).ctime).slice(0, files.length - CONFIG.maxBackupFiles);
            filesToDelete.forEach(file => fs.unlinkSync(path.join(backupDir, file)));
        }
    },
    editFile: async function (filePath, content) {
        if (CONFIG.backupBeforeEdit) {
            await this.backupFile(filePath);
        }
        if (CONFIG.overWrite || !fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content, 'utf-8');
        } else {
            throw new Error(`File already exists: ${filePath}`);
        }
    },
    deleteFile: async function (filePath) {
        if (CONFIG.allowFileRemoval && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            throw new Error(`File does not exist or removal not allowed: ${filePath}`);
        }
    }
}


export default Editor;
export { setConfig };