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
