module.exports = {
    multiProject: false, /* Enable searching projects with component folder path */
    skipFinalStep: false, /* Toggle final step agreement */
    folderPath: 'src/', /* Destination path or array of paths to create components */
    templatesFolder: 'templates', /* Folder which contains templates */
    templates: { /* Component file structure declaration */
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
            name: '[name].test.tsx', /*'__tests__/[name].test.tsx' to put tests into subfolder*/
            optional: true,
            default: false
        },
    },
    placeholders: { /* Placeholders to fill data in templates, #NAME# for example */
        NAME: ({ componentName }) => componentName,
        STYLE: ({ files }) => (files.style ? `\nimport styles from './${files.style.name}';` : ''),
    },
    // afterCreation: {
    //     prettier: { /* Script name */
    //         extensions: ['.ts', '.tsx'],
    //         cmd: 'prettier --write [filepath]' /* Script command */
    //     }
    // }
};
