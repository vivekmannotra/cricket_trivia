'use strict';
angular.module('index', ['ui.bootstrap', 'index.landPad', 'index.scoreCard', 'ngRoute', 'chart.js', 'truncate']);
angular.module('index.landPad', []);
angular.module('index.landPad').controller('landPadController', landPadController);
landPadController.$inject = ['$location', 'masterFactory', '$filter', '$uibModal', '$scope', '$route', '$rootScope', '$anchorScroll'];
function landPadController ($location, masterFactory, $filter, $uibModal, $scope, $route, $rootScope, $anchorScroll) {
    var lp = this;
    lp.message = 'This is the header of the page.';
    lp.questions = [
        {
            id: "q1",
            question: "Who is the highest scoring cricketer ever?",
            correct_answer : "qa11",
            answers : [
                {
                    value: "qa11",
                    id: "qa11"
                },
                {
                    value: "qa12",
                    id: "qa12"
                },
                {
                    value: "qa13",
                    id: "qa13"
                }
            ]
        },
        {
            id: "q2",
            question: "Who is the highest scoring cricketer ever?",
            correct_answer : "qa21",
            answers : [
                {
                    value: "qa21",
                    id: "qa21"
                },
                {
                    value: "qa22",
                    id: "qa22"
                },
                {
                    value: "qa23",
                    id: "qa23"
                }
            ]

        },
        {
            id: "q3",
            question: "Who is the highest scoring cricketer ever?",
            correct_answer : "qa31",
            answers : [
                {
                    value: "qa31",
                    id: "qa31"
                },
                {
                    value: "qa32",
                    id: "qa32"
                },
                {
                    value: "qa33",
                    id: "qa33"
                }
            ]
        },
        {
            id: "q4",
            question: "Who is the highest scoring cricketer ever?",
            correct_answer : "qa41",
            answers : [
                {
                    value: "qa41",
                    id: "qa41"
                },
                {
                    value: "qa42",
                    id: "qa42"
                },
                {
                    value: "qa43",
                    id: "qa43"
                }
            ]
        },
        {
            id: "q5",
            question: "Who is the highest scoring cricketer ever?",
            correct_answer : "qa51",
            answers : [
                {
                    value: "qa51",
                    id: "qa51"
                },
                {
                    value: "qa52",
                    id: "qa52"
                },
                {
                    value: "qa53",
                    id: "qa53"
                }
            ]
        }
    ];
    lp.evaluate = function () {
        for (var i in lp.questions) {
            lp.questions[i].first_off = 0;
            lp.questions[i].warn = !lp.questions[i].user_answer;
        }
        var first_offender = _.find(lp.questions, function (ques) {
            return ques.warn;
        });
        if (first_offender) {
            var old = $location.hash();
            first_offender.first_off = 1;
            $location.hash(first_offender.id);
            $anchorScroll.yOffset = "50px";
            $anchorScroll();
            $location.hash(old);
        } else {
            masterFactory.result = getScore();
            $location.path('/scoreCard');
        }
    };
    function getScore () {
        var result = {
            total: 0,
            correct: 0,
            incorrect: 0
        };
        for (var i in lp.questions) {
            result.total ++;
            if (lp.questions[i].user_answer === lp.questions[i].correct_answer) {
                result.correct ++;
            } else {
                result.incorrect ++;
            }
        }
        result.answer_sheet = angular.copy(lp.questions);
        return result;
    }
    lp.checkQuestion = function (question) {
        if (question.user_answer) {
            question.warn = false;
            question.first_off = 0;
        }
    };
    lp.resetForm = function () {

    };
}
angular.module('index.scoreCard', []);
angular.module('index.scoreCard').controller('scoreCardController', scoreCardController);
scoreCardController.$inject = ['$location', 'masterFactory', '$filter', '$uibModal', '$scope', '$route', '$rootScope'];
function scoreCardController ($location, masterFactory, $filter, $uibModal, $scope, $route, $rootScope) {
    var sc = this;
    function activate () {
        sc.result = masterFactory.result;
        if (!sc.result) {
            $location.path('/home');
        } else {
            sc.charts = {
                bar: {
                    labels: ['Correct', 'Incorrect'],
                    series: ['Correct', 'Incorrect'],
                    data: [
                        [sc.result.correct, sc.result.incorrect]
                    ]
                }
            }
        }
    }
    activate ();
    sc.repeat = function () {
        masterFactory.result = 0;
        $location.path('/home');
    };
}
angular.module('index').config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/home'
        })
        .when('/home', {
            templateUrl: 'modules/landPad/landPad.html'
        })
        .when('/scoreCard', {
            templateUrl: 'modules/scoreCard/scoreCard.html'
        })
        .otherwise({
            redirectTo: '/home'
        });
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.headers.common["req-auth-token"] = '#^&SFHAH@Y%$H@$@$%HG$!$#B!$FBWTRBRTHTHRFHBWR@@%$T!SDFEWF@F@F@@ECW';

}]);
angular.module('index').factory('masterFactory', ['$http', '$location', function ($http, $location) {
    var api_root = window.location.origin;
    function getEmail (request) {
        return $http.post(api_root + '/getEmail', request);
    }
    return {
        getEmail : getEmail
    }
}]);
angular.module('index').filter('compoundFilter', ['$filter', function ($filter) {
    return function (array, text) {
        if (text) {
            var list = text.split(' ');
            for (var i = 0; i < list.length; i++) {
                array = $filter('filter')(array, list[i]);
            }
        }
        return array;
    };
}]);
angular.module('index').run(['$http', '$rootScope', '$uibModal', 'masterFactory', function ($http, $rootScope, $uibModal, masterFactory) {
    $http.defaults.headers.common['Content-Type'] = 'application/json';
    $rootScope.showMailModal = function (key) {
        $rootScope.mailType = key;
        $rootScope.selectedTemplate = (key === 'IMS') ? 'modules/mailTemplates/sample_invoice.html':'modules/mailTemplates/sample_promotion.html';
        $rootScope.mailModal = $uibModal.open({
            templateUrl: 'modules/mailModal.html',
            scope: $rootScope,
            size: 'lg'
        });
        $rootScope.mailModal.result.then(function (response){

        });
    };
    $rootScope.sendEmail = function (toEmail) {
        masterFactory.getEmail({
            to: toEmail,
            type: $rootScope.mailType
        }).then(function (response) {
            if (response.data.status === 'success') {
                alert('Email has been sent!');
                $rootScope.mailModal.close();
            }
        }).catch(function (error) {
            alert('Error occured while trying to send mail!');
        });
    }
}]);
angular.module('truncate', [])
    .filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) === ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '…';
            }
            return input;
        };
    })
    .filter('splitcharacters', function() {
        return function (input, chars) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length > chars) {
                var prefix = input.substring(0, chars/2);
                var postfix = input.substring(input.length-chars/2, input.length);
                return prefix + '...' + postfix;
            }
            return input;
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '…';
                }
            }
            return input;
        };
    });
