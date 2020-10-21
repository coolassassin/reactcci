export type FileOption = {
    name: string;
    description: string;
};

type AfterCreationCommand = {
    extensions?: string[];
    cmd: string;
};

export type TemplateDescription = { name: string; file?: string | FileOption[]; optional?: boolean; default?: boolean };

export type TemplateDescriptionObject = {
    [key in string]: TemplateDescription;
};

type MultiTemplate = {
    name: string;
    folderPath?: string;
    files: TemplateDescriptionObject;
}[];

export type FileDescription = {
    name: string;
    file?: string;
    selected: boolean;
    type?: string;
};

export type FilesList = {
    [key in string]: FileDescription;
};

export type Setting = {
    root: string;
    moduleRoot: string;
    config: {
        multiProject: boolean;
        skipFinalStep: boolean;
        folderPath: string | string[];
        templatesFolder: string;
        templates: TemplateDescriptionObject | MultiTemplate;
        placeholders: { [key in string]: (data: any) => string };
        afterCreation?: {
            [key in string]: AfterCreationCommand;
        };
    };
    project: string;
    componentNames: string[];
    templateName: string;
    projectRootPath: string;
    resultPath: string;
    componentFileList: { [key in string]: FilesList };
    commandLineFlags: {
        init: boolean;
        update: boolean;
        dest: string;
        name: string;
        template: string;
        project: string;
    };
};

export type templatePlaceholdersData = {
    project: string;
    componentName: string;
    objectName: string;
    objectType: string;
    pathToObject: string;
    destinationFolder: string;
    objectFolder: string;
    relativeObjectFolder: string;
    files: FilesList;
    getRelativePath: (to: string) => string;
    join: (...parts: string[]) => string;
};
