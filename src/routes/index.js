const fs = require('fs');
const path = require('path');

let entryPoint = path.basename(__filename);
let files = fs.readdirSync(__dirname);

let routes = {};

for (let file of files) {
	if (/\.js$/.test(file) && file !== entryPoint) {
		let routeSet = require(`./${file}`);
		let prefix = file.replace('.js', '');
		Object.keys(routeSet).map(route => {
			let oriPath = routeSet[route].path;
			routeSet[route].path = `/${prefix}${oriPath}`;
		});
		for (let route in routeSet) {
			routes[`${prefix}_${route}`] = routeSet[route];
		}
	}
}

module.exports = routes;
