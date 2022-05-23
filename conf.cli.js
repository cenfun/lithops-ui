module.exports = {

    build: {

        //for shadow dom
        cssExtract: 'string',

        vendors: ['lithops-ui'],

        afterAll: require('./scripts/after-all-build.js')
    }

};
