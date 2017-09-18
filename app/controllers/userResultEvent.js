var g = null;
window.onload = function(){
    var user = $('.header-result-page').data('user');
    var url = '/api/find-by-user';
    var data = {
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
                var titlesArray = [];
                var sumVotesArray = [];
                $('.header-result-page').text('overall scores for ' + user);
                for(var i = 0; i < res.length; i++){
                    var created = new Date(res[i].created);
                    var lastvoted = new Date(res[i].lastvoted);
                    var html = "";
                    html += "<a href='/" + res[i].user + "/" + res[i].title + "'><div class='panel'><div class='panel-heading'>";
                    html += res[i].title;
                    html += "</div><div class='panel-body'>";
                    html += res[i].question;
                    html += "</div><div class='panel-footer'>";
                    html += "created at : " + created.toDateString() + " - " + created.toLocaleTimeString('en-US', { hour12: false });
                    html += " | lastvoted at : " + lastvoted.toDateString() + " - " + lastvoted.toLocaleTimeString('en-US', { hour12: false });
                    html += " | by : " + res[i].user;
                    html += "</div></div></a>";
                    titlesArray.push(res[i].title);
                    sumVotesArray.push(res[i].sumvotes);
                    $('.poll-panels').append(html);
                    $('a').on('click', function(){
                        clearInterval(g.id);
                        g = new gradientAnimate({
                            gradientLoc : $('.waiting-line') 
                        });
                    });
                }
                Chart.defaults.global.defaultFontFamily = 'Open Sans Condensed';
                Chart.defaults.global.defaultFontSize = 14;
                var ctx = $('#result');
                verticalBarChartObj.data = {
                    labels: titlesArray,
                    datasets: [{
                        label : "Votes",
                        data : sumVotesArray,
                        backgroundColor : '#f80'
                    }]
                };
                clearInterval(g.id);
                $('.waiting-line').css('display', 'none');
                var verticalBarChart = new Chart(ctx, verticalBarChartObj);
            } else {
                var e = new alertize({
                    err : "no item",
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

$('a').on('click', function(){
    clearInterval(g.id);
    g = new gradientAnimate({
        gradientLoc : $('.waiting-line') 
    });
});