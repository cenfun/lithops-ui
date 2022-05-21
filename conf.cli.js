module.exports = {

    build: {

        //for shadow dom
        cssExtract: 'string',

        vendors: ['lithops-ui']


        // webpackConfig: (conf, Util) => {

        //     conf.module.rules.forEach(rule => {
        //         if (rule.use && Array.isArray(rule.use)) {
        //             rule.use.forEach(item => {
        //                 if (item.loader === 'sass-loader') {
        //                     if (!item.options) {
        //                         item.options = {};
        //                     }
        //                     item.options.additionalData = '';
        //                 } else if (item.loader === 'css-loader') {
        //                     if (!item.options) {
        //                         item.options = {};
        //                     }
        //                     item.options.modules = {
        //                         localIdentName: '[local]'
        //                     };
        //                 }
        //             });
        //         }
        //         if (rule.use && rule.use.loader === 'babel-loader') {
        //             //delete rule.exclude;
        //         }
        //     });
    
        //     return conf;
        // }
        
    }

};
