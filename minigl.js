// minigl.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MINIGL - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

export const MINIGL_VERSION = '0.0.6a';

import * as Helpers from './minigl_helpers.js';
import * as VMath   from './vector_math.js';

import { PI, TAU, RtoD, DtoR }          from './vector_math.js';
import { X, Y, Z, W, AXES, R, G, B, A } from './vector_math.js';

import { DebugMenu           } from './debug_menu.js';
import { DebugOverlay        } from './debug_overlay.js';
import { PerformanceAnalyser } from './performance_analyser.js';
import { Camera              } from './camera.js';
import { Primitives          } from './primitives.js';
import { TextureGenerator    } from './texture_generator.js';

import * as DirectionalLight from './renderer_directional_light.js';
import * as RadialLight      from './renderer_radial_light.js';


// Disable the logo by setting 'showLogo:false' when creating the MiniGL instance.
const MINIGL_LOGO_FADE_TIME = 250;
const MINIGL_LOGO_SHOW_TIME = 500;
const MINIGL_LOGO_DATA_URI
= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATMAAACpCAMAAABwDCr9AAAAM1BMVEUQb+8AAAAAJTsvMS8AUntJT08Ac4YBdKlnaWcRi'
+ 'M4Lo7oXm/qNj4wAyfaoq6jCxsP///+I+lyqAAAAAXRSTlMAQObYZgAACNNJREFUeNrt3YmSmzAMANAYYxBEa/L/X1vJV7iPBNJApJl2tuk207y1ZWEr'
+ '5HaTkJCQkJA4XaAQiJmYiZmYiZmEmImZmImZmEmImZiJmZiJmYSYiZmYiZmYSYiZmImZmImZhJiJmZiJmZhJiNnOZlZ4tpk1KGRPjDVmItadcXbRrMF'
+ 'GnHoi82ZWxMaSWDNtJmKL8xNFbDUajplZqdbWFBktJRSxdUkN08IgYmuTGko5trnoQBHbnNRQxDajoRQX+12jS8gw20vM8i/JZhsWTevnZiPTc5OYz2'
+ 'eCtupqs3uNfsmkhvuKAfae+YpJbUczC2B03+yKSQ13FVMKh8+MYjYnprKS5mf/ma+W1HYxQxJTLJZXVa7V4JkvltTeN6PiogEGK4rqfr/namh2saSG7'
+ '4vR74bE6vrvPmV2rfmJO4jdblDUfxQzZlean/iWWBw8TozNqiqbMLvQocDrL6R1+Iae7K+qynLazOCPm7XFdOHE6pIj02bkmQEbVAaaHzbrHPAaxWZV'
+ '6QMGz8xnm6DRgtJgf9Wsl5mMyjmTebJ85DqAvFBh06DWgD9pNjgYIbO7N8vzzHSfmS8KUGmamdg8GmvUYlLDy5mNHSUFs5zEMtU3UzwpNT4eTfOg32A'
+ 'xqV3NbPzwzZlVDEYxMFNAk9Ky14N/4/lpf8dsqt8O4MazksU03EbMvJcbaI/HUlK7ktlsLxT0wXpmjNY0Xq3hpNb8gNlC9xiXETj2zMkshEODufl5Fb'
+ 'PFfrsuWBM3iIZmXm1ufl7DbGu/Xdh0RMNrptE9szg/p9CuYLaxTwWBqKKZMrRm9s3i/JxIaqc329bZYxG0WwxaZrEwa/pqaMaT2snNtokFsIGZQ4taF'
+ 'u1zqMHYrD+12SaxCJZxZTswS2KNBUhqsbHvMmYbxGwCy/OyyqfNLCDSagppqN1G9rxPa8bDYesIK4o6nKGMm/EgU8aQWRpqfOnZ3/M+qRkNHOgV9ZPh'
+ 'z+jcCUo6Dxg14x8D82pGC0MNfM/t+c04MZusLNf95zXNSA82a+YGGdBjWmk/1PhRvzHUXQlOaObbEwmhylaaFQHsaaYGZrRcOjP/qFOzyezW2R46nRn'
+ '6PGZ5r3qt2ZNsxgz4pD1dH7Bay4z/dFKzBl3TBT1W8xFSNn9pNDC7+5g00yr+Q/pSazYLCw1ga8k5k5lrIaBqgV4w1HyGZEbXU05IHTNN3+wWzGiWLZ'
+ 'o5NV48wT/Cu5IQi47zmLn9RFtUVU7DC8p7WZYjuxfc+kMpv+dYFPm9ZaZWmPFGJaGBRwOubyEktbOYhY5OQ/OLz42AKtMcRsGoCKvrQvfKjWRWVdWCW'
+ 'TqzciUHmGBG15+hz/scZml3jMz86LI0waAL5oqwUFQUasKMz56yeTNQoRUSTcuMarUmVGpnMMPUA2vr+z0k/vZCxsmnXYSRWXcQ8vmmXwNWmSmvhppL'
+ 'jmTWxJbl7zfjkr8orM9Lf8msW+inARaCZLR62Yy/0gHP/7jYzIZC5OvfUEzJBXNKUP6nTWYjBYbhDJa43ALpZKbMFvIZaL4k4GKDL7rCuslmJi5G3y5'
+ '2Y7O/v5y/4pa7MmsNQD89TbfMD2Z5jq+aud009Bf2ODD75paruNeDVMBWTGVbZn53B9tmrWqCV0eySUNtu5lTM6PjjN/42Xy1GP8XebWkUQNcmDozBi'
+ 'vyMnuadbjCUHvPjB+2cQ3tmX1lS2R7P5GwKI2Vxg0zb2Y45dO1UzKrohcfl+9hFtgao82Y2fcltW4LgTPjbouWmZuNPTPnxWviLmZhn7ZVa3TMvqxK6'
+ 'x/vBrOycBPQm3mBvGPmaghNL7x0OlvNEFOtwU1V4fQJJ82+KKnZke13cK+2fprZ0LTeMzM8o0HVr5i5oaa9mQH0e9tNMz3OviapjbUQJDN6wXHdNCU/'
+ '0pmbVVgStpjx+fDznM66XgRfytIVAC6ZfUVSG6+ww9zkNTOvghmUfwnJm1E2e8HMbR7FMcVmxlh/Kaa04Rk6a/b/k9rU0ZtfN/OSflFKC2b1bmZI89M'
+ 'mM63i9bnSj2Wz/5vUpq/iohkZHWvG64BJb1WEVWb/8XZWdrZFDvg6ICODg81YLXUg4zqz/zU/539WweyW3/TrZtmsGT7NCMlfxq42+x/zc6mFIJoZKv'
+ '+nzP7eMtNAxUUrpWnucoTVZp8uOlY0XUSz25FmEIaaO9jyOxrrzT5adKxqU3mawRFmloyeZh4OGW6D2eeS2srGnoPN3DZJ2yxsaSBsMftMUlt979zjz'
+ 'W6u49jaltkjXFGtNvtAUttwX9NPmPl1wL5jdnRS23Qn2P3NsiwbmJlk9uxC3mZ2aFLbWDpvNMMxs6xom1HQTLSt1wjPPr1ubDI7LKltvoPi+2a2dlG6'
+ 'U4LwJk4qKLpvOqRaliHtjJnWZuFM+Iik9so9J18xa5+hgCn8iWc7uM+lZ+bLNA7ro2/mOm2NMfON5F8gNmfmD8ux5rOBsmMWXfgBrVaZmdATGsPrPfu'
+ 'C/HWC7dzY6vCk9up9TTtmlX9rdO1uYODQUIe35kczvWyWu7Wza4YwFqF1A+xz7C31Pu+X1F7/KAO80TiKZnxATl/QZPS3MBgzKyh1cZ5PZnldF3mMzM'
+ 'fAzM1ijo5Z7HNsjb3FfvGdtofeuc08mtrr8L1Ycm9Gih7AjasiCAWzrCiiizdTmRqLgRm6Xe0Yzi/8jR4yHjw/37sxPxo24ZcPGWNwm2McL9wmqhNCM'
+ 'GuxBDO13qwb0Uy1HNfcuOTd+fnuRxmg+4/y8mXiVyYFN1W1/5Rm2POB9p87MZxkg28Z/Ys1o2ghd6PE1jg8HR53RYJH/rMXZ9c+C8hJzV569XvdZv6s'
+ 'ZrvcTeXnzDbNz10/yuDEZuuv2Xf+8Iczm628Zt/9895Obbbmuw/4LK6Tmy0ltUM+vezsZrNJ7aB2j9ObTSe1wz715/xmU0ei9tte2VeZfboP5hJmH+6'
+ 'DuYbZTcaZmImZmImZmImZmImZmInZmX8aYiZmYiZmP7S6iJmEmImZmImZmEmImZiJmZhJSEhISEiE+AePXs0ezybpNQAAAABJRU5ErkJggg=='
;


