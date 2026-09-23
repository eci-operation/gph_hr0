function buildNavTopProblemMenu() {
	var href = CONTEXT_PATH + "/Autocomplete/";
	var params = {
			"sourceType" : "getProblemInformationForNavTop",
			"arg01" : CURRENT_PROJECT_ID
		};

	var data = $.qp.getJson(href, params).outputGroup;
	var str = "";
	var total = 0;
	$("li#navTopProblem").find(".dropdown-alerts").html("");
	
	var url = CONTEXT_PATH + "/problemlist/search?";
	var params;
	var moduleName = "";
	if (data != null && data.length > 0 ) {
		str ="<ul class=\"dropdown-menu dropdown-alerts\">";
		for (var i = 0; i < data.length; i++) {
			element = data[i];
			total += parseInt(element.output01);
			if (element.optionLabel == '') {
				moduleName = fcomMsgSource['sc.sys.0058'];
				params= { moduleId:'-1', moduleIdAutocomplete:'', resourceType:''};
			} else {
				moduleName = element.optionLabel;
				params= { moduleId:element.optionValue, moduleIdAutocomplete:moduleName, resourceType:''};
			}
			str+="<li><a class=\"active\" href=\"" + url + jQuery.param(params) + "\"><span class='pull-left'>"+ moduleName + "</span><span class=\"pull-right text-muted\">(" + element.output01 + ")</span></a></li>";
			str+="<li class=\"divider\"></li>";
		}
		str+="<li ><a href=\"" +CONTEXT_PATH+ "/problemlist/search?init\" class=\"text-center active\"><strong>"+fcomMsgSource['sc.sys.0057']+"</strong></a></li>";
		str+="</ul>";
		$("li#navTopProblem").find(".label-menu-corner").text(total);
		$("li#navTopProblem").find(".label-menu-corner").show();
	} else {
		
		$("li#navTopProblem").find(".label-menu-corner").text("");
		$("li#navTopProblem").find(".label-menu-corner").hide();
	}
	
	$("li#navTopProblem").append(str);
}

/**
 * Function that allows you to pass in a template string (a string that contains placeholders) and some parameters,
 * and it replaces the placeholders from the template string with the parameter values.
 *
 * Sample usage
 * var str = "She {1} {0}{2} by the {0}{3}. {-1}^_^{-2}";
 * str = str.format(["sea", "sells", "shells", "shore"]);
 * alert(str);
 *
 * @param args
 * @returns {string}
 */
String.prototype.format = function (args) {
    var str = this;
    return str.replace(String.prototype.format.regex, function(item) {
        var intVal = parseInt(item.substring(1, item.length - 1));
        var replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");

/**
 * Function to change form input field to JSON string format.
 *
 * @param $form
 */
function toJson($form) {
    var data = {};
    $($form.serializeArray()).each(function(i, v) {
        data[v.name] = v.value;
    });
    return JSON.stringify(data);
}

/**
 * Convert currency to integer format
 *
 * @param $val
 *
 * @returns If ',' is matched return '', if '.' matched return ','
 */
function currencyToInteger($val){
    $val = $val.replace(/[,.]/g, function (m) {
        return m === ',' ? '' : '';
    });
    return $val;
};

/**
 * Convert currency to decimal format
 *
 * @param $val
 *
 * @returns If ',' is matched return '.', if '.' matched return ''
 */
function currencyToDecimal($val){
    $val = $val.replace(/[,.]/g, function (m) {
        return m === ',' ? '.' : '';
    });
    return $val;
};

function changeLanguage(obj,label) {
    if(obj != null && obj.length > 0){
        var languageCode = obj.split("_");
        var dialog = $('div#languageDialog');
        dialog.modal();
        var message = fcomMsgSource['inf.sys.0065'];
        if(message!=undefined || message!=null){
            message = message.format([label]);
            dialog.find('div.modal-body').html(message);
        }

        dialog.find('button#languageYes').attr("onclick","processChangeLanguage('"+languageCode[0]+"','"+languageCode[1]+"')");
    }
}

function getListLanguage(){
    $.ajax({
        url: CONTEXT_PATH + "/language/getUnusedLanguages",
        dataType: 'json',
        type: 'GET',
        success: function(data) {
            if(data.length>0){
                $('li.language-menu').empty();
                var item =
                    '            <a onclick="changeLanguage(\''+data[0].value+'\',\''+data[0].label+'\')" href="javascript:">\n' +
                    '                <img class="img-thumbnail border-image" src="'+CONTEXT_PATH+'/resources/media/images/'+data[0].value+'.png"/>\n' +
                    '                &nbsp;'+fcomMsgSource["err.sys.0303"]+'\n' +
                    '        </a>\n' ;
                $('li.language-menu').append(item);
            }

        }
    });
}

function processChangeLanguage(lang,country){
    $('button#languageYes').text(fcomMsgSource['sc.sys.0056']).attr('disabled','disabled');
    window.location.href = CONTEXT_PATH
    			+ '/language/locale?languageCode=' + lang
    			+ '&countryCode=' + country + '&r='
    			+ Math.random();
}

function redirectBack(backURL){
    if(backURL!=null && backURL!="" && backURL!=undefined){
        window.location = CONTEXT_PATH+backURL;
    }else{
        window.history.back();
    }
}

function isBlank(str){
    return !(str != undefined && str!=null && str != "");
}

function isNull(obj){
    return !(obj != undefined && obj!=null);
}

function pushPopup(message,classStyle){
    var className = "alert-info";
    if(!isBlank(classStyle)){
        className = classStyle;
    }
    $('.alert-stack-section').append('<div class="alert alert-stack-mode '+className+'">'+
        '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
        '<ul><li>'+message+'</li></ul></div>');
    $(".alert-stack-mode").fadeTo(2000, 500).slideUp(500, function(){
        $(this).slideUp(500);
        $(this).remove();
    });
}

$(function(){
    getListLanguage();
    
    var url = window.location.pathname;  
    var currentUrl = url.replace(CONTEXT_PATH, '').split('/');
    var activePage = CONTEXT_PATH + '/' + currentUrl[1] + '/';
    $('.treeview-menu li a').each(function(){  
        var currentPage = this.href.substring(0, this.href.lastIndexOf('/')+1);

        if (currentPage.includes(activePage)) {
        	var e = $(this).parent();
        	while(e) {
	        	if($(e).is('li')){
	        		$(e).addClass('active');
	        	} else if($(e).is('ul')){
	        		$(this).addClass('menu-open');
	                $(this).css('display', 'block');
	        	} else if($(e).is('section')){
	        		break;
	        	}
	        	e = $(e).parent();
        	}
        } 
    });
});