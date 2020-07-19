type FileOption = {
    name: string;
    description: string;
};

type AfterCreationCommand = {
    extensions?: string[];
    cmd: string;
};

export type TemplateDescriptionObject = {
    [key in string]: { name: string; file?: string | FileOption[]; optional?: boolean; default?: boolean };
};

type MultiTemplate = {
    name: string;
    folderPath?: string;
    files: TemplateDescriptionObject;
}[];

export type Setting = {
    root: string;
    moduleRoot: string;
    config: {
        multiProject: boolean;
        skipFinalStep: boolean;
        folderPath: string;
        templatesFolder: string;
        templates: TemplateDescriptionObject | MultiTemplate;
        placeholders: { [key in string]: (data: any) => string };
        afterCreation?: {
            [key in string]: AfterCreationCommand;
        };
    };
    project: string;
    componentName: string;
    templateName: string;
    projectRootPath: string;
    resultPath: string;
    fileList: { [key in string]: { name: string; file: string; type?: string } };
    commandLineFlags: {
        init: boolean;
        dest: string;
        name: string;
        project: string;
    };
};
