/**
 * Created by zhipu.liao on 2016/4/13.
 */
"use strict";
var formConfig = [{
    schema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                title: "请求名称",
                description: "接口的名称"
            },
            api: {
                type: "string",
                title: "请求路径",
                description: "接口路径"
            },
            method: {
                type: "string",
                title: "请求模式",
                enum: ["POST", "GET"]
            },
            params: {
                type: "array",
                title: "请求头(header)",
                items: {
                    type: "object",
                    properties: {
                        apiName: {
                            type: "string",
                            title: "参数名称"
                        },
                        type: {
                            type: "string",
                            title: "类型"
                        },
                        require: {
                            type: "string",
                            title: "是否必填",
                            default:"是"
                        },
                        apiValue: {
                            type: "string",
                            title: "说明"
                        }
                    }
                }
            },
            res: {
                type: "array",
                title: "请求参数",
                items: {
                    type: "object",
                    properties: {
                        key: {
                            type: "string",
                            title: "参数名称"
                        },
                        type: {
                            type: "string",
                            title: "类型"
                        },
                        require: {
                            type: "string",
                            title: "是否必填",
                            default:"是"
                        },
                        revalue: {
                            type: "string",
                            title: "说明"
                        }
                    }
                }
            },
            demo: {
                type: "string",
                title: "JSON返回示例"
            },
            description: {
                type: "string",
                title: "接口说明"
            }
        }
    },
    form: ["name", "api", "method",
        {
            key: "params",
            add: "添加",
            items: [
                {
                    "type": "section",
                    "htmlClass": "row",
                    items: [{
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["params[].apiName"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["params[].type"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["params[].require"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["params[].apiValue"]
                    }]
                }
            ]
        },
        {
            key: "res",
            add: "添加",
            items: [
                {
                    "type": "section",
                    "htmlClass": "row",
                    items: [{
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["res[].key"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["res[].type"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["res[].require"]
                    }, {
                        "type": "section",
                        "htmlClass": "col-xs-6",
                        items: ["res[].revalue"]
                    }]
                }
            ]
        },
        {
            key: "demo",
            "type": "textarea"
        }, {
            key: "description",
            "type": "textarea"
        }, {
            type: "submit",
            title: "保存"
        }]
}];