'use strict';

import $ from 'jquery';
import template from './toolsadmin';
import Lenticular from './lenticular';

(function () {

	const lenticular = new Lenticular( document.querySelector('.lenticular'),
		{
			images: ['static/img/general/1.jpg', 'static/img/general/2.jpg'],
			stripesCount: 100,
			afterInit: () => {
				console.log('after init...')
			},
			onLeft: () => {
				console.log('onLeft...');
			},
			onRight: () => {
				console.log('onRight...');
			},
			onDestroy: () => {
				console.log('onDestroy...'); // TODO: create this one
			}
		}
	);

	lenticular.init();

	/*
	if (window.location.pathname.match('svg')) {
		const lenticularSvg = new LenticularSvg(
			$('.app2'), {
				images: ['static/img/content/2.jpg', 'static/img/content/3.jpg']
			}
		);
	} else {
		lenticular.init();
	}
	*/

	/*
	$('img').on('load', () => {
		hologram.init();
	});
	*/

})();
