/**
 * Template initiation
 * Settings:
 **** background => [color, image], for color leave image blank (or you may delete it) and do the opposite for image.
 **** Title => [text, icon{}], text => your title text | icon->source => Icon's source\image | icon->bg-color => Icon's bg color
 **** Pagination => [shown, haystack], shown => toggle pagination | haystack => amout of tabs
 **** Answers => [shown, array], shown => toggle answers | array => array of answers
 */
import Template from './engine';

export const template = new Template({
	"background": {
		"color": "#FFF",
		"image": "" //http://img.mako.co.il/2015/03/24/la_mancha_i.jpg
	},
	"title": {
		"text": "טקסט שמגיע מהפלאגין", // Title text
		"icon": {
			"background-color": ["#22b7cd"]
		}
	},
	"pagination": {
		"shown": true, // Display pagination or not
		"haystack": 555 // Number of tabs
	},
	"answers": {
		"shown": false,
		"array": [
			"תשובה",
			"תשובה ארוכה רצח",
			"איליה מפקפק ביכולות הפלאגינים שלי",
			"ברור שיעבוד."
		]
	}
});
