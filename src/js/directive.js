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
    }])
    .directive("onListReady",["$timeout","$stateParams",function($timeout,$stateParams){
        return {
            "restrict":"A",
            link:function(scope){
               $timeout(function(){
                   console.log(scope.docs);
                   scope.docs.forEach(function(doc){
                      if(doc.name===$stateParams.docName){
                          doc.isOpen=true;
                      }else{
                          doc.isOpen=false;
                      }
                   });
               })
            }
        }
    }]);