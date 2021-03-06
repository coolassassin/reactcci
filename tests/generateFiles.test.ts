import mockFs from 'mock-fs';

import path from 'path';
import fs from 'fs';

import { Setting } from '../src/types';
import { generateFiles } from '../src/generateFiles';
import { componentSettingsMap } from '../src/componentSettingsMap';
import { getTemplate } from '../src/getTemplate';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            root: process.cwd(),
            project: '',
            config: {} as any,
            projectRootPath: 'src/',
            resultPath: '.',
            componentNames: ['Comp1', 'Comp2'],
            templateName: 'component',
            componentFileList: {
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
            }
        } as Partial<Setting>
    };
});

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

    beforeEach(() => {
        mockFs(fsMockFolders);
    });

    afterEach(() => {
        mockFs.restore();
    });

    it('generate', async () => {
        const { root, project, projectRootPath, resultPath, componentNames } = componentSettingsMap;
        const folder = path.resolve(root, project, projectRootPath, resultPath);
        const mkdirSpy = jest.spyOn(fs.promises, 'mkdir');
        const writeFileSpy = jest.spyOn(fs.promises, 'writeFile');
        await generateFiles();
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
