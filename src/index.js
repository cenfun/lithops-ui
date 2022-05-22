import generateComponents from './util/generate-components.js';

const context = require.context('./components', true, /\.js$/);
const components = generateComponents(context);
//console.log(components);

export { components };

export default components;
