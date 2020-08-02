# React create component interactive CLI
CLI which allows you to build your React application with your own file structure and make your components interactively without typing any paths.
Setup your config once to build your app as quick as it possible.

![Example](https://raw.githubusercontent.com/coolassassin/reactcci/master/readme-example.gif)

[![Build Status](https://travis-ci.org/coolassassin/reactcci.svg?branch=master)](https://travis-ci.org/github/coolassassin/reactcci)

## Installation
To install via npm:  
```npm install --save-dev reactcci```  

To install via yarn:  
```yarn add --dev reactcci```

Also, you are able to install it globally:  
```npm install reactcci -g```

## Running
If the package has been installed globally, run it simply by `reactcci`

If it is the local package type `npx reactcci` or `yarn reactcci`

## Quick start
CLI allows you to build your application without any configuration, 
but to set up your config quickly you are able to execute next command:  
`reactcci --init`  
This command runs configuration mode, 
which allow you to generate config and template folder without any manual manipulations.

## Path
By default, components will be added into `src/` folder. To change this, you can set up your own config or run it with the flag:  
```reactcci --dest src/app/components```

Also, you can type `reactcci --help` to see all available commands.

## Config
To set up your config, you need to create `rcci.config.js`  
The default config has the next structure:
```javascript
module.exports = {
    multiProject: false,
    skipFinalStep: false,
    folderPath: 'src/',
    templatesFolder: 'templates',
    templates: {
        index: {
            name: 'index.ts',
            file: 'index.ts'
        },
        component: {
            name: '[name].tsx',
            file: [
                { name: 'fc.tsx', description: 'Functional component' },
                { name: 'class.tsx', description: 'Class component' },
            ],
        },
        style: {
            name: '[name].module.css',
            optional: true
        },
        test: {
            name: '[name].test.tsx',
            optional: true,
            default: false
        },
    },
    placeholders: {
        NAME: ({ componentName }) => componentName,
        STYLE: ({ files }) => (files.style ? `\nimport styles from './${files.style.name}';` : ''),
    },
};
```

### Parameters

- `folderPath`  
Default: `src/`  
`string` or array of `string`  
- `templatesFolder`  
Default: `templates`  
Path to your own components templates
- `multiProject`  
Default: `false`  
Allow you to set up config for mono-repository with several projects
- `skipFinalStep`  
Default: `false`  
Allow you to switch off the last checking step  
- `templates`  
Default: Example of setup above  
Object which describes the structure of your component. 
You are able to set up `name` for your files. 
Filename of template in template folder or array of files to be able to select variant. 
You are able to make it optional and make it switched off by default.
- `placeholders`  
Default: Example of setup above  
List of placeholders which you can use to build your own component template
- `afterCreation`  
Default: `undefined`  
Object with scripts to process you file after creation  
Example:  
    ```javascript
    {
        ...config,
        afterCreation: {                
            prettier: {
                extensions: ['.ts', '.tsx'], // optional
                cmd: 'prettier --write [filepath]'
            }
        }
    }
    ```

## Multi-template
If you need to generate something else, not components only, you are able to set up array of templates. Example bellow:
```javascript
{
    ...config,
    templates: [
        {
            name: 'component', // will be added to default folderPath folder
            files: {
                index: {
                    name: 'index.ts',
                    file: 'component.ts'
                }
            }
        },
        {
            name: 'service',
            folderPath: 'services/', // will be added by the specific path
            files: {
                index: {
                    name: 'index.ts',
                    file: 'service.ts'
                }
            }
        }
    ]
}
```

## Placeholders
As you can see above, each placeholder is a function which get some data to build your own placeholder.
Below, you can see the list of all available data and functions to create a new one.
``` typescript
type templatePlaceholdersData = {
    project: string;
    // Project name in multy-project mode
    componentName: string;
    objectName: string;
    // componentName and objectName either is a name of the component or another object in multi-template mode
    objectType: string;
    // type of object which was selected by user. It is "component" by default.
    pathToObject: string;
    // path to objects folder. For example "src/components"
    destinationFolder: string;
    // relative path to folder of object which is being created
    objectFolder: string;
    // Absolute path to your object (component) folder
    relativeObjectFolder: string;
    // Relative path to your object (component) folder
    getRelativePath: (to: string) => string;
    // Function to get relative path to any another path. For example "../../src/helpers"
    files: FilesList;
    // Object of files which is being created
};
```
  
## Commands
`--init` - to generate config file and template folder  
`--dest`, `-d` - to set destination path  
`--name`, `-n` - to set component name  
`--project`, `-p` - to set project
