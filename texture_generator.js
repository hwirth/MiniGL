// texture_canvas.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { minigl } from './minigl_helpers.js';

import { PI, TAU, RtoD, DtoR }          from './vector_math.js';
import { X, Y, Z, W, AXES, R, G, B, A } from './vector_math.js';


/**
 * TextureGenerator()
 */
export const TextureGenerator = function (minigl) {
	const self = this;


	/**
	 * dice()
	 */
	this.dice = function () {
		console.log( "Creating texture canvas: dice" );

		const height = 256;
		const width = 6 * height;
		const dot_distance = 0.25;

		const canvas = document.createElement( "canvas" );
		canvas.setAttribute( 'width', canvas.width = width );
		canvas.setAttribute( 'height', canvas.height = height );

		//canvas.className = "texture";
		//document.body.appendChild( canvas );

		const ctx = canvas.getContext( "2d" );

		ctx.fillStyle = "#fff";
		ctx.fillRect( 0, 0, width, height );
		ctx.fillStyle = "#000";

		const dot_positions = [
			[[0,0]],
			[[-1,-1], [1,1]],
			[[-1,-1], [0,0], [1,1]],
			[[-1,-1], [-1,1], [1,-1], [1,1]],
			[[-1,-1], [-1,1], [0,0], [1,-1], [1,1]],
			[[-1,-1], [-1,0], [-1,1], [1,-1], [1,0], [1,1]],
		];

		for (let i = 0; i < 6; ++i) {
			dot_positions[i].forEach( (dots)=>{
				const x = i * height + height/2 + dots[0]*height*dot_distance;
				const y = height/2 + dots[1]*height*dot_distance;
				ctx.beginPath();
				ctx.arc( x, y, height/10, 0, TAU );
				ctx.fill();
			});
		}

		return canvas;

	}; // dice


	/**
	 * color()
	 */
	this.color = function (color) {
		console.log( "Creating texture canvas: color " + color );
		const width  = 1;
		const height = 1;

		const canvas = document.createElement( "canvas" );
		canvas.setAttribute( 'width',  canvas.width  = width  );
		canvas.setAttribute( 'height', canvas.height = height );

		const ctx = canvas.getContext( "2d", { antialias: false } );

		ctx.fillStyle = color;
		ctx.fillRect( 0, 0, length, width );

		return canvas;

	}; // color


	/**
	 * fromImageElement()
	 */
	this.fromImageElement = function (selector) {
		console.log( "Creating texture canvas from image element:", selector );

		const img = document.querySelector( selector );

		const width  = img.naturalWidth;
		const height = img.naturalHeight;

		const canvas = document.createElement( "canvas" );
		canvas.setAttribute( 'width',  canvas.width  = width  );
		canvas.setAttribute( 'height', canvas.height = height );

		const ctx = canvas.getContext( "2d" );
		ctx.drawImage( img, 0, 0 );

		return canvas;

	}; // fromImageElement

}; // TextureGenerator


//EOF