#1.9.0
* refactoring to make project more stable and strict

## 1.8.4
* update templates and config to support "processFileAndFolderName" param

## 1.8.3
* add new stringToCase method to placeholder function

## 1.8.2
* fix processing commander options

## 1.8.1
* fix check files to update with different case
* update dependencies
* update imports in templates

## 1.8.0
* fixed resolving placeholders. Avoid unnecessary executions
* afterCreation filepath resolving fix
* new placeholder variables (filePrefix, folderName)
* fixed xml-settings for webstorm
* fixed filename processing for multiple placeholder uses
* fixed processing for snake_case and dash-case
* new command-line flag for vs-rcci

## 1.7.6
* New string types for processFileAndFolderName parameter

## 1.7.4
* File type selection by command line flag

## 1.7.3
* Fix root destination parsing issue

## 1.7.0
* Added smart destination path parsing
* Added `--skip-search`, `-s` flags to turn of interactive selection with `--dest` flag
* Added `--files`, `-f` flags to set optional files to skip interactive selection step
* Added `--sls` flag to skip last step like `skipFinalStep` config 

## 1.6.0
* Removed initialization flag with initialization on first run

## 1.5.3
* Added files and folder name processing feature

## 1.5.2
* Added template command line flag

## 1.5.0
* Added update component feature

## 1.4.5
* New improved path search

## 1.4.1
* Added join function for placeholders

## 1.4.0
* Added multi-component creation feature

## 1.3.1
* Added rcci shortcut

## 1.3.0
* Added extended template placeholders functionality

## 1.2.8
* Fixed template folder name replacing 

## 1.2.1
* Fixed shorting POSIX paths

## 1.2.0
* Added multi-template feature

## 1.1.5
* Added template subfolder feature

## 1.1.4
* Fixed POSIX path resolving in initialize mode

## 1.1.3
* Fixed POSIX path resolving

## 1.1.2
* Fixed folderPath processing

## 1.1.1
* Fixed afterCreation script check

## 1.1.0
* Added configuration mode

## 1.0.6
* Fixed size of package

## 1.0.5
* Fixed folder path cutter

## 1.0.4
* Added folder search feature
* `dist` flag renamed to `dest`

## 1.0.3
* Added `name` and `project` command line flags
* Replaced `chalk` to `kleur` because kleur is already used inside prompts

## 1.0.2
* Added option to skip final step

## 1.0.0
Features:
* interactive creation
* dynamic templates
* afterCreation scripts
* path flag to skip selecting step
* multi-project mode
