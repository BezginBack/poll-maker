var g = null;
window.onload = function(){
    var url = '/api/get-all-polls';
    var data = null;
    var wait = function() {
        g = new gradientAnimate({
            gradientLoc : $('.waiting-line') 
        });
    };
    var admin = $('.section').eq(1).data('admin');
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
        if(err) {
            var e = new alertize({
                err : 'There is something improper : --ajaxRequest',
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 7,
                leftLoc : 30,
                width : 40
            });
            $('.waiting-line').css('display', 'none');
            clearInterval(g.id);
        } else {
            if(res.length > 0){
                for(var i = 0; i < res.length; i++){
                    var created = new Date(res[i].created);
                    var lastvoted = new Date(res[i].lastvoted);
                    var html = "";
                    html += "<div class='panel'><div class='panel-heading'>";
                    html += "<p>" + res[i].title + "</p>";
                        if(admin){
                            html += "<button type='button' class='close closer' data-id='" + res[i]._id + "'>&times;</button>";
                        }
                    html += "</div><a href='/" + res[i].user + "/" + res[i].title + "'><div class='panel-body'>";
                    html += res[i].question;
                    html += "</div><div class='panel-footer'>";
                    html += "created at: " + created.toDateString() + " - " + created.toLocaleTimeString('en-US', { hour12: false });
                    html += " | lastvoted at: " + lastvoted.toDateString() + " - " + lastvoted.toLocaleTimeString('en-US', { hour12: false });
                    html += " | by: " + res[i].user;
                    html += "</div></div></a>";
                    $('.waiting-line').css('display', 'none');
                    clearInterval(g.id);
                    $('.holder').append(html);
                }
                $('a').on('click', function(){
                    clearInterval(g.id);
                        g = new gradientAnimate({
                            gradientLoc : $('.waiting-line') 
                        });
                    });
                $('.closer').on('click', function(){
                    backUpClick($(this).data('id'));
                });
            } else {
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

var backUpClick = function (rid){
    var url = '/api/find-by-id';
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
            deleteIt(res[0]._id);
            backUp(res[0]);
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        }
    }));
};

var backUp = function(obj) {
    var url = '/backup';
    var data = {
        title : obj.title,
        user : obj.user,
        question : obj.question,
        lastvoted : obj.lastvoted,
        created : obj.created,
        options : JSON.stringify(obj.options),
        votes : JSON.stringify(obj.votes),
        sumvotes : obj.sumvotes
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
            console.log(res);
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        }
    }));  
};

var deleteIt = function(rid) {
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
            document.location.reload();
            clearInterval(g.id);
            $('.waiting-line').css('display', 'none');
        }
    })); 
};