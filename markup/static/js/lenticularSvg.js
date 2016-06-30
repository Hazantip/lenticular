/**
 * Created by Khazan on 29/06/2016.
 */

class LenticularSvg {
	constructor(container, params) {
		this.container = container;
		this.params = {...params};

		this.images = this.params.images || [];

		this.width  = this.container.outerWidth();
		this.x      = 0;

		this.render();
	}

	render() {
		const markup = this.generateMarkup();
		this.container.append( markup );
		this.addListeners();
	}

	generateMarkup() {
		return `
				<div class="img" style="background-image: url(${this.images[0]})" ></div>
				<svg viewBox="0 0 400 400">
					<defs>
				     <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(0)">
				        <stop offset="0%"    stop-opacity:1  style="stop-color:white;" />
				        <stop offset="100%"  stop-opacity:0  style="stop-color:white;" />
				      </linearGradient>

			          <mask id="mask" maskUnits="userSpaceOnUse">
			            <rect width="400" height="400" fill="url(#gradient)"/>
			          </mask>
					</defs>
				    <image mask="url(#mask)" width="400" height="400" y="0" x="0" preserveAspectRatio="xMidYMid slice"
				    xlink:href=${this.images[1]} />
				</svg>
				`;
	}

	addListeners() {
		$('.app2').on('mousemove', (e) => { this.mousemoveListener(e) } );
		window.addEventListener('deviceorientation', (e) => { this.accelerateListener(e) });
	}

	handleMask() {
		const offset = [0, 100];
		const opacity = [1, 0];
		const {width } = this;
		// $('#gradient')[0].attributes[5].value = `rotate( ${ -this.x / width * 100 } )`;
		$('#gradient').attr('x2', (this.x / width * 200) + '%');

		$('#gradient stop').each((i, el) => {

			$(el).attr('offset', parseFloat(offset[i]) + (this.x / width * 100) + '%');

			if (i === 0) {
				$(el).attr('stop-opacity', opacity[i] - this.x / width);
			}
		});

	}

	mousemoveListener(e) {
		this.x = e.pageX;
		this.handleMask();
	}

	accelerateListener(e) {
		const ORIENTATION_MAX = 90;
		this.x = (Math.abs(e.gamma) / ORIENTATION_MAX) * this.width;
		// e.gamma / ORIENTATION_MAX // ==> +/-90
		// * this.width              // ==> 0 - this.width
		this.handleMask();
	}

	output() {
		$('.output').html(`
			<p>X: ${this.x}</p>
		`)
	}
}

export default LenticularSvg;
