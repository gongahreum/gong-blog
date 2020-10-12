
function init() {
	var setRibbonCanvas = function(el) {
		var canvas = $('#canvas-ribbon');
		var thisCtx = canvas[0].getContext('2d');
		

		var _init = function() {

			canvas[0].width = $(window).width();
			canvas[0].height = window.outerHeight;
			_drawPath();
		}

		var _drawPath = function() {
			thisCtx.beginPath();
			thisCtx.strokeStyle = 'black';
			thisCtx.moveTo(20, 20);
			thisCtx.lineTo(200, 20);
			thisCtx.stroke();
		}

		var _drawRibbon = function() {

			canvasStep1[0].width = $(window).width();
			canvasStep1[0].height = window.outerHeight;

		}
		_init();

		return {
			// init : _init
			// scroll : _scroll,
			// resize : resize
		}
	}

	setRibbonCanvas();
}
window.onload = init;