/**
 * body.onload()
 * Install CSS rules for pixel zoom  in a <style> element shared by all modules
 */
addEventListener( 'load', ()=>{
	// Get or create <style> element
	let style_element = document.querySelector( '#minigl_styles' ) || document.createElement( 'style' );
	if (style_element.innerHTML.indexOf( 'minigl.js' ) >= 0) return;
	style_element.id = 'minigl_styles';

	style_element.innerHTML += `
		/* Inserted by minigl.js */
		.minigl { position:relative; overflow:hidden; }
		.minigl :focus { outline:none; }
		.minigl .hidden { display:none; }
		.minigl canvas { position:absolute; top:0; left:0; }
		.minigl canvas.pixelated {
		        image-rendering: optimizeSpeed;             /* Older versions of FF          */
		        image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
		        image-rendering: -webkit-optimize-contrast; /* Safari                        */
		        image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
		        image-rendering: pixelated;                 /* Sane browsers                 */
		 -ms-interpolation-mode: nearest-neighbor;          /* IE                            */
		}
		.minigl.logo::before {
			content:''; position:absolute; z-index:999; top:0; left:0; width:100%; height:100%;
			background:#c0c8d0 url("${MINIGL_LOGO_DATA_URI}") center no-repeat;
			opacity:0; transition:opacity ${MINIGL_LOGO_FADE_TIME}ms ease-in-out;
		}
		.minigl.logo.visible::before { opacity:1; }
		.minigl.debug { pointer-events:none; }
	`.trim().replace( /\t/g, '' ) + '\n';

	document.querySelector( 'head' ).appendChild( style_element );
});



/**
 * MiniGL
 */
