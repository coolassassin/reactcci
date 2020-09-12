# React create component interactive CLI
CLI which allows you to build your React application with your own file structure and make your components interactively without typing any paths.
Setup your config once to build your app as quick as it possible.  
Works on MacOS, Windows, and Linux.  
Supports Typescript, React Native, Less, Sass or any CSS-in-JS library, Storybook, any testing library.

![Example](https://raw.githubusercontent.com/coolassassin/reactcci/master/readme-example.gif)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcoolassassin%2Freactcci.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcoolassassin%2Freactcci?ref=badge_shield)

[![Build Status](https://travis-ci.org/coolassassin/reactcci.svg?branch=master)](https://travis-ci.org/github/coolassassin/reactcci)
[![Build Status](https://img.shields.io/npm/dm/reactcci.svg?style=flat)](https://www.npmjs.com/package/reactcci)
[![Build Status](https://img.shields.io/npm/v/reactcci.svg?style=flat)](https://www.npmjs.com/package/reactcci)


## Quick Overview
Via yarn and interactive mode
```
$ yarn add -D reactcci
$ yarn rcci
```
or via npm and flags
```
$ npm i -D reactcci
$ npx rcci --name Header Body Footer --dest src/App
```

## Update component mode
Instead of creating component, you are able to update existent component using the `--update` or `-u` flag.
Using these flags you can create new files for component (styles, stories, tests) or replace some existent.

## Installation
To install via npm:  
```npm install --save-dev reactcci```  

To install via yarn:  
```yarn add --dev reactcci```

Also, you are able to install it globally:  
```npm install reactcci -g```

## Config
To quick set up your own config and templates execute next command:  
`rcci --init`  
This command creates file `rcci.config.js` and template folder with basic template set.  
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
        stories: {
            name: '[name].stories.tsx',
            file: 'stories.tsx',
            optional: true,
            default: false
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
        STORY_PATH: ({ join, project, destinationFolder, componentName }) =>
            join(project, destinationFolder, componentName)
    }
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
## Commands
`--init` - to generate config file and template folder  
`--dest`, `-d` - to set destination path  
`--name`, `-n` - to set component name or names of several components divided by space  
`--project`, `-p` - to set project

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

| Field | Description |
|---|---|
| `project` | Project name in multy-project mode |
| `componentName`<br> `objectName` | Name of the component or another object in multi-template mode |
| `objectType` | Type of object which was selected by user. It is `component` by default. |
| `pathToObject` | path to objects folder <br> Example: `src/components` |
| `destinationFolder` | relative path to folder of object which is being created<br>Example: `App/Header/Logo` |
| `objectFolder` | Absolute path to your object (component) folder |
| `relativeObjectFolder` | Relative path to your object (component) folder |
| `files` | Object of files which is being created |
| `getRelativePath(to: string)` | Function to get relative path to any another path<br>Example: `../../src/helpers` |
| `join(...parts: string)` | Function to get joined parts of path. <br>Example:<br> `join(project, destinationFolder, componentName)` => `Project/Footer/Email` |



## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcoolassassin%2Freactcci.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcoolassassin%2Freactcci?ref=badge_large)