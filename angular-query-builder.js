var app = angular.module('app', ['ngSanitize', 'queryBuilder']);
app.controller('QueryBuilderCtrl', ['$scope', function ($scope) {
    var data = '{"group": {"operator": "AND","rules": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    $scope.options = {};
    
    $scope.options.check= function(data){
        console.log(data);
    }
    
    function computed(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
            i > 0 && (str += " <strong>" + group.operator + "</strong> ");
            
            switch(group.rules[i].condition){
                case "contains":
                    str += group.rules[i].group ?
                           computed(group.rules[i].group) :
                           "("+group.rules[i].field +".includes("+ group.rules[i].data+"))";
                    break;
                    case "Does_Not_Contain":
                    str += group.rules[i].group ?
                           computed(group.rules[i].group) :
                           "!("+group.rules[i].field +".includes("+ group.rules[i].data+"))";
                    break;
                    case "Starts_with":
                    str += group.rules[i].group ?
                           computed(group.rules[i].group) :
                           "("+group.rules[i].field +".startsWith("+ group.rules[i].data+"))";
                    break;
                    case "Ends_with":
                    str += group.rules[i].group ?
                           computed(group.rules[i].group) :
                           "("+group.rules[i].field +".endsWith("+ group.rules[i].data+"))";
                    break;
                    
                default: 
                    str += group.rules[i].group ?
                computed(group.rules[i].group) :
                "( "+group.rules[i].field + htmlEntities(group.rules[i].condition) + group.rules[i].data+" )";
                    break;
            } 
        }

        return str + ")";
    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function (newValue) {
        console.log(newValue);
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output = computed(newValue.group);
    }, true);
}]);



var queryBuilder = angular.module('queryBuilder', []);

queryBuilder.directive("queryBuilderParent",function(){
 return {
     restrict : "E",
     templateUrl:'/queryBuilderParent.html',
     scope:{
             group: '=',
             options:'='
            },
      link : function(scope,element,attr){
          scope.handler={};
          scope.handler.check = function(){
              console.log("handler check has been called");
          }
          
         // scope.handler.defaultColorCodedView = function(){
              scope.group.rules=[{
                        condition: '=',
                        field: 'Firstname',
                        data: ''
                    },{
                        condition: '=',
                        field: 'Lastname',
                        data: ''
                    }
                  ,{
                        group: {"operator": "AND","rules": [ {
                        condition: '=',
                        field: 'Firstname',
                        data: ''
                        }, {
                        condition: '=',
                        field: 'Lastname',
                        data: ''}
                      ]}}
                   ];
                   
         // }
                
      }
 }
})

queryBuilder.directive('queryBuilder', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            group: '=',
            handler:'='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                
               console.log(scope , content);
                
                if(scope.handler.defaultColorCodedView){
                    
                  scope.handler.defaultColorCodedView();
                }
                
                scope.operators = [
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.fields = [
                    { name: 'Firstname' },
                    { name: 'Lastname' },
                    { name: 'Birthdate' },
                    { name: 'string' },
                    { name: 'date' },
                    { name: 'datetime' },
                    { name: 'ss' }
                ];
                


                scope.conditions = 
                {
                  datetime : [ { name:"is equal to" , value:"===" },
                               { name:"is not equal to" , value:"!==" },
                               { name:"is after or equal to" , value:">=" },
                               { name:"is after" , value:">" },
                               { name:"is before or equal to" , value:"<=" },
                               { name:"is before" , value:"<" },
                               { name:"is null" , value:null },
                               { name:"is not null" , value:!null }

                             ],

                  date : [ { name:"is equal to" , value:"===" },
                               { name:"is not equal to" , value:"!==" },
                               { name:"is after or equal to" , value:">=" },
                               { name:"is after" , value:">" },
                               { name:"is before or equal to" , value:"<=" },
                               { name:"is before" , value:"<" },
                               { name:"is null" , value:null },
                               { name:"is not null" , value:!null }

                             ],

                  string : [   { name:"is equal to" , value:"===" },
                               { name:"is not equal to" , value:"!==" },
                               { name:"contains" , value:"contains" },
                               { name:"Does not Contains" , value:"Does_Not_Contain" },
                               { name:"Starts with" , value:"Starts_with" },
                               { name:"Ends with" , value:"Ends_with)" },
                               { name:"Less than or equal to" , value:"<=" },
                               { name:"Less than" , value:"<" },
                               { name:"Greater than or equal to" , value:">=" },
                               { name:"Greater than" , value:">" }

                             ],
                    
                    bool : [   { name:"is equal to" , value:"===" },
                               { name:"is not equal to" , value:"!==" },
                               { name:"contains" , value:"contains" },
                               { name:"Does not Contains" , value:"Does_Not_Contain" },
                               { name:"Starts with" , value:"Starts_with" },
                               { name:"Ends with" , value:"Ends_with)" },
                               { name:"Less than or equal to" , value:"<=" },
                               { name:"Less than" , value:"<" },
                               { name:"Greater than or equal to" , value:">=" },
                               { name:"Greater than" , value:">" }

                             ]

                }
                /*scope.conditions = [
                    { name: '=' },
                    { name: '<>' },
                    { name: '<' },
                    { name: '<=' },
                    { name: '>' },
                    { name: '>=' }
                ];*/

                scope.addCondition = function () {
                    
                    scope.group.rules.push({
                        condition: '=',
                        field: 'Firstname',
                        data: ''
                    }, {
                        condition: '=',
                        field: 'Lastname',
                        data: ''
                    },{
                        group: {"operator": "AND","rules": [ {
                        condition: '=',
                        field: 'Firstname',
                        data: ''
                        }, {
                        condition: '=',
                        field: 'Lastname',
                        data: ''
                     } ]}}
                    );
                };

                
                scope.removeCondition = function (index) {
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    if(scope.handler.check){
                        scope.handler.check();
                    }
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);
