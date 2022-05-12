export const mockProcess = () => {
    const exitMock = jest.fn();
    const stdoutWrite = jest.fn();
    const realProcess = process;

    beforeEach(() => {
        global.process = {
            ...realProcess,
            exit: exitMock,
            stdout: { ...realProcess.stdout, write: stdoutWrite }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    });

    afterAll(() => (global.process = realProcess));

    return {
        exitMock,
        stdoutWrite
    };
};

export const mockConsole = () => {
    const consoleError = jest.fn();
    const realConsole = console;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        global.console = { ...realConsole, error: consoleError } as any;
    });

    afterAll(() => (global.console = realConsole));

    return { consoleError };
};
