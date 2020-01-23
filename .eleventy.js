module.exports = function(eleventyConfig) {
    //copy files
    eleventyConfig.addPassthroughCopy('./src/assets/');
    return {
        dir: { input: 'src', output: 'dist' }
    };
};