export const MiniGL = function (parameters) {
	const minigl = this;

	this.instanceName;       // Keeping track of exit'ed instances in window.miniglInstances
	this.containerElement;   // "Viewport"; <body> or a <div>
	this.callbacks;          // Event handlers

	this.canvas;             // WebGL drawing surface
	this.context;            // WebGL drawing surface
	this.maxX;               // Context resolution, MiniGL maintains these on resize
	this.maxY;
	this.midX;
	this.midY;

	this.clearColor;         // Background color. Set to [0,0,0,0] if you want transparency
	this.antiAlias;          // Set to false, for nicer effect with pixel size > 1
	this.pixelSize;          // Zoom pixels for retro feel
	this.limitFPS;           // false or desired frames/second rate
	this.light;              // Color, position
	this.camera;             // Offers methods to move about

	this.renderContinuous;   // Wether to constantly render, or wait for  .requestUpdate()  calls
	this.running;            // Signals the render loop to terminate, when  .exit()  is called
	this.totalFrames;        // Nr. of frames rendered since start

	this.keyboardControls    // True: Enable keyboard commands for the camera
	this.mouseControls;      // True: Enable camera mouse controls
	this.mirrorMouseX;
	this.mirrorMouseY;

	this.custom;             // The application may store special items in this object

	this.debug = {
		checkGLErrors : !false,
		webGL0        : !false,
		webGL1        : !false,
	};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// WEB GL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * minigl.checkGLErrors()
	 */
	const gl_error_messages = {
		0     : 'gl.NO_ERROR: No error has been recorded. The value of this constant is 0.',
		1280  : 'gl.INVALID_ENUM: An unacceptable value has been specified for an enumerated argument. The command is ignored and the error flag is set.',
		1281  : 'gl.INVALID_VALUE: A numeric argument is out of range. The command is ignored and the error flag is set.',
		1282  : 'gl.INVALID_OPERATION: The specified command is not allowed for the current state. The command is ignored and the error flag is set.',
		1286  : 'gl.INVALID_FRAMEBUFFER_OPERATION: The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.',
		1285  : 'gl.OUT_OF_MEMORY: Not enough memory is left to execute the command.',
		37442 : 'gl.CONTEXT_LOST_WEBGL: If the WebGL context is lost, this error is returned on the first call to getError. Afterwards and until the context has been restored, it returns gl.NO_ERROR.',
	};

	this.checkGLErrors = function (gl_context, location_id) {
		if (! minigl.debug.checkGLErrors) return;

		const error = gl_context.getError();
		if (error != 0) {
			const message
			= ((gl_error_messages[error] == undefined) ? 'Unknown Error' : gl_error_messages[error])
			.replace( 'The command is ignored', '\nThe command is ignored' )
			;
			throw new Error( "GL ERROR " + error + " @ " + location_id + '\n' + message );
		}

	}; // checkGLError


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// SHADER HANDLING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * load_shader()
	 */
	function load_shader (gl, type, source) {
		const shader = gl.createShader( type );
		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if (! gl.getShaderParameter( shader, gl.COMPILE_STATUS )) {
			const compile_result = gl.getShaderInfoLog( shader )
			gl.deleteShader( shader );
			throw new Error( 'Error while compiling shader program: ' + compile_result );
		}

		return shader;

	} // load_shader


	/**
	 * create_shader_program()
	 */
	function create_shader_program( gl_context, vertex_shader_source, fragment_shader_source ) {
		const gl = gl_context;

		function remove_comments (string) {
			const lines = string.split( '\n' );
			const result = [];
			lines.forEach( (line, index)=>{
				if (line.substr( 0, 2 ) != '//') {
					result.push( (index+1) + '\t' + line );
				}
			});
			return result.join( '\n' );
		}

		console.groupCollapsed( 'Compiling vertex shader' );
		console.log( remove_comments( vertex_shader_source ) );
		console.groupEnd();
		const vertex_shader = load_shader( gl, gl.VERTEX_SHADER, vertex_shader_source );

		console.groupCollapsed( 'Compiling fragment shader' );
		console.log( remove_comments( fragment_shader_source ) );
		console.groupEnd();
		const fragment_shader = load_shader( gl, gl.FRAGMENT_SHADER, fragment_shader_source );

		const shader_program = gl.createProgram();
		gl.attachShader( shader_program, vertex_shader   );
		gl.attachShader( shader_program, fragment_shader );

		console.log( 'Linking shader program' );
		gl.linkProgram( shader_program );
		if (! gl.getProgramParameter( shader_program, gl.LINK_STATUS )) {
			const link_result = gl.getProgramInfoLog( shader_program );
			throw new Error( 'Error while linking shader program: ' + link_result );
		}

		return shader_program;

	} // create_shader_program


	/**
	 * compile_shaders()
	 */
	this.compileShaders = function (gl_context, shader_sources, cb_attributes, cb_uniforms) {
		const gl = gl_context;

		console.groupCollapsed( 'Compiling shader "' + shader_sources.name + '"' );

		const vertex_shader_source   = shader_sources.vertex;
		const fragment_shader_source = shader_sources.fragment;

		const program = create_shader_program( gl, vertex_shader_source, fragment_shader_source );

		console.log( 'Gathering pointers' );

		const shader = {
			name             : shader_sources.name,
			program          : program,
			attribLocations  : cb_attributes( program ),
			uniformLocations : cb_uniforms( program ),
		};

		console.log( 'Program', shader.program );
		console.log( 'Attribute locations:', shader.attribLocations );
		console.log( 'Uniform locations:', shader.uniformLocations );

		console.groupEnd();

		return shader;

	} // compile_shaders


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MESH BUFFERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * meshBuffers()
	 */
	this.meshBuffers = function (primitive_name, new_data) {
		const gl = minigl.context;

		const data = {
			positions     : [],
			points        : [],
			lines         : [],
			triangles     : [],
			normals       : [],
			colors        : [],
			textureCoords : [],
		};

		if (new_data !== null) {
			if (new_data.positions     !== undefined) data.positions     = new_data.positions;
			if (new_data.points        !== undefined) data.points        = new_data.points;
			if (new_data.lines         !== undefined) data.lines         = new_data.lines;
			if (new_data.triangles     !== undefined) data.triangles     = new_data.triangles;
			if (new_data.normals       !== undefined) data.normals       = new_data.normals;
			if (new_data.colors        !== undefined) data.colors        = new_data.colors;
			if (new_data.textureCoords !== undefined) data.textureCoords = new_data.textureCoords;
			if (new_data.drawMode      !== undefined) data.drawMode      = new_data.drawMode;
		}

		if (data.positions.length == 0) throw new Error( 'No positions given' );

		var position_buffer, point_index_buffer, line_index_buffer, triangle_index_buffer;
		var color_buffer, normal_buffer, tex_coord_buffer;

		//...gl.deleteBuffer()

		if (data.normals.length == 0) {
			for (let i = 0; i < data.positions.length; i+=3) {
				data.normals.push(
					get_face_normal(
						data.positions[i    ],
						data.positions[i + 1],
						data.positions[i + 2],
					)
				);
			}
		}

		position_buffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, position_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.positions ), gl.STATIC_DRAW );

		if (data.points.length > 0) {
			point_index_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, point_index_buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data.points ), gl.STATIC_DRAW );
		}
		if (data.lines.length > 0) {
			line_index_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, line_index_buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data.lines ), gl.STATIC_DRAW );
		}
		if (data.triangles !== undefined) {
			triangle_index_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, triangle_index_buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( data.triangles ), gl.STATIC_DRAW );
		}

		if (data.colors.length > 0) {
			color_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, color_buffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.colors ), gl.STATIC_DRAW );
		}

		normal_buffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, normal_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.normals ), gl.STATIC_DRAW );

		tex_coord_buffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, tex_coord_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( data.textureCoords ), gl.STATIC_DRAW );

		const buffers = {
			name          : primitive_name,
			position      : position_buffer,
			points        : point_index_buffer,
			lines         : line_index_buffer,
			triangles     : triangle_index_buffer,
			colors        : color_buffer,
			normal        : normal_buffer,
			textureCoords : tex_coord_buffer,
			nrPoints      : data.points.length,
			nrLines       : data.lines.length,
			nrTriangles   : data.triangles.length,
			drawMode      : data.drawMode,
		};

		if (minigl.debug.webGL0) {
			console.groupCollapsed(
				'New primitive "' + primitive_name + '":',
				buffers.nrPoints + ' points,',
				buffers.nrLines  + ' lines,',
				buffers.nrTriangles + ' triangles.',
			);
			console.log( 'positions:',     data.positions );
			console.log( 'triangles:',     data.triangles );
			console.log( 'lines:',         data.lines );
			console.log( 'colors:',        data.colors );
			console.log( 'normals:',       data.normals );
			console.log( 'textureCoords:', data.textureCoords );
		}
		if (minigl.debug.webGL1) {
			console.groupCollapsed( 'Mesh data' );
			console.log( data );
			console.groupEnd();
		}
		if (minigl.debug.webGL0) {
			console.groupEnd();
		}

		return buffers;

	}; // meshBuffers


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// TEXTURES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * textureFromCanvas()
	 */
	this.textureFromCanvas = function (canvas, definition) {
		if (definition == undefined) definition = {
			filterMax: 9999,
		};

		const gl = minigl.context;

		minigl.checkGLErrors( gl, 'BEGIN createCanvasTexture' );

		const texture = gl.createTexture();
		gl.bindTexture( gl.TEXTURE_2D, texture );


		/**
		 * set_anisotropic_filter()
		 */
		function set_anisotropic_filter (gl_context, requested_value) {
			const gl = gl_context;

			if (requested_value !== null) {
				const filter_max = requested_value;

				const extension = (
					gl.getExtension( "EXT_texture_filter_anisotropic" )
					|| gl.getExtension( "MOZ_EXT_texture_filter_anisotropic" )
					|| gl.getExtension( "WEBKIT_EXT_texture_filter_anisotropic" )
				);

				if (extension){
					const max = Math.min(
						filter_max,
						gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT )
					);
					gl.texParameterf( gl.TEXTURE_2D, extension.TEXTURE_MAX_ANISOTROPY_EXT, max );
					if (minigl.debug.webGL1) console.log( "Setting anisotropic filtering to " + max );
				} else {
					if (minigl.debug.webGL1) console.log(
						"Anisotropic filtering requested ("
						+ filter_max
						+ "), but extension not available"
					);
				}
			}

		} // set_anisotropic_filter


		set_anisotropic_filter( gl, definition.filterMax );

		const level          = 0;
		const internalFormat = gl.RGBA;
		const width          = canvas.width;
		const height         = canvas.height;
		const border         = 0;
		const src_format     = gl.RGBA;
		const src_type       = gl.UNSIGNED_BYTE;

		minigl.checkGLErrors( gl, 'createCanvasTexture: BEFORE gl.texImage2D()' );

		gl.texImage2D(
			gl.TEXTURE_2D,
			level,
			internalFormat,
			src_format,
			src_type,
			canvas
		);

		minigl.checkGLErrors( gl, 'createCanvasTexture: AFTER gl.texImage2D()' );

		if (Helpers.isPowerOf2( canvas.width ) && Helpers.isPowerOf2( canvas.height )) {
			// Yes, it's a power of 2. Generate mips.
			if (minigl.debug.webGL1) console.log( "Generating mipmap for ", canvas );

			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
			//gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
			gl.generateMipmap( gl.TEXTURE_2D );
		} else {
			if (minigl.debug.webGL1) console.log( "DISABLING MIPMAPS for ", canvas );

			// No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		}

		minigl.checkGLErrors( gl, 'END createCanvasTexture' );

		return texture;

	}; // createCanvasTexture


	/**
	 * generateTexture()
	 */
	this.generateTexture = new TextureGenerator( minigl );


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// RENDERER - HELPERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * initialize_viewport()
	 */
	function initialize_viewport (minigl, gl_context, shader, camera) {
		if (minigl.debug.webGL1) console.log(
			'initialize_viewport('
			+ shader.name
			+ '):'
			, minigl.maxX
			, 'x'
			, minigl.maxY
		);

		const gl = gl_context;
		const clear_color = minigl.clearColor;

		gl.useProgram( shader.program );

		gl.viewport( 0, 0, minigl.maxX, minigl.maxY );
		gl.clearColor( clear_color[R], clear_color[G], clear_color[B], clear_color[A] );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

		gl.enable   ( gl.DEPTH_TEST );
		gl.enable   ( gl.BLEND );
		gl.depthFunc( gl.LEQUAL );
		gl.blendFunc( gl.ONE, gl.ONE_MINUS_SRC_ALPHA );
		gl.disable  ( gl.DITHER );

		if (minigl.antiAlias) {
			gl.enable( gl.SAMPLE_ALPHA_TO_COVERAGE );
		} else {
			gl.disable( gl.SAMPLE_COVERAGE );
			gl.disable( gl.SAMPLE_ALPHA_TO_COVERAGE );
		}

		const projection_matrix = VMath.projection_mat4(
			minigl.maxX,
			minigl.maxY,
			camera.fov,
			camera.zNear,
			camera.zFar,
		);
		gl.uniformMatrix4fv(
			shader.uniformLocations.projectionMatrix,
			false,
			projection_matrix,
		);

		minigl.checkGLErrors( gl, 'initialize_viewport' );

		return projection_matrix;

	}; // initialize_viewport


	/**
	 * upload_vertex_data()
	 * Tell WebGL how to pull out the POSITIONS from the position buffer into the vertexPosition attribute
	 * Tell WebGL which INDICES to use for indexing the vertices
	 */
	function upload_vertex_data (minigl, gl_context, shader, entity) {
		if (minigl.debug.webGL1) console.groupCollapsed( "Uploading vertex data" );

		const gl = gl_context;

		const buffers = entity.buffers;

		const num_components = 3;
		const type           = gl.FLOAT;
		const normalize      = false;
		const stride         = 0;
		const offset         = 0;

		if (minigl.debug.webGL1) console.log( "binding position buffer:", buffers.position );

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.position );
		gl.vertexAttribPointer(
			shader.attribLocations.vertexPosition,
			num_components,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(
			shader.attribLocations.vertexPosition
		);

		if (buffers.nrPoints > 0) {
			if (minigl.debug.webGL1) console.log( "binding points index buffer:", buffers.points );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffers.points );
		}
		if (buffers.nrLines > 0) {
			if (minigl.debug.webGL1) console.log( "binding lines index buffer:", buffers.lines );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffers.lines );
		}
		if (buffers.nrTriangles > 0) {
			if (minigl.debug.webGL1) console.log( "binding triangles index buffer:", buffers.triangles );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buffers.triangles );
		}

		if (minigl.debug.webGL1) console.groupEnd();

		minigl.checkGLErrors( gl, 'upload_vertex_data' );

	}; // upload_vertex_data


	/**
	 * apply_colors()
	 */
	function apply_colors (minigl, gl_context, shader, entity) {
		const buffers = entity.buffers;

		if (minigl.debug.webGL1) console.groupCollapsed( "Uploading color data" );

		const gl = gl_context;

		const num_components = 4;
		const type           = gl.FLOAT;
		const normalize      = false;
		const stride         = 0;
		const offset         = 0;

		if (minigl.debug.webGL1) console.log( "Binding colors buffer:", buffers.colors );

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.colors );
		gl.vertexAttribPointer(
			shader.attribLocations.vertexColor,
			num_components,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(
			shader.attribLocations.vertexColor,
		);

		if (minigl.debug.webGL1) console.groupEnd();

		minigl.checkGLErrors( gl, 'apply_colors' );

	}; // apply_colors


	/**
	 * apply_lighting()
	 * Tell WebGL how to pull out the NORMALS from the normal buffer into the vertexNormal attribute
	 */
	function apply_lighting (minigl, gl_context, shader, entity, camera, light, model_view_matrix) {
		if (minigl.debug.webGL1) {
			console.groupCollapsed( "Applying lighting" );
			console.log( 'Light:', light );
			console.log( 'camera:', camera );
			console.log( 'model_view_matrix:', VMath.mat4_format(model_view_matrix) );
			console.log( "normal buffer:", entity.buffers.normal );
		}

		const gl = gl_context;

		const num_components = 3;
		const type           = gl.FLOAT;
		const normalize      = false;
		const stride         = 0;
		const offset         = 0;

		gl.bindBuffer( gl.ARRAY_BUFFER, entity.buffers.normal );
		gl.vertexAttribPointer(
			shader.attribLocations.vertexNormal,
			num_components,
			type,
			normalize,
			stride,
			offset,
		);
		gl.enableVertexAttribArray(
			shader.attribLocations.vertexNormal
		);


		// Set up normal matrix
		const normal_matrix = VMath.identity_mat4();


		switch (entity.renderer) {
		case 'codeColor':
			// Does not call  applyLighting()
		break;
		case 'directionalLight':
			gl.uniform3fv( shader.uniformLocations.ambientLightColor,      light.ambient );
			gl.uniform3fv( shader.uniformLocations.directionalLightColor,  light.color );
			gl.uniform3fv( shader.uniformLocations.directionalLightVector, light.directionalVector );

			//...
			if (entity.matrices.rotation != undefined) {
				VMath.mat4_multiply_mat4(
					normal_matrix,
					entity.matrices.rotation,
					normal_matrix,
				);
			}
		break;
		case 'radialLight':
			//...
			if (entity.matrices.rotation_0 != undefined) {
				VMath.mat4_multiply_mat4(
					normal_matrix,
					entity.matrices.rotation_0,
					normal_matrix,
				);
			}

			gl.uniform3fv( shader.uniformLocations.ambientLightColor,   light.ambient );
			gl.uniform3fv( shader.uniformLocations.radialLightColor,    light.color );
			gl.uniform3fv( shader.uniformLocations.radialLightPosition, VMath.vec3(entity.position) );
		break;
		default:
			throw new Error( 'apply_lighting(): Unknown renderer:', renderer );
		}


		// Upload normal matrix
		if (minigl.debug.webGL1) console.log(
			"Uploading normal matrix:",
			VMath.mat4_format( normal_matrix )
		);
		gl.uniformMatrix4fv(
			shader.uniformLocations.normalMatrix,
			false,
			normal_matrix,
		);

		if (minigl.debug.webGL1) console.groupEnd();

		minigl.checkGLErrors( gl, 'apply_lighting' );

	}; // apply_lighting


	/**
	 * apply_textures()
	 * Tell WebGL how to pull out the TEXTURE COORDINATES from the buffer into the  textureCoords  attribute
	 */
	function apply_textures (minigl, gl_context, shader, entity) {
		const buffers   = entity.buffers;
		const texture   = entity.textures;
		const pixelated = (entity.pixelated == undefined) ? false : entity.pixelated;

		if (minigl.debug.webGL1) {
			console.groupCollapsed( "Applying textures" );
			console.log( 'texture:', texture );
			console.log( 'buffers.textureCoords:', buffers.textureCoords );
		}

		const gl = gl_context;

		const num_components = 2;
		const type           = gl.FLOAT;
		const normalize      = false;
		const stride         = 0;
		const offset         = 0;

		gl.bindBuffer( gl.ARRAY_BUFFER, buffers.textureCoords );
		gl.vertexAttribPointer(
			shader.attribLocations.textureCoords,
			num_components,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray( shader.attribLocations.textureCoords );

		// Specify the texture to map onto the faces
		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.uniform1i( shader.uniformLocations.textureSampler, 0 );

		if (pixelated) {
			if (minigl.debug.webGL1) console.log( "Pixelated" );
			gl.texParameterf( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
			gl.texParameterf( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
		} else {
			if (minigl.debug.webGL1) console.log( "Interpolated" );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		}

		if (minigl.debug.webGL1) console.groupEnd();

		minigl.checkGLErrors( gl, 'minigl_helpers: applyTextures' );

	}; // apply_textures


	/**
	 * apply_culling()
	 */
	function apply_culling (minigl, gl_context, entity) {
		const gl = gl_context;

		if (entity.cullFaces !== false) {
			switch (entity.cullFaces) {
			case 'back'  :  gl.cullFace( gl.BACK  );  break;
			case 'front' :  gl.cullFace( gl.FRONT );  break;
			}
			gl.enable( gl.CULL_FACE );

		} else {
			gl.disable( gl.CULL_FACE );
		}

		minigl.checkGLErrors( gl, 'apply_culling' );

	} // apply_culling


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// RENDERER - MAIN
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * renderScene()
	 */
	this.renderScene = function () {
		const gl       = minigl.context;
		const camera   = minigl.camera;
		const light    = minigl.light;

		minigl.checkGLErrors( gl, 'BEGIN renderScene' );

		Object.keys( minigl.renderers ).forEach( (key)=>{
			const projection_matrix = initialize_viewport(
				minigl,
				gl,
				minigl.renderers[key].shader,
				camera,
			);

			minigl.debug.projectionMatrix = projection_matrix;
		});


		/*
		 * Render entities
		 */

		if (minigl.debug.webGL1) console.groupCollapsed( 'Rendering entities' );

		Object.keys( minigl.entities ).forEach( (key)=>{
			const entity = minigl.entities[key];
			const renderer = minigl.renderers[entity.renderer];

			if (entity.visible) {
				if (minigl.debug.webGL1) console.groupCollapsed( "Rendering entity '" + key + '"' );

				const shader = renderer.shader

				gl.useProgram( shader.program );
				minigl.checkGLErrors(
					gl,
					'renderScene: useProgram: Renderer:' + renderer.name,
				);

				if (minigl.debug.webGL0) console.log( minigl.renderers[entity.renderer] );

				// Model View Matrix

				const model_view_matrix = VMath.identity_mat4();
				Object.keys( entity.matrices ).forEach( (key)=>{
					VMath.mat4_multiply_mat4(
						model_view_matrix,
						entity.matrices[key],
						model_view_matrix,
					);
				});
				VMath.mat4_multiply_mat4(
					model_view_matrix,
					camera.matrix,
					model_view_matrix,
				);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
				//... Can I get rid of this?
				VMath.mat4_transpose( model_view_matrix, model_view_matrix );
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

				// Upload model view matrix
				gl.uniformMatrix4fv(
					shader.uniformLocations.modelViewMatrix,
					false,
					model_view_matrix,
				);
				minigl.checkGLErrors( gl, 'renderScene: modelViewMatrix' );


				// Apply Properties
				upload_vertex_data( minigl, gl, shader, entity );
				apply_colors      ( minigl, gl, shader, entity );
				apply_lighting(
					minigl,
					gl,
					shader,
					entity,
					camera,
					light,
					model_view_matrix,
				);
				apply_textures( minigl, gl, shader, entity );
				apply_culling ( minigl, gl, entity );

				if (entity.ignoreZBuffer === true) {
					gl.disable( gl.DEPTH_TEST );
				} else {
					gl.enable ( gl.DEPTH_TEST );
				}

				gl.uniform4fv( shader.uniformLocations.baseColor,      entity.color );
				gl.uniform1f ( shader.uniformLocations.ignoreLight,    entity.ignoreLight );
				gl.uniform1f ( shader.uniformLocations.ignoreTextures, entity.ignoreTextures );
				gl.uniform1f ( shader.uniformLocations.selected,       entity.selected );

				minigl.checkGLErrors( gl, 'renderScene: uniforms' );


				// Draw Entity

				const mode = entity.buffers.drawMode;
				if (entity.buffers.nrPoints > 0) {
					gl.drawElements(
						gl[mode || 'POINTS'],         // gl_mode
						entity.buffers.nrPoints,      // element count
						gl.UNSIGNED_SHORT,            // type
						0,                            // offset
					);
				}
				if (entity.buffers.nrLines > 0) {
					gl.lineWidth( entity.lineWidth || 1 );
					gl.drawElements(
						gl[mode || 'LINES'],          // gl_mode
						entity.buffers.nrLines,       // element count
						gl.UNSIGNED_SHORT,            // type
						0,                            // offset
					);
				} else {
					gl.drawElements(
						gl[mode || 'TRIANGLES'],      // gl_mode
						entity.buffers.nrTriangles,   // element count
						gl.UNSIGNED_SHORT,            // type
						0,                            // offset
					);
				}

				if (minigl.debug.webGL1) console.groupEnd();
				minigl.checkGLErrors( gl, 'renderScene: drawElements' );
			}
		});

		if (minigl.debug.webGL1) console.groupEnd();

		minigl.checkGLErrors( gl, 'END renderScene' );

		if (minigl.debug.webGL1) console.groupEnd();
		if (minigl.debug.webGL0) console.groupEnd();

	}; // renderScene


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// RENDER LOOP
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * start()
	 */
	this.start = function () {
		if (minigl.debug.webGL0) {
			console.log(
				'Starting render loop:',
				'minigl.limitFPS:', minigl.limitFPS,
				'Interval:', Math.floor( 1000 / minigl.limitFPS ),
			);
		}

		let previous_ms   = 0;
		let t_render_done = 0;

		function render_next_frame (timestamp_ms) {
			const fps_interval = Math.floor(1000 / minigl.limitFPS);
			const elapsed_ms = (previous_ms === null) ? fps_interval : timestamp_ms-previous_ms;

			if (minigl.running && minigl.limitFPS && (elapsed_ms < fps_interval)) {
				requestAnimationFrame( render_next_frame );
				return;
			}

			minigl.currentTime = timestamp_ms;
			minigl.elapsedTime = elapsed_ms;

			minigl.performanceAnalyser.storeValue( 'browser', Helpers.now() - t_render_done );

			if (minigl.callbacks.onUpdateScene) {
				const t_start = Helpers.now();
				minigl.callbacks.onUpdateScene( minigl, timestamp_ms, elapsed_ms );
				minigl.performanceAnalyser.storeValue( 'updateScene', Helpers.now() - t_start );
			}

			if (minigl.renderContinuous || minigl.updateRequested) {
				const t_start = Helpers.now();

				minigl.renderScene();

				++minigl.totalFrames;
				minigl.performanceAnalyser.storeValue( 'renderScene', Helpers.now() - t_start );
			}

			previous_ms = timestamp_ms;

			minigl.updateRequested = false;
			minigl.debug.webGL0    = false;   // Only log things for the first frame, preventing slow down
			minigl.debug.webGL1    = false;   // and keeping memory leaks in the dev console under control

			if (minigl.debug.everyFrame) {
				// Will attempt to call  minigl.callbacks.onUpdateDebug() :
				minigl.debugOverlay.update();
			}

			if (minigl.running) {
				requestAnimationFrame( render_next_frame );
			}

			minigl.performanceAnalyser.storeValue( 'fps', 1000/elapsed_ms );

			t_render_done = Helpers.now();

		} // render

		minigl.totalFrames = 0;
		minigl.statUpdateTimer = setInterval( ()=>{
			if (! minigl.debug.everyFrame) {
				// Will attempt to call  minigl.callbacks.onUpdateDebug() :
				minigl.debugOverlay.update();
			}

			if (minigl.callbacks.onUpdateStats) {
				minigl.callbacks.onUpdateStats( minigl );
			}

			if (minigl.debug.inDocumentTitle) {
				const fps = minigl.performanceAnalyser.graphs.fps.average.toPrecision(2);
				document.title = minigl.documentTitle + ' [' + fps + ' f/s]';
			}
		}, 1000 );

		minigl.running = true;

		requestAnimationFrame( render_next_frame );    // Start render loop
		minigl.requestUpdate();

	}; // start


	/**
	 * stop()
	 */
	this.stop = function () {
		clearInterval( minigl.statUpdateTimer );
		minigl.running = false;
		console.log( 'MiniGL render loop stopped.' );

	}; // stop


	/**
	 * requestUpdate()
	 */
	this.requestUpdate = function () {
		minigl.updateRequested = true;

	}; // requestUpdateconsole


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MISCELLANEOUS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * eat_event()
	 */
	function eat_event (event) {
		event.stopPropagation();
		event.preventDefault();
		return false;

	} // eat_event


	/**
	 * update_screen_midmax()
	 */
	function update_screen_midmax () {
		minigl.maxX = minigl.containerElement.offsetWidth;
		minigl.maxY = minigl.containerElement.offsetHeight;
		minigl.midX = Math.floor( minigl.maxX / 2 );
		minigl.midY = Math.floor( minigl.maxY / 2 );

	} // update_screen_midmax


	/**
	 * toggleFPSLimit()
	 */
	this.toggleFPSLimit = function () {
		const limits    = [false, 10, 30]; //, 45, 60];
		const current   = Math.max( 0, limits.indexOf(minigl.limitFPS) );
		minigl.limitFPS = limits[ (current + 1) % limits.length ];

	}; // toggleFPSLimit


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MOUSE CONTROL
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * on_context_menu()
	 */
	function on_context_menu (event) {
		if (event.altKey) return;
		if ((! minigl.mouseControls) || (event.target.tagName != 'CANVAS'))return;
		return eat_event( event );

	} // on_context_menu


	/**
	 * on_start_pan()
	 */
	function on_start_pan (event) {
		if (! minigl.mouseControls) return;

		let prev_mouse_x = event.screenX;
		let prev_mouse_y = event.screenY;

		function on_mouse_move (event) {
			const shift = event.shiftKey;
			const ctrl  = event.ctrlKey;
			const alt   = event.altKey;

			const delta_x = (event.screenX - prev_mouse_x) / minigl.maxX;
			const delta_y = (event.screenY - prev_mouse_y) / minigl.maxY;
			prev_mouse_x = event.screenX;
			prev_mouse_y = event.screenY;

			const mirror_x = (minigl.mirrorMouseX) ? -1 : 1;
			const mirror_y = (minigl.mirrorMouseY) ? -1 : 1;

			const fine_tune = (shift) ? 0.1 : 1;
			let angle_x = fine_tune * mirror_x * delta_x * 360 * DtoR;
			let angle_y = fine_tune * mirror_y * delta_y * 360 * DtoR;

			if (ctrl) {
				if (Math.abs(angle_x) > Math.abs(angle_y)) {
					angle_y = 0;
				} else {
					angle_x = 0;
				}
			}

			const camera = minigl.camera;

			switch (minigl.mouseMode) {
			case 'rotate_absolute':
				camera.rotateAbsolute( angle_y, angle_x, 0 );
			break;
			case 'rotate_relative':
				camera.rotateRelative( angle_y, angle_x, 0 );
			break;
			case 'orbit_axis':
				camera.orbitAxis( camera.vectorUp, angle_x );
				camera.orbitAxis( AXES[X], angle_y );
			break;
			case 'orbit_target':
				camera.orbitTarget( [0,0,0], angle_x, angle_y );
			break;
			}

			minigl.requestUpdate();
		}

		function on_mouse_up (event) {
			removeEventListener( 'mousemove', on_mouse_move );
			removeEventListener( 'mouseup', on_mouse_up );
			document.body.classList.remove( 'no_user_select' );
		}

		addEventListener( 'mousemove', on_mouse_move );
		addEventListener( 'mouseup', on_mouse_up );
		document.body.classList.add( 'no_user_select' );

	} // on_start_pan


	/**
	 * on_mouse_down()
	 */
	function on_mouse_down (event) {
		if (! minigl.mouseControls) return;

		switch (event.button) {
		//case 0:  on_select( event );      break;
		case 1:  minigl.camera.reset();  minigl.requestUpdate();   break;
		case 2:  on_start_pan( event );  break;
		}

	} // on_mouse_down


	/**
	 * on_mouse_wheel()
	 * https://stackoverflow.com/questions/25204282/mousewheel-wheel-and-dommousescroll-in-javascript
	 */
	function on_mouse_wheel (event) {
		if (! minigl.mouseControls) return;
		if (event.type != 'wheel') return;   // Check whether the wheel event is supported

		const delta = ((event.deltaY || -event.wheelDelta || event.detail) >> 10) || 1;

		const amount = (delta < 0) ? 1 : -1;

		if (event.shiftKey) {
			minigl.camera.translateAbsolute( 0, 0, amount );
		} else {
			minigl.camera.translateRelative( 0, 0, amount );
		}

		minigl.requestUpdate();

		return eat_event( event );

	}; // on_mouse_wheel


	/**
	 * on_key_up()
	 */
	function on_key_up (event) {
		if (! minigl.keyboardControls) return;

		const shift = event.shiftKey;
		const ctrl = event.ctrlKey;

		switch (event.key) {
		//case 'd':    minigl.debugOverlay.toggle();        break;
		case 'f':    minigl.toggleFPSLimit();             break;
		//case 'h':    minigl.performanceAnalyser.dump();   break;
		case 'x':    minigl.mirrorMouseX *= -1;           break;
		case 'y':    minigl.mirrorMouseY *= -1;           break;
		case 'End':  on_camera_control( 'reset_camera' ); break;
		case 'ArrowDown':
			if (ctrl)       on_camera_control( 'translate_back' );
			else if (shift) on_camera_control( 'rotate_up' );
			else            on_camera_control( 'orbit_up' );
		break;
		case 'ArrowUp':
			if (ctrl)       on_camera_control( 'translate_forward' );
			else if (shift) on_camera_control( 'rotate_down' );
			else            on_camera_control( 'orbit_down' );
		break;
		case 'ArrowLeft':
			if (ctrl)       on_camera_control( 'roll_right'  );
			else if (shift) on_camera_control( 'rotate_right' );
			else            on_camera_control( 'axis_left'  );
		break;
		case 'ArrowRight':
			if (ctrl)       on_camera_control( 'roll_left'  );
			else if (shift) on_camera_control( 'rotate_left' );
			else            on_camera_control( 'axis_right'  );
		break;
		}

		const keys = 'f x y End ArrowDown ArrowUp ArrowLeft ArrowRight'.split( ' ' );
		if (keys.indexOf( event.key ) >= 0) return eat_event( event );

	} // on_key_up


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// DOM EVENTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * on_webgl_context_lost()
	 */
	function on_webgl_context_lost (event) {
		document.title = 'PANIC!';
		console.log( event );
		throw new Error( 'WebGL context lost' );

		// Test: minigl.canvasScene.getContext('webgl').getExtension('WEBGL_lose_context').loseContext();

	} // on_webgl_context_lost


	/**
	 * on_resize()
	 */
	function on_resize () {
		update_screen_midmax();

		console.log( 'MiniGL.onResize(): Viewport size:', minigl.maxX, 'x', minigl.maxY );

		//minigl.pixels = new Uint8Array( 4 * minigl.maxX * minigl.maxY );

		minigl.containerElement.querySelectorAll( 'canvas' ).forEach( (canvas)=>{
			canvas.width  = minigl.maxX;
			canvas.height = minigl.maxY;
		});

		minigl.context = minigl.canvas.getContext(
			'webgl',
			{ antialias: minigl.antiAlias },
		);

		if (! minigl.context) {
			throw new Error( 'Unable to initialize context' );
		}

		minigl.canvas.classList.toggle( 'pixelated', !minigl.antiAlias );

		minigl.requestUpdate();

	}; // on_resize


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// PUBLISHED EVENT HANDLERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	this.onResize = on_resize;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// CONSTRUCTOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * show_logo()
	 */
	function show_logo () {
		minigl.containerElement.classList.add( 'logo' );
		return new Promise( (done)=>{
			setTimeout( ()=>{
				minigl.containerElement.classList.add( 'visible' );
				setTimeout( done, MINIGL_LOGO_FADE_TIME );
			});
		});

	} // show_logo


	/**
	 * remove_logo()
	 */
	function remove_logo () {
		return new Promise( (done)=>{
			setTimeout( ()=>{
				minigl.containerElement.classList.remove( 'visible' );
				setTimeout( ()=>{
					minigl.containerElement.classList.remove( 'logo' );
				}, MINIGL_LOGO_FADE_TIME );
				done();
			}, MINIGL_LOGO_SHOW_TIME );
		});

	} // remove_logo


	/**
	 * getOrCreateCanvas()
	 */
	this.getOrCreateCanvas = function (class_name) {
		let canvas = minigl.containerElement.querySelector( '.' + class_name );
		if (canvas == undefined) {
			canvas = document.createElement( 'canvas' )
			canvas.className = class_name;
			minigl.containerElement.appendChild( canvas );
		}

		return canvas;

	}; // getOrCreateCanvas


	/**
	 * exit()
	 */
	this.exit = function () {
		minigl.stop();
		//... free GL buffers
		if (minigl.debug.exits) console.log( minigl.getInstanceId() + '> Renderer terminating' );

	}; // exit


	/**
	 * init()
	 */
	async function init (parameters) {
		// Settings
		minigl.instanceName     = Helpers.getParam( parameters, 'instanceName'     , 'minigl'     );
		minigl.containerElement = Helpers.getParam( parameters, 'viewport'         , null         );
		minigl.callbacks        = Helpers.getParam( parameters, 'callbacks'        , {}           );
		minigl.clearColor       = Helpers.getParam( parameters, 'clearColor'       , [0,0,0, 1]   );
		minigl.antiAlias        = Helpers.getParam( parameters, 'antiAlias'        , true         );
		minigl.pixelSize        = Helpers.getParam( parameters, 'pixelSize'        , 1            );
		minigl.limitFPS         = Helpers.getParam( parameters, 'limitFPS'         , 30           );
		minigl.renderContinuous = Helpers.getParam( parameters, 'renderContinuous' , true         );
		minigl.keyboardControls = Helpers.getParam( parameters, 'keyboardControls' , false        );
		minigl.mouseControls    = Helpers.getParam( parameters, 'mouseControls'    , false        );
		minigl.mouseMode        = Helpers.getParam( parameters, 'mouseMode'        , 'orbit_axis' );
		minigl.mirrorMouseX     = Helpers.getParam( parameters, 'mirrorMouseX'     , false        );
		minigl.mirrorMouseY     = Helpers.getParam( parameters, 'mirrorMouseY'     , false        );
		minigl.showLogo         = Helpers.getParam( parameters, 'showLogo'         , true         );
		minigl.custom           = Helpers.getParam( parameters, 'custom'           , {}            );
		minigl.light            = Helpers.getParam( parameters, 'light', {
			ambientColor      : [0.1, 0.1, 0.1],
			directionalColor  : [0.9, 0.9, 0.9],
			directionalVector : [1.0, 1.0, 1.0],
			position          : [0.0, 0.0, 0.0],
		});

		minigl.debug = Helpers.getParam( parameters, 'debug', {} );
		minigl.debug.collapseInitLog = Helpers.getParam( parameters.debug, 'collapseInitLog' , true  );
		minigl.debug.exits           = Helpers.getParam( parameters.debug, 'exits'           , false );
		minigl.debug.meshCreation    = Helpers.getParam( parameters.debug, 'meshCreation'    , false );
		minigl.debug.camera          = Helpers.getParam( parameters.debug, 'camera'          , false );
		minigl.debug.cameraCollapse  = Helpers.getParam( parameters.debug, 'cameraCollapse'  , true  );
		minigl.debug.showMenu        = Helpers.getParam( parameters.debug, 'showMenu'        , false );
		minigl.debug.lockMenu        = Helpers.getParam( parameters.debug, 'lockMenu'        , false );
		minigl.debug.webGL0          = Helpers.getParam( parameters.debug, 'webGL0'          , false );
		minigl.debug.webGL1          = Helpers.getParam( parameters.debug, 'webGL1'          , false );
		minigl.debug.showOverlay     = Helpers.getParam( parameters.debug, 'showOverlay'     , false );
		minigl.debug.everyFrame      = Helpers.getParam( parameters.debug, 'everyFrame'      , false );
		minigl.debug.checkGLErrors   = Helpers.getParam( parameters.debug, 'checkGLErrors'   , false );
		minigl.debug.inDocumentTitle = Helpers.getParam( parameters.debug, 'inDocumentTitle' , false );


		if (window.miniglInstances == undefined) window.miniglInstances = {};
		if (window.miniglInstances[minigl.instanceName] == undefined) {
			window.miniglInstances = {
				[minigl.instanceName]: {
					instanceNr: 0,
				}
			};
		} else {
			window.miniglInstances[minigl.instanceName].instanceNr += 1;
		}
		minigl.instanceId
		=  minigl.instanceName
		+ '['
		+ window.miniglInstances[minigl.instanceName].instanceNr
		+ ']'
		;


		// Show logo
		minigl.containerElement.classList.add( 'minigl');
		if (minigl.showLogo) await show_logo();


		// Start debug
		const boot_message = 'Initializing MiniGL v' + MINIGL_VERSION + ', (' + minigl.instanceId + ')';
		if (minigl.debug.collapseInitLog) {
			console.groupCollapsed( boot_message );
		} else {
			console.group( boot_message );
		}
		if (parameters.debug != undefined) {
			console.log( 'Parameters:', JSON.parse(JSON.stringify( parameters )) );
		}
		console.log( 'Instance ID:', minigl.instanceId );
		console.log( 'MiniGL:', minigl );


		// Viewport
		minigl.canvas = minigl.getOrCreateCanvas( 'scene' );
		minigl.onResize();  // Adjust canvas sizes

		if (minigl.containerElement.tabIndex == undefined) {
			minigl.containerElement.tabIndex = 0;
		}


		// Renderers
		minigl.renderers = {
			directionalLight : new DirectionalLight.Renderer( minigl ),
			radialLight      : new RadialLight.Renderer( minigl ),
		};


		// Camera
		minigl.camera = new Camera( minigl, parameters.camera );


		// World
		minigl.primitives = new Primitives( minigl );
		minigl.callbacks.onInitWorld( minigl );

		if (minigl.debug.webGL1) {
			console.groupCollapsed( 'Entities' );
			console.log( minigl.entities );
			console.groupEnd();
		}


		// Debug overlay
		minigl.debugOverlay = new DebugOverlay( minigl );


		// Performance
		const draw_keys = 'fps sceneJS sceneGL debugOverlay renderScene updateScene';
		minigl.performanceAnalyser = new PerformanceAnalyser({
			nrValues : 50,
			context  : minigl.debugOverlay.context,
			drawKeys : draw_keys.split(' '),
			left     : -175,  // negative values indigate right align
			top      : 5,
			width    : 130,
			height   : 300,
			graphs: {
				fps          : { color:[255,  0,  0, 1.0], label:'f/s', lineWidth:1.5 },
				sceneJS      : { color:[255,255,  0, 1.0], scale:  5, lineDash:[1,4] },
				sceneGL      : { color:[  0,255, 64, 2.0], scale: 10 },
				debugOverlay : { color:[  0,255,255, 1.0], scale: 10 },
				browser      : { color:[  0,128,255, 2.0], scale: 10, lineDash:[6,4] },
				renderScene  : { color:[ 96,  0,255, 1.0], scale: 10, lineWidth:2 },
				updateScene  : { color:[255,  0,255, 1.5], scale: 10, lineWidth:1.5, lineDash:[2,3] },
				renderTotal  : { color:[255,128,  0, 1.0], scale: 1 },
				renderJS     : { color:[255,255,  0, 1.0], scale: 10 },
				shadowJS     : { color:[  0,255,128, 1.0], scale: 10, lineDash:[1,5] },
				shadowGL     : { color:[  0,255,255, 1.0], scale: 10, lineDash:[1,5] },
			},
		});


		// Events
		addEventListener( 'resize', on_resize );
		addEventListener( 'keyup',  on_key_up );

		minigl.canvas.addEventListener( 'webglcontextlost', on_webgl_context_lost, false );

		if (minigl.mouseControls) {
			minigl.containerElement.addEventListener( 'mousedown',      on_mouse_down );
			minigl.containerElement.addEventListener( 'contextmenu',    on_context_menu );
			minigl.containerElement.addEventListener( 'wheel',          on_mouse_wheel, {passive: false} );
			minigl.containerElement.addEventListener( 'mousewheel',     on_mouse_wheel, {passive: false} );
			minigl.containerElement.addEventListener( 'DOMMouseScroll', on_mouse_wheel, {passive: false} );
		}

		if (minigl.debug.showMenu) new DebugMenu( minigl );

		minigl.documentTitle   = document.title;
		minigl.currentTime     = 0;
		minigl.elapsedTime     = 0;
		minigl.updateRequested = false;
		minigl.running         = false;

		if (minigl.showLogo) await remove_logo();

		console.groupEnd();

		minigl.start();

	} // init


	// CONSTRUCTOR

	return init( parameters ).then( ()=>minigl );

}; // MiniGL


//EOF