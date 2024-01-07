const fs = require('fs').promises;
const path = require('path');

class Interpreter {
    constructor() {
        this.validFiles = [];
        this.ResponseObject = {}
    }

    async process(filePath) {
        // Clear the validFiles array before processing a new directory
        this.validFiles = [];
        this.ResponseObject = {};

        try {
            // Ensure the provided filePath is a valid directory
            await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK);

            // Read all files in the directory and its subdirectories
            await this.readFilesRecursive(filePath);



            for (filePath of this.validFiles) {
                var chunkObject = {}

                var fileName = path.basename(filePath)
                var fileData = (await fs.readFile(filePath, "utf-8")).trim()



                if (fileName.endsWith(".server.lua")) {

                    fileName = fileName.replace(/\..*$/, '');

                    chunkObject = {
                        Type: "Server",
                        Data: fileData
                    }

                    this.ResponseObject[fileName] = chunkObject

                } else if (fileName.endsWith(".client.lua")) {

                    fileName = fileName.replace(/\..*$/, '');

                    chunkObject = {
                        Type: "Client",
                        Data: fileData
                    }

                    this.ResponseObject[fileName] = chunkObject

                } else if (fileName.endsWith(".module.lua")) {

                    fileName = fileName.replace(/\..*$/, '');

                    chunkObject = {
                        Type: "Module",
                        Data: fileData
                    }

                    this.ResponseObject[fileName] = chunkObject
                } else if (fileName.endsWith(".json")) {
                    fileData = JSON.parse(fileData)
                    this.ResponseObject[fileData.Name] = fileData
                }

            }

            return this.ResponseObject

        } catch (err) {
            console.error('Error:', err.message);
        }
    }

    async readFilesRecursive(directory) {
        try {
            // Read the contents of the directory
            const files = await fs.readdir(directory);

            // Process each file or directory
            for (const file of files) {
                const fullPath = path.join(directory, file);

                // Check if it's a directory
                if ((await fs.stat(fullPath)).isDirectory()) {
                    // Skip processing the .git directory
                    if (file !== '.git') {
                        // Recursively read files in the subdirectory
                        await this.readFilesRecursive(fullPath);
                    }
                } else {
                    // Check for file exclusions and specific extensions
                    if (
                        file !== 'LICENSE' &&
                        (file.endsWith('.server.lua') ||
                            file.endsWith('.client.lua') ||
                            file.endsWith('module.lua') ||
                            file.endsWith('.json'))
                    ) {
                        // Store the valid file in the array
                        this.validFiles.push(fullPath);
                    }
                }
            }
        } catch (err) {
            console.error('Error reading directory:', err.message);
        }
    }
}
module.exports = Interpreter;