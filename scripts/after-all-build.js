const fs = require('fs');
const path = require('path');

module.exports = (o, Util) => {
  
    const item = o.jobList[0];

    //console.log(item);
    const assets = Util.getValue(item, 'report.statsData.assets.subs');
    const asset = assets[0] || {};
    const size = Util.BF(asset.size);
    const gzip = Util.BF(asset.sizeGzip);

    const minified = Boolean(item.minify);

    const sizeStr = `Dist size (js minified: ${minified}): ${size} / gzip: ${gzip}`;

    console.log(sizeStr);

    const dirs = fs.readdirSync(path.resolve(__dirname, '../src/components'));

    const componentsStr = dirs.map((dir) => {
        return `- ${dir}`;
    }).join('\r');

    const readmeStr = fs.readFileSync(path.resolve(__dirname, 'README.md'), 'utf8');

    const readme = Util.replace(readmeStr, {
        'place-holder-size': sizeStr,
        'place-holder-components': componentsStr
    });

    fs.writeFileSync(path.resolve(__dirname, '../README.md'), readme);

    console.log('updated README.md');

    return 0;
};
