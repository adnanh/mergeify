var tools = require('browserify-transform-tools');

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
            for (var key in rawConfigObject.options) {
                configObject[key] = rawConfigObject.options[key];
            }
        }

        if (rawConfigObject.hasOwnProperty(transformOptions.config.environment)) {
            for (var key in rawConfigObject[transformOptions.config.environment]) {
                configObject[key] = rawConfigObject[transformOptions.config.environment][key];
            }
        }

        var newContent = JSON.stringify(configObject);

        return done(null, newContent);
    } else {
        return done(null, content);
    }
}

// Export transform
module.exports = tools.makeStringTransform('mergeify', { includeExtensions: [".json"] }, transform);
