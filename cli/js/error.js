//错误等级
var errorList = [
    {
        name : 'debug',
        level: 1
    },
    {
        name : 'info',
        level: 2
    },
    {
        name : 'warn',
        level: 3
    },
    {
        name : 'error',
        level: 4
    },
    {
        name : 'fatal',
        level: 5
    }
];

function Errors(data) {
    this.line     = data.line;
    this.column   = data.column;
    this.message  = data.message;
    this.severity = errorList[data.severity - 1];
}

Errors.list = [];

Errors.push = function(data) {
    Errors.list.push(new Errors(data));
};

Errors.addFile = function(path) {
    Errors.list.push([
        '',
        'zun PATH ' + path,
        ''
    ].join('\n'));
};

Errors.print = function() {
    var i = 0,
        l = Errors.list.length;

    var res = [];

    for (; i < l; i ++) {
        res.push(Errors.list[i].toString());
    }
    res.push('\n');
    return res.join('\n');
};

Errors.empty = function() {
    Errors.list = [];
}

Errors.prototype.toString = function() {
    return [
        'zun',
        this.severity.name.toUpperCase(),
        '→',
        'line',
        this.line,
        'col',
        this.column + ':',
        this.message
    ].join(' '); 
};

module.exports = Errors;