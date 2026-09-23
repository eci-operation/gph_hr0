var escapseHTMLentityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

(function() {
	// include jQuery namespace.
	jQuery.namespace = function() {
		var a = arguments, o = null, i, j, d;
		for (i = 0; i < a.length; i = i + 1) {
			if(a[i]){
				d = a[i].split(".");
				o = window;
				for (j = 0; j < d.length; j = j + 1) {
					o[d[j]] = o[d[j]] || {};
					o = o[d[j]];
				}
			}
		}
		return o;
	};

	// definition namespace
	jQuery.namespace('$.qp');

	// ----- Common function -----
	$.qp.escapseHTML = function(string) {
	    return String(string).replace(/[&<>"'\/]/g, function (s) {
	      return escapseHTMLentityMap[s];
	    });
	}
	$.qp.unEscapseHTML = function(string) {
		return $("<div/>").html(string).text();
	}

	$.qp.getModuleMessage = function(messageCode) {
		return $.qp.unEscapseHTML(dbMsgSource[messageCode]);
	}
	
	$.qp.getMessage = function(messageCode) {
		return $.qp.unEscapseHTML(fcomMsgSource[messageCode]);
	}
	
	/**
	 * DungNN - alert
	 */
	
	$.qp.alert = function(string) {
		alert($.qp.unEscapseHTML(string));
	}

	$.qp.confirm = function(string) {
		return confirm($.qp.unEscapseHTML(string));
	}
	// Toggle multi rows
	$.qp.toggleMultiRows = function(thiz, fcomClassName) {
		var status = jQuery(thiz).prop("checked");
		if (!status) {
			$("." + fcomClassName).prop('checked', false).parents("tr")
					.removeAttr("style");
		} else {
			$("." + fcomClassName).prop('checked', true).parents("tr").attr(
					"style", "background-color:#FFFFCC");
		}
	};

	// Toggle single row
	$.qp.toggleSingleRow = function(thiz) {
		var status = jQuery(thiz).prop("checked");
		if (!status) {
			$(thiz).prop('checked', false).parents("tr").removeAttr("style");
		} else {
			$(thiz).prop('checked', true).parents("tr").attr("style",
					"background-color:#FFFFCC");
		}
	};

	// Add row in table
	$.qp.addRow = function(fcomTableId, fcomBusinessName, limitRow) {
		fcomAddRemoveSize = $("table#" + fcomTableId).find(
				"input[name=fcomAddRemoveIndex]").size();
		if (fcomAddRemoveSize < fcomLimitRow[limitRow]) {
			var obj = $("#" + fcomTableId + "-template").tmpl(); // clone
			// template
			// row
			$(obj).appendTo("table#" + fcomTableId);
			$(obj).find("[class^=input-autocomplete]").each(
					function() { // initial auto complete
						var hidden_obj = "<input type='hidden' name='"
								+ $(this).attr("submitElName") + "'>";
						$(hidden_obj).insertAfter($(this));
						$.qp.initialAutocomplete(this);
					});
			$(obj).find("[class^=input-datepicker]").each(function() {// initial
				// date
				// picker
				$.qp.initialDatePicker(this);
			});

			$.qp.initialAutoNumeric(obj);// initial Auto numeric

			$(".fcom-" + fcomTableId + "-totalCount")
					.val(fcomAddRemoveSize + 1);
			$.qp.reCalIndex(fcomTableId); // refresh row index (No.)
			$.qp.alternateRowColorInTable(fcomTableId); // alternate color
			$.qp.reCalBusinessName(fcomTableId, fcomBusinessName);
		} else {
			$.qp.alert(fcomMsgSource['err.sys.0010']);
		}
	};

	// Remove row in table
	$.qp.removeRow = function(fcomTableId, fcomBusinessName) {
		$("table#" + fcomTableId).find("input[name=fcomAddRemoveIndex]").each(
				function() {
					if (this.checked) {
						$(this).parents("tr").remove();
					}
				});

		if ($("table#" + fcomTableId).find("input[name=fcomAddRemoveIndex]")
				.size() == 0) {
			var obj = $("#" + fcomTableId + "-template").tmpl(); // clone
			// template
			// row
			$(obj).appendTo("table#" + fcomTableId);
		}

		$(".fcom-" + fcomTableId + "-totalCount").val(
				$("table#" + fcomTableId)
						.find("input[name=fcomAddRemoveIndex]").size());

		$(obj).find("[class^=input-autocomplete]").each(
				function() { // initial auto complete
					var hidden_obj = "<input type='hidden' name='"
							+ $(this).attr("submitElName") + "'>";
					$(hidden_obj).insertAfter($(this));
					$.qp.initialAutocomplete(this);
				});

		$.qp.initialAutoNumeric(obj);// initial Auto numeric

		$.qp.reCalIndex(fcomTableId); // refresh row index (No.)
		$.qp.alternateRowColorInTable(fcomTableId); // alternate color
		$.qp.reArrayIndex(fcomTableId);
		$.qp.reCalBusinessName(fcomTableId, fcomBusinessName);
	};

	// Refresh Row Index in Table
	$.qp.reCalIndex = function(table) {
		$table=$(table);
		var ignoreRows = parseInt($table.attr("data-ar-irows"));
		if(isNaN(ignoreRows)) {
			ignoreRows = 0;
		}
		$table.find(">tbody>tr").each(function(i) {
			if(i>=ignoreRows){
				$(this).find(">td.tableIndex").html(i-ignoreRows+1);
				$(this).find("input.tableIndex").val(i-ignoreRows);
				$(this).attr("data-ar-rindex",i-ignoreRows);
			}
		});

	};

	// alternate Color in Table
	$.qp.alternateRowColorInTable = function(fcomTableId) {
		var rowEven = '#' + fcomTableId + ' tr:even';
		var rowOdd = '#' + fcomTableId + ' tr:odd';
		$(rowEven).removeClass('style-odd-row ').addClass('style-even-row ');
		$(rowOdd).removeClass('style-even-row ').addClass('style-odd-row ');
	};

	// alternate Color in Table
	$.qp.initialRowColorInTable = function(className) {
		$('.' + className).each(
				function(i) {
					// var rowEven = '.' + className + ' tr:even';
					// var rowOdd = '.' + className + ' tr:odd';
					$(this).find("tr:even").removeClass('style-odd-row ')
							.addClass('style-even-row ');
					$(this).find("tr:odd").removeClass('style-even-row ')
							.addClass('style-odd-row ');
				});
	};

	$.qp.reCalBusinessName = function(fcomTableId, fcomBusinessName) {
		$("table#" + fcomTableId + " > tbody > tr").each(
				function(index, element) {
					$(this).find("input[name*='" + fcomBusinessName + "']")
							.each(
									function(i, e) {
										var eNameIndex = $(e).attr("name")
												.lastIndexOf('].');
										var eName = $(e).attr("name").substr(
												eNameIndex);
										$(e).attr(
												"name",
												fcomBusinessName + "["
														+ (index) + eName);
									});
					$(this).find("textarea[name*='" + fcomBusinessName + "']")
							.each(
									function(i, e) {
										var eNameIndex = $(e).attr("name")
												.lastIndexOf('].');
										var eName = $(e).attr("name").substr(
												eNameIndex);
										$(e).attr(
												"name",
												fcomBusinessName + "["
														+ (index) + eName);
									});
				});

	};

	$.qp.convertFormatDateTime = function(obj) {

	}
	// initial DatePicker
	$.qp.initialDatePicker = function(obj) {
		obj.datetimepicker({
			format : fcomSysDateFormat,
			showClear : true,
			showClose : true,
			showTodayButton : true,
			useStrict : true
		});
	};

	$.qp.initialDateTimePicker = function(obj) {
		obj.datetimepicker({
			format : fcomSysDatetimeFormat,
			showClear : true,
			showClose : true,
			showTodayButton : true,
			useStrict : true
		});
	};

	$.qp.initialTimePicker = function(obj) {
		obj.datetimepicker({
			format : fcomSysTimeFormat,
			showClear : true,
			showClose : true,
			showTodayButton : true,
			useStrict : true
		});
	};

	$.qp.initialDateTimePickerDetail = function(obj) {
		obj.datetimepicker({
			format : fcomSysDatetimeFormat,
			showClear : true,
			showClose : true,
			showTodayButton : true,
			useStrict : true
		});
	};
	$.qp.disableAutocomplete = function(obj) {
		$(obj).closest("div").find("input").prop('disabled', true);
		$(obj).closest("div").find(".dropdown-toggle").attr('disabled', true);
		$(obj).closest("div").addClass('combobox-disabled');
		$(obj).val("")
	};

	$.qp.enableAutocomplete = function(obj) {
		$(obj).closest("div").find("input").prop('disabled', false);
		$(obj).closest("div").find(".dropdown-toggle").attr('disabled', false);
		$(obj).closest("div").removeClass('combobox-disabled');
	};

	$.qp.initialCatAutocomplete = function(thiz) {
		
		var href = CONTEXT_PATH + "/Autocomplete/";
		
		$(thiz).each(function (){
			var autocomplete = $(this);
			var onselectAutocomplete =  $(autocomplete).attr("onSelectEvent");
			var onchangeAutocomplete =  $(autocomplete).attr("onChangeEvent");
			var onremoveAutocomplete =  $(autocomplete).attr("onRemoveEvent");
			
			$(autocomplete).autocomplete({				
				source: function( request, response ) {
					var params = {
							"searchKey" : $(autocomplete).val(),
							"sourceType" : $(autocomplete).attr("selectsqlid"),
							"arg01" :  $(autocomplete).attr("arg01"),
							"arg02" :  $(autocomplete).attr("arg02"),
							"arg03" :  $(autocomplete).attr("arg03"),
							"arg04" :  $(autocomplete).attr("arg04"),
							"arg05" :  $(autocomplete).attr("arg05"),
							"arg06" :  $(autocomplete).attr("arg06"),
							"arg07" :  $(autocomplete).attr("arg07"),
							"arg08" :  $(autocomplete).attr("arg08"),
							"arg09" :  $(autocomplete).attr("arg09"),
							"arg10" :  $(autocomplete).attr("arg10"),
							"arg11" :  $(autocomplete).attr("arg11"),
							"arg12" :  $(autocomplete).attr("arg12"),
							"arg13" :  $(autocomplete).attr("arg13"),
							"arg14" :  $(autocomplete).attr("arg14"),
							"arg15" :  $(autocomplete).attr("arg15"),
							"arg16" :  $(autocomplete).attr("arg16"),
							"arg17" :  $(autocomplete).attr("arg17"),
							"arg18" :  $(autocomplete).attr("arg18"),
							"arg19" :  $(autocomplete).attr("arg19"),
							"arg20" :  $(autocomplete).attr("arg20")
						};
					
					var dataSource;
					var dataSourceType = $(autocomplete).attr("sourceType");
					
					if(dataSourceType && dataSourceType=="local"){
						if(typeof jQuery.namespace($(autocomplete).attr("sourceCallback")) == "function") {
							dataSource = jQuery.namespace($(autocomplete).attr("sourceCallback"))(params);
						}
					} else {
						dataSource = $.qp.getJson(href, params).outputGroup;
					}
					response(dataSource);
			      },
			      change: function (event, ui) {
			    	  //console.log("change" + !ui.item + " " + ui.item);
			    	  if($(autocomplete).attr("mustmatch") == "true" || $(autocomplete).attr("mustmatch") == undefined) {
			    		 if (!ui.item) {
			    			 //alert('no value' + $(autocomplete).next("input[type=hidden]").val());
			    			 this.value = '';
			    			 $(autocomplete).next("input[type=hidden]").val('');
			    			 $(autocomplete).attr("selectedValue", "false");
			    		 } else {
			    			 if(ui.item != undefined && ui.item.optionLabel != this.value){
			    				 this.value = '';
				    			 $(autocomplete).next("input[type=hidden]").val('');
				    			 $(autocomplete).attr("selectedValue", "false");
			    			 }
			    		 }
			    	  } else {
			    		  if (!ui.item) {
			    			  $(autocomplete).next("input[type=hidden]").val(this.value);
			    			  $(autocomplete).attr("selectedValue", "false");
			    			  $.data(autocomplete,"selectedItem",null);
			    		  } else {
			    			  var optionValue = $(autocomplete).attr("optionValue");
			    			  $(autocomplete).next("input[type=hidden]").val(ui.item[optionValue]);  
			    			  $(autocomplete).attr("selectedValue", "true");
			    		  }
			    	  }
			    	  
			    	// change span icon
			    	  if($(autocomplete).next("input[type=hidden]").val() != ''){
			    		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
		        	  } else {
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
		        	  }
			    	  
			    	  if (onchangeAutocomplete != null && onchangeAutocomplete.length > 0 && typeof jQuery.namespace(onchangeAutocomplete) == "function") {
			    		  event["item"] = ui.item;
			    		  jQuery.namespace(onchangeAutocomplete)(event);
					  }
		          },
		          minLength: 1,
			      focus: function( event, ui ) {		
			    	  //console.log("focus");
			    	  /*
			    	  var displayOption = "";
			    	  var optionLabel = $(autocomplete).attr("optionLabel").split(",");
			    	  $(optionLabel).each(function(i){
			    		   displayOption += ui.item[optionLabel[i]] + " - ";
			    	  });
			    	  if(optionLabel.length > 0){
			    		  displayOption = displayOption.substring(0, displayOption.length - 3);
			    	  }
			    	  $(autocomplete).val(displayOption);
			    	  */
				      return false;
			        },
			      select: function( event, ui ) {			    	  
			    	 // alert("select" + ui.item);
			    	  var displayOption = "";
			    	  var optionLabel = $(autocomplete).attr("optionLabel").split(",");
			    	  $(optionLabel).each(function(i){
			    		   displayOption += ui.item[optionLabel[i]] + " - ";
			    	  });
			    	  if(optionLabel.length > 0){
			    		  displayOption = displayOption.substring(0, displayOption.length - 3);
			    	  }
			    	  
			    	  $(autocomplete).val(displayOption);
			    	  
		        	  if (ui.item != null) {
		        		  var optionValue = $(autocomplete).attr("optionValue");
			    		  $(autocomplete).next("input[type=hidden]").val(ui.item[optionValue]);  
			    		  $(autocomplete).attr("selectedValue", "true");
			    		  $(autocomplete).data("selectedItem",ui.item);
			    	  } else {
			    		  $(autocomplete).next("input[type=hidden]").val('');
			    		  $(autocomplete).attr("selectedValue", "false");
			    		  $(autocomplete).data("selectedItem",null);
			    	  }
		        	  
		        	  if (onselectAutocomplete != null && onselectAutocomplete.length > 0 && typeof window[onselectAutocomplete] == "function") {
		        		  event["item"] = ui.item;
		        		  window[onselectAutocomplete](event);
					  }
			    	  return false;
			      },
			      open: function(event, ui) {
			    	  $(autocomplete).attr("previousValue", $(autocomplete).next("input[type=hidden]").val());
			    	  $(autocomplete).attr("previousLabel", $(autocomplete).val());		
			    	  // show more results
			    	  //$('.ui-autocomplete').append('<li style="background-color: gray;" class="ui-menu-item"><a href="javascript:">More result</a></li>');
			      },
			      close: function() {
			    	  //console.log("close");
			    	  if($(autocomplete).attr("mustmatch") == undefined || $(autocomplete).attr("mustmatch") == "true") {
				    		 if (this.value == '') {
				    			 $(autocomplete).next("input[type=hidden]").val('');
				    			 $(autocomplete).attr("selectedValue", "false");
				    		 }
			    	  } 
			    	  // change span icon
		        	  if($(autocomplete).next("input[type=hidden]").val() != ''){
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
		        	  } else {
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
		        	  }
			      },
			      create: function() {
			    	  if($(autocomplete).next("input[type=hidden]").next("span").length == 0){
			  			var hiddenInput = $(autocomplete).next("input[type=hidden]");
			  			if($(hiddenInput).val() != "") {
			  				$(hiddenInput).after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
			  			} else {
			  				$(hiddenInput).after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
			  			}
			  			
			  		  }		
			    	  
			    	  $(this).data("uiAutocomplete")._renderItem = function(ul, item) {
			  			ul.addClass('qp-ul-autocomplete');
			  			
			  			var level = 0;
			  			var margin = 0;
			  			if (item['level'] != undefined) {
			  				
			  				var count = ((item['level']+ '').match(/\./g) || []).length;
			  				level = count;
			  				margin = 10 * level;
			  			}
			  			var startTag = "";
			  			var endTag = "";
			  			var preventPoint = '';
			  			
			  			if (item['hasChild'] != undefined && item['hasChild'] == true) {
			  				preventPoint = 'class="pointer-events"';
			  				startTag = "<span class='ui-autocomplete-category'>";
				  			endTag = "</span>";
			  			} else {
			  				startTag = "<a>";
				  			endTag = "</a>";
			  			}
			  			
			  			var displayOption = "<li "+preventPoint+" style='padding-left: "+margin+"px'>" + startTag;
			  			var optionLabel = $(autocomplete).attr("optionLabel").split(",");
				    	$(optionLabel).each(function(i){
				    		displayOption += item[optionLabel[i]] + " - ";
		    			});
				    	if(optionLabel.length > 0){
				    		displayOption = displayOption.substring(0, displayOption.length - 3);
				    	}
			  			displayOption += endTag + "</li>";
			  			
			  			return  $(displayOption).appendTo(ul);
			    	  }
			      },
			      messages: {
		              noResults: '',
		              results: function() {}
		          }
			}).focus(function(){ 
				$(this).autocomplete("option","minLength", $(this).attr("minlength"));  
		    	$(this).data("uiAutocomplete").search($(this).val());
			});
		});
	};
	
	$.qp.initialAutocomplete = function(thiz) {
		
		var href = CONTEXT_PATH + "/Autocomplete/";

		$(thiz).each(function (){
			var autocomplete = $(this);
			var onselectAutocomplete =  $(autocomplete).attr("onSelectEvent");
			var onchangeAutocomplete =  $(autocomplete).attr("onChangeEvent");
			var onremoveAutocomplete =  $(autocomplete).attr("onRemoveEvent");
			$(autocomplete).autocomplete({				
				source: function( request, response ) {
					var params = {
							"searchKey" : $(autocomplete).val(),
							"sourceType" : $(autocomplete).attr("selectsqlid"),
							"arg01" :  $(autocomplete).attr("arg01"),
							"arg02" :  $(autocomplete).attr("arg02"),
							"arg03" :  $(autocomplete).attr("arg03"),
							"arg04" :  $(autocomplete).attr("arg04"),
							"arg05" :  $(autocomplete).attr("arg05"),
							"arg06" :  $(autocomplete).attr("arg06"),
							"arg07" :  $(autocomplete).attr("arg07"),
							"arg08" :  $(autocomplete).attr("arg08"),
							"arg09" :  $(autocomplete).attr("arg09"),
							"arg10" :  $(autocomplete).attr("arg10"),
							"arg11" :  $(autocomplete).attr("arg11"),
							"arg12" :  $(autocomplete).attr("arg12"),
							"arg13" :  $(autocomplete).attr("arg13"),
							"arg14" :  $(autocomplete).attr("arg14"),
							"arg15" :  $(autocomplete).attr("arg15"),
							"arg16" :  $(autocomplete).attr("arg16"),
							"arg17" :  $(autocomplete).attr("arg17"),
							"arg18" :  $(autocomplete).attr("arg18"),
							"arg19" :  $(autocomplete).attr("arg19"),
							"arg20" :  $(autocomplete).attr("arg20")
						};
					
					var dataSource;
					var dataSourceType = $(autocomplete).attr("sourceType");
					
					if(dataSourceType && dataSourceType=="local"){
						if(typeof jQuery.namespace($(autocomplete).attr("sourceCallback")) == "function") {
							dataSource = jQuery.namespace($(autocomplete).attr("sourceCallback"))(params,autocomplete);
						}
					} else {
						dataSource = $.qp.getJson(href, params).outputGroup;
					}
					response(dataSource);
			      },
			      change: function (event, ui) {
			    	  //console.log("change" + !ui.item + " " + ui.item);
			    	  if($(autocomplete).attr("mustmatch") == "true" || $(autocomplete).attr("mustmatch") == undefined) {
			    		 if (!ui.item) {
			    			 //alert('no value' + $(autocomplete).next("input[type=hidden]").val());
			    			 this.value = '';
			    			 $(autocomplete).next("input[type=hidden]").val('');
			    			 $(autocomplete).attr("selectedValue", "false");
			    		 } else {
			    			
			    			 var displayOption = "";
					    	  var optionLabel = $(autocomplete).attr("optionLabel").split(",");
					    	  $(optionLabel).each(function(i){
					    		   displayOption += ui.item[optionLabel[i]] + " - ";
					    	  });
					    	  if(optionLabel.length > 0){
					    		  displayOption = displayOption.substring(0, displayOption.length - 3);
					    	  }
			    			 if(displayOption != this.value){
			    				 this.value = '';
				    			 $(autocomplete).next("input[type=hidden]").val('');
				    			 $(autocomplete).attr("selectedValue", "false");
			    			 }
			    		 
			    		 }
			    	  } else {
			    		  if (!ui.item) {
			    			  $(autocomplete).next("input[type=hidden]").val(this.value);
			    			  $(autocomplete).attr("selectedValue", "false");
			    			  $.data(autocomplete,"selectedItem",null);
			    		  } else {
			    			  var optionValue = $(autocomplete).attr("optionValue");
			    			  $(autocomplete).next("input[type=hidden]").val(ui.item[optionValue]);  
			    			  $(autocomplete).attr("selectedValue", "true");
			    		  }
			    	  }
			    	  
			    	// change span icon
			    	  if($(autocomplete).next("input[type=hidden]").val() != ''){
			    		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
		        	  } else {
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
		        	  }
			    	  
			    	  if (onchangeAutocomplete != null && onchangeAutocomplete.length > 0 && typeof jQuery.namespace(onchangeAutocomplete) == "function") {
			    		  event["item"] = ui.item;
			    		  jQuery.namespace(onchangeAutocomplete)(event);
					  }
		          },
		          minLength: 1,
			      focus: function( event, ui ) {		
			    	  //console.log("focus");
			    	  /*
			    	  var displayOption = "";
			    	  var optionLabel = $(autocomplete).attr("optionLabel").split(",");
			    	  $(optionLabel).each(function(i){
			    		   displayOption += ui.item[optionLabel[i]] + " - ";
			    	  });
			    	  if(optionLabel.length > 0){
			    		  displayOption = displayOption.substring(0, displayOption.length - 3);
			    	  }
			    	  $(autocomplete).val(displayOption);
			    	  */
				      return false;
			        },
			      select: function( event, ui ) {			    	  
			    	 // alert("select" + ui.item);
			    	  var displayOption = "";
			    	  var optionLabel = $(autocomplete).attr("optionLabel").split(",");
			    	  $(optionLabel).each(function(i){
			    		   displayOption += ui.item[optionLabel[i]] + " - ";
			    	  });
			    	  if(optionLabel.length > 0){
			    		  displayOption = displayOption.substring(0, displayOption.length - 3);
			    	  }
			    	  $(autocomplete).val(displayOption);
			    	  
		        	  if (ui.item != null) {
		        		  var optionValue = $(autocomplete).attr("optionValue");
			    		  $(autocomplete).next("input[type=hidden]").val(ui.item[optionValue]);  
			    		  $(autocomplete).attr("selectedValue", "true");
			    		  $(autocomplete).data("selectedItem",ui.item);
			    	  } else {
			    		  $(autocomplete).next("input[type=hidden]").val('');
			    		  $(autocomplete).attr("selectedValue", "false");
			    		  $(autocomplete).data("selectedItem",null);
			    	  }
		        	  
		        	  if (onselectAutocomplete != null && onselectAutocomplete.length > 0 && typeof window[onselectAutocomplete] == "function") {
		        		  event["item"] = ui.item;
		        		  window[onselectAutocomplete](event);
					  }
			    	  return false;
			      },
			      open: function(event, ui) {
			    	  $(autocomplete).attr("previousValue", $(autocomplete).next("input[type=hidden]").val());
			    	  $(autocomplete).attr("previousLabel", $(autocomplete).val());		
			    	  // show more results
			    	  //$('.ui-autocomplete').append('<li style="background-color: gray;" class="ui-menu-item"><a href="javascript:">More result</a></li>');
			      },
			      close: function() {
			    	  //console.log("close");
			    	  if($(autocomplete).attr("mustmatch") == undefined || $(autocomplete).attr("mustmatch") == "true") {
				    		 if (this.value == '') {
				    			 $(autocomplete).next("input[type=hidden]").val('');
				    			 $(autocomplete).attr("selectedValue", "false");
				    		 }
			    	  } 
			    	  // change span icon
		        	  if($(autocomplete).next("input[type=hidden]").val() != ''){
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
		        	  } else {
		        		  $(autocomplete).next("input[type=hidden]").next("span").remove();
		        		  $(autocomplete).next("input[type=hidden]").after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
		        	  }
			      },
			      create: function() {
			    	  if($(autocomplete).next("input[type=hidden]").next("span").length == 0){
			  			var hiddenInput = $(autocomplete).next("input[type=hidden]");
			  			if($(hiddenInput).val() != "") {
			  				$(hiddenInput).after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.removeAutocompleteData(this)'> <span class='fa fa-times'></span></span>"));
			  			} else {
			  				$(hiddenInput).after($("<span class='input-group-addon dropdown-toggle' data-dropdown='dropdown' style='cursor: pointer;' onclick='$.qp.searchAutocompleteData(this)'> <span class='caret'></span></span>"));
			  			}
			  			
			  		  }		
			    	  
			    	  $(this).data("uiAutocomplete")._renderItem = function(ul, item) {
			  			ul.addClass('qp-ul-autocomplete');
			  			
			  			var displayOption = "<li><a>";
			  			var optionLabel = $(autocomplete).attr("optionLabel").split(",");
				    	$(optionLabel).each(function(i){
				    		displayOption += $.qp.escapseHTML(item[optionLabel[i]]) + " - ";
		    			});
				    	if(optionLabel.length > 0){
				    		displayOption = displayOption.substring(0, displayOption.length - 3);
				    	}
			  			displayOption += "</a></li>";
			  			
			  			return  $(displayOption).appendTo(ul);
			    	  }
			      },
			      messages: {
		              noResults: '',
		              results: function() {}
		          }
			}).focus(function(){ 
				$(this).autocomplete("option","minLength", $(this).attr("minlength"));  
		    	$(this).data("uiAutocomplete").search($(this).val());
			});
		});
	};

	// For button save:
	$.qp.submitConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0015'])) {
			$.qp.undoFormatNumeric();
			$('form')
					.attr('action', CONTEXT_PATH + url + '?r=' + Math.random());
		} else {
			return false;
		}
	};

	// For button save:
	$.qp.generateConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0043'])) {
			$.qp.undoFormatNumeric();
			if (url != undefined && url.length > 0) {
				$('form').attr('action',
						CONTEXT_PATH + url + '?r=' + Math.random());
			}
		} else {
			return false;
		}
	};
	
	$.qp.searchAutocompleteData = function(obj){
		$(obj).prev("input[type=hidden]").prev('input').focus();
	}
	
	$.qp.removeAutocompleteData = function(obj){
		var hiddenInput = $(obj).prev("input[type=hidden]");
		var input = $(obj).prev("input[type=hidden]").prev('input');
		$(obj).prev("input[type=hidden]").prev("input").attr('previousvalue', $(hiddenInput).val());
		$(obj).prev("input[type=hidden]").prev("input").attr('previouslabel', $(input).val());
		
		if($(input).attr("mustmatch") != undefined && $(input).attr("mustmatch") == "false"){
			$(hiddenInput).val('');
			$(input).val('');
		}
		$(obj).prev("input[type=hidden]").prev("input").data("ui-autocomplete")._trigger("change");
		$(obj).prev("input[type=hidden]").prev("input").attr('previousvalue', '');
		$(obj).prev("input[type=hidden]").prev("input").attr('previouslabel', '');
	}

	// For button save:
	$.qp.saveConfirm = function() {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0015'])) {
			$.qp.undoFormatNumeric();
		} else {
			return false;
		}
	};

	// For button delete:
	$.qp.undoFormatNumeric = function() {
		$("[class^=qp-input-text]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-integer]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-from-integer]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-to-integer]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-currency-decimal]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

        $("[class^=qp-input-currency-decimal-without-code]").each(function(i, e) {
            $(this).val($(this).autoNumeric('get'));
        });

		$("[class^=qp-input-currency]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-from-currency]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-to-currency]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-float]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-from-float]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-to-float]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$("[class^=qp-input-percentage]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-from-percentage]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-to-percentage]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-percentage-decimal]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-from-percentage-decimal]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$("[class^=qp-input-to-percentage-decimal]").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

	};

	$.qp.undoFormatNumericForm = function(form) {
		$(form).find(".qp-input-integer").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-integer").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-integer").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		
		//hunghx add new
		$(form).find(".qp-input-bigint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-bigint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-bigint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		
		$(form).find(".qp-input-serial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-serial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-serial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		
		$(form).find(".qp-input-bigserial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-bigserial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-bigserial").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		
		$(form).find(".qp-input-smallint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-smallint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-smallint").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		//hunghx
		
		$(form).find(".qp-input-currency-decimal").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

        $(form).find(".qp-input-currency-decimal-without-code").each(function(i, e) {
            $(this).val($(this).autoNumeric('get'));
        });

		$(form).find(".qp-input-currency").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-from-currency").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-to-currency").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-float").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-from-float").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-to-float").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

		$(form).find(".qp-input-percentage").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-from-percentage").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-to-percentage").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-percentage-decimal").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-from-percentage-decimal").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});
		$(form).find(".qp-input-to-percentage-decimal").each(function(i, e) {
			$(this).val($(this).autoNumeric('get'));
		});

	};

    $.qp.formatExponentialToNumber = function(thiz) {
        $(thiz).each(function(i, e) {
            $(this).val(Number($(this).val()));
        });
    };

	$.qp.initalButton = function(thiz) {
		$(thiz).click(function() {
			var form = $(this).closest("form");
			$.qp.undoFormatNumericForm(form);
			form.submit();
		});
	}
	// For button delete:
	$.qp.deleteConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0018'])) {
			// window.parent.location.href = CONTEXT_PATH+url;
			// $.qp.closeFancyBox();
		} else {
			return false;
		}
	};
	// For button discard:
	$.qp.cancelConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0024'])) {
			location.href = CONTEXT_PATH + url;
		} else {
			return false;
		}
		// return confirm("Do you want to discard current data and close
		// window?");
	};
	// For button cancel:
	$.qp.cancelDataConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0029'])) {
			location.href = CONTEXT_PATH + url;
		} else {
			return false;
		}
		// return confirm("Do you want to discard current data and close
		// window?");
	};

	// For button edit:
	$.qp.editConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0035'])) {
			window.parent.location.href = CONTEXT_PATH + url;
			$.qp.closeFancyBox();
			return false;
		} else {
			return false;
		}
	};
	// For button copy:
	$.qp.copyConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0040'])) {
			window.parent.location.href = CONTEXT_PATH + url;
			$.qp.closeFancyBox();
			return false;
		} else {
			return false;
		}
	};
	// For button print
	$.qp.printConfirm = function(url) {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0036'])) {
			// $.qp.closeFancyBox();
			// window.parent.location.href = CONTEXT_PATH+url;
		} else {
			return false;
		}
	};
	// For button activate
	$.qp.activateConfirm = function() {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0019'])) {

		} else {
			return false;
		}
	};
	// For button activate
	$.qp.deactivateConfirm = function() {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0021'])) {

		} else {
			return false;
		}
	};
	// For button confirm
	$.qp.confirmOrdersConfirm = function() {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0041'])) {

		} else {
			return false;
		}
	};
	// For button unconfirm
	$.qp.unconfirmOrdersConfirm = function() {
		if ($.qp.confirm(fcomMsgSource['inf.sys.0042'])) {

		} else {
			return false;
		}
	};
	$.qp.closeFancyBox = function(url) {
		// unselected rack elements in visulization_warehouse
		// parent.$('ul#grid li.rack').removeClass("ui-selected");
		// parent.$('ul#grid li.rack').removeClass("ui-selecting");
		// autoAdjustBgColor(parent.$("ul#grid li.rack"));
		parent.$.fancybox.close();
	};

	// check all for checkbox and radio on search screen
	$.qp.autoCheckbox = function() {
		$(".com-table-td-checkbox").each(function() {
			if ($(this).find('input:checkbox:checked').length == 0) {
				$(this).find('input:checkbox').prop('checked', true);
			}
		});
	};

	// initial Auto numeric
	$.qp.initialAutoNumeric = function(thiz) {
		$.qp.formatInteger($(thiz).find('.qp-input-integer'));
		
		/**Start DungNN add new 20150728*/
		$.qp.formatBigint($(thiz).find('.qp-input-bigint'));
		$.qp.formatSerial($(thiz).find('.qp-input-serial'));
		$.qp.formatBSerial($(thiz).find('.qp-input-bigserial'));
		$.qp.formatSmallint($(thiz).find('.qp-input-smallint'));
		/**End DungNN add new*/
		
		$.qp.formatFloat($(thiz).find('.qp-input-float'));
		$.qp.formatCurrency($(thiz).find('.qp-input-currency'));
		$.qp.formatCurrencyDecimal($(thiz).find('.qp-input-currency-decimal'));
        $.qp.formatCurrencyDecimalWithoutCode($(thiz).find('.qp-input-currency-decimal-without-code'));
		$.qp.formatPercentage($(thiz).find('.qp-input-percentage'));

		$.qp.formatInteger($(thiz).find('.qp-input-integer-fix'));
		$.qp.formatFloat($(thiz).find('.qp-input-float-fix'));
		$.qp.formatCurrency($(thiz).find('.qp-input-currency-fix'));

		$.qp.formatInteger($(thiz).find('.qp-input-integer-detail'));
		$.qp.formatFloat($(thiz).find('.qp-input-float-detail'));
		$.qp.formatCurrency($(thiz).find('.qp-input-currency-detail'));
		$.qp.formatPercentage($(thiz).find('.qp-input-percentage-detail'));
	};

	$.qp.initialAllPicker = function(thiz) {
		$(thiz).find(".input-datepicker").each(function() {// initial
			$.qp.initialDatePicker(this);
		});
		$(thiz).find(".qp-input-datetimepicker-detail").each(function() {// initial
			$.qp.initialDateTimePickerDetail($(this));
		});
		$(thiz).find(".qp-input-from-datetimepicker-detail").each(function() {// initial
			$.qp.initialDateTimePickerDetail($(this));
		});
		$(thiz).find(".qp-input-to-datetimepicker-detail").each(function() {// initial
			$.qp.initialDateTimePickerDetail($(this));
		});
		$(thiz).find(".qp-input-from-datepicker").each(function() {// initial
			$.qp.initialDatePicker($(this));
		});
		$(thiz).find(".qp-input-to-datepicker").each(function() {// initial
			$.qp.initialDatePicker($(this));
		});
		$(thiz).find(".qp-input-autocomplete").each(function() {// initial			
			$.qp.initialAutocomplete($(this));
		});
		$(thiz).find("input[class*='qp-input-file']").each(function() {// initial
			
			if ($(this).prev().prop("tagName") != "SPAN") {
				$.qp.inititalInputFile($(this));
			}
		});
		$(thiz).find(".qp-input-timepicker").each(function() {// initial
			$.qp.initialTimePicker($(this));
		});
		$(thiz).find(".qp-input-from-timepicker").each(function() {// initial
			$.qp.initialTimePicker($(this));
		});
		$(thiz).find(".qp-input-to-timepicker").each(function() {// initial
			$.qp.initialTimePicker($(this));
		});
		$(thiz).find(".qp-input-integer").each(function() {// initial
			$.qp.formatInteger($(this));
		});
		$(thiz).find(".qp-input-from-integer").each(function() {// initial
			$.qp.formatInteger($(this));
		});
		$(thiz).find(".qp-input-to-integer").each(function() {// initial
			$.qp.formatInteger($(this));
		});
		
		/**Start DungNN add new 20150728*/
		$(thiz).find(".qp-input-bigint").each(function() {// initial
			$.qp.formatBigint($(this));
		});
		$(thiz).find(".qp-input-from-bigint").each(function() {// initial
			$.qp.formatBigint($(this));
		});
		$(thiz).find(".qp-input-to-bigint").each(function() {// initial
			$.qp.formatBigint($(this));
		});
		$(thiz).find(".qp-input-serial").each(function() {// initial
			$.qp.formatSerial($(this));
		});
		$(thiz).find(".qp-input-from-serial").each(function() {// initial
			$.qp.formatSerial($(this));
		});
		$(thiz).find(".qp-input-to-serial").each(function() {// initial
			$.qp.formatSerial($(this));
		});
		$(thiz).find(".qp-input-smallint").each(function() {// initial
			$.qp.formatSmallint($(this));
		});
		$(thiz).find(".qp-input-from-smallint").each(function() {// initial
			$.qp.formatSmallint($(this));
		});
		$(thiz).find(".qp-input-to-smallint").each(function() {// initial
			$.qp.formatSmallint($(this));
		});
		$(thiz).find(".qp-input-bigserial").each(function() {// initial
			$.qp.formatBSerial($(this));
		});
		$(thiz).find(".qp-input-from-bigserial").each(function() {// initial
			$.qp.formatBSerial($(this));
		});
		$(thiz).find(".qp-input-to-bigserial").each(function() {// initial
			$.qp.formatBSerial($(this));
		});
		/**DungNN add new*/
		
		$(thiz).find(".qp-input-from-float").each(function() {// initial
			$.qp.formatFloat($(this));
		});
		$(thiz).find(".qp-input-to-float").each(function() {// initial
			$.qp.formatFloat($(this));
		});
		$(thiz).find(".qp-input-datepicker").each(function() {// initial
			$.qp.initialDatePicker($(this));
		});
		$(thiz).find(".qp-numeric-up-down").each(function() {// initial
			if ($(this).attr("name") != null) {
				$.qp.initialTouchSpin($(this));
			}
		});
	};

	/**Start DungNN add new 20150728*/
	$.qp.formatBigint = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "-9223372036854775808",
				vMax : "9223372036854775807"
			});
		}
	};

	$.qp.formatSmallint = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "-32768",
				vMax : "32767"
			});
		}
	};

	$.qp.formatSerial = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "0",
				vMax : "2147483647"
			});
		}
	};

	$.qp.formatBSerial = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "0",
				vMax : "9223372036854775807"
			});
		}
	};
	/**DungNN add new*/
	$.qp.formatInteger = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			var options = {
				aSep : '',
				dGroup : '3',
				aPad : 'false',
				vMin : "-2147483647",
				vMax : "2147483647"
			};
			var min = $(thiz).data('minimum');
			if(min!=undefined && min != null && min!=""){
				options.vMin = min;
			}

			$(thiz).autoNumeric('init', options);
		}
	};

	$.qp.formatFloat = function(thiz) {
		if ($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "-999999999999.99999",
				vMax : "999999999999.99999"
			});
		}
	};

	$.qp.formatCurrency = function(thiz) {
		if($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : '.',
				aDec : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : '0',
				aSign : fcomSysCurrencyCode + " ",
				pSign : 'p',
				vMax : "9999999999999999"
			});
		}
	};

    $.qp.formatCurrencyDecimal = function(thiz) {
        if($(thiz) != undefined && $(thiz).val() != undefined) {
        	var currencyCode = fcomSysCurrencyCode;
        	var codeParam = $(thiz).attr('currency-code');
        	if(codeParam != undefined && codeParam != null){
        		currencyCode = codeParam;
        		if(codeParam == "none"){
        			currencyCode = "";
				}
			}
            $(thiz).autoNumeric('init', {
                aSep : '.',
                aDec : ',',
                dGroup : '3',
                mDec : '2',
                vMin : '-9999999999999999.999',
                aSign : currencyCode + " ",
                pSign : 'p',
                vMax : "9999999999999999.999"
            });
        }
    };

    $.qp.formatCurrencyDecimalWithoutCode = function(thiz) {
        if($(thiz) != undefined && $(thiz).val() != undefined) {
            $(thiz).autoNumeric('init', {
                aSep : '.',
                aDec : ',',
                dGroup : '3',
                mDec : '2',
                vMin : '0',
                aSign : " ",
                pSign : 'p',
                vMin : '-9999999999999999.999',
                vMax : "9999999999999999.999"
            });
        }
    };

	$.qp.formatPercentage = function(thiz) {
		if($(thiz) != undefined && $(thiz).val() != undefined) {
			$(thiz).autoNumeric('init', {
				aSep : ',',
				dGroup : '3',
				aPad : 'false',
				vMin : "0",
				vMax : "1000",
				aSign : " %",
				pSign : "s"
			});
		}
	};

	$.qp.formatPercentageDecimal = function(thiz) {
		if($(thiz) != undefined && $(thiz).val() != undefined) {
			for(let i=0;i<thiz.length;i++){
				var options = {
					aSep : '.',
					aDec : ',',
					dGroup : '3',
					aPad : 'false',
					vMin : "0",
					vMax : "1000.00",
					aSign : " %",
					pSign : "s"
				};
				var digits = $(thiz[i]).data('decimal-digit');
				if(digits != undefined && digits != null && digits != ""){
					options["mDec"]=digits;
				}
				$(thiz[i]).autoNumeric('init',options);
			}
		}
	};

    $.qp.formatUpdate = function(thiz) {
        if($(thiz) != undefined && $(thiz).val() != undefined) {
            $(thiz).autoNumeric('update');
        }
    };

    $.qp.formatDestroy = function(thiz) {
        if($(thiz) != undefined && $(thiz).val() != undefined) {
            $(thiz).autoNumeric('destroy');
        }
    };

	$.qp.showConfirm = function(obj, screenId) {
		var messageConfirm = fcomMsgSource["inf.sys.0015"];
		var onselectConfirm = undefined;
		
		
		
		if($(obj).attr("message-string") != undefined){
			messageConfirm =$(obj).attr("message-string");
		} else {
			if($(obj).attr("messageId") != undefined){
				messageConfirm = fcomMsgSource[$(obj).attr("messageId")];
			}
		}
		
		if($(obj).attr("onClick") != undefined){
			onselectConfirm = $(obj).attr("onClick");
		}
		$.qp.initConfirmModels('#fcomConfirmDialog');
		
		var warning = "";
		
		if ($(obj).attr("warning") != undefined) {
			warning = $(obj).attr("warning");
		}
		
		$("#fcomConfirmDialog .modal-body").html(warning + messageConfirm);
		$("#fcomConfirmDialog").modal('show');
		
		$("#fcomConfirmDialog").on("hidden.bs.modal", function() {    // remove the event listeners when the dialog is dismissed
			$("#fcomConfirmBtnYes").off("click");
			$(this).parent().find('input[type!=hidden]:first').focus();
		});
		$('#fcomConfirmDialog').on('shown.bs.modal', function() {
			$("#fcomConfirmDialog #fcomConfirmBtnYes").focus();
	    });
		$("#fcomConfirmBtnYes").on("click", function(e) {
			if(onselectConfirm != undefined && typeof(onselectConfirm) == "function"){
				var result = window[onselectConfirm](event);
				if(result == false)
				{
					$("#fcomConfirmDialog").modal('hide');
					return;
				}
			}
            var form = $(obj).closest("form");
			$.qp.undoFormatNumericForm(form);
			if (screenId != undefined && screenId != null) {
				window.location.href = CONTEXT_PATH + '/screendesign/delete?screenId=' + screenId;
			} else {
				$.qp.preventDoubleSubmission(form);
				form.submit();
			}
			
	        });
		$("#fcomConfirmBtnYes").next().on("click", function(e) {
			$("#fcomConfirmBtnYes").unbind();
			
	        });
		$(obj).parent().on('keydown', function(evt) {
			 if (evt.keyCode == $.ui.keyCode.ESCAPE) {
				 $("#fcomConfirmDialog").modal('hide');
				 $('input[type!=hidden]:first').focus();
			 }
	    });
	};
	$.qp.settingConfirm = function(obj){
		var onselectConfirm = undefined;
		if($(obj).attr("onClick") != undefined){
			onselectConfirm = $(obj).attr("onClick");
		}
		$.qp.initConfirmModels('#fcomConfirmDialog');
		$(obj).click(function (e) {
			var objAction = $("#fcomConfirmDialog").data("target");
			var form = $(objAction).closest("form");
			var precheckCallback = $(obj).attr("data-confirm-pcallback");
			var passPrecheck = true;
			var targetBtn = e.target;
			if(typeof $.namespace(precheckCallback)=="function"){
				try{
				passPrecheck = $.namespace(precheckCallback)(form);
				} catch(err){
					
				}
			}
			if(passPrecheck){
				$('#fcomConfirmDialog').off();
				if(onselectConfirm != undefined && typeof window[onselectConfirm] == "function"){
					//DungNN - 20150612 - change to run on firefox
					var result = eval(onselectConfirm + '($(obj));');	
					if(result == false)
					{
						e.preventDefault();
						$(obj).parents("form").find('input[type!=hidden]').first().focus();
						return;
					}
				}
				$("#fcomConfirmDialog").on("hidden.bs.modal", function() {    
					// remove the event listeners when the dialog is dismissed
					$("#fcomConfirmBtnYes").off("click");
					$(objAction).parents("form").find('input[type!=hidden]').first().focus();
				});

				$("#fcomConfirmBtnYes").on("click", function(e) {
					var objAction = $("#fcomConfirmDialog").data("target");
					
					
					var form = $(objAction).closest("form");
					$.qp.undoFormatNumericForm(form);
					var beforeCallback = $(obj).attr("data-confirm-bcallback");
					if(typeof $.namespace(beforeCallback)=="function"){
						$.namespace(beforeCallback)(form,targetBtn);
					}
					if($(targetBtn).is("[type=submit][name]")){
						form.append($("<input type='hidden' name='"+$(targetBtn).attr("name")+"' value='"+ $(targetBtn).attr("value")+"' >"));
					}
					$.qp.preventDoubleSubmission(form);
					if($(obj).is("button[name]")){
						$(form).append($("<input type='hidden' name='"+$(obj).attr("name")+"' value='"+$(obj).attr("value")+"'>"));
					}
					
					if ($(objAction).attr('on-yes') != undefined && $(objAction).attr('on-yes') != null && $(objAction).attr('on-yes').length > 0) {
						window[$(objAction).attr('on-yes')](objAction);
					}
					
					if ($(obj).attr("onclick") != undefined && $(obj).attr("onclick") != null && $(obj).attr("onclick").length > 0 && $(obj).attr("onclick") == "beforeGetHaveConfirm(this)") {
						var url = $(obj).attr('button-href');
						window.location.href = url;
					} else {
						form.submit();
					}
				});
				$("#fcomConfirmDialog").data("target", obj);
				var messageConfirm = fcomMsgSource["inf.sys.0015"];
				if($(obj).attr("messageId") != undefined){
                    messageConfirm = fcomMsgSource[$(obj).attr("messageId")];
					if($(obj).attr("messageArgs")!= undefined){
						var messageArgs = $(obj).attr("messageArgs").split(",");
						if((messageConfirm!=undefined || messageConfirm!=null)&&(messageArgs!=null || messageArgs!=undefined)){
                            messageConfirm = messageConfirm.format(messageArgs);
						}
					}
				}else if($(obj).attr("messageString") != undefined){
					messageConfirm = $(obj).attr("messageString");
				}
				
				var showConfirmDialogFlg = $(obj).attr("data-confirm-dialog-flg");
				
				if (showConfirmDialogFlg != undefined && showConfirmDialogFlg == "false") {
					var objAction = $("#fcomConfirmDialog").data("target");
					
					var form = $(objAction).closest("form");
					$.qp.undoFormatNumericForm(form);
					var beforeCallback = $(obj).attr("data-confirm-bcallback");
					if(typeof $.namespace(beforeCallback)=="function"){
						$.namespace(beforeCallback)(form,targetBtn);
					}
					if($(targetBtn).is("[type=submit][name]")){
						form.append($("<input type='hidden' name='"+$(targetBtn).attr("name")+"' value='"+ $(targetBtn).attr("value")+"' >"));
					}
					$.qp.preventDoubleSubmission(form);
					if($(obj).is("button[name]")){
						$(form).append($("<input type='hidden' name='"+$(obj).attr("name")+"' value='"+$(obj).attr("value")+"'>"));
					}
					
					if ($(objAction).attr('on-yes') != undefined && $(objAction).attr('on-yes') != null && $(objAction).attr('on-yes').length > 0) {
						window[$(objAction).attr('on-yes')](objAction);
					}
					
					form.submit();
				} else {
					$("#fcomConfirmDialog .modal-body").html(messageConfirm);
					$("#fcomConfirmDialog").modal({ 
						   show: true,
						   closable: false,
						   keyboard:false,
						   backdrop:'static'
						  });
					$("#fcomConfirmDialog #fcomConfirmBtnYes").focus();
				}
			}
			e.preventDefault();
			e.stopPropagation(); // Stop bubbling up
			
		});
		$(obj).parent().on('keydown', function(evt) {
			 if (evt.keyCode == $.ui.keyCode.ESCAPE) {
				 $("#fcomConfirmDialog").modal('hide');
				 $(obj).parents("form").find('input[type!=hidden]').first().focus();
			 }
	    });
	}
	$.qp.initConfirm = function(obj) {
		$(obj).each(function (){
			$.qp.settingConfirm($(this));
		});
	};
	
	$.qp.initConfirmCustom = function(obj) {
		$(obj).each(function (){
			$.qp.settingConfirmCustom($(this));
		});
	};
	
	$.qp.settingConfirmCustom = function(obj){
		var onselectConfirm = undefined;
		if($(obj).attr("onClick") != undefined){
			onselectConfirm = $(obj).attr("onClick");
		}
		$.qp.initConfirmModels('#fcomConfirmDialog');
		$(obj).click(function (e) {
			
			if($(obj).attr("event-click") != undefined && $(obj).attr("event-click")) {
				var eventClick = window[$(obj).attr("event-click")](obj);
				
				if (eventClick == undefined || !eventClick) {
					return;
				}
				
			}
			
			var objAction = $("#fcomConfirmDialog").data("target");
			var form = $(objAction).closest("form");
			var precheckCallback = $(obj).attr("data-confirm-pcallback");
			var passPrecheck = true;
			if(typeof $.namespace(precheckCallback)=="function"){
				passPrecheck = $.namespace(precheckCallback)(form);
			}
			if(passPrecheck){
				$('#fcomConfirmDialog').off();
				if(onselectConfirm != undefined && typeof window[onselectConfirm] == "function"){
					//DungNN - 20150612 - change to run on firefox
					var result = eval(onselectConfirm + '($(obj));');	
					if(result == false)
					{
						e.preventDefault();
						$(obj).parents("form").find('input[type!=hidden]').first().focus();
						return;
					}
				}
				$("#fcomConfirmDialog").on("hidden.bs.modal", function() {    
					// remove the event listeners when the dialog is dismissed
					$("#fcomConfirmBtnYes").off("click");
					$(objAction).parents("form").find('input[type!=hidden]').first().focus();
				});
				$("#fcomConfirmBtnYes").on("click", function(e) {
					var objAction = $("#fcomConfirmDialog").data("target");
					var form = $(objAction).closest("form");
					$.qp.undoFormatNumericForm(form);
					var beforeCallback = $(obj).attr("data-confirm-bcallback");
					if(typeof $.namespace(beforeCallback)=="function"){
						$.namespace(beforeCallback)(form);
					}

					$.qp.preventDoubleSubmission(form);
					form.submit();
				});
				$("#fcomConfirmDialog").data("target", obj);
				var messageConfirm = fcomMsgSource["inf.sys.0015"];
				if($(obj).attr("messageId") != undefined){
					messageConfirm = fcomMsgSource[$(obj).attr("messageId")];
				}
				
				$("#fcomConfirmDialog .modal-body").html(messageConfirm);
				$("#fcomConfirmDialog").modal({ 
					   show: true,
					   closable: false,
					   keyboard:false,
					   backdrop:'static'
					  });
				$("#fcomConfirmDialog #fcomConfirmBtnYes").focus();
				e.preventDefault();
				e.stopPropagation(); // Stop bubbling up
			}
		});
		$(obj).parent().on('keydown', function(evt) {
			 if (evt.keyCode == $.ui.keyCode.ESCAPE) {
				 $("#fcomConfirmDialog").modal('hide');
				 $(obj).parents("form").find('input[type!=hidden]').first().focus();
			 }
	    });
	}
	
	$.qp.initConfirmModels = function (id){
		  var top = Math.round(screen.height / 4);
		  top = top > 0 ? top : 0;
		  $(id).find('.modal-content').css("margin-top", top);
		}

	$.qp.initMoreToggle = function(classNamePattern) {
		$("a[class*='" + classNamePattern + "']").click(function(event) {
					var baseClass = $(event.currentTarget).attr('class').match(classNamePattern + "(-(\\d+))*")[0];
					$("." + baseClass + "-replacement-label").show();
					$("." + baseClass + "-replacement").show();
					$("." + baseClass + "-row").show();
					$("a." + baseClass).hide();
				});
	}
	$.qp.showDialogConfirm = function(obj) {

	};
	$.qp.getNumericValue = function(obj) {
		return $(obj).autoNumeric('get');
	};
    $.qp.setNumericValue = function(obj, value) {
        return $(obj).autoNumeric('set', value);
    };

	$.qp.numberWithCommas = function(number) {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	$.qp.numberWithoutCommas = function(stringNum) {
		return parseFloat(stringNum.replace(/[^\d\.\-]/g, ""));
	};

	$.qp.changeSystemLanguage = function(obj) {
		if(obj != null && obj.length > 0){
			var languageCode = obj.split("_");
			if ($.qp.confirm(fcomMsgSource['inf.sys.0029'])) {
				window.location.href = CONTEXT_PATH
						+ '/language/locale?languageCode=' + languageCode[0]
						+ '&countryCode=' + languageCode[1] + '&r='
						+ Math.random();
			} else {
				return false;
			}
		}
	};

	

	$.qp.initalFancyboxSetting = function(className, href, args) {
		if (href == null) {
			$("a." + className).fancybox({
				'centerOnScroll' : true,
				'enableEscapeButton' : false,
				'onStart' : function() {
					$("body").css("overflow", "hidden");
				},
				'onClosed' : function() {
					$("body").css("overflow", "auto");
				},
				'width' : 1100,
				'height' : '100%',
				'autoSize' : false,
				'autoScale' : true,
				'autoDimensions' : true,
				'hideOnOverlayClick' : false,
				'transitionIn' : 'none',
				'transitionOut' : 'none',
				'type' : 'iframe',
				'afterLoad' : function() {
					if (args != null)
						args.afterLoad();
				},
			});
		}
		if (href != null) {
			$("a." + className).fancybox({
				'href' : href,
				'centerOnScroll' : true,
				'enableEscapeButton' : false,
				'onStart' : function() {
					$("body").css("overflow", "hidden");
				},
				'onClosed' : function() {
					$("body").css("overflow", "auto");
				},
				'width' : 1100,
				'height' : '100%',
				'autoSize' : false,
				'autoScale' : true,
				'autoDimensions' : true,
				'hideOnOverlayClick' : false,
				'transitionIn' : 'none',
				'transitionOut' : 'none',
				'type' : 'iframe',
				'afterLoad' : function() {
					if (args != null)
						args.afterLoad();
				},
			});
		}
	};

	// Add row into List table
	$.qp.addRowJS = function(fcomTableId) {
		var obj = $("#" + fcomTableId + "-template").tmpl(); // clone
		// template row
		// $(obj).appendTo("table#" + fcomTableId);
		$("table#" + fcomTableId).append(obj);
		$(obj).find(".input-datepicker").each(function() {// initial
			$.qp.initialDatePicker(this);
		});
		$(obj).find(".qp-input-datetimepicker-detail").each(function() {// initial
			$.qp.initialDateTimePickerDetail($(this));
		});
		$(obj).find(".qp-input-autocomplete").each(function() {// initial
			$.qp.initialAutocomplete($(this));
		});
		$.qp.initialAutoNumeric(obj);// initial Auto numeric
		$.qp.reCalIndex(fcomTableId); // refresh row index (No.)
		$.qp.reArrayIndex(fcomTableId);
		$.qp.alternateRowColorInTable(fcomTableId); // alternate color
	};

	$.qp.addRowJSByLink = function(link) {
		var table = $(link).closest("div").prev("table");
		var obj = $("#" + $(table).attr("id") + "-template").tmpl();

		$(obj).contents().find("input").each(function() {
  			 $(this).val("");
  		});		

		$(table).append(obj);
		$(obj).find(".input-datepicker").each(function() {// initial
			$.qp.initialDatePicker(this);
		});
		$(obj).find(".qp-input-datetimepicker-detail").each(function() {// initial
			$.qp.initialDateTimePickerDetail($(this));
		});
		$(obj).find(".qp-input-autocomplete").each(function() {// initial
			$.qp.initialAutocomplete($(this));
		});

		$.qp.initialAllPicker(table);
		$.qp.initialAutoNumeric(obj);// initial Auto numeric
		$.qp.reCalIndex(table); // refresh row index (No.)
		$.qp.reArrayIndex(table);
		$.qp.alternateRowColorInTable($(table).attr("id")); // alternate color
		$.qp.initialConventionNameCode(obj);
	};

	// Remove row from List table
	$.qp.removeRowJS = function(fcomTableId, obj) {
		var table = $(obj).closest("table#" + fcomTableId);
		if(table!="undefined") {
			$(obj).closest("tr").remove();
			if (table.find("tr").size() == 0) {
				var tmpl = $("#" + $(table).attr("id") + "-template").tmpl();
	
				$(table).append(tmpl);
				$(tmpl).find(".input-datepicker").each(function() {// initial
					$.qp.initialDatePicker(this);
				});
				$(tmpl).find(".qp-input-datetimepicker-detail").each(function() {// initial
					$.qp.initialDateTimePickerDetail($(this));
				});
				$(tmpl).find(".qp-input-autocomplete").each(function() {// initial
					$.qp.initialAutocomplete($(this));
				});
				$(obj).find(".qp-input-autocomplete-test").each(function() {// initial
					$.qp.initialAutocompleteTest($(this));
				});
			}
			$.qp.initialAutoNumeric(obj);// initial Auto numeric
			$.qp.reCalIndex(table); // refresh row index (No.)
			$.qp.alternateRowColorInTable(fcomTableId); // alternate color
			$.qp.reArrayIndex(table);	
		}
	};
	
	$.qp.addRowJSByLinkEx = function(link,tableId,templateId) {
		var $table = null;
		var $template = null;
		if(!tableId) {
			$table = $(link).closest("div").prev("table");
		} else {
			$table = $("#"+tableId);
		}
		if($table!="undefined") {
			var precheckFunction = $table.attr("data-ar-precheck");
			var passCheck = true;
			if(typeof window[precheckFunction]=="function"){
				passCheck = window[precheckFunction]($table,link,"add");
			}
			if(passCheck){
				if(!templateId) {
					$template = $("#" + $table.attr("id") + "-template");
				} else {
					$template = $("#"+templateId);
				}
				var ignoreRows = parseInt($table.attr("data-ar-irows"));
				if(isNaN(ignoreRows)) {
					ignoreRows = 0;
				}
				
				var maxRows = parseInt($table.attr("data-ar-mrows"));
				if(isNaN(maxRows)) {
					maxRows = 200;
				}

				if($table.find(">tbody>tr").length-ignoreRows < maxRows) {
					var callback = $table.attr("data-ar-callback");
					var newRow = $template.tmpl();
					$(newRow).attr("data-ar-templateid",$template.attr("id"));
					$table.append(newRow);
					$(newRow).find(".input-datepicker").each(function() {// initial
						$.qp.initialDatePicker(this);
					});
					$(newRow).find(".qp-input-datetimepicker-detail").each(function() {// initial
						$.qp.initialDateTimePickerDetail($(this));
					});
					$(newRow).find(".qp-input-autocomplete").each(function() {// initial
						$.qp.initialAutocomplete($(this));
					});
					$.qp.initialAutoNumeric(newRow);// initial Auto numeric
					$.qp.reCalIndex($table); // refresh row index (No.)
					$.qp.reArrayIndex($table);
					$.qp.initialConventionNameCode($(this));
					if(typeof window[callback]=="function"){
						window[callback]($table,'add',newRow);
					}
				}
			}
		}
	};
	
	$.qp.removeRowJSEx = function(link, isReserved) {
		var $table = $(link).parents("table:first");
		var callback = $table.attr("data-ar-callback");
		var ignoreRows = parseInt($table.attr("data-ar-irows"));
		if (isNaN(ignoreRows)) {
			ignoreRows = 0;
		}
		var $removeRow = $(link).closest("tr");
		var precheckFunction = $table.attr("data-ar-precheck");
		var passCheck = true;
		if(typeof window[precheckFunction]=="function"){
			passCheck = window[precheckFunction]($table,link,"remove",$removeRow);
		}
		if(passCheck){
			$removeRow.remove();
			var templateId = $removeRow.attr("data-ar-templateid");
			if(!templateId) {
				$template = $("#" + $table.attr("id") + "-template");
			} else {
				$template = $("#"+templateId);
			}
			if (isReserved) {
				if ($table.find("tr").size() <= ignoreRows) {
					var $newRow = $template.tmpl();
					$newRow.attr("data-ar-templateid",$removeRow.attr("data-ar-templateid"));
					$table.append($newRow);
					$newRow.find(".input-datepicker").each(function() {// initial
						$.qp.initialDatePicker(this);
					});
					$newRow.find(".qp-input-datetimepicker-detail").each(
						function() {// initial
							$.qp.initialDateTimePickerDetail($(this));
						});
					$newRow.find(".qp-input-autocomplete").each(function() {// initial
						$.qp.initialAutocomplete($(this));
					});
					$(link).find(".qp-input-autocomplete-test").each(function() {// initial
						$.qp.initialAutocompleteTest($(this));
					});
				}
			}
			$.qp.initialAutoNumeric(link);// initial Auto numeric
			$.qp.reCalIndex($table); // refresh row index (No.)
			$.qp.reArrayIndex($table);
			if (typeof window[callback] == "function") {
				window[callback]($table,"remove",$removeRow);
			}
		}
	};

	$.qp.reArrayIndex = function(table) {
		$table=$(table);
		var ignoreRows = parseInt($table.attr("data-ar-irows"));
		var tableTreeLevel = parseInt($table.attr("data-ar-tlevel"));
		if(isNaN(ignoreRows)) {
			ignoreRows = 0;
		}
		if(isNaN(tableTreeLevel)) {
			tableTreeLevel = 0;
		}
		$table	.find(">tbody>tr")
				.each(function(i) {
					if(i>=ignoreRows) {
							$(this)	.find("[name*='['][name*='].']")
									.each(function() {
												
												var regex = /\[\d*\]/g;
												var index=0;
												var replacements = [];
												var tempTable = $table;
												for(var j=tableTreeLevel-1;j>-1;j--) {
													tempTable=$(tempTable).parents("table:first");
													replacements[j] ='[' + tempTable.parents("tr:first").attr("data-ar-rindex")+ ']';
												}
												if ($(this).attr("name").match(regex)[tableTreeLevel]!='undefined') {
													$(this).attr("name",$(this).attr("name").replace(regex,function(match,stringIndex){
														var replacement = "[]";
														if(index==tableTreeLevel){
															replacement = '[' + (i-ignoreRows) + ']';
														} else {
															if(index>tableTreeLevel){
																replacement =  match;
															} else replacement=replacements[index];
														}
														index++;
														return replacement;
													}));
												}
									});
						}
					});
	};

	// JAVASCRIPT DATA VALIDATION

	$.qp.validateNotAlphanumericWithoutSpace = function(obj, label) {
		if (!obj.match(/^[a-zA-Z0-9]+$/)) {
			return "<li>"
					+ fcomMsgSource['errors.alphaNumericString'].replace("{0}",
							label) + "</li>";
		} else {
			return "";
		}
	};

	$.qp.validateRequire = function(obj, label) {
		if (obj.trim().length == 0) {
			return "<li>"
					+ fcomMsgSource['errors.required'].replace("{0}", label)
					+ "</li>";
		} else {
			return "";
		}
	};

	$.qp.validateShowMessage = function(msg) {
		$("#comErrorMessageText").html("<br/>" + msg + "<br/>");
		$("html, body").animate({
			scrollTop : 0
		}, "slow");
	};

	$.qp.validateClearMessage = function(msg) {
		$("#comErrorMessageText").html("");
	};

	$.qp.ajax = function(url, params, functionSuccess) {
		$.ajax({
			// The link we are accessing.
			url : url,
			data : $.param(params),
			// The type of request.
			type : "get",
			error : function() {

			},
			beforeSend : function() {
			},
			complete : function() {
			},
			success : function(data) {
				functionSuccess(data);
			}
		});

	};

	$.qp.ajaxPost = function(url, params, functionSuccess) {
		$.ajax({
			// The link we are accessing.
			url : url,
			data : $.param(params),
			// The type of request.
			type : "post",
			error : function() {

			},
			beforeSend : function() {
			},
			complete : function() {
			},
			success : function(data) {
				functionSuccess(data);
			}
		});

	};
	$.qp.inititalInputFile = function(thiz) {
		$(thiz).bootstrapFileInput();
	};

	$.qp.getJson = function(url, parameters) {
		return $.parseJSON($.ajax({
			url : url + "?parameters="
					+ encodeURIComponent(JSON.stringify(parameters))
					+ "&r=" + Math.random(),
			type : "GET",
			async : false,
			success : function(data) {

			},
			error : function() {

			}
		}).responseText);
	};
	
	$.qp.getTextResult = function(url) {
		return $.ajax({
			url : url,
			type : "GET",
			async : false,
			success : function(data) {

			},
			error : function() {
				$.qp.alert("Can't get data from server.");
			}
		}).responseText;
	};
	$.qp.getData = function(url) {
		return $.parseJSON($.ajax({
			url : url,
			type : "GET",
			async : false,
			success : function(data) {

			},
			error : function() {
				$.qp.alert("Can't get data from server.");
			}
		}).responseText);
	};
	
	$.qp.getHtml = function(url) {
		var html;
		$.ajax({
			url : url,
			type : "GET",
			async : false,
			dataType: 'html',
			success : function(data) {
				html = data;
			},
			error: function (xhr, exception){
				if (xhr.status === 0) {
					$.qp.alert('Not connect.\n Verify Network.');
				} else if (xhr.status == 404) {
					$.qp.alert('Requested page not found. [404]');
				} else if (xhr.status == 500) {
					$.qp.alert('Internal Server Error [500].');
				} else if (exception === 'timeout') {
					$.qp.alert('Time out error.');
				} else if (exception === 'abort') {
					$.qp.alert('Ajax request aborted.');
				} else {
					$.qp.alert('Uncaught Error.\n' + xhr.responseText);
				}
			}
		});

		return html;
	};
	
	$.qp.getString = function(url) {
		return $.ajax({
			url : url,
			type : "GET",
			async : false,
			success : function(data) {

			},
			error : function() {

			}
		}).responseText;
	};
	
	$.qp.initialTouchSpin = function(thiz) {
		$(thiz).TouchSpin({
			verticalbuttons : true,
			min : 0
		});

	};
	$.qp.sortDataByColumn = function(formId,columnName) {
		var form = "#"+formId;
		if($(form).length >0 ){
			var value = $('#fcomHeaderSort'+ columnName).val();
			if(value != undefined){
				if($('#fcomHeaderSortSubmit').length > 0)
				{
			 		$('#fcomHeaderSortSubmit').val(value);
				}
				else
				{
					// add hidden input
					$('<input>').attr({
					    type: 'hidden',
					    id: 'fcomHeaderSortSubmit',
					    name: 'sort',
					    value: value
					}).appendTo(form);
				}
				$(form).submit();
			}else{
				//This element is not exist.
			}
		}else{
			//This form is not exist.
		}
		
	}
	$.qp.initialPopupNavigationLink = function(link) {
		$(link).click(function(){
			var parentWindow = window.parent.document; 
			var href = $(this).attr('href');
			
			$.ajax({
					method : "GET",
					url : href,
				}).done(function(data,status) {
					var $document;
					var state;
					if($.qp.isHasPageErrors(data)) {
						$document = window.document;
						state = {"html":data};
					} else {
						$document = window.parent.document;
						$("iframe").parents(".fancybox-overlay")
						state = {"html":data};
						window.parent.history.pushState(state,"",href);
					}
					$.qp.updateDocument($document,state);
				});
				return false;
	    });
	}
	$.qp.updateDocument = function(document,state){
		//$document.documentElement.innerHTML = state.html;
		if(state){
			var newDoc = document.open();
			newDoc.write(state.html);
			newDoc.close();
		}
	}
	$.qp.isHasPageErrors = function(contentScope){
		if($(contentScope).find(".qp-message .alert li").length>0){
			return true;
		}
		return false;
	};
	$.qp.initialPopstate = function() {
		 $(window.parent).on("popstate",function(event){
			var document = window.top.document;
			$.qp.updateDocument(document,event.originalEvent.state);
		});
	}
	/**DungNN - check has one of class*/
	$.qp.hasAnyOfClasses = function() {
		for (var i = 0, il = arguments.length; i<il; i++) {
			if (this.hasClass(arguments[i])) return true;
		}
		return false;
      }
	
	$.qp.defaultString = function(str, strDefault) {
		if (str == null || str == undefined)
			return strDefault;

		return str
	}
	
	$.qp.getNumericValue = function (input) {
		try {
			return input.autoNumeric('get');
		} catch(exception){
			return input.val();
		}	
	}
	
	$.qp.initialTableAddRemove = function(){
		 if($.qp.ar){
			 $.qp.ar.callbackDefault = function($table,direction,$row){
				if(direction==$.qp.ar.CONST.DIRECTION_ADD){
					$row.find(".input-datepicker").each(function() {// initial
						$.qp.initialDatePicker(this);
					});
					$row.find(".qp-input-datetimepicker-detail").each(function() {// initial
						$.qp.initialDateTimePickerDetail($(this));
					});
					$row.find(".qp-input-autocomplete").each(function() {// initial
						$.qp.initialAutocomplete($(this));
					});
					$.qp.initialAutoNumeric($row);// initial Auto numeric
					$($row).find('.qp-convention-name-row').on('change', function() {
				    	var code = $(this).closest("tr").find(".qp-convention-code-row");
						if ($(code).val() == '') {
							$(code).val(($(this).val().capitalize()));
							$(code).change();
						}
							
					});
					$($row).find('.qp-convention-code-row').on('change', function() {
						var name = $(this).closest("tr").find(".qp-convention-name-row");
						if ($(name).val() == '') {
							$(name).val(($(this).val().toDash()));
							$(name).change();
						}
					});
				};
			}; 
		 }
	};
	
	// to prevent double submission of forms
	$.qp.preventDoubleSubmission = function(formInput) {
	  $(formInput).on('submit',function(e){
	    var $form = $(this);
	 
	    if ($form.data('submitted') === true) {
	      // Previously submitted - don't submit again
	      e.preventDefault();
	    } else {
	      // Mark it so that the next submit can be ignored
	      $form.data('submitted', true);
	      $("#fcomConfirmBtnYes").attr('disabled','disabled');
	      
	      if(fcomMsgSource["sc.sys.0056"] != undefined){
		      $("#fcomConfirmBtnYes").html(fcomMsgSource["sc.sys.0056"]);
	      }
	    }
	  });
	 
	  // Keep chainability
	  return this;
	};
	$.qp.initFloatVerticalMenu = function(){
		$('.navbar-vertical').affix({
			offset : {
				top :90,
			}
		});
		$('.navbar-vertical').on('affix.bs.affix',function(){
			var $navbar = $(this);
			var $toggleButton = $("<button data-toggle='hide' class='btn btn-default fa fa-align-justify toggle-button'>");
			$toggleButton.css({
				left:"-40px",
				top:"40px"
			});
			if($(".qp-root").css("margin-left").replace("px","")<40){
				$('.navbar-vertical').css({
					"margin-left":"40px"
				});
			}
			$toggleButton.on("click",function(){
				if(($toggleButton).attr("data-toggle") == "hide"){
					$navbar.find(">*").not($toggleButton).show();
					$toggleButton.attr("data-toggle","show"); 
				} else {
					$navbar.find(">*").not($toggleButton).css("display","");
					$toggleButton.attr("data-toggle","hide");
				}
				
				
			});
			$navbar.find(">*").hide();
			$navbar.prepend($toggleButton);
			
		});
		$('.navbar-vertical').on('affixed-top.bs.affix',function(){
			var $navbar = $(this);
			$navbar.find(".toggle-button").remove();
			$navbar.find(">.navbar-header").show();
			$navbar.find(">*").not(".toggle-button").css("display","");
			$('.navbar-vertical').css({
				"margin-left":"0px"
			});
		});
		$('body').on('click', function (e) {
			if(!$(e.target).is("button.toggle-button") && $(e.target).closest(".navbar-vertical").length == 0){
				$("button.toggle-button").each(function(){
					var $toggleButton = $(this);
					var $navbar = $toggleButton.closest(".navbar-vertical");
					
					$navbar.find(">*").not($toggleButton).css("display","");
					$toggleButton.attr("data-toggle","hide");
				});
			}
	    });
		$('.navbar-vertical').affix('checkPosition');
	};
	/** DungNN - 20150813 
	 * add auto generate code to name or name to code only support english
	 * */
	$.qp.initialConventionNameCode = function(obj) {
		if(obj == undefined || obj == null){
			$('.qp-convention-name').on('change', function() {
		    	var code = $(this).closest("table").find(".qp-convention-code");
				if ($(code).val() == '')
					$(code).val(($(this).val().capitalize()));
			});
			
			$('.qp-convention-code').on('change', function() {
				var name = $(this).closest("table").find(".qp-convention-name");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDash()));
			});
			
			//convert name, code in row
		    $('.qp-convention-name-row').on('change', function() {
		    	var code = $(this).closest("tr").find(".qp-convention-code-row");
				if ($(code).val() == '')
					$(code).val(($(this).val().capitalize()));
			});

			$('.qp-convention-code-row').on('change', function() {
				var name = $(this).closest("tr").find(".qp-convention-name-row");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDash()));
			});
			
			$('.qp-convention-db-name').on('change', function() {
				var code = $(this).closest("table").find(".qp-convention-db-code");
				if ($(code).val() == '')
					$(code).val(($(this).val().toDatabaseCode()));
			});

			$('.qp-convention-db-name-row').on('change', function() {
		    	var code = $(this).closest("tr").find(".qp-convention-db-code-row");
				if ($(code).val() == '')
					$(code).val(($(this).val().toDatabaseCode()));
			});
			
			$('.qp-convention-db-code').on('change', function() {
				var name = $(this).closest("table").find(".qp-convention-db-name");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDashDB()).firstTitle());
			});
			
			$('.qp-convention-db-code-row').on('change', function() {
				var name = $(this).closest("tr").find(".qp-convention-db-name-row");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDashDB()).firstTitle());
			});
		}else{
			$(obj).find('.qp-convention-name').on('change', function() {
		    	var code = $(this).closest("table").find(".qp-convention-code");
				if ($(code).val() == '')
					$(code).val(($(this).val().capitalize()));
			});
			
			$(obj).find('.qp-convention-code').on('change', function() {
				var name = $(this).closest("table").find(".qp-convention-name");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDash()));
			});
			
			//convert name, code in row
			$(obj).find('.qp-convention-name-row').on('change', function() {
		    	var code = $(this).closest("tr").find(".qp-convention-code-row");
				if ($(code).val() == '')
					$(code).val(($(this).val().capitalize()));
			});

			$(obj).find('.qp-convention-code-row').on('change', function() {
				var name = $(this).closest("tr").find(".qp-convention-name-row");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDash()));
			});
			
			$(obj).find('.qp-convention-db-name').on('change', function() {
				var code = $(this).closest("table").find(".qp-convention-db-code");
				if ($(code).val() == '')
					$(code).val(($(this).val().toDatabaseCode()));
			});

			$(obj).find('.qp-convention-db-name-row').on('change', function() {
		    	var code = $(this).closest("tr").find(".qp-convention-db-code-row");
				if ($(code).val() == '')
					$(code).val(($(this).val().toDatabaseCode()));
			});
			
			$(obj).find('.qp-convention-db-code').on('change', function() {
				var name = $(this).closest("table").find(".qp-convention-db-name");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDashDB()).firstTitle());
			});
			
			$(obj).find('.qp-convention-db-code-row').on('change', function() {
				var name = $(this).closest("tr").find(".qp-convention-db-name-row");
				if ($(name).val() == '')
					$(name).val(($(this).val().toDashDB()).firstTitle());
			});
		}
		
	}
	
	$.qp.initCustomConfirm = function () {
		
	}

	/** DungNN - 20150813 
	 * add auto generate code to name or name to code only support english
	 * */
	$.qp.validateIsAlphanumeric = function(obj) {
		if (!obj.match(/^[a-zA-Z0-9- _]+$/)) {
			return false;
		} else {
			return true;
		}
	};

	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, "");
	};

	String.prototype.toCamel = function() {
		return this.replace(/(\ [a-zA-Z0-9])/g, function($1) {
			return $1.toUpperCase().replace(' ', '');
		});
	};

	String.prototype.capitalize = function() {
		if ($.qp.validateIsAlphanumeric(this.toString())) {
			return (this.charAt(0).toLowerCase() + this.slice(1).toCamel()).trim();
		}
		return "";
	};

	String.prototype.toDash = function() {
		return this.replace(/([A-Z])/g, function($1) {
			return " " + $1.toUpperCase();
		}).trim();
	};

	String.prototype.toDashDB = function() {
		return this.replace(/_/g, ' ');
	};
	
	String.prototype.firstTitle = function() {
		return this.charAt(0).toUpperCase() + this.slice(1).trim();
	};

	String.prototype.toDatabaseCode = function() {
		if ($.qp.validateIsAlphanumeric(this.toString())) {
			return (this.replace(/(\ [a-zA-Z0-9])/g, function($1) {
				return $1.replace(' ', '_');
			})).trim().toLowerCase();
		}
		return "";
	};
	/** DungNN - 20150813 
	 * add auto generate code to name or name to code only support english
	 * */
	$.qp.validateIsCode = function(obj) {
		var REGULAR_EXP_CODE = /^[a-zA-Z]+[_0-9a-zA-Z]{0,49}$/i;
		if (obj.match(REGULAR_EXP_CODE)) {
			return false;
		} else {
			return true;
		}
	};

})(jQuery);

// set timeout for submit by ajax
jQuery.fn.setFormTimeout = function() {
	  var $form = $(this);
	  setTimeout(function() {
	    $('input[type="submit"]', $form).button('reset');
	    $.qp.alert('Form failed to submit within 2 seconds');
	  }, 2000);
};

// KhanhTH add column
$.qp.addColumnJSByLink = function(link, tableId) {
	var table = $(link).closest("div").find("table");
	var columnWidth = 230;
	$('#' + tableId + ' colgroup').append("<col width=" + columnWidth + "px'></col>");
	$('#' + tableId + '').width($('#' + tableId + '').width() + columnWidth);
	
	table.find('tr').each(function() {
		var tableRow = $(this);
		if (tableRow.parent('thead').length == 1) {
			$(".glyphicon-plus").remove();
			tableRow.append('<th style="text-align:center"><span class="forPrototype"></span><span onclick="$(\'#dialog-formula-setting\').modal(\'show\');" class="btn btn-default btn-xs fa fa-list-alt qp-button-action" title="Setting"></span>  <a class="btn btn-default btn-xs fa fa-minus qp-button-action" href="javascript:void(0)" title="Remove" onclick="$.qp.removeColumnJSByLink(this, \'tbl_list_domain_items\');"></a>  <a class="btn btn-default btn-xs fa fa-plus qp-button-action" href="javascript:void(0)" title="Add" onclick="$.qp.addColumnJSByLink(this, \'tbl_list_domain_items\');"></a></th>');
		} else if (tableRow.parent('tbody').length == 1) {
			tableRow.append('<td><select class="form-control qp-input-select"><option value="0">No display</option><option value="1" selected="true">Display</option></select></td>');
		}
	});
};

