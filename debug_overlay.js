// debug_overlay.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import { MINIGL_VERSION } from './minigl.js';
import { RtoD }           from './vector_math.js';

import * as Helpers from './minigl_helpers.js'
import * as VMath   from './vector_math.js';


/**
 * DebugOverlay()
 */
export const DebugOverlay = function (minigl) {
	const self = this;

	this.canvas;
	this.context;
	this.text;

	this.hardwareInfo;


	/**
	 * gatherHardwareInfo()
	 */
	this.gatherHardwareInfo = function () {
		const gl = minigl.context;

		function get_unmasked_info (gl) {
			const info = {
				renderer : 'n/a',
				vendor   : 'n/a'
			};

			const render_info = gl.getExtension('WEBGL_debug_renderer_info');
			if (render_info != null) {
				info.renderer = gl.getParameter( render_info.UNMASKED_RENDERER_WEBGL );
				info.vendor   = gl.getParameter( render_info.UNMASKED_VENDOR_WEBGL );
			}

			return info;
		}

		self.hardwareInfo = [
			'renderer: ' + gl.getParameter( gl.RENDERER ) + ' / ' + get_unmasked_info( gl ).renderer,
			'  vendor: ' + gl.getParameter( gl.VENDOR ) + ' / ' + get_unmasked_info( gl ).vendor,
		];

		const memory = console.memory;
		if (memory) {
			for (const property in memory) {
				self.hardwareInfo.push( property + ': ' + Helpers.formatInteger(memory[property]) );
			}
		} else {
			self.hardwareInfo.push( 'memory: n/a' );
		}
		self.hardwareInfo.push( 'cores: ' + navigator.hardwareConcurrency );

		console.groupCollapsed( 'Performance info' );
		console.log( 'perf', performance );
		console.groupEnd();

		console.groupCollapsed( 'Hardware info' );
		console.log( 'Hardware', self.hardwareInfo );
		console.groupEnd();

		self.hardwareInfo.forEach( (line, index)=>{
			const pos = line.indexOf( ':' );
			self.hardwareInfo[index] = ' '.repeat( 15 - pos ) + line;
		});

	}; // gatherHardwareInfo


	/**
	 * print()
	 */
	this.print = function (text) {
		self.text.push( text );

	}; // print


	this.drawMarker = function (ctx, x, y, color = 'rgba(255,255,255,0.75)') {
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo( x-10, y );
		ctx.lineTo( x+10, y );
		ctx.moveTo( x, y-10 );
		ctx.lineTo( x, y+10 );
		ctx.stroke();

		ctx.strokeStyle = 'rgba(0,0,0, 0.75)';
		ctx.beginPath();
		ctx.moveTo( x- 1, y+11 );
		ctx.lineTo( x+ 1, y+11 );
		ctx.lineTo( x+ 1, y+ 1 );
		ctx.lineTo( x+11, y+ 1 );
		ctx.lineTo( x+11, y- 1 );
		ctx.lineTo( x+ 1, y- 1 );
		ctx.lineTo( x+ 1, y-11 );
		ctx.lineTo( x- 1, y-11 );
		ctx.lineTo( x- 1, y- 1 );
		ctx.lineTo( x-11, y- 1 );
		ctx.lineTo( x-11, y+ 1 );
		ctx.lineTo( x- 1, y+ 1 );
		ctx.lineTo( x- 1, y+11 );
		ctx.stroke();

	}; // drawMarker


	/**
	 * update()
	 */
	this.update = function () {
		if (! self.enabled) {
			minigl.performanceAnalyser.storeValue( 'debugOverlay', 0 );
			return;
		}

		const t_start = Helpers.now();
		const ctx = self.context;

		const default_color = '#480';
		const hilight_color = '#7b0';
		const font_size     = 10;
		const line_height   = font_size + 4;

		let x = 4;
		let y = 0;
		var formatted;

		const max_lines = Math.floor( minigl.maxY / line_height );


		function check_wrap_y ( nr_requested_lines ) {
			if (y + nr_requested_lines >= max_lines) {
				y = 9;
				x += 250;
			}
		}

		function print (line = '') {
			if (line.charAt( 0 ) == '#') {
				ctx.fillStyle = line.slice( 0, 4 );
				line = line.slice( 4 );
			} else {
				ctx.fillStyle = default_color;
			}
			ctx.fillText( line, x, ++y*line_height );
		}

		function print_matrix (matrix, caption = 'MISSING_CAPTION') {
			let line_nr = 0;
			VMath.mat4_format( matrix ).trim().split( '\n' ).forEach( (line)=>{
				const prefix = (line_nr == 0) ? caption+' ' : '';
				print( prefix + line );
				++line_nr;
			});
		}


		self.text = [];

		ctx.font = font_size + 'px monospace';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		ctx.clearRect( 0, 0, minigl.maxX+1, minigl.maxY+1 );

		self.drawMarker( ctx, minigl.midX, minigl.midY, 'rgba(255,255,255, 0.5)' );

		print( 'MiniGL v' + MINIGL_VERSION );
		print();

		self.hardwareInfo.forEach( print );
		print();

		print_matrix( minigl.debug.projectionMatrix, 'Projection' );
		print_matrix( minigl.camera.matrix, 'Camera' );

		const c = minigl.camera;
		print( hilight_color + 'Position: ' + VMath.vec3_format(c.position) );
		print( hilight_color + 'Rotation: ' + VMath.vec3_format(c.rotation) );
		print( '   vRight: ' + VMath.vec3_format(c.vectorRight) );
		print( '      vUp: ' + VMath.vec3_format(c.vectorUp) );
		print( ' vForward: ' + VMath.vec3_format(c.vectorForward) );
		print( hilight_color + 'fov: ' + (c.fov * RtoD).toPrecision(3) + ', zNear: ' + c.zNear + ', zFar: ' + c.zFar );
		print( 'mouseMode: ' + minigl.mouseMode );
		print();

		function print_time (label) {
			const key = label.trim();
			let time = minigl.performanceAnalyser.graphs[key].average.toPrecision(3);
			while (time.length < 5) time = ' ' + time;
			print( label + ': ' + time + ' ms' );
		}
		print_time( ' updateScene' );
		print_time( ' renderScene' );
		print_time( 'debugOverlay' );
		print_time( '     browser' );

		const fps = minigl.performanceAnalyser.graphs.fps.average.toPrecision(2);
		print();
		print(
			hilight_color
			+ fps
			+ ' f/s (Frame #' + minigl.totalFrames
			+ ', limit: '     + minigl.limitFPS
			+ ')'
			,
		);

		print();

		// Gather additional debug info from the application
		if (minigl.callbacks.onUpdateDebug) {
			minigl.callbacks.onUpdateDebug( minigl );
		}


		// Output all text we have so far
		self.text.forEach( (line)=>{
			check_wrap_y();
			print( line );
		});


		// Debug entities
		/*
		Object.keys( minigl.debug.matrices ).forEach( (key)=>{
			check_wrap_y( 5 );
			print_matrix( minigl.debug.matrices[key], 'Entity ' + key );
		});
		*/

		minigl.performanceAnalyser.drawGraph();
		minigl.performanceAnalyser.storeValue( 'debugOverlay', Helpers.now() - t_start );

	}; // update


	/**
	 * toggle()
	 */
	this.toggle = function (enabled = null) {
		if (enabled === null) enabled = self.canvas.classList.contains( 'hidden' );
		self.canvas.classList.toggle( 'hidden', !enabled );
		self.enabled = enabled;

	}; // toggle


	/**
	 * onResize()
	 */
	this.onResize = function () {
		self.canvas.width = minigl.maxX;
		self.canvas.height = minigl.maxY;
		self.context = self.canvas.getContext( '2d' );

	}; // onResize


	/**
	 * init();
	 */
	function init () {
		self.canvas  = minigl.getOrCreateCanvas( 'debug' );
		self.onResize();

		self.text = [];
		self.gatherHardwareInfo();

		self.enabled = minigl.debug.showOverlay;

		self.toggle( (minigl.debug.showOverlay == undefined) ? true : self.enabled );

	} // init


	// CONSTRUCTOR

	init();

}; // DebugOverlay



//EOF