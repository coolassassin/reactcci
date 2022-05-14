import prompts from 'prompts';

import { setComponentNames } from '../src/setComponentNames';
import { CommandLineFlags } from '../src/types';

import { mockProcess } from './testUtils';

describe('setComponentName', () => {
    const props: Parameters<typeof setComponentNames>[0] = {
        commandLineFlags: { name: '' } as CommandLineFlags,
        templateName: 'component'
    };
    const { exitMock } = mockProcess();

    beforeEach(() => {
        props.commandLineFlags.name = '';
    });

    it('normal input', async () => {
        const name = 'NormalComponentName';
        prompts.inject([name]);
        expect(await setComponentNames(props)).toEqual([name]);
    });

    it('normal input with several names', async () => {
        const name = 'NormalComponentName NormalComponentName2';
        prompts.inject([name]);
        expect(await setComponentNames(props)).toEqual(name.split(' '));
    });

    it('normal input with several equal names', async () => {
        const name = 'NormalComponentName NormalComponentName';
        prompts.inject([name]);
        expect(await setComponentNames(props)).toEqual([name.split(' ')[0]]);
    });

    it('normal input by commandLine', async () => {
        const name = 'NormalComponentName';
        props.commandLineFlags.name = name;
        expect(await setComponentNames(props)).toEqual([name]);
    });

    it('empty input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['', name]);
        expect(await setComponentNames(props)).toEqual([name]);
    });

    it('unexpected input', async () => {
        const name = 'NormalComponentName';
        prompts.inject(['!%$@', name]);
        expect(await setComponentNames(props)).toEqual([name]);
    });

    it('undefined component name', async () => {
        prompts.inject([undefined]);
        await setComponentNames(props);
        expect(exitMock).toBeCalledTimes(1);
    });
});
