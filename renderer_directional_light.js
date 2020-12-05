// renderer_directional_light.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import * as Helpers  from "./minigl_helpers.js"
import * as VMath    from "./vector_math.js";

import { PI, TAU, RtoD, DtoR }          from "./vector_math.js";
import { X, Y, Z, W, AXES, R, G, B, A } from "./vector_math.js";


/**
 * Renderer()
 */
export const Renderer = function (minigl) {
	const self = this;

	this.name;
	this.shader;

	const shader_sources = {
		name: 'directionalLight',
		vertex: `
//----------------------------------------------------------------------------------------------------------------119:-
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoords;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform vec4 uBaseColor;
uniform vec3 uAmbientLightColor;
uniform vec3 uDirectionalLightColor;
uniform vec3 uDirectionalLightVector;
uniform lowp float uSelected;
uniform lowp float uIgnoreLight;
varying lowp vec4 vColor;
varying highp vec3 vLighting;
varying highp vec2 vTextureCoords;
void main (void) {
	gl_Position                   = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	vColor                        = aVertexColor * ((uSelected == 0.0) ? uBaseColor : vec4( 0,1,0,1 ));
	vTextureCoords                = aTextureCoords;
	highp vec3 light_vector       = normalize( -1.0 * uDirectionalLightVector );
	highp vec4 transformed_normal = normalize( vec4( aVertexNormal, 1.0 ) * uNormalMatrix );
	highp float directional       = max( dot( transformed_normal.xyz, light_vector ), 0.0 );

	if (uIgnoreLight == 1.0) {
		vLighting = vec3(1,1,1);
	} else {
		vLighting = uAmbientLightColor + uDirectionalLightColor * directional;
	}

	if (uSelected == 1.0) vLighting = vec3(0,2,0);
}
//----------------------------------------------------------------------------------------------------------------119:-
		`.trim(),
		fragment: `
//----------------------------------------------------------------------------------------------------------------119:-
varying lowp vec4  vColor;
varying highp vec3 vLighting;
varying highp vec2 vTextureCoords;
uniform sampler2D uTextureSampler;
uniform lowp float uIgnoreTextures;
void main (void) {
	highp vec4 texel_color = (uIgnoreTextures == 0.0) ? texture2D( uTextureSampler, vTextureCoords ) : vec4(1,1,1,1);
	gl_FragColor           = vec4( vColor.rgb * texel_color.rgb * vLighting / 2.0, vColor.a * texel_color.a);
	if (gl_FragColor.a == 0.0) discard;
}
//----------------------------------------------------------------------------------------------------------------119:-
		`.trim(),
	}; // shader_sources


	/**
	 * gather_attributes()
	 */
	function gather_attributes (program) {
		const gl = minigl.context;
		return {
			vertexPosition : gl.getAttribLocation( program, 'aVertexPosition' ),
			vertexColor    : gl.getAttribLocation( program, 'aVertexColor' ),
			vertexNormal   : gl.getAttribLocation( program, 'aVertexNormal' ),
			textureCoords  : gl.getAttribLocation( program, 'aTextureCoords' ),
		};

	} // gather_attributes


	/**
	 * gather_uniforms()
	 */
	function gather_uniforms (program) {
		const gl = minigl.context;
		return {
			projectionMatrix       : gl.getUniformLocation( program, 'uProjectionMatrix' ),
			modelViewMatrix        : gl.getUniformLocation( program, 'uModelViewMatrix' ),
			normalMatrix           : gl.getUniformLocation( program, 'uNormalMatrix' ),
			baseColor              : gl.getUniformLocation( program, 'uBaseColor' ),
			ambientLightColor      : gl.getUniformLocation( program, 'uAmbientLightColor' ),
			directionalLightColor  : gl.getUniformLocation( program, 'uDirectionalLightColor' ),
			directionalLightVector : gl.getUniformLocation( program, 'uDirectionalLightVector' ),
			ignoreLight            : gl.getUniformLocation( program, 'uIgnoreLight' ),
			ignoreTextures         : gl.getUniformLocation( program, 'uIgnoreTextures' ),
			selected               : gl.getUniformLocation( program, 'uSelected' ),
		};

	} // gather_uniforms


	/**
	 * init()
	 */
	this.init = function (new_canvas) {
		self.name = shader_sources.name;
		self.shader = minigl.compileShaders(
			minigl.context,
			shader_sources,
			gather_attributes,
			gather_uniforms,
		);

	}; // init


	// CONSTRUCTOR

	self.init();

}; // Renderer


//EOF