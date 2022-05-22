export default function(context) {
    
    const components = {};

    const paths = context.keys();
    //console.log(paths);

    paths.forEach((path) => {

        //console.log(path);
    
        //get folder name
        //kebab case, custom element names must contain a hyphen.
        const list = path.toLowerCase().split('/');

        //file and folder should be same
        const fileName = list.pop();
        const folderName = list.pop();

        // "./lui-button/lui-button.js" 
        // "./path-to/lui-grid/lui-grid.js"

        // entry file name must be same with folder name
        if (fileName !== `${folderName}.js`) {
            //console.log(`ignore ${path}`);
            return;
        }

        const tagName = folderName;
        //custom element tag
        if (!tagName.includes('-')) {
            return;
        }

        //esModule default
        const Component = context(path).default;
        //console.log(context(path));

        //override tagName
        Component.tagName = tagName;

        //define custom element
        if (customElements.get(tagName)) {
            console.error(`${tagName} already defined`);
        } else {
            customElements.define(tagName, Component);
        }

        // no private component
        if (Component.private) {
            return;
        }
    
        components[tagName] = Component;
    });

    //console.log(components);
    return components;
}
