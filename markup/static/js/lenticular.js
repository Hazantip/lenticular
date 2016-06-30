/**
 * Created by Khazan on 27/06/2016.
 */
import $ from 'jquery';

class Lenticular {

	constructor(container, params) {
		// main
		this.container      = container;
		this.params         = { stripesCount: 10, ...params };
		// params
		this.images         = this.params.images || [];
		this.stripesCount   = this.params.stripesCount;
		this.duration       = 1.5;
		this.durationMin    = 0.2;
		this.durationInc    = this.duration / this.stripesCount;
		this.direction      = 'left';
		this.lastValue      = 0;
		this.multiplier     = 2;    // multiple value for this.acc*
		this.booster        = 0.5;  // value which will be added to this.acc*

		this.accX           = null;
		this.accY           = null;
		// callbacks
		this.afterInit      = this.params.afterInit;
		this.onDestroy      = this.params.onDestroy;
		this.onLeft         = this.params.onLeft;
		this.onRight        = this.params.onRight;
		// auto-init
		//this.init();
	}

	generateImages() {
		const { container, images } = this;

		const imagesDiv = $('<div class="lenticular__images"></div>');
		$(container).append(imagesDiv);

		images.map((image) => {
			imagesDiv.append( `<img src="${image}"/>` );
		});
	}

	stripeImage() {

		const { container, stripesCount, durationInc, duration, direction } = this;

		let img = $(container).find('.lenticular__images img:first-child');
		let totalW = $(container).innerWidth();
		let totalH = $(container).innerHeight();
		let isGeneratedStripes = $(container).find('.lenticular__inner').length;

		const getTransition = (i) => {
			if (direction === 'left'){
				return Math.max(this.durationMin, durationInc + i*durationInc)
			} else {
				return Math.max(this.durationMin, duration - i * durationInc)
			}
		};

		const generateStyles = () => {
			let inner = $(container).find('.lenticular__inner');
			let cols  = inner.find('.lenticular__col');

			inner.css({
				width: totalW, height: totalH
			});

			cols.map( (i, el) => {
				$(el).css({
					position: 'absolute',
					top: 0,
					bottom: 0,
					width: totalW / stripesCount,
					left: i * (totalW / stripesCount),
					transitionDuration: getTransition(i) + 's'
				});
				$(el).find('img').css({
					width: totalW,
					marginLeft: -(i * (totalW / stripesCount))
				})
			});
			console.log('styles...');
		};

		const generateStripes = () => {
			let inner = $('<div class="lenticular__inner"></div>').css({width: totalW, height: totalH});
			$(container).append(inner);

			const images = (count) => {
				for (var i = 0; i < count; i++) {
					const grid = $('<div class="lenticular__col"></div>');
					const imgClone = img.clone();
					grid.append(imgClone).appendTo(inner);
				}
			};

			images(stripesCount);

			generateStyles();

			console.log('markup...')

		};

		isGeneratedStripes ? generateStyles() : generateStripes();
	}

	attachEvets() {

		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', (e) => { this.accelerateListener(e) });
		}
		else if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', (e) => { this.accelerateListener(e) });
		}

		$(this.container).on('touchmove mousemove ', (e) => { this.mousemoveListener(e) });

		window.addEventListener('resize', (e) => { this.resizeListener(e) });
	}

	accelerateListener(e) {
		const { multiplier, booster } = this;
		const ORIENTATION_MAX = 90;
		const ACCELERATION_MAX = 10;

		if (e.beta || e.gamma) {
			this.accX = e.gamma / ORIENTATION_MAX * multiplier + booster;
			this.accY = e.beta / ORIENTATION_MAX * multiplier + booster;
		} else if (e.accelerationIncludingGravity) {
			this.accX = e.accelerationIncludingGravity.x / ACCELERATION_MAX * multiplier + booster;
			this.accY = e.accelerationIncludingGravity.y / ACCELERATION_MAX * multiplier + booster;
		}

		this.debounce(this.handleOpacity(e), 1000);
		//this.handleOpacity(e);

	}

	mousemoveListener(e) {
		e.stopImmediatePropagation();

		// horizontal
		this.accY = 1 - this.accX;
		this.accX = (e.pageX - $(this.container).offset().left) / $(this.container).width();

		// diagonal
		//this.accY = (((e.pageY - this.container.offsetTop) / $(this.container).width()));
		//this.accX = ( ( (e.pageX - this.container.offsetLeft) / $(this.container).width() ) + this.accY)/2;

		this.handleOpacity(e);
	}

	resizeListener() {
		this.debounce( this.stripeImage(), 250 )
	}

	handleOpacity(e) {

		const { accX, accY, onLeft, onRight } = this;

		const handleDirection = () => {
			if (this.lastValue > (accX)) {
				if (this.direction !== 'left')  { this.stripeImage(); }
				this.direction = 'left';
			} else {
				if (this.direction !== 'right') { this.stripeImage(); }
				this.direction = 'right';
			}
			this.lastValue = accX;
		};

		handleDirection();

		$('.lenticular__col').css('opacity', accX);

		//$('.lenticular__col:even').css('opacity', accX);
		//$('.lenticular__col:odd').css('opacity', accX);

		//$.each($('.lenticular__col'), (i, val) => {
		//	$(val).css('opacity', accX * (1 + i/50));
		//});

		//$.each($('.lenticular__col'), (i, el) => {
		//	$(el).css('opacity', accX);
		//});


		if (onLeft && Math.abs(accX) < 0.5 && Math.abs(accX) > 0) onLeft();
		if (onRight && Math.abs(accX) > 0.5) onRight();

		// debug
		$('.output').html(
			`
			<p>Event: ${e.type} </p>
			<p>direction: ${this.direction} </p>
			<p>last: ${this.lastValue} </p>
			<p>accX: ${this.accX} </p>
			<p>accY: ${this.accY} </p>
			<p>accX+accY: ${this.accX + this.accY} </p>
			 `
		);
	}

	debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	init() {
		this.generateImages();
		this.stripeImage();
		this.attachEvets();
		if (this.afterInit) this.afterInit();
	}

}

export default Lenticular;
