// primitives.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MINIGL - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import * as VMath                       from './vector_math.js';
import { PI, TAU, RtoD, DtoR }          from './vector_math.js';
import { X, Y, Z, W, AXES, R, G, B, A } from './vector_math.js';


/**
 * Primitives()
 */
export const Primitives = function (minigl) {

//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * coordinates()
	 *
	 *     +y top
	 *     |
	 *     |
	 *     0--+x right
	 *    /
	 *   /
	 *  +z front (toward screen)
	 *
	 */
	this.coordinates = function (size = 1, background_color = [0,0,0]) {
		const positions = [
			1, 0, 0,  -1, 0, 0,
			0, 1, 0,   0,-1, 0,
			0, 0, 1,   0, 0,-1,
		];

		const indices = [
			0, 1,
			2, 3,
			4, 5,
		];

		const colors = [
			1,0,0,1,   // Red
			0,0,0,1,
			0,1,0,1,   // Green
			0,0,0,1,
			0,0,1,1,   // Blue
			0,0,0,1,
		];

		const normals = [
			 1, 1, 1,
			 1, 1, 1,
			 1, 1, 1,
			 1, 1, 1,
			 1, 1, 1,
			 1, 1, 1,
		];

		const tex_coords = [
			0, 0, 0,   1, 1, 1,
			0, 0, 0,   1, 1, 1,
			0, 0, 0,   1, 1, 1,
			0, 0, 0,   1, 1, 1,
			0, 0, 0,   1, 1, 1,
			0, 0, 0,   1, 1, 1,
		];

		return minigl.meshBuffers(
			'Coordinates',
			{
				positions     : positions,
				lines         : indices,
				colors        : colors,
				normals       : normals,
				textureCoords : tex_coords,
				drawMode      : 'LINES',
			},
		);

	}; // coordinates


//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * point()
	 */
	this.point = function (gl_context) {
		return minigl.meshBuffers(
			'Point',
			{
				positions     : [0,0,0],
				points        : [0],
				colors        : [1,1,1, 1],
				normals       : [0,0,-1],
				textureCoords : [0, 0, 1, 0, 1, 1, 1, 0],
			},
		);

	}; // point


//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * plane()
	 *
	 *     +y top
	 *     |
	 *     |
	 *     0---+x right
	 *    /
	 *   /
	 *  +z front (toward screen)
	 *
	 */
	this.plane = function (gl_context, scale = null) {

		const color = [1,1,1,1];

		scale = scale || 1;

		const vertices   = [];
		const triangles  = [];
		const normals    = [];
		const colors     = [];
		const tex_coords = [];

		var n;

		let nr_vertices = 0;


		function add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y ) {
			vertices.push(
				v0[X]*scale, v0[Y]*scale, v0[Z]*scale,
				v1[X]*scale, v1[Y]*scale, v1[Z]*scale,
				v2[X]*scale, v2[Y]*scale, v2[Z]*scale,
			);
			triangles.push( nr_vertices, nr_vertices+1, nr_vertices+2 );
			nr_vertices += 3;

			n = get_face_normal( v0, v1, v2 );
			normals.push(
				n[X], n[Y], n[Z],
				n[X], n[Y], n[Z],
				n[X], n[Y], n[Z],
			);
			colors.push(
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
			);
			tex_coords.push(
				t0x, t0y,
				t1x, t1y,
				t2x, t2y,
			);
		} // add_triangle


		/**
		 * add_rectangle()
		 */
		function add_rectangle( v0, v1, v2, v3, color, t0x, t0y, t1x, t1y, t2x, t2y, t3x, t3y ) {
			add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y );
			add_triangle( v0, v2, v3, color, t0x, t0y, t2x, t2y, t3x, t3y );

		} // add_rectangle



		add_rectangle(
			[-0.5,-0.5, 0],
			[-0.5, 0.5, 0],
			[ 0.5, 0.5, 0],
			[ 0.5,-0.5, 0],
			color,
			0, 0,
			1, 0,
			1, 1,
			0, 1,
		);

		return minigl.meshBuffers(
			'Plane',
			{
				positions     : vertices,
				triangles     : triangles,
				colors        : colors,
				normals       : normals,
				textureCoords : tex_coords,
			},
		);

	}; // plane


