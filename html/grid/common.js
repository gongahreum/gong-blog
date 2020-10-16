
function init() {
	var setGrid = function() {
		var $parent = $('.grid-wrapper');

		var wW = window.innerWidth;
		var wH = window.outerHeight;

		var wWv = (wW/600);
		var wHv = (wH/500);

		// var beforePosArr = {x: 0, y: 0, scale: 1};
		var afterPosArr = [];
		$('.item').each(function(i){
			if(i<4) afterPosArr.push({x:-122,y:-288,scale:2});
			else if(i==4) afterPosArr.push({x:300,y:-300,scale:1.8});
			else if(i==5) afterPosArr.push({x:-300,y:0,scale:2.2});
			else if(i<10) afterPosArr.push({x:372,y:5,scale:2});
			else if(i<14) afterPosArr.push({x:-130,y:365,scale:1.5});
			else afterPosArr.push({x:348,y:300,scale:3});
		});
		
		function _init() {
			console.log('init !');

			// gsap.from('.screen-container', 
			// 		{scale: 5},
			// 		{ease: "power1.in"});

			// $('.item').each(function(i){
			// 	gsap.from(this, 
			// 		afterPosArr[i], 
			// 		{ease: "power1.in"});
			// });
			
		}

		function scrollAnim(percent) {
			var cMax = 7;
			var cMin = 1;
			var containerScale = Math.max(cMin,cMax-((cMax-cMin)*(percent)));
			gsap.from('.screen-container', {scale: containerScale}, {ease: "power1.in"});
			// $('.screen-container').css({'transform':'scale('+containerScale+')'});

			$('.item').each(function(i){
				var iMaxX = afterPosArr[i].x;
				var iMaxY = afterPosArr[i].y;
				var iMaxScale = afterPosArr[i].scale;
				var thisPos = { x:iMaxX-(iMaxX*(percent)), 
								y:iMaxY-(iMaxY*(percent)), 
								scale:Math.max(1,iMaxScale-((iMaxScale)*(percent)))};

				gsap.from(this, thisPos, {ease: "power1.in"});
				// console.log($(this), thisPos);
				// $(this).css({'transform':'translate('+thisPos.x+' '+thisPos.y+',0) scale('+thisPos.scale+')'});
			});
		}

		function _scroll() {
			var _top = $(window).scrollTop() - $parent.offset().top;
			var _move = Math.max(0, $parent.height() - $(window).height());
			var _percent = Math.max(0, Math.min(1, _top/_move));
			scrollAnim(_percent);
		}

		return {
			init : _init,
			scroll : _scroll
		}
	}();

	var setPrivacy = function() {
		var $parent = $('.privacy-wrapper');
		var $fakeTypo = $parent.find('.typo.fake');
		var typoText = $parent.find('.typo.real').text();
		var tLength = typoText.length;
		var lengPer;

		function _init() {
			$fakeTypo.html(typoText);
		}

		function _scroll() {
			var _top = $(window).scrollTop() - $parent.offset().top;
			var _move = Math.max(0, $parent.height() - $(window).height());
			var _percent = Math.max(0, Math.min(1, _top/_move));
			scrollAnim(_percent);
		}

		function scrollAnim(percent){
			lengPer = Math.round(tLength*percent);
			var curTypo = replaceText(lengPer);
			$fakeTypo.html(curTypo);
		}

		function replaceText(index) {
			var fakeTypo = typoText.substr(0, lengPer) + typoText.substr((tLength-lengPer)+lengPer, tLength);
			
			for(var i=0; i<(tLength-lengPer); i++){
				fakeTypo = fakeTypo + '*';
			}
			return fakeTypo;
		}


		return {
			init : _init,
			scroll : _scroll
		}
	}();

	setGrid.init();
	setPrivacy.init();

	$(window).on('scroll',function(){
		setGrid.scroll();
		setPrivacy.scroll();
	});
}
window.onload = init;