// KhanhTH remove column
$.qp.removeColumnJSByLink = function(link, tableId) {
	var table = $(link).closest("div").find("table");
	var cellIndex = $(link).parent().index();
	$('#' + tableId + ' colgroup').find('col:eq(' + cellIndex + ')').remove();
	
	table.find('tr').each(function() {
		var tableRow = $(this);
		tableRow.find('th:eq(' + cellIndex + ')').remove();
		tableRow.find('td:eq(' + cellIndex + ')').remove();
	});
	
	table.find('thead tr').each(function() {
		var tableRow = $(this);
		if(tableRow.find('th:last a').hasClass('fa-plus')) {
			// do nothing
		} else {
			tableRow.find('th:last').append('<a class="btn btn-default btn-xs fa fa-plus qp-button-action" href="javascript:void(0)" title="Add" onclick="$.qp.addColumnJSByLink(this, \'tbl_list_domain_items\');"></a>');
		}
	});
};

// KhanhTH set condition name (for prototype)
$.qp.setConditionName = function() {
	$('#dialog-formula-setting').modal('hide');
	$('.forPrototype').text("Condition sample");
};

$.qp.addMultiRowJSByLink = function(link) {
	var table = $(link).closest("div").prev("table");
	var obj = $("#" + $(table).attr("id") + "-template").tmpl();
	var numberOfRowspan = $(table).find("tbody tr:first td:first").attr("rowspan");
	$(table).append(obj);
	$(obj).find(".input-datepicker").each(function() {// initial
		$.qp.initialDatePicker(this);
	});
	$(obj).find(".qp-input-datetimepicker-detail").each(function() {// initial
		$.qp.initialDateTimePickerDetail($(this));
	});
	$(obj).find(".qp-input-autocomplete").each(function() {// initial
		$.qp.initialAutocomplete($(this));
	});
	$.qp.initialAutoNumeric(obj);// initial Auto numeric
	$.qp.reCalIndexMultiRow(table); // refresh row index (No.)
	$.qp.reArrayIndexMultiRow(table,numberOfRowspan);
	$.qp.alternateRowColorInTable($(table).attr("id")); // alternate color
	$.qp.initialConventionNameCode(obj);
};

