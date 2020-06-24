# React create component interactive CLI
CLI which allows you to build your React application with your own file structure and make your components interactively without typing any paths.
Setup your config once to build your app as quick as it possible.

![Example](https://raw.githubusercontent.com/coolassassin/reactcci/master/readme-example.gif)

## Installation
To install via npm:  
```npm install reactcci```  

To install via yarn:  
```yarn add reactcci```

Also, you are able to install it globally:  
```npm install reactcci -g```

## Running
If the package has been installed globally, run it simply by `reactcci`

If it is the local package type `npx reactcci` or `yarn reactcci`

## Setup
By default, components will be added into `src/` folder. To change this, you can set up your own config or run it with the flag:  
```reactcci --dist src/app/components```

Also, you can type `reactcci --help` to see all available commands.

## Config
To set up your config, you need to create `rcci.config.js`  
The default config has the next structure:
```javascript
module.exports = {
    multiProject: false,
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

| Parameter | Description | Default value |
|---|---|---|
| `folderPath` | `string` or array of `string` | `src/` |
| `templatesFolder` | Path to your own components templates | `templates` |
| `multiProject` | Allow you to set up config for mono-repository with several projects | `false` |
| `templates` | Object which describes the structure of your component. You are able to set up `name` for your files. Filename of template in template folder or array of files to be able to select variant. You are able to make it optional and make it switched off by default. | Example of setup above |
| `placeholders` | List of placeholders which you can use to build your own component template | Example of setup above |
| `afterCreation` | Object with scripts to process you file after creation | - |

### After creation script example
```javascript
{
    ...config,
    afterCreation: {                
        prettier: {
            extensions: ['.ts', '.tsx'], // optional
            cmd: 'prettier --write [filename]'
        }
    }
}
```