//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * cube()
	 *
	 *        G---------H      +y top           Eyes
	 *       /:        /|      |
	 *      / :       / |      |                     3  6
	 *     /  :      /  |      |                     | /
	 *    D---------C   |      |                     |/
	 *    |   F.....|...E      0-----+x right    5---*---2
	 *    |  :      |  /      /                     /|
	 *    | :       | /      /                     / |
	 *    |:        |/      +z front              1  4
	 *    A---------B
	 *
	 *   Triangles to be defined counter-clockwise!
	 */
	this.cube = function (size = 0.5) {
		const s = size/2;

		const positions = [
			-s, -s,  s,   // A  0 +z Front  Blue
			 s, -s,  s,   // B  1
			 s,  s,  s,   // C  2    *
			-s,  s,  s,   // D  3

			 s, -s, -s,   // E  8 +x Right  Red
			 s,  s, -s,   // H 11      *
			 s,  s,  s,   // C 10
			 s, -s,  s,   // B  9  *

			-s,  s,  s,   // D 16 Top    Green
			 s,  s,  s,   // C 17      *
			 s,  s, -s,   // H 18    *
			-s,  s, -s,   // G 19  *

			 s, -s,  s,   // B 20 -y Bottom Magenta
			-s, -s,  s,   // A 23  *   *
			-s, -s, -s,   // F 22
			 s, -s, -s,   // E 21  *   *

			-s, -s, -s,   // F 12 -x Left   Cyan
			-s, -s,  s,   // A 13  *   *
			-s,  s,  s,   // D 14    *
			-s,  s, -s,   // G 15  *   *

			 s, -s, -s,   // E  4 -z Back   Yellow
			-s, -s, -s,   // F  5  *   *
			-s,  s, -s,   // G  6  *   *
			 s,  s, -s,   // H  7  *   *
		];

		const indices = [
			 0,  1,  2,   0,  2,  3,   // Front
			 4,  5,  6,   4,  6,  7,   // Back
			 8,  9, 10,   8, 10, 11,   // Right
			12, 13, 14,  12, 14, 15,   // Left
			16, 17, 18,  16, 18, 19,   // Top
			20, 21, 22,  20, 22, 23,   // Bottom
		];

		const colors = [
			0,0,1,1,  0,0,1,1,  0,0,1,1,  0,0,1,1,   // +z Front  Blue
			1,0,0,1,  1,0,0,1,  1,0,0,1,  1,0,0,1,   // +x Right  Red
			0,1,0,1,  0,1,0,1,  0,1,0,1,  0,1,0,1,   // +y Top    Green
			1,0,1,1,  1,0,1,1,  1,0,1,1,  1,0,1,1,   // -y Bottom Magenta
			0,1,1,1,  0,1,1,1,  0,1,1,1,  0,1,1,1,   // -x Left   Cyan
			1,1,0,1,  1,1,0,1,  1,1,0,1,  1,1,0,1,   // -z Back   Yellow
		];

		const normals = [
			 0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,   // Front
			 1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,   // Right
			 0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,   // Top
			 0,-1, 0,  0,-1, 0,  0,-1, 0,  0,-1, 0,   // Bottom
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,   // Left
			 0, 0,-1,  0, 0,-1,  0, 0,-1,  0, 0,-1,   // Back
		];

		const tex_coords = [
			0/6,0,  1/6,0,  1/6,1,  0/6,1,   // Front
			1/6,0,  2/6,0,  2/6,1,  1/6,1,   // Right
			2/6,0,  3/6,0,  3/6,1,  2/6,1,   // Top
			3/6,0,  4/6,0,  4/6,1,  3/6,1,   // Bottom
			4/6,0,  5/6,0,  5/6,1,  4/6,1,   // Left
			5/6,0,  6/6,0,  6/6,1,  5/6,1,   // Back
		];

		return minigl.meshBuffers(
			'Cube',
			{
				positions     : positions,
				triangles     : indices,
				colors        : colors,
				normals       : normals,
				textureCoords : tex_coords,
			},
		);

	}; // cube

//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * sphere()
	 */
	this.sphere = function (radius = 1, facets_alpha = 4, facets_beta = 4, smooth = true) {
		const gl = minigl.context;

		const scale = [1,1,1];
		const color = [1,1,1,1];

		const vertices   = [];
		const triangles  = [];
		const normals    = [];
		const colors     = [];
		const tex_coords = [];

		var n, n1, n2, n3;

		let nr_vertices = 0;

// this.addTriangle = function (v1, v2, v3, normals = null, colors = null, tex_coords = null) {
		/**
		 * add_triangle()
		 */
		function add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y ) {
			vertices.push(
				v0[X], v0[Y], v0[Z],
				v1[X], v1[Y], v1[Z],
				v2[X], v2[Y], v2[Z],
			);
			triangles.push( nr_vertices, nr_vertices+1, nr_vertices+2 );
			nr_vertices += 3;
			if (smooth) {
				normals.push(
					v0[X], v0[Y], v0[Z],
					v1[X], v1[Y], v1[Z],
					v2[X], v2[Y], v2[Z],
				);
			} else {
				n = get_face_normal( v0, v1, v2 );
				normals.push(
					n[X], n[Y], n[Z],
					n[X], n[Y], n[Z],
					n[X], n[Y], n[Z],
				);
			}
			colors.push(
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
			);
			tex_coords.push(
				t0x, t0y,
				t1x, t1y,
				t2x, t2y,
			);
		} // add_triangle


