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
            question: "Which cricketers have the record for the highest run patnership at the World Cup ?",
            correct_answer : "qa12",
            answers : [
                {
                    value: "Sachin Tendulkar and Saurav Ganguly",
                    id: "qa11"
                },
                {
                    value: "Saurav Ganguly and Rahul Dravid",
                    id: "qa12"
                },
                {
                    value: "Saurav Ganguly and Virender Sehwag",
                    id: "qa13"
                },
                {
                    value: "Rahul Dravid and Sachin Tendulkar",
                    id: "qa14"
                }
            ]
        },
        {
            id: "q2",
            question: "Against which country did India score their lowest total at the World Cup ?",
            correct_answer : "qa24",
            answers : [
                {
                    value: "West Indies",
                    id: "qa21"
                },
                {
                    value: "England",
                    id: "qa22"
                },
                {
                    value: "New Zealand",
                    id: "qa23"
                },
                {
                    value: "Australia",
                    id: "qa24"
                }
            ]

        },
        {
            id: "q3",
            question: "Who was the wicket-keeper of the Indian Cricket Team during the World Cup 2003 tournament?",
            correct_answer : "qa33",
            answers : [
                {
                    value: "Parthiv Patel",
                    id: "qa31"
                },
                {
                    value: "Nayan Mongia",
                    id: "qa32"
                },
                {
                    value: "Rahul Dravid",
                    id: "qa33"
                },
                {
                    value: "Mahendra Singh Dhoni",
                    id: "qa34"
                }
            ]
        },
        {
            id: "q4",
            question: "In which year were the World Cup matches reduced to 50 overs from the previous 60 overs?",
            correct_answer : "qa44",
            answers : [
                {
                    value: "1983",
                    id: "qa41"
                },
                {
                    value: "1979",
                    id: "qa42"
                },
                {
                    value: "1992",
                    id: "qa43"
                },
                {
                    value: "1987",
                    id: "qa44"
                }
            ]
        },
        {
            id: "q5",
            question: "Which cricketer has the best bowling figures in an innings at the World Cup ?",
            correct_answer : "qa52",
            answers : [
                {
                    value: "Ajit Agarkar",
                    id: "qa51"
                },
                {
                    value: "Ashish Nehra",
                    id: "qa52"
                },
                {
                    value: "Kapil Dev",
                    id: "qa53"
                },
                {
                    value: "V Prasad",
                    id: "qa54"
                }
            ]
        },
        {
            id: "q6",
            question: "How many runs did India make in its historic World Cup win over West Indies in 1983?",
            correct_answer : "qa63",
            answers : [
                {
                    value: "374",
                    id: "qa61"
                },
                {
                    value: "175",
                    id: "qa62"
                },
                {
                    value: "183",
                    id: "qa63"
                },
                {
                    value: "259",
                    id: "qa64"
                }
            ]
        },
        {
            id: "q7",
            question: "Against which country did India score their highest total at the World Cup?",
            correct_answer : "qa71",
            answers : [
                {
                    value: "Bermuda",
                    id: "qa71"
                },
                {
                    value: "Kenya",
                    id: "qa72"
                },
                {
                    value: "Sri Lanka",
                    id: "qa73"
                },
                {
                    value: "Namibia",
                    id: "qa74"
                }
            ]
        },
        {
            id: "q8",
            question: "Which cricketer has scored the most ducks at the World Cup ?",
            correct_answer : "qa83",
            answers : [
                {
                    value: "Ajit Agarkar",
                    id: "qa81"
                },
                {
                    value: "Sachin Tendulkar",
                    id: "qa82"
                },
                {
                    value: "K Srikkanth",
                    id: "qa83"
                },
                {
                    value: "J Srinath",
                    id: "qa84"
                }
            ]
        },
        {
            id: "q9",
            question: "Who was the highest wicket taker for India during the historic 1993 Prudential World Cup held in England?",
            correct_answer : "qa94",
            answers : [
                {
                    value: "Ravi Shashtri",
                    id: "qa91"
                },
                {
                    value: "Kapil Dev",
                    id: "qa92"
                },
                {
                    value: "Sandeep Patil",
                    id: "qa93"
                },
                {
                    value: "Roger Binny",
                    id: "qa94"
                }
            ]
        },
        {
            id: "q10",
            question: "Who was the captain of the Indian team during the first World Cup in England in 1975?",
            correct_answer : "qa101",
            answers : [
                {
                    value: "S.Venkataraghavan",
                    id: "qa101"
                },
                {
                    value: "Abid Ali",
                    id: "qa102"
                },
                {
                    value: "Sunil Gavaskar",
                    id: "qa103"
                },
                {
                    value: "Gundappa Vishwanath",
                    id: "qa104"
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
                sc.message = "All answers correct!";
                sc.icon = "http://im.rediff.com/cricket/2012/aug/26pic1.jpg";
            } else if (sc.result.correct > sc.result.incorrect) {
                sc.message = "Almost there...";
                sc.icon = "http://images.indianexpress.com/2016/11/saharunoutfbl.jpg";
            } else {
                sc.message = "Better luck next time :(";
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
