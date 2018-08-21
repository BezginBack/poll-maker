var sumVote = 0;
var optionsArray = [];
var votesArray = [];
var id;
var g = null;
window.onload = function(){
    var user = $('.header-poll-page').data('user');
    var title = $('.header-poll-page').data('title');
    var url = '/api/find-by-title-and-user';
    var data = {
        title : title,
        user : user
    };
    var wait = function() {
        g = new gradientAnimate({
            gradientLoc : $('.waiting-line') 
        });
    };
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
        if(err) {
            var e = new alertize({
                err : 'There is something improper : --ajaxRequest',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 25,
                width : 51
            });
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        } else {
            if(res.length > 0){
                id = res[0]._id;
                votesArray = res[0].votes;
                sumVote = res[0].sumvotes;
                var html = "";
                $('title').text(res[0].title + ' | Hoppala');
                $('.header-poll-page label').text(res[0].title);
                $('.header-poll-page p').text(res[0].question);
                for(var i = 0; i < res[0].options.length; i++){
                    html += "<div><p class='text-muted each-option' data-index='" + i + "'>" + res[0].options[i].option + "</p></div>";
                    $('body').append("<div class='hidetool'>result</div>");
                    optionsArray.push(res[0].options[i]);
                }
                $('.options-option').append(html);
                $('.share-url').find('label').eq(0).text('share url');
                $('.share-url').find('p').eq(0).text("https://poll-maker-bezginback.c9users.io/" + res[0].user + "/" + res[0].title);
                $('.share-url').find('p').eq(0).on('click', function(e){
                    e.stopPropagation();
                    if($('.pop-over').css('display') == 'none'){
                        $('.pop-over').css('left', e.pageX + 10);
                        $('.pop-over').css('top', e.pageY + 20);
                        $('.pop-over').fadeIn(500);
                    } else {
                        $('.pop-over').fadeOut(500);
                    } 
                });
                $('#copy').on('click', function() {
                   copyToClipboard($('.share-url').find('p').eq(0).text());
                   $('.pop-over').fadeOut(500);
                });
                $('.footer-buttons').find('a').eq(0).attr('href', '/');
                $('.footer-buttons').find('a').eq(0).html("<p class='text-muted'>home</p>");
                $('.footer-buttons').find('a').eq(1).attr('href', '#');
                $('.footer-buttons').find('a').eq(1).html("<p class='text-muted'>results</p>");
                $('.footer-buttons').find('a').eq(1).on('click', function() {
                    getGraphic();
                });
                $('.footer-buttons').find('.liner').eq(0).addClass('line');
                $('.each-option').on('click', function(){
                    eachOptionClick(this);
                });
                if($('.data-name').data('name') == res[0].user){
                    var button = "<button class='btn btn-danger btn-block' id='delete'>Delete</button>";
                    $('.footer-buttons').find('.col-sm-2').eq(2).append(button);
                    $('#delete').on('click', function() {
                        deleteClick(id);
                    });
                }
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
                $('a').on('click', function(){
                    clearInterval(g.id);
                    g = new gradientAnimate({
                        gradientLoc : $('.waiting-line') 
                    });
                });
            } else {
                var e = new alertize({
                    err : "not found <a href='/'><strong>go home</strong></a>",
                    alertLoc : $('.alert-div'),
                    alertClass : 'alert-danger',
                    topLoc : 12,
                    leftLoc : 25,
                    width : 51
                });
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
            }
        }
    }));
};

var eachOptionClick = function(obj){
    getIp(function (ip) {
        var flag = true;
        if(votesArray.length > 0) {
            for(var i = 0; i < votesArray.length; i++){
                if (votesArray[i] == ip){
                    i = votesArray.length;
                    flag = false;
                }
            }
        }
        if(flag){
            var opts = [];
            var rates = [];
            var index = $(obj).data('index');
            optionsArray[index].vote++;
            votesArray.push(ip);
            sumVote++;
            for(var j = 0; j < optionsArray.length; j++ ){
                opts.push(optionsArray[j].option);
                rates.push((optionsArray[j].vote*100/sumVote).toFixed(1));
            }
            updatePollVote(id, optionsArray, votesArray, sumVote, function(result){
                if(result[1]){
                    var a = new alertize({
                        err : 'Thanks for voting',
                        alertLoc : $('.alert-div'),
                        alertClass : 'alert-success',
                        topLoc : 12,
                        leftLoc : 25,
                        width : 51
                    });
                    clearInterval(g.id);
                    $('.waiting-line').css('display', 'none');
                    grafize(opts, rates, sumVote);
                } else {
                    var e = new alertize({
                        err : 'There is something improper : --data',
                        alertLoc : $('.alert-div'),
                        alertClass : 'alert-danger',
                        topLoc : 12,
                        leftLoc : 25,
                        width : 51
                    });
                    clearInterval(g.id);
                    $('.waiting-line').css('display', 'none');
                }
            });
        } else {
            var e = new alertize({
                err : 'You have already voted',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 25,
                width : 51
            });
            getGraphic();
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        }
    });    
};

var getIp = function(callback){
    var url = '/api/get-ip';
    var data = null;
    var wait = function() {
        clearInterval(g.id);
        g = new gradientAnimate({
            gradientLoc : $('.waiting-line') 
        });
    };
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
        if(err) {
            var e = new alertize({
                err : 'There is something improper : --ajaxRequest --getIp',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 25,
                width : 51
            });
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        } else {
            callback(res.ip);
        }
    }));
};

