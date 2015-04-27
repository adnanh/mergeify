var tools = require('browserify-transform-tools');
var _ = require('lodash-node');

// Transform function
function transform(content, transformOptions, done) {
    var file = transformOptions.file;

    transformOptions.config.files = transformOptions.config.files || ['config.json'];
    transformOptions.config.environment = transformOptions.config.environment || 'development';

    var shouldTransform = false;
    for (var i = 0; i < transformOptions.config.files.length; i++) {
        var rxp = new RegExp(transformOptions.config.files[i] + '$', 'gi');

        if (file.match(rxp)) {
            shouldTransform = true;
            break;
        }
    }

    if (shouldTransform) {
        var rawConfigObject = JSON.parse(content);

        var configObject = {};

        if (rawConfigObject.hasOwnProperty('options')) {
            configObject = _.merge(configObject, rawConfigObject.options);
        }

        if (rawConfigObject.hasOwnProperty(transformOptions.config.environment)) {
            configObject = _.merge(configObject, rawConfigObject[transformOptions.config.environment]);
        }

        var newContent = JSON.stringify(configObject);

        return done(null, newContent);
    } else {
        return done(null, content);
    }
}

// Export transform
module.exports = tools.makeStringTransform('mergeify', { includeExtensions: [".json"] }, transform);
