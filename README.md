# zun

百度前端代码格式化工具

### 安装

```
    $[sudo] npm i zun -g
```
### 使用

该工具默认只对代码模块中新添加的和有修改的文件进行格式化处理，所以请确保当前目录是在svn的管理之下。同时，默认采取原文件覆盖模式。

```
    $[sudo] zun format(f)
```

只对新增文件格式化：

```
    $[sudo] zun format --nomodify
```

强制对所有文件进行格式化：

```
    $[sudo] zun format --all
```

强制取消变量命名规范检查（开发中）

```
    $[sudo] zun format --icc
```

指定输出路径，没有最后一个参数则默认为当前目录下的output目录：

```
    $[sudo] zun format --directory your_directory
```

提交代码评审（此命令需配置zun-conf.json）：

```
    $[sudo] zun cooder
```

#### zun-conf.json说明

在当前活动路径下配置zun-conf.json文件，该文件提供了两个功能：对不需要格式化的文件（jquery等第三方文件）进行配置；设置cooder命令的详细内容。

```
{
    "cooder": {
        "subject"    : "code review",
        "owner"      : "wanghaojie01",
        "reviewers"  : "wanghaojie01",
        "description": "code review",
        "token"      : "the token"
    },
    "ignore": [
        "/static/js/core/*.js",
        "/static/css/reset.css"
    ]
}
```

该工具还在不断的完善之中，有好的意见或建议，欢迎提出。