// minigl_helpers.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

export const minigl = { debug: null };

import { PI, TAU, RtoD, DtoR }          from './vector_math.js';
import { X, Y, Z, W, AXES, R, G, B, A } from './vector_math.js';

import * as VMath from './vector_math.js';


/**
 * clone()
 */
export function clone (obj) {
	return JSON.parse( JSON.stringify(obj) );

} // clone


/**
 * hasNaN()
 */
export function hasNaN (array) {
	let has_nan = false;

	array.forEach( (value)=>{
		if (isNaN(value)) has_nan = true;
	});

	return has_nan;

} // hasNaN



/**
 * getParam()
 */
export function getParam (obj, key, default_value) {
	return (obj[key] == undefined) ? default_value : obj[key];

} // getParam


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// GENERAL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * computedStyle()
 */
export function computedStyle( element ) {
	return element.currentStyle || window.getComputedStyle(element);

} // computedStyle


/**
 * initializeCanvas()
 */
export function initializeCanvas (canvas, new_width, new_height, offset = false) {
	canvas.setAttribute("width",  canvas.width  = new_width  );
	canvas.setAttribute("height", canvas.height = new_height );

	if (offset) canvas.getContext("2d").translate(0.5, 0.5);

	// This also seems to clear the canvas

} // initializeCanvas


/**
 * now()
 */
export function now() {
	const now = new Date();
	return now.getTime();

} // now


/**
 * isPowerOf2()
 */
export function isPowerOf2 (value) {
	return (value & (value - 1)) == 0;

} // isPowerOf2


/**
 * SeededRandom()
 * const seeded_random = new Helpers.SeededRandom( 1, 1 );
 * const random_number = seeded_random( MAXIMUM )
 */
export const SeededRandom = function (state1, state2) {
	let mod1 = 2294967087;
	let mul1 = 65539;
	let mod2 = 4294965887;
	let mul2 = 65537;

	if (typeof state1 != "number") {
		state1 = new Date();
	}

	if (typeof state2 != "number") {
		state2 = state1;
	}

	state1 %= (mod1 - 1) + 1;
	state2 %= (mod2 - 1) + 1;

	return function random (limit) {
		state1 = (state1 * mul1) % mod1;
		state2 = (state2 * mul2) % mod2;

		if ((state1 < limit) && (state2 < limit) && (state1 < mod1 % limit) && (state2 < mod2 % limit)) {
			return random( limit );
		}
		return (state1 + state2) % limit;
	};

}; // SeededRandom


/**
 * formatInteger()
 */
export const formatInteger = function (i) {
	let string = String(i);
	let result = '';

	while (string.length > 0) {
		result = string.slice( -3 ) + ' ' + result;
		string = string.slice( 0, -3 );
	}

	return result.trim();

}; // formatInteger


/**
 * getScreenCoords()
 */
export function getScreenCoords (minigl, entity, camera, projection_matrix, model_view_matrix) {
	if (entity.selected) {
		const position = [0,0,0];

		VMath.vec4_multiply_mat4(
			position,
			position,
			projection_matrix,
		);
		VMath.vec4_multiply_mat4(
			position,
			position,
			model_view_matrix,
		);

		const z = -position[Z];
		position[X] /= z;
		position[Y] /= z;

		const new_coords = [ position[X], position[Y] ];

		const aspect = minigl.maxY / minigl.maxX;
		const fov_correction = ( 90*DtoR / camera.fov ) ** 1.215;

		//new_coords[X] *= fov_correction;
		//new_coords[Y] *= fov_correction;

		new_coords[X] = Math.floor( minigl.midX + new_coords[X] * minigl.midX * aspect );
		new_coords[Y] = Math.floor( minigl.midY - new_coords[Y] * minigl.midY );

		return new_coords;
	} else {
		return [0,0];
	}

} // getScreenCoords


//EOF