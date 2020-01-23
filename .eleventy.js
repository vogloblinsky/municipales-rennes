module.exports = function(eleventyConfig) {
    //copy files
    eleventyConfig.addPassthroughCopy('./src/assets/');

    eleventyConfig.addHandlebarsHelper('compare', function(
        lvalue,
        rvalue,
        options
    ) {
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        operator = options.hash.operator || '==';

        var operators = {
            '==': function(l, r) {
                return l == r;
            },
            '===': function(l, r) {
                return l === r;
            },
            '!=': function(l, r) {
                return l != r;
            },
            '<': function(l, r) {
                return l < r;
            },
            '>': function(l, r) {
                return l > r;
            },
            '<=': function(l, r) {
                return l <= r;
            },
            '>=': function(l, r) {
                return l >= r;
            },
            typeof: function(l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator])
            throw new Error(
                "Handlerbars Helper 'compare' doesn't know the operator " +
                    operator
            );

        var result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    return {
        dir: { input: 'src', output: 'dist' }
    };
};