var updatePollVote = function(rid, roptionsArray, rvotesArray, rsumVote, callback){
    var url = '/update';
    var data = {
        id : rid,
        optionsArray : JSON.stringify(roptionsArray),
        votesArray : JSON.stringify(rvotesArray),
        sumVotes : rsumVote
    };
    var wait = null;
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
        if(err) {
            var e = new alertize({
                err : 'There is something improper : --ajaxRequest --updatePollVote',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 25,
                width : 51
            });
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        } else {
            callback(res);
        }
    }));
};

var getGraphic = function(){
    var user = $('.header-poll-page').data('user');
    var title = $('.header-poll-page').data('title');
    var url = '/api/find-by-title-and-user';
    var data = {
        title : title,
        user : user
    };
    var wait = function() {
        clearInterval(g.id);
        g = new gradientAnimate({
            gradientLoc : $('.waiting-line') 
        });
    };
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
        if(err) {
            var e = new alertize({
                err : 'There is something improper : --ajaxRequest',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 25,
                width : 51
            });
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        } else {
            if(res.length > 0) {
                var optsa = [];
                var ratesa = [];
                var suma = res[0].sumvotes;
                for(var i = 0; i < res[0].options.length; i++){
                    optsa.push(res[0].options[i].option);
                    ratesa.push((res[0].options[i].vote * 100 / suma).toFixed(1)); 
                }
                grafize(optsa, ratesa, suma);
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
            }
        }
    }));
};

var grafize = function(opts, rates, sum){
    $('.bar-canvas').empty();
    $('.bar-canvas').append("<canvas id='canvas-bar'><canvas>");
    $('.options-option').css('display', 'none');
    $('.bar-canvas').css('display', 'block');
    Chart.defaults.global.defaultFontFamily = 'Open Sans Condensed';
    Chart.defaults.global.defaultFontSize = 14;
    var ctx = $('#canvas-bar');
    horizontalBarChartObj.data = {
        labels: opts,
        datasets: [{
            label : 'total votes: ' + sum + ' | ' + 'vote rate',
            data : rates,
            backgroundColor : '#f80',
        }]
    };
    horizontalBarChartObj.options.animation = {
        duration : 3000,
        easing : 'linear',
        onProgress : function(a) {
            if(a.animationObject.numSteps > 60){
                var id = this.id;
                var cLeft = this.config.data.datasets[0]._meta[id].controller.chart.chart.canvas.offsetLeft;
                var cTop = this.config.data.datasets[0]._meta[id].controller.chart.chart.canvas.offsetTop;
                for(var j = 0; j < rates.length; j++) {
                    var base = this.config.data.datasets[0]._meta[id].data[j]._model.base;
                    var mY = this.config.data.datasets[0]._meta[id].data[j]._model.y;
                    var mH = this.config.data.datasets[0]._meta[id].data[j]._model.height;
                    $('.hidetool').eq(j).css('display', 'block');
                    $('.hidetool').eq(j).text((a.animationObject.currentStep / a.animationObject.numSteps * rates[j]).toFixed(1) + ' %');
                    $('.hidetool').eq(j).css('font-size', mH/2);
                    $('.hidetool').eq(j).css('left', base + cLeft + "px");
                    $('.hidetool').eq(j).css('top',  + cTop + mY - (mH/3) + "px");
                }
            }
        },
    };
    var horizontalBarChart = new Chart(ctx, horizontalBarChartObj);
};

var deleteClick = function(rid){
    confirmDialog('Delete!', 'Selected poll will be deleted permanently', 'No, don\'t do anything', 'Yes, i\'m sure', function(){
        var url = '/delete';
        var data = {
            id : rid
        };
        var wait = function() {
            clearInterval(g.id);
            g = new gradientAnimate({
                gradientLoc : $('.waiting-line') 
            });
        };
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
            if(err) {
                var e = new alertize({
                    err : 'There is something improper : --ajaxRequest',
                    alertLoc : $('.alert-div'),
                    alertClass : 'alert-danger',
                    topLoc : 12,
                    leftLoc : 25,
                    width : 51
                });
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
            } else {
                window.history.back();
                window.history.back();
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
            }
        })); 
    });
};


var confirmDialog =  function(heading, question, cancelButtonTxt, okButtonTxt, callback) {
    var confirmModal = 
    $('<div class="modal fade">' +        
    '<div class="modal-dialog">' +
    '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<a class="close" data-dismiss="modal" >&times;</a>' +
    '<h3>' + heading +'</h3>' +
    '</div>' +
    
    '<div class="modal-body">' +
    '<p>' + question + '</p>' +
    '</div>' +
    
    '<div class="modal-footer">' +
    '<a href="#!" class="btn btn-danger" data-dismiss="modal">' + 
    cancelButtonTxt + 
    '</a>' +
    '<a href="#!" id="okButton" class="btn btn-primary">' + 
    okButtonTxt + 
    '</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>');

    confirmModal.find('#okButton').click(function(event) {
      callback();
      confirmModal.modal('hide');
    }); 
    confirmModal.modal('show');
};  

$('.pop-over').on('click', function(e) {
    e.stopPropagation();
});

$('body').on('click', function() {
    $('.pop-over').fadeOut(500);
});

$('a').on('click', function(){
    clearInterval(g.id);
    g = new gradientAnimate({
        gradientLoc : $('.waiting-line')
    });
});
