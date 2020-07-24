import { capitalizeName, isDirectory } from '../src/helpers';

jest.mock('fs', () => {
    return {
        lstatSync: () => ({
            isDirectory: () => true
        })
    };
});

describe('helpers', () => {
    it('capitalizeName', () => {
        expect(capitalizeName('test')).toBe('Test');
    });

    it('isDirectory', () => {
        expect(isDirectory('test')).toBe(true);
    });
});
