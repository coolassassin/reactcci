import prompts from 'prompts';

import { setComponentName } from '../src/setComponentName';
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
        componentSettingsMap.componentName = '';
        componentSettingsMap.commandLineFlags.name = '';
    });

    it('normal input', async () => {
        const name = 'NormalComponentName';
        prompts.inject([name]);
        await setComponentName();
        expect(componentSettingsMap.componentName).toBe(name);
    });

    it('normal input by commandLine', async () => {
        const name = 'NormalComponentName';
        componentSettingsMap.commandLineFlags.name = name;
        await setComponentName();
        expect(componentSettingsMap.componentName).toBe(name);
    });

    it('empty input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['', name]);
        await setComponentName();
        expect(componentSettingsMap.componentName).toBe(name);
    });

    it('unexpected input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['!%$@', name]);
        await setComponentName();
        expect(componentSettingsMap.componentName).toBe(name);
    });

    it('undefined component name', async () => {
        prompts.inject([undefined]);
        await setComponentName();
        expect(exitMock).toBeCalledTimes(1);
    });
});
