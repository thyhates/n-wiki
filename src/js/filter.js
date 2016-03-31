/**
 * Created by zhipu.liao on 2016/3/15.
 */
angular.module("app")
    .filter("docType", function () {
        return function (type) {
            switch (type) {
                case "0":
                    return "api";
                    break;
                case "1":
                    return "sdk";
                    break;
                default:
                    break;
            }
        };
    });