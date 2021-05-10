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

export type TypingCases = 'camelCase' | 'PascalCase' | 'snake_case' | 'dash-case';

export type ProcessFileAndFolderName = ((name?: string, parts?: string[], isFolder?: boolean) => string) | TypingCases;

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
        processFileAndFolderName?: ProcessFileAndFolderName;
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
        update: boolean;
        skipSearch: boolean;
        sls: boolean;
        nfc: boolean;
        dest: string;
        name: string;
        template: string;
        project: string;
        files: string;
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

type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PartialSetting = DeepPartial<Setting>;
