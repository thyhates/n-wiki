/**
 * Created by zhipu.liao on 2016/3/4.
 */
angular.module("app")
    .directive("onErrReady", ["$timeout", function ($timeout) {
        return {
            "restrict": "A",
            link: function (scope) {
                scope.addErr = function () {
                    var err = {
                        name: "",
                        res: "",
                        description: ""
                    };
                    scope.errors.push(err);
                };
                scope.delErr = function (index) {
                    scope.errors.splice(index, 1);
                }
            }
        }
    }]);