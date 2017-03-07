'use strict';
angular.module('index', ['ui.bootstrap', 'index.landPad', 'index.scoreCard', 'ngRoute', 'chart.js']);
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
            $anchorScroll.yOffset = 50;
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
            lp.questions[i].correct_answer_full = _.find(lp.questions[i].answers, function (item) {
                return item.id === lp.questions[i].correct_answer;
            });
            lp.questions[i].user_answer_full = _.find(lp.questions[i].answers, function (item) {
                return item.id === lp.questions[i].user_answer;
            });
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
        lp.resetModal = $uibModal.open({
            templateUrl: 'modules/warningModal.html',
            scope: $scope,
            size: 'md'
        });
        lp.resetModal.result.then(function (response){
            if (response === 'confirm') {
                for (var i in lp.questions) {
                    lp.questions[i].user_answer = null;
                    lp.questions[i].warn = null;
                    lp.questions[i].first_off = null;
                }
                var old = $location.hash();
                $location.hash('top');
                $anchorScroll.yOffset = 0;
                $anchorScroll();
                $location.hash(old);
            }
        });
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
            if (sc.result.total === sc.result.correct) {
                sc.message = "All answers correct";
                sc.icon = "http://im.rediff.com/cricket/2012/aug/26pic1.jpg";
            } else if (sc.result.correct > sc.result.incorrect) {
                sc.message = "Almost there";
                sc.icon = "http://images.indianexpress.com/2016/11/saharunoutfbl.jpg";
            } else {
                sc.message = "Better luck next time";
                sc.icon = "http://www.umpiretraining.co.uk/images/eLearning/Bowled/bowled_3.jpg";
            }
            var ctx = document.getElementById("myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ["Correct", "Incorrect"],
                    datasets: [{
                        label: '# of Questions',
                        data: [sc.result.correct, sc.result.incorrect],
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)',
                            'rgba(255,99,132,1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
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
angular.module('index').run(['$http', '$rootScope', '$uibModal', 'masterFactory', function ($http, $rootScope, $uibModal, masterFactory) {
    $http.defaults.headers.common['Content-Type'] = 'application/json';
}]);
