import prompts from 'prompts';

import { setComponentNames } from '../src/setComponentNames';
import { componentSettingsMap } from '../src/componentSettingsMap';

jest.mock('../src/componentSettingsMap', () => {
    return {
        componentSettingsMap: {
            templateName: 'component',
            commandLineFlags: {
                name: ''
            }
        }
    };
});

describe('setComponentName', () => {
    const exitMock = jest.fn();
    const realProcess = process;

    beforeEach(() => {
        global.process = { ...realProcess, exit: exitMock, stdout: { ...realProcess.stdout, write: jest.fn() } } as any;
        componentSettingsMap.commandLineFlags.name = '';
    });

    it('normal input', async () => {
        const name = 'NormalComponentName';
        prompts.inject([name]);
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual([name]);
    });

    it('normal input with several names', async () => {
        const name = 'NormalComponentName NormalComponentName2';
        prompts.inject([name]);
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual(name.split(' '));
    });

    it('normal input with several equal names', async () => {
        const name = 'NormalComponentName NormalComponentName';
        prompts.inject([name]);
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual([name.split(' ')[0]]);
    });

    it('normal input by commandLine', async () => {
        const name = 'NormalComponentName';
        componentSettingsMap.commandLineFlags.name = name;
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual([name]);
    });

    it('empty input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['', name]);
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual([name]);
    });

    it('unexpected input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['!%$@', name]);
        await setComponentNames();
        expect(componentSettingsMap.componentNames).toEqual([name]);
    });

    it('undefined component name', async () => {
        prompts.inject([undefined]);
        await setComponentNames();
        expect(exitMock).toBeCalledTimes(1);
    });
});
