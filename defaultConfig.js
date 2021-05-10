module.exports = {
    multiProject: false /* Enable searching projects with component folder path */,
    skipFinalStep: false /* Toggle final step agreement */,
    folderPath: 'src/' /* Destination path or array of paths to create components */,
    templatesFolder: 'templates' /* Folder with templates */,
    templates: [
        {
            name: 'component',
            files: {
                /* Component folder structure declaration */
                index: {
                    name: 'index.ts',
                    file: 'index.ts'
                },
                component: {
                    name: '[name].tsx',
                    file: [
                        { name: 'fc.tsx', description: 'Functional component' },
                        { name: 'class.tsx', description: 'Class component' }
                    ]
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
                    name: '[name].test.tsx' /*'__tests__/[name].test.tsx' to put tests into subfolder*/,
                    file: 'tst.tsx',
                    optional: true,
                    default: false
                }
            }
        }
    ],
    placeholders: {
        /* Template placeholders */
        NAME: ({ componentName }) => componentName,
        STYLE: ({ files }) => (files.style ? `\nimport styles from './${files.style.name}';\n` : ''),
        STORY_PATH: ({ join, project, destinationFolder, componentName }) =>
            join(project, destinationFolder, componentName)
    }
};
