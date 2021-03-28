# Webstorm integration
Using [reactcci](https://github.com/coolassassin/reactcci) with Webstorm or any another product by [JetBrains](https://www.jetbrains.com) you are able to create [External Tools](https://www.jetbrains.com/help/webstorm/configuring-third-party-tools.html#web-browsers) to make scaffolding with reactcci more easier.
## Quick setup
You can set up configuration manually, but you can download settings file instead.  
Open folder according to your operating system:  
- **macOS**: *~/Library/Application Support/JetBrains/[product][version]/tools*  
- **Linux**: *~/.config/JetBrains/[product][version]/tools*  
- **Windows**: *%APPDATA%/JetBrains/[product][version]/tools*  

For more information read [the article](https://www.jetbrains.com/help/webstorm/configuring-project-and-ide-settings.html#restore-defaults).

After that, download [**config file**](https://github.com/coolassassin/reactcci/raw/master/docs/reactcci.xml) and place in this folder like this:  
*.../JetBrains/Webstorm2021.3/tools/reactcci.xml*

After that click on components' folder with right mouse button and in new "reactcci" menu choose what you need 

## Manual setup
Make few simple steps to set up a new tool:  
1. Open Settings in menu `File -> Settings` (`Ctrl+Alt+S`, `⌘+Alt+S`)
2. Open External Tools menu `Tools -> External Tools`
3. Press the plus button ➕
4. Give the name for you new tool. For example "Create new component".
5. Fill the `Program` field with `node`
6. Fill the `Working directory` field with next command: `$ProjectFileDir$`
7. The last step is filling `Arguments` field. How to make necessary command will be described further.

## Arguments
### Create component
Simple example for creating component looks like this:  
`./node_modules/reactcci/build/cli.js --dest "$FileDir$" --name $Prompt$ --files no -s --sls`  
Looks a bit complex but let's try to figure what is going on here.
1. First part is the path to main script of CLI:   
    `./node_modules/reactcci/build/cli.js`
2. Next part is `--dest "$FileDir$"`  
    `--dest` means destination, you can make it shorter via `-d`  
    `$FileDir$` means current directory in project explorer, we need quotes here because path can contain spaces.
3. The third argument is name of you component or components `--name`  
    `$Prompt$` opens window with text field to type there your component name or several divided by space
4. The fourth is `--files`. We place here `no`, it means that we don't need any optional files.
5. Next is `-s`. It is shortcut for `--skip-search`. It helps us to select exact folder in second argument without further selecting.
6. The last one is `--sls`. It means "skip last step". It is analogue for config flag `skipFinalStep`

So the result will be look like this:  
![Example](https://raw.githubusercontent.com/coolassassin/reactcci/master/docs/createcomponentexample.png)  

Now, you can click on any folder in your project by right button and in context menu will be able next command: `External Tools -> Create new component`.  
Click and enjoy the magic ✨

### Create component with optional files
If you want to be able to create component with style file or with tests file you can modify the `--files` flag.  
You can type any files divided by space.  
For example: `--files style stories test`

### Update existing component
Creating component is not the one feature for reactcci. You can update component by adding styles file for example.  
Copy you external tool and name it somehow like that: `Add styles`  
Then to set the update mode, we need add just on a new flag: `--update` or short variant `-u`.  
More than that, in this case we don't need `--name` flag because our folder is the name of our component.  
So, our arguments will be look like that:  
`./node_modules/reactcci/build/cli.js --dest "$FileDir$" --files styles --update --skip-search --sls`
Easy way to try this is to find an existing component, right-click on it and `External Tools -> Add styles`.  
Few moments and we have new file ✨

## Bonus
After all this you are able to add hot key for this. Open Settings again:  
`File -> Settings` (`Ctrl+Alt+S`, `⌘+Alt+S`)  
Then open `Keymap -> External tools -> External tools -> [your tool]`, right click and then add keyboard or mouse shortcut.
