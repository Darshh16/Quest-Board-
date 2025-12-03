# Quest Board App

This is a local Quest Board application built with React, Vite, and Electron.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

## Development

To run the application in development mode:

```bash
npm run electron:dev
```

## Building the Executable (.exe)

To build the standalone `.exe` file for Windows:

```bash
npm run electron:build
```

**Note:** If you encounter an error like `ERROR: Cannot create symbolic link`, please run your terminal (PowerShell or Command Prompt) as **Administrator** or enable **Developer Mode** in Windows Settings. This is required for the build tools to extract necessary dependencies.

The output executable will be located in the `dist-electron` directory.
