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
                            title: "是否必填"
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
                            title: "是否必填"
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
            "type": "section",
            "htmlClass": "row",
            "items": [
                {
                    "type": "section",
                    "htmlClass": "col-xs-12",
                    "items": [
                        "params"
                    ]
                },
                {
                    "type": "section",
                    "htmlClass": "col-xs-12",
                    "items": [
                        "res"
                    ]
                }
            ]
        },
         // "params", "res",
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