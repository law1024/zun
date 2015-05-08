var util = {
    //扩展
    extend: function() {
        var args = Array.prototype.slice.call(arguments);
        var i = 1,
            l = args.length;
        for (; i < l; i ++) {
            for (var idx in args[i]) {
                if (!args[i].hasOwnProperty(idx)) {
                    continue;
                }
                //浅拷贝
                args[0][idx] = args[i][idx];
            }
        }
        return args[0];
    },
    getRelative: function(path) {
        return path.slice(process.cwd().length - 1);
    }
};

module.exports = util;