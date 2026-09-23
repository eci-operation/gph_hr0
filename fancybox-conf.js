$.qp.initalFancybox = function(className, href) {
	if (href == null) {
		$("a." + className).each(function(){
			var width = $(this).data('popupwidth');
			width = $(this).data('popupwidth') == undefined ? $(this).attr('popupwidth') : $(this).data('popupwidth');
			if(isBlank(width))
				width = '90%';
			var height = $(this).data('popupheight');
			height = $(this).data('popupheight') == undefined ? $(this).attr('popupheight') : $(this).data('popupheight');
			if(isBlank(height))
				height = '90%';
			$(this).fancybox({
				'centerOnScroll' : true,
				'enableEscapeButton' : false,
				onStart : function() {
					$("body").css("overflow", "hidden");
				},
				onClosed : function() {
					$("body").css("overflow", "auto");
				},
				afterClose : function(){
					fcomFancyBoxClose();
				},
				'width' : width,
				'height' : height,
				'autoSize' : false,
				'autoScale' : true,
				'autoDimensions' : true,
				'hideOnOverlayClick' : false,
				'transitionIn' : 'none',
				'transitionOut' : 'none',
				'type' : 'iframe',
				'beforeLoad': function(){
					var state = {"html":window.top.document.documentElement.innerHTML};
					window.history.replaceState(state,"",window.top.location.href);
				},
				'afterLoad':function(){
					this.title = '<div class="title-popup">'+this.title+'</div>';
				},
				helpers: {
					overlay : { closeClick: false },
					title: {
						type: 'inside',
						position: 'top'
					}
				}
			});
		});
	}

	if (href != null) {
		$("a." + className).each(function(){
			var width = $(this).data('popupwidth');
			if(isBlank(width))
				width = '90%';
			var height = $(this).data('popupheight');
			if(isBlank(height))
				height = '90%';
			$(this).fancybox({
				'href' : href,
				'centerOnScroll' : true,
				'enableEscapeButton' : false,
				onStart : function() {
					$("body").css("overflow", "hidden");
				},
				onClosed : function() {
					$("body").css("overflow", "auto");
				},
				afterClose : function(){
					fcomFancyBoxClose();
				},
				'width' : width,
				'height' : height,
				'autoSize' : false,
				'autoScale' : true,
				'autoDimensions' : true,
				'hideOnOverlayClick' : false,
				'transitionIn' : 'none',
				'transitionOut' : 'none',
				'type' : 'iframe',
				helpers: {
					overlay : { closeClick: false },
					title: {
						type: 'inside',
						position: 'top'
					}
				}
			});
		});

	}
};
$(document).ready(function(){
	$.qp.initalFancybox("qp-link-popup", null);
	$.qp.initalFancybox("qp-button-popup", null);

	$('.popup').fancybox();
});

function isBlank(str){
	return !(str != undefined && str!=null && str != "");
}
function fcomFancyBoxClose()
{
	var isReload = $('#fcomReloadFancyBox').val();
	if(isReload == 'true')
	{
		var parentWindow = window.parent.document;
		parentWindow.location.reload();
	}
}