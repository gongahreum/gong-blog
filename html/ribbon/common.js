
function init() {
	var setRibbonCanvas = function() {
		var $parent = $('.ribbon-wrapper');
		var canvas = $('#canvas-ribbon');
		var ctx = canvas[0].getContext('2d');
		
		var wW = window.innerWidth;
		var wH = window.outerHeight;

		var wWv = (wW/600);
		var wHv = (wH/500);

		var drawTime;
		var offset = 0;
		var maxOffset = 8090;

		function _init() {
			console.log('init !');

			canvas[0].width = window.innerWidth;
			canvas[0].height = window.outerHeight;
			// drawShape(ctx,wWv,wHv);
			// drawAnim();
		}

		function _scroll() {
			var _top = $(window).scrollTop() - $parent.offset().top;
			var _move = Math.max(0, $parent.height() - $(window).height());
			var _percent = Math.max(0, Math.min(1, _top/_move));

			drawScrollAnim(_percent);
		}

		function drawShape(ctx, xoff, yoff) {
			canvas[0].width = window.innerWidth;

			ctx.beginPath();
			ctx.moveTo(18*xoff, 0*yoff);
			ctx.bezierCurveTo(17*xoff, 7*yoff, 16*xoff, 415*yoff, 19*xoff, 469*yoff);
			ctx.bezierCurveTo(21*xoff, 503*yoff, 158*xoff, 515*yoff, 157*xoff, 474*yoff);
			ctx.bezierCurveTo(156*xoff, 427*yoff, 162*xoff, 31*yoff, 161*xoff, 16*yoff);
			ctx.bezierCurveTo(160*xoff, -8*yoff, 295*xoff, -9*yoff, 298*xoff, 22*yoff);
			ctx.bezierCurveTo(299*xoff, 37*yoff, 297*xoff, 448*yoff, 300*xoff, 469*yoff);
			ctx.bezierCurveTo(304*xoff, 499*yoff, 432*xoff, 509*yoff, 431*xoff, 476*yoff);
			ctx.bezierCurveTo(430*xoff, 442*yoff, 436*xoff, 58*yoff, 438*xoff, 13*yoff);
			ctx.bezierCurveTo(439*xoff, -7*yoff, 575*xoff, -6*yoff, 576*xoff, 18*yoff);
			ctx.bezierCurveTo(578*xoff, 57*yoff, 578*xoff, 487*yoff, 576*xoff, 472*yoff);

			ctx.strokeStyle = "cadetblue";
			ctx.lineWidth = 400;
			ctx.lineJoin = "round";
			ctx.lineCap = "round";

			ctx.setLineDash([maxOffset, maxOffset]);
			ctx.lineDashOffset = offset;
			console.log(ctx.lineDashOffset);

			ctx.stroke();
		}
		function drawAnim() {
			offset+=20;
            
            if(offset > maxOffset){
                offset = 0;
                clearTimeout(drawTime);
            } else {
				drawTime = setTimeout(drawAnim, 1);
				drawShape(ctx,wWv,wHv);
            }
		}

		function drawScrollAnim(percent) {
			offset = maxOffset-(maxOffset*percent);
			if(offset > maxOffset) offset=maxOffset;
			drawShape(ctx,wWv,wHv);
		}

		return {
			init : _init,
			scroll : _scroll
		}
	}();

	setRibbonCanvas.init();

	$(window).on('scroll',function(){
		setRibbonCanvas.scroll();
	});
}
window.onload = init;