$.qp.reCalIndexMultiRow = function(table) {
	$table=$(table);
	var ignoreRows = parseInt($table.attr("data-ar-irows"));
	if(isNaN(ignoreRows)) {
		ignoreRows = 0;
	}
	var index = 1;
	$table.find(">tbody>tr").each(function(i) {
		if ($(this).find('td[rowspan][rowspan != 0][rowspan != 1]').length > 0) {
			$(this).find(">td.tableIndex").html(index);
			index++;
		}
	});

};

//Remove row from List table
$.qp.removeMultiRowJS = function(fcomTableId, obj) {
	var table = $(obj).closest("table");
	var numberOfRowspan = $(table).find("tbody tr:first td:first").attr("rowspan");
	if(table!="undefined") {
		var rowspan = $(obj).closest('td').attr('rowspan') - 1;
		var currentIndex = $(obj).closest('tr').index();
		
		while (rowspan > 0) {
			var index = currentIndex + rowspan;
			$(obj).closest('table tbody').find('tr:eq('+index+')').remove();
			rowspan--;
		}
		
		$(obj).closest("tr").remove();
		if (table.find("tr").size() == 0) {
			var tmpl = $("#" + $(table).attr("id") + "-template").tmpl();

			$(table).append(tmpl);
			$(tmpl).find(".input-datepicker").each(function() {// initial
				$.qp.initialDatePicker(this);
			});
			$(tmpl).find(".qp-input-datetimepicker-detail").each(function() {// initial
				$.qp.initialDateTimePickerDetail($(this));
			});
			$(tmpl).find(".qp-input-autocomplete").each(function() {// initial
				$.qp.initialAutocomplete($(this));
			});
			$(obj).find(".qp-input-autocomplete-test").each(function() {// initial
				$.qp.initialAutocompleteTest($(this));
			});
		}
		$.qp.initialAutoNumeric(obj);// initial Auto numeric
		$.qp.reCalIndexMultiRow(table); // refresh row index (No.)
		$.qp.alternateRowColorInTable(fcomTableId); // alternate color
		$.qp.reArrayIndexMultiRow(table,numberOfRowspan);	
	}
};

$.qp.reArrayIndexMultiRow = function(table,numberOfRowspan) {
	$table=$(table);
	var index = 0;
	var preIndex;
	$table.find(">tbody td[rowspan="+numberOfRowspan+"][class^='qp-output-fixlength']").each(function(i) {
		var preIndex = i;
		var trFirst = $(this).closest("tr");
		putIndex(trFirst,preIndex);
		var indexTrFirst = $(trFirst).index();
		for(var j = indexTrFirst+1; j < indexTrFirst + numberOfRowspan; j++) {
			/*putIndex($(trFirst).next("tr:eq( "+(j+1)+")"),preIndex);*/
			putIndex($table.find(">tbody tr").get(j),preIndex);
		}
	});
};

function putIndex(trIndex,preIndex) {
	$(trIndex).closest("tr").each(function(i){
		$(this).find("[name*='['][name*='].']").each(function() {
			var regex = /\[\d*\]/g;
			$(this).attr("name",$(this).attr("name").replace(regex,function(match,stringIndex){
				var replacement = "[]";
				replacement = '[' + preIndex + ']';
				return replacement;
			}));
		});
	});
}