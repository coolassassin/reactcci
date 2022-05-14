import mockFs from 'mock-fs';

import path from 'path';
import fs from 'fs';

import { ComponentFileList, Config, Project } from '../src/types';
import { generateFiles } from '../src/generateFiles';
import { getTemplate } from '../src/getTemplate';

jest.mock('../src/getTemplate', () => ({
    getTemplate: jest.fn(() => 'data')
}));

describe('generateFiles', () => {
    const fsMockFolders = {
        node_modules: mockFs.load(path.resolve(__dirname, '../node_modules')),
        src: {
            Comp1: {}
        }
    };
    const root = process.cwd();
    const moduleRoot = '';
    const config = {} as Config;
    const project: Project = '';
    const componentNames = ['Comp1', 'Comp2'];
    const templateName = 'component';
    const projectRootPath = 'src/';
    const resultPath = '.';
    const componentFileList: ComponentFileList = {
        Comp1: {
            index: {
                name: 'index.ts',
                file: 'index.ts',
                selected: true
            },
            component: {
                name: 'Comp1.tsx',
                file: 'fc.tsx',
                selected: true,
                type: 'Functional component'
            },
            styles: {
                name: 'Comp1.module.css',
                selected: false
            }
        },
        Comp2: {
            index: {
                name: 'index.ts',
                file: 'index.ts',
                selected: true
            },
            test: {
                name: '__test__/test.ts',
                file: 'tst.tsx',
                selected: true
            }
        }
    };

    beforeEach(() => {
        mockFs(fsMockFolders);
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('generate', async () => {
        const folder = path.resolve(root, project, projectRootPath, resultPath);
        const mkdirSpy = jest.spyOn(fs.promises, 'mkdir');
        const writeFileSpy = jest.spyOn(fs.promises, 'writeFile');
        await generateFiles({
            root,
            moduleRoot,
            config,
            project,
            componentNames,
            templateName,
            resultPath,
            projectRootPath,
            componentFileList
        });
        const filesComp1 = await fs.promises.readdir(path.resolve(folder, componentNames[0]));
        const filesComp2 = await fs.promises.readdir(path.resolve(folder, componentNames[1]));
        expect(filesComp1.length).toBe(2);
        expect(filesComp2.length).toBe(2);
        expect(getTemplate).toBeCalledTimes(4);
        expect(mkdirSpy).toBeCalledTimes(2);
        expect(mkdirSpy).toBeCalledWith(path.resolve(folder, componentNames[1]));
        expect(mkdirSpy).toBeCalledWith(path.resolve(folder, componentNames[1], '__test__'));
        expect(writeFileSpy).toBeCalledTimes(4);
    });
});
