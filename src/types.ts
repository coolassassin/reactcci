type FileOption = {
    name: string;
    description: string;
};

type AfterCreationCommand = {
    extensions?: string[];
    cmd: string;
};

export type Setting = {
    root: string;
    config: {
        multiProject: boolean;
        skipFinalStep: boolean;
        folderPath: string;
        templatesFolder: string;
        templates: {
            [key in string]: { name: string; file?: string | FileOption[]; optional?: boolean; default?: boolean };
        };
        placeholders: { [key in string]: (data: any) => string };
        afterCreation?: {
            [key in string]: AfterCreationCommand;
        };
    };
    project: string;
    componentName: string;
    projectRootPath: string;
    resultPath: string;
    fileList: { [key in string]: { name: string; file: string; type?: string } };
    commandLineFlags: {
        dest: string;
        name: string;
        project: string;
    };
};