// this.addRectangle = function (v1, v2, v3, v4, normals = null, colors = null, tex_coords = null) {
		/**
		 * add_rectangle()
		 */
		function add_rectangle( v0, v1, v2, v3, color, t0x, t0y, t1x, t1y, t2x, t2y, t3x, t3y ) {
			add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y );
			add_triangle( v0, v2, v3, color, t0x, t0y, t2x, t2y, t3x, t3y );

		} // add_rectangle


		const min_beta = -facets_beta / 4;
		const max_beta = facets_beta / 4;

		for (let beta = min_beta; beta < max_beta; ++beta) {
			const beta0_rad = (beta    ) / facets_beta * TAU;
			const beta1_rad = (beta + 1) / facets_beta * TAU;

			const h0 = Math.sin( beta0_rad ) * radius * scale[Z];
			const r0 = Math.cos( beta0_rad ) * radius;

			const h1 = Math.sin( beta1_rad ) * radius * scale[Z];
			const r1 = Math.cos( beta1_rad ) * radius;

			for (let alpha = 0; alpha < facets_alpha; ++alpha) {
				const vertices = [[], [], [], [], [], []];

				const alpha0_rad = (alpha      ) / facets_alpha * TAU;
				const alpha1_rad = (alpha + 1  ) / facets_alpha * TAU;

				vertices[0][X] = Math.cos( alpha0_rad ) * r0 * scale[X];
				vertices[0][Y] = Math.sin( alpha0_rad ) * r0 * scale[Y];
				vertices[0][Z] = h0;

				vertices[1][X] = Math.cos( alpha1_rad ) * r0 * scale[X];
				vertices[1][Y] = Math.sin( alpha1_rad ) * r0 * scale[Y];
				vertices[1][Z] = h0;

				vertices[2][X] = Math.cos( alpha1_rad ) * r1 * scale[X];
				vertices[2][Y] = Math.sin( alpha1_rad ) * r1 * scale[Y];
				vertices[2][Z] = h1;

				vertices[3][X] = Math.cos( alpha0_rad ) * r1 * scale[X];
				vertices[3][Y] = Math.sin( alpha0_rad ) * r1 * scale[Y];
				vertices[3][Z] = h1;

				const t0x =     (alpha    ) / facets_alpha;
				const t1x =     (alpha + 1) / facets_alpha;
				const t0y = 1 - (beta     ) / (facets_beta / 2) - 0.5;
				const t1y = 1 - (beta + 1 ) / (facets_beta / 2) - 0.5;

				if (r0 < 1e-9) {
					// Bottom triangles
					add_triangle(
						vertices[0],
						vertices[2],
						vertices[3],
						color,
						t0x, t0y,
						t1x, t1y,
						t0x, t1y,
					);
				}
				else if (r1 < 1e-9) {
					// Top triangles
					add_triangle(
						vertices[0],
						vertices[1],
						vertices[2],
						color,
						t0x, t0y,
						t1x, t0y,
						t1x, t1y,
					);
				}
				else {
					// Mantle
					add_rectangle(
						vertices[0],
						vertices[1],
						vertices[2],
						vertices[3],
						color,
						t0x, t0y,
						t1x, t0y,
						t1x, t1y,
						t0x, t1y,
					);
				}
			}
		}

		if (minigl.debug.meshCreation) console.groupEnd();

		return minigl.meshBuffers(
			'Cylindrical Sphere',
			{
				positions     : vertices,
				triangles     : triangles,
				normals       : normals,
				colors        : colors,
				textureCoords : tex_coords,
			},
		);

	} // sphere


