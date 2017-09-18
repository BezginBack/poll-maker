$(document).ready(function() {
    var g = null;
    
    $('#title').on('keyup', function(){
        $('.alert-box').remove();
        var v = new validation({
            regExp : /^[A-Za-z_-]{3,12}$/,
            loc : $('#titlebox'),
            span : $('#titlebox span'),
            value : this.value,
            ajax : true
        });
        v.returnObj(function(err, info){
            if (info == 'found'){
                var er = new alertize({
                    err : 'This title has already been taken',
                    alertLoc : $('.alert-div'),
                    alertClass : 'alert-danger',
                    topLoc : 12,
                    leftLoc : 30,
                    width : 40
                });
            } else if (info == 'error'){
                var er = new alertize({
                    err : 'There is something improper : --ajaxRequest',
                    alertLoc : $('.alert-div'),
                    alertClass : 'alert-danger',
                    topLoc : 12,
                    leftLoc : 30,
                    width : 40
                });
            } 
        });
    });
    
    $("#add_row").on("click", function() {
        if($('#tab_logic tr').length < 11){
            var newid = 0;
            $.each($("#tab_logic tr"), function() {
                if (parseInt($(this).data("id")) > newid) {
                    newid = parseInt($(this).data("id"));
                }
            });
            newid++;
            var tr = $("<tr></tr>", {
                id: "addr"+newid,
                "data-id": newid
            });
        }
        
        $.each($("#tab_logic tbody tr:nth(0) td"), function() {
            var cur_td = $(this);
            var children = cur_td.children();
            if ($(this).data("name") != undefined) {
                var td = $("<td></td>", {
                    "data-name": $(cur_td).data("name")
                });
                var d = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
                var c = $(d).children('input');
                c.attr("name", $(cur_td).data("name") + newid);
                d.appendTo($(td));
                td.appendTo($(tr));
                c.on('keyup', function(){
                    var v = new validation({
                        regExp : /^[A-Za-z0-9 ',.()?-]{1,100}$/,
                        loc : d,
                        span : $(d).children('span'),
                        value : this.value
                    });        
                });
            } else {
                var td = $("<td></td>", {
                    'text': $('#tab_logic tr').length
                }).appendTo($(tr));
            }
        });
        
        $(tr).appendTo($('#tab_logic'));
        
        $(tr).find("td button.row-remove").on("click", function() {
            $(this).closest("tr").remove();
        });
    });
    
    $('#question').on('keyup', function(){
        var v = new validation({
            regExp : /^[A-Za-z0-9 ?(),'-]{3,100}$/,
            loc : $('#questionbox'),
            span : $('#questionbox span'),
            value : this.value,
        });
    });
    
    $('#savePoll').on('click', function() {
        var t = $('#titlebox').data('success');
        var q = $('#questionbox').data('success');
        var options = []; 
        var title;
        var question;
        var error = 'There is something improper :';
        $.each($('.options'), function() {
            if($(this).data('success') == '1'){
                var item = { 
                    option : $(this).find('input').val(),
                    vote : 0
                };
                options.push(item);
            }
        });
        if(t == '1'){
            title = $('#titlebox input').val();
        } else {
            title = null;
            error += ' --Title';
        }
        if(q == '1'){
            question = $('#questionbox input').val();
        } else {
            question = null;
            error += ' --Question';
        }
        if(options.length == 0){
            error += ' --Options';
        }
        if(title != null && question != null && options.length > 0){
            $('.alert-box').remove();
            $(this).attr("disabled", true);
            var url = '/savepoll';
            var data = {
                title : title,
                question : question,
                options : JSON.stringify(options)
            };
            var wait = function() {
                g = new gradientAnimate({
                    gradientLoc : $('.waiting-line') 
                });
            };
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
                if(err){
                    error += ' --ajaxRequest';
                    var er = new alertize({
                        err : error,
                        alertLoc : $('.alert-div'),
                        alertClass : 'alert-danger',
                        topLoc : 12,
                        leftLoc : 30,
                        width : 40
                    });
                    clearInterval(g.id);
                    $('.waiting-line').css('display', 'none');
                } else {
                    if(res){
                        $('#userform')[0].reset();
                        $.each($('.form-group'), function() {
                            $(this).data('success', '0');
                            $(this).removeClass('has-success');
                            $(this).find('span').removeClass('glyphicon-ok');
                        });
                        clearInterval(g.id);
                        $('.waiting-line').css('display', 'none');
                        document.location.href = '/' + res.user + '/' + res.title;
                    } else {
                        error += ' --data';
                        var er = new alertize({
                            err : error,
                            alertLoc : $('.alert-div'),
                            alertClass : 'alert-danger',
                            topLoc : 12,
                            leftLoc : 30,
                            width : 40
                        });
                        clearInterval(g.id);
                        $('.waiting-line').css('display', 'none');
                    }
                }
            }));
        } else {
            var er = new alertize({
                err : error,
                alertLoc : $('.alert-div'),
                alertClass : 'alert-danger',
                topLoc : 12,
                leftLoc : 30,
                width : 40
            });
        }
    });
    
    window.addEventListener('keydown', function(e) {
        if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
            if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
                var t = $('#titlebox').data('success');
                var q = $('#questionbox').data('success');
                var options = []; 
                var title;
                var question;
                var error = 'There is something improper :';
                $.each($('.options'), function() {
                    if($(this).data('success') == '1'){
                        var item = { 
                            option : $(this).find('input').val(),
                            vote : 0
                        };
                        options.push(item);
                    }
                });
                if(t == '1'){
                    title = $('#titlebox input').val();
                } else {
                    title = null;
                    error += ' --Title';
                }
                if(q == '1'){
                    question = $('#questionbox input').val();
                } else {
                    question = null;
                    error += ' --Question';
                }
                if(options.length == 0){
                    error += ' --Options';
                }
                if(title != null && question != null && options.length > 0){
                    $('#userform')[0].reset();
                    $('.alert-box').remove();
                    e.preventDefault();
                    var url = '/savepoll';
                    var data = {
                        title : title,
                        question : question,
                        options : JSON.stringify(options)
                    };
                    var wait = function() {
                        g = new gradientAnimate({
                            gradientLoc : $('.waiting-line') 
                        });
                    };
                    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', url, data, wait, function (err, res) {
                        if(err){
                            error += ' --ajaxRequest';
                            var er = new alertize({
                                err : error,
                                alertLoc : $('.alert-div'),
                                alertClass : 'alert-danger',
                                topLoc : 12,
                                leftLoc : 30,
                                width : 40
                            });
                            clearInterval(g.id);
                            $('.waiting-line').css('display', 'none');
                        } else {
                            if(res){
                                $('#userform')[0].reset();
                                $.each($('.form-group'), function() {
                                    $(this).data('success', '0');
                                    $(this).removeClass('has-success');
                                    $(this).find('span').removeClass('glyphicon-ok');
                                });
                                clearInterval(g.id);
                                $('.waiting-line').css('display', 'none');
                                document.location.href = '/' + res.user + '/' + res.title;
                            } else {
                                error += ' --data';
                                var er = new alertize({
                                    err : error,
                                    alertLoc : $('.alert-div'),
                                    alertClass : 'alert-danger',
                                    topLoc : 12,
                                    leftLoc : 30,
                                    width : 40
                                });
                                clearInterval(g.id);
                                $('.waiting-line').css('display', 'none');
                            }
                        }
                    }));
                } else {
                    var er = new alertize({
                        err : error,
                        alertLoc : $('.alert-div'),
                        alertClass : 'alert-danger',
                        topLoc : 12,
                        leftLoc : 30,
                        width : 40
                    });
                    e.preventDefault();
                }
            }
        }
    }, true);
    
   $('a').on('click', function(){
        clearInterval(g.id);
        g = new gradientAnimate({
            gradientLoc : $('.waiting-line')
        });
    });
});
