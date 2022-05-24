//starfall-cli config
//https://github.com/cenfun/starfall-cli

module.exports = {

    build: {

        //for shadow dom
        cssExtract: 'string',

        vendors: ['lithops-ui'],

        afterAll: require('./scripts/after-all-build.js')
    }

};