//----------------------------------------------------------------------------------------------------------------119:-

	/**
	 * skySphere()
	 */
	this.skySphere = function (radius = 1e9, facets_alpha = 4, facets_beta = 4, smooth = true) {
		const gl = minigl.context;

		const scale = [1,1,1];
		const color = [1,1,1,1];

		const vertices   = [];
		const triangles  = [];
		const normals    = [];
		const colors     = [];
		const tex_coords = [];

		var n, n1, n2, n3;

		let nr_vertices = 0;


		/**
		 * add_triangle()
		 */
		function add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y ) {
			vertices.push(
				v0[X], v0[Z], v0[Y],
				v1[X], v1[Z], v1[Y],
				v2[X], v2[Z], v2[Y],
			);
			triangles.push( nr_vertices, nr_vertices+1, nr_vertices+2 );
			nr_vertices += 3;
			if (smooth) {
				normals.push(
					v0[X], v0[Z], v0[Y],
					v1[X], v1[Z], v1[Y],
					v2[X], v2[Z], v2[Y],
				);
			} else {
				n = get_face_normal( v0, v1, v2 );
				normals.push(
					n[X], n[Z], n[Y],
					n[X], n[Z], n[Y],
					n[X], n[Z], n[Y],
				);
			}
			colors.push(
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
				color[R], color[G], color[B], color[A],
			);
			tex_coords.push(
				t0x, t0y,
				t1x, t1y,
				t2x, t2y,
			);
		} // add_triangle


		/**
		 * add_rectangle()
		 */
		function add_rectangle( v0, v1, v2, v3, color, t0x, t0y, t1x, t1y, t2x, t2y, t3x, t3y ) {
			add_triangle( v0, v1, v2, color, t0x, t0y, t1x, t1y, t2x, t2y );
			add_triangle( v0, v2, v3, color, t0x, t0y, t2x, t2y, t3x, t3y );

		} // add_rectangle


		const min_beta = -facets_beta / 4;
		const max_beta = facets_beta / 4;

		for (let beta = min_beta; beta < max_beta; ++beta) {
			const beta0_rad = (beta    ) / facets_beta * TAU;
			const beta1_rad = (beta + 1) / facets_beta * TAU;

			const h0 = Math.sin( beta0_rad ) * radius * scale[Z];
			const r0 = Math.cos( beta0_rad ) * radius;

			const h1 = Math.sin( beta1_rad ) * radius * scale[Z];
			const r1 = Math.cos( beta1_rad ) * radius;

			for (let alpha = 0; alpha < facets_alpha; ++alpha) {
				const vertices = [[], [], [], [], [], []];

				const alpha0_rad = (alpha      ) / facets_alpha * TAU;
				const alpha1_rad = (alpha + 1  ) / facets_alpha * TAU;

				vertices[0][X] = Math.cos( alpha0_rad ) * r0 * scale[X];
				vertices[0][Y] = Math.sin( alpha0_rad ) * r0 * scale[Y];
				vertices[0][Z] = h0;

				vertices[1][X] = Math.cos( alpha1_rad ) * r0 * scale[X];
				vertices[1][Y] = Math.sin( alpha1_rad ) * r0 * scale[Y];
				vertices[1][Z] = h0;

				vertices[2][X] = Math.cos( alpha1_rad ) * r1 * scale[X];
				vertices[2][Y] = Math.sin( alpha1_rad ) * r1 * scale[Y];
				vertices[2][Z] = h1;

				vertices[3][X] = Math.cos( alpha0_rad ) * r1 * scale[X];
				vertices[3][Y] = Math.sin( alpha0_rad ) * r1 * scale[Y];
				vertices[3][Z] = h1;

				const t0x =     (alpha    ) / facets_alpha;
				const t1x =     (alpha + 1) / facets_alpha;
				const t0y = 1 - (beta     ) / (facets_beta / 2) - 0.5;
				const t1y = 1 - (beta + 1 ) / (facets_beta / 2) - 0.5;

				if (r0 < 1e-9) {
					// Bottom triangles
					add_triangle(
						vertices[0],
						vertices[2],
						vertices[3],
						color,
						t0x, t0y,
						t1x, t1y,
						t0x, t1y,
					);
				}
				else if (r1 < 1e-9) {
					// Top triangles
					add_triangle(
						vertices[0],
						vertices[1],
						vertices[2],
						color,
						t0x, t0y,
						t1x, t0y,
						t1x, t1y,
					);
				}
				else {
					// Mantle
					add_rectangle(
						vertices[0],
						vertices[1],
						vertices[2],
						vertices[3],
						color,
						t0x, t0y,
						t1x, t0y,
						t1x, t1y,
						t0x, t1y,
					);
				}
			}
		}

		if (minigl.debug.meshCreation) console.groupEnd();

		return minigl.meshBuffers(
			'Skybox Sphere',
			{
				positions     : vertices,
				triangles     : triangles,
				normals       : normals,
				colors        : colors,
				textureCoords : tex_coords,
			},
		);

	} // skySphere

}; // Primitives


//EOF