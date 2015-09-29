;
(function($) {

	function Flymobile(container, options) {
		this.$container = $(container);
		this.$slides = this.$container.children();
		this.options = options;
		this.cw = window.innerWidth;
		this.ch = window.innerHeight;
		this.startY;
		this.endY;
		this.moveY;
		this.touchInterval = this.ch / 4;
		this.isSwitching = false;
		this.curIndex = 0;
		this.maxIndex = this.$slides.length - 1;
		this.isLoop = options.isLoop ? options.isLoop : false;
		this.onInit = options.onInit ? options.onInit : new Function();
		this.onTouchStart = options.onTouchStart ? options.onTouchStart : new Function();
		this.onTouchMove = options.onTouchMove ? options.onTouchMove : new Function();
		this.onTouchEnd = options.onTouchEnd ? options.onTouchEnd : new Function();
		this.onSlideChangeStart = options.onSlideChangeStart ? options.onSlideChangeStart : new Function();
		this.onSlideChangeEnd = options.onSlideChangeEnd ? options.onSlideChangeEnd : new Function();
		this.init();
	}

	Flymobile.prototype = {
		init: function() {
			this.enableTouch();
			this.preventDefault(this.$container);
			this.resetElement();
			this.onInit(this);
		},
		resetElement: function() {
			$(".ele").hide();
			this.$slides.eq(this.curIndex).find(".ele").show();
		},
		touchStart: function(e) {
			if (!this.isSwitching) {
				console.log("start");
				this.$container.css({
					"transition": " none",
					"-webkit-transition": "none"
				});
				var touches = e.originalEvent.changedTouches;
				if (touches.length == 1) {
					this.startY = touches[0].pageY + this.ch * this.curIndex;
				}
				this.onTouchStart(this, e);
			}
		},
		touchMove: function(e) {
			var touches = e.originalEvent.changedTouches;
			if (touches.length == 1) {
				this.moveY = this.startY - touches[0].pageY;
				this.switchPage(-this.moveY);
			}
			this.onTouchMove(this, e);
		},
		touchEnd: function(e) {
			var touches = e.originalEvent.changedTouches;
			if (touches.length == 1) {
				this.endY = touches[0].pageY + this.ch * this.curIndex;
				var disY = this.endY - this.startY;
				if (Math.abs(disY) > this.touchInterval && !this.isSwitching) {
					this.$container.css({
						"transition": " transform 0.5s linear 0s",
						"-webkit-transition": "-webkit-transform 0.5s linear 0s"
					});
					if (disY < 0) {
						this.nextPage();
					} else {
						this.prevPage();
					}
				} else {
					var _this = this;
					this.$container.css({
						"transition": " transform 0.3s ease-out 0s",
						"-webkit-transition": "-webkit-transform 0.3s ease-out 0s"
					});
					this.switchPage(-(this.ch * this.curIndex));
				}
			}
			this.onTouchEnd(this, e);
		},
		switchPage: function(y) {
			this.$container.css({
				"transform": "translate3d(0," + y + "px,0)",
				"-webkit-transform": "translate3d(0," + y + "px,0)"
			});
		},
		nextPage: function() {
			var _this = this;
			this.isSwitching = true;
			this.curIndex++;
			if (this.curIndex >= this.maxIndex) {
				this.curIndex = this.maxIndex;
			}
			this.switchPage(-(this.ch * this.curIndex));
			this.onSlideChangeStart(this);
			this.$container.on("transitionend webkitTransitionEnd", function() {
				_this.slideChangeEnd();
			});
		},
		prevPage: function() {
			var _this = this;
			this.isSwitching = true;
			this.curIndex--;
			if (this.curIndex <= 0) {
				this.curIndex = 0;
			}
			this.switchPage(-(this.ch * this.curIndex));
			this.onSlideChangeStart(this);
			this.$container.on("transitionend webkitTransitionEnd", function() {
				_this.slideChangeEnd();
			});
		},
		slideChangeEnd: function() {
			this.resetElement();
			this.isSwitching = false;
			this.$container.off("transitionend webkitTransitionEnd");
			this.onSlideChangeEnd(this);
		},
		enableTouch: function() {
			var _this = this;
			this.$container.on("touchstart", function(e) {
				_this.touchStart(e);
			});
			this.$container.on("touchmove", function(e) {
				_this.touchMove(e);
			});
			this.$container.on("touchend", function(e) {
				_this.touchEnd(e);
			});
		},
		disableTouch: function() {
			this.$container.off("touchstart");
			this.$container.off("touchmove");
			this.$container.off("touchend");
		},
		preventDefault: function(obj) {
			obj.on("touchstart", function(e) {
				e.preventDefault();
			});
			obj.on("touchmove", function(e) {
				e.preventDefault();
			});
			obj.on("touchend", function(e) {
				e.preventDefault();
			});
		}
	}

	window["Flymobile"] = Flymobile;

})(jQuery)