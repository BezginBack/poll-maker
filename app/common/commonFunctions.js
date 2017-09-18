var appUrl = window.location.origin;
var ajaxFunctions = {
    ready: function ready (fn) {
        if (typeof fn !== 'function') {
            return;
        }
        if (document.readyState === 'complete') {
            return fn();
        }
        document.addEventListener('DOMContentLoaded', fn, false);
    },
    ajaxRequest: function ajaxRequest (method, rurl, data, waitFunction, callback) {
        $.ajax({
            type: method,
            url : appUrl + rurl,
            data : data,
            dataType : 'json',
            beforeSend : waitFunction,
            error : function(err){
                callback(err, null);   
            },
            success : function(response){
                callback(null, response);
            }
        });
    }
};

var alertize = function(obj){
    this.err = obj.err;
    this.alertLoc = obj.alertLoc;
    this.alertClass = obj.alertClass;
    this.topLoc = obj.topLoc;
    this.leftLoc = obj.leftLoc;
    this.width = obj.width;
    var html = "<div class='alert " + this.alertClass + " fade in alert-box' role='alert'";
    html += "style='display:none; position:fixed; border-radius:0; top:" + this.topLoc +"%; left:" + this.leftLoc +"%; width:" + this.width + "%; font-size:10pt; padding:10px' >";
    html += "<span id='alertclause'>" + this.err + "</span>";
    html += "<a class='close' href='#' data-dismiss='alert' aria-label='close'>&times;</a></div>";
    this.alertLoc.html(html);
    $('.alert-box').fadeIn('slow');
};

var gradientAnimate = function(obj) {
    this.gradientLoc = obj.gradientLoc;
    this.id = obj.id;
    var gradientLoc = this.gradientLoc;
    gradientLoc.css('display', 'block');
    var i = 0;
    this.id = setInterval(function(){
        if(gradientLoc.css('display') == 'block'){
            gradientLoc.css('background', '-moz-linear-gradient(0deg, #000040 0%, #000040 ' + i + '%, #ffffff ' + (i+10) + '%, #000040 ' + (i+20) + '%, #000040 100%)');
            gradientLoc.css('background', '-webkit-gradient(linear, left top, right top, color-stop(0%, #000040), color-stop(' + i + '%, #000040), color-stop(' + (i+10) + '%, #ffffff), color-stop(' + (i+20) + '%, #000040), color-stop(100%, #000040))');
            gradientLoc.css('background', '-webkit-linear-gradient(0deg, #000080 0%, #000040 ' + i + '%, #ffffff ' + (i+10) + '%, #000040 ' + (i+20) + '%, #000040 100%)');
            gradientLoc.css('background', '-o-linear-gradient(0deg, #000080 0%, #000040 ' + i + '%, #ffffff ' + (i+10) + '%, #000040 ' + (i+20) + '%, #000040 100%)');
            gradientLoc.css('background', '-ms-linear-gradient(0deg, #000080 0%, #000040 ' + i + '%, #ffffff ' + (i+10) + '%, #000040 ' + (i+20)+ '%, #000040 100%)');
            gradientLoc.css('background', 'linear-gradient(90deg, #000080 0%, #000040 ' + i + '%, #ffffff ' + (i+10) + '%, #000040 ' + (i+20) + '%, #000040 100%)');
            i++;
            if(i == 100){
                i = 0;
            }
        } else {
            clearInterval(this.id);
        }
    }, 10);
};

var validation = function(obj){
    var errClass = 'has-error';
    var successClass = 'has-success';
    var errGlyphicon = 'glyphicon-remove';
    var successGlyphicon = 'glyphicon-ok';
    
    if(obj.ajax == undefined){
        if(!obj.regExp.test(obj.value)) {
            obj.loc.removeClass(successClass);
            obj.loc.addClass(errClass);
            obj.loc.data('success', '0');
            obj.span.removeClass(successGlyphicon);
            obj.span.addClass(errGlyphicon);
        } else {
            obj.loc.removeClass(errClass);
            obj.loc.addClass(successClass);
            obj.loc.data('success', '1');
            obj.span.removeClass(errGlyphicon);
            obj.span.addClass(successGlyphicon);
        }
    } else {
        if(!obj.regExp.test(obj.value)) {
            obj.loc.removeClass(successClass);
            obj.loc.addClass(errClass);
            obj.loc.data('success', '0');
            obj.span.removeClass(successGlyphicon);
            obj.span.addClass(errGlyphicon);
        } else {
            obj.loc.removeClass(errClass);
            obj.loc.addClass(successClass);
            obj.loc.data('success', '1'); 
            obj.span.removeClass(errGlyphicon);
            obj.span.addClass(successGlyphicon);
            var rurl = '/api/find-by-title';
            var data = {
                title : obj.value  
            };
            this.returnObj = function(callback){
                $.ajax({
                    type: 'POST',
                    url : appUrl + rurl,
                    data : data,
                    dataType : 'json',
                    error : function(err){
                        callback(null, 'error');   
                    },
                    success : function(response){
                        if(response != ""){
                            obj.loc.removeClass(successClass);
                            obj.loc.addClass(errClass);
                            obj.loc.data('success', '0');
                            obj.span.removeClass(successGlyphicon);
                            obj.span.addClass(errGlyphicon);
                            callback(null, 'found');
                        }
                    }
                });
            };
        }
    }
};

var copyToClipboard = function (text) {
if (window.clipboardData && window.clipboardData.setData) {
    return clipboardData.setData("Text", text); 
} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
};