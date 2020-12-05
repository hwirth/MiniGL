// 0002_helpers.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// JSynthLab - copy(l)eft 2019 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import * as VMath from '../vector_math.js';
import { PI, TAU, RtoD, DtoR }          from "../vector_math.js";
import { X, Y, Z, W, AXES, R, G, B, A } from "../vector_math.js";


function arrays_identical (a, b) {
	let identical
	=  (a instanceof Array)
	&& (b instanceof Array)
	&& (a.length == b.length)
	;

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) identical = false;
	}

	return identical;
}


function array_is_numbers (a) {
	let is_numeric = true;

	a.forEach( (value)=>{
		if (isNaN( value )) is_numeric = false;
		if (typeof value != 'number') is_numeric = false;
	});

	return is_numeric;
}


function round_vector (vector, precision = 3) {
	precision = 10**precision;
	vector.forEach( (value, index)=>{
		vector[index] =  Math.floor( value * precision ) / precision;
	});
}


export const tests = {
	'=== TEST HELPERS ===': (assert)=>assert(true),

	'arrays_identical( [1,2,3], [1,2,3] ) returns true': (assert)=>{
		assert( arrays_identical( [1,2,3], [1,2,3] ) );
	},

	'arrays_identical( [1,2,3], [4,5,6] ) returns false': (assert)=>{
		assert( !arrays_identical( [1,2,3], [4,5,6] ) );
	},

	'arrays_identical( [1,2,3], [1,2] ) returns false': (assert)=>{
		assert( !arrays_identical( [1,2,3], [1,2] ) );
	},

	'array_is_numbers( [1, 2, 3] ) returns true': (assert)=>{
		const vector = [1, 2, 3];
		assert( array_is_numbers(vector) );
	},

	'array_is_numbers( [Number.POSITIVE_INFINITY] ) returns true': (assert)=>{
		const vector = [Number.POSITIVE_INFINITY];
		assert( array_is_numbers(vector) );
	},

	'array_is_numbers( [] ) returns true': (assert)=>{
		const vector = [];
		assert( array_is_numbers(vector) );
	},

	'array_is_numbers( [null] ) returns false': (assert)=>{
		const vector = [null];
		assert( !array_is_numbers(vector) );
	},

	'array_is_numbers( [undefined variable] ) returns false': (assert)=>{
		var x;
		const vector = [x];
		assert( !array_is_numbers(vector) );
	},

	"array_is_numbers( ['2'] ) returns false": (assert)=>{
		const vector = ['2'];
		assert( !array_is_numbers(vector) );
	},

	'array_is_numbers( [{}] ) returns false': (assert)=>{
		const vector = [{}];
		assert( !array_is_numbers(vector) );
	},

	'array_is_numbers( {} ) throws error': (assert)=>{
		const vector = {};
		let success = true;

		try {
			array_is_numbers( vector );
		}
		catch (error) {
			console.log( error );
			success = false;
		}

		assert( success === false );
	},

	'round_vector() returns expected result': (assert)=>{
		const precision = 2;
		const vector = [1.23456, 2.34567, 3.45678];
		const expected = [1.23, 2.34, 3.45];

		round_vector( vector, precision );

		console.log( 'result =', VMath.vec4_format( vector ) );
		console.log( 'expected =', VMath.vec4_format( expected ) );

		assert( arrays_identical(vector, expected) );
	},



	'=== NUMERIC ===': (assert)=>assert(true),

	'identity_mat4() returns numbers': (assert)=>{
		assert( array_is_numbers( VMath.identity_mat4() ) );
	},

	'rotation_x_mat4() returns numbers': (assert)=>{
			assert( array_is_numbers( VMath.rotation_x_mat4(0) ) );
		},

	'rotation_y_mat4() returns numbers': (assert)=>{
		assert( array_is_numbers( VMath.rotation_y_mat4(0) ) );
	},

	'rotation_z_mat4() returns numbers': (assert)=>{
		assert( array_is_numbers( VMath.rotation_z_mat4(0) ) );
	},

	'translation_mat4() returns numbers': (assert)=>{
		assert( array_is_numbers( VMath.translation_mat4( [1,2,3] ) ) );
	},

	'mat4_multiply_mat4() returns numbers': (assert)=>{
		const A = VMath.identity_mat4();
		const B = VMath.identity_mat4();
		const C = VMath.identity_mat4();

		VMath.mat4_multiply_mat4( A, B, C );

		assert( array_is_numbers( A ) );
	},

	'vec4_multiply_mat4() returns numbers': (assert)=>{
		const vector = [1, 2, 3];
		const matrix = VMath.identity_mat4();

		VMath.vec4_multiply_mat4( vector, vector, matrix );

		assert( array_is_numbers( vector ) );
	},



	'=== GENERATED MATRICES ===': (assert)=>assert(true),

	'identity_mat4() returns an identity matrix': (assert)=>{
		const A = VMath.identity_mat4();
		const B = [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		];

		assert( arrays_identical( A, B ) );
	},

	'translation_mat4() returns expected matrix': (assert)=>{
		const A = VMath.translation_mat4( [11, 22, 33] );
		const B = [
			1, 0, 0, 11,
			0, 1, 0, 22,
			0, 0, 1, 33,
			0, 0, 0, 1,
		];

		console.log( 'A', VMath.mat4_format(A) );
		console.log( 'B', VMath.mat4_format(A) );

		assert( arrays_identical( A, B ) );
	},

	'mat4_transpose() returns expected matrix': (assert)=>{
		const M = [
			 1,  2,  3,  4,
			 5,  6,  7,  8,
			 9, 10, 11, 12,
			13, 14, 15, 16,
		];

		const expected = [
			1, 5,  9, 13,
			2, 6, 10, 14,
			3, 7, 11, 15,
			4, 8, 12, 16,
		];

		console.log( 'M =', M );

		VMath.mat4_transpose( M, M );

		console.log( '  result =', M );
		console.log( 'expected =', expected );

		assert( arrays_identical(M, expected) );
	},


	'=== MULTIPLICATIONS ===': (assert)=>assert(true),

	'mat4_multiply_mat4( [1..16], [17..32] ) returns expected result': (assert)=>{
		const A = [
			 1,  2,  3,  4,
			 5,  6,  7,  8,
			 9, 10, 11, 12,
			13, 14, 15, 16,
		];
		const B = [
			17, 18, 19, 20,
			21, 22, 23, 24,
			25, 26, 27, 28,
			29, 30, 31, 32,
		];
		const C = VMath.identity_mat4();

		const expected = [
			 250,  260,  270,  280,
			 618,  644,  670,  696,
			 986, 1028, 1070, 1112,
			1354, 1412, 1470, 1528,
		];

		VMath.mat4_multiply_mat4( C, A, B );

		console.log( 'A =', VMath.mat4_format( A,6 ) );
		console.log( 'B =', VMath.mat4_format( B,6 ) );
		console.log( 'C =', VMath.mat4_format( C,6 ) );
		console.log( 'expected =', VMath.mat4_format( expected,6 ) );

		assert( arrays_identical( C, expected ) );
	},

	'vec4_multiply_mat4( vector, translation_mat4( [11, 22, 33] ) ) returns translated vector': (assert)=>{
		const vector = [100,200,300];
		const matrix = VMath.translation_mat4( [11, 22, 33] );

		const expected = [
			111,
			222,
			333,
			1,
		];

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( vector, 9 );

		console.log( '  matrix =', VMath.mat4_format(matrix) );
		console.log( 'expected =', VMath.vec4_format(expected) );
		console.log( '  result =', VMath.vec4_format(vector) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( vector, translation_mat4( [-11, -22, -33 ) returns translated vector': (assert)=>{
		const vector = [100,200,300];
		const matrix = VMath.translation_mat4( [-11, -22, -33] );

		const expected = [
			89,
			178,
			267,
			1,
		];

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( vector, 9 );

		console.log( '  matrix =', VMath.mat4_format(matrix) );
		console.log( 'expected =', VMath.vec4_format(expected) );
		console.log( '  result =', VMath.vec4_format(vector) );

		assert( arrays_identical(vector, expected) );
	},



	'=== ROTATIONS ===': (assert)=>assert(true),

	/* Rotating counter-clock wise, when looking along the axis to the origin:
	 *
	 *   Initial             rot_x(+90°)  rot_y(+90°)  rot_z(+90°)
	 *
	 *     +y top             y'=-z          Y          y'=+x
	 *     |                    |            |            |
	 *     |                    |            |            |
	 *     0---+x right         0---X        0---x'=+z    0---x'=-y
	 *    /                    /            /            /
	 *   /                    /            /            /
	 *  +z front            z'=+y        z'=-x         Z
	 *  (toward screen)
	 */

	'vec4_multiply_mat4( [1,10,100], rotation_x_mat4(90°) ) returns rotated vector': (assert)=>{
		const angle = 90*DtoR;
		const vector = [1, 10, 100];
		const matrix = VMath.rotation_x_mat4( angle );

		const expected = [
			1,
			-100,
			10,
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_x_mat4(45°) ) returns rotated vector': (assert)=>{
		const angle = 45*DtoR;
		const vector = [1,10,100];
		const matrix = VMath.rotation_x_mat4( angle );

		const expected = [
			vector[X],
			vector[Y]*Math.cos( angle ) - vector[Z]*Math.sin( angle ),
			vector[Z]*Math.cos( angle ) + vector[Y]*Math.sin( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_x_mat4(10°) ) returns rotated vector': (assert)=>{
		const angle = 10*DtoR;
		const vector = [1,10,100];
		const matrix = VMath.rotation_x_mat4( angle );

console.log( 'x sin a = ' + vector[X]*Math.sin(angle) + ', x cos a = ' + vector[X]*Math.cos(angle) );
console.log( 'y sin a = ' + vector[Y]*Math.sin(angle) + ', y cos a = ' + vector[Y]*Math.cos(angle) );
console.log( 'z sin a = ' + vector[Z]*Math.sin(angle) + ', z cos a = ' + vector[Z]*Math.cos(angle) );

		const expected = [
			vector[X],
			vector[Y]*Math.cos( angle ) - vector[Z]*Math.sin( angle ),
			vector[Z]*Math.cos( angle ) + vector[Y]*Math.sin( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},



	'vec4_multiply_mat4( [1,10,100], rotation_y_mat4(90°) ) returns rotated vector': (assert)=>{
		const angle = 90*DtoR;
		const vector = [1, 10, 100];
		const matrix = VMath.rotation_y_mat4( angle );

		const expected = [
			vector[Z],
			vector[Y],
			-vector[X],
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_y_mat4(45°) ) returns rotated vector': (assert)=>{
		const angle = 45*DtoR;
		const vector = [1,10,100];
		const matrix = VMath.rotation_y_mat4( angle );

		const expected = [
			vector[X]*Math.cos( angle ) + vector[Z]*Math.sin( angle ),
			vector[Y],
			vector[Z]*Math.sin( angle ) - vector[X]*Math.cos( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_y_mat4(10°) ) returns rotated vector': (assert)=>{
		const angle = 10*DtoR;
		const vector = [1,0,0];
		const matrix = VMath.rotation_y_mat4( angle );


console.log( 'x sin a = ' + vector[X]*Math.sin(angle) + ', x cos a = ' + vector[X]*Math.cos(angle) );
console.log( 'y sin a = ' + vector[Y]*Math.sin(angle) + ', y cos a = ' + vector[Y]*Math.cos(angle) );
console.log( 'z sin a = ' + vector[Z]*Math.sin(angle) + ', z cos a = ' + vector[Z]*Math.cos(angle) );

		const expected = [
			vector[X]*Math.cos( angle ) + vector[Z]*Math.sin( angle ),
			vector[Y],
			vector[Z]*Math.cos( angle ) - vector[X]*Math.sin( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},



	'vec4_multiply_mat4( [1,10,100], rotation_z_mat4(90°) ) returns rotated vector': (assert)=>{
		const angle = 90*DtoR;
		const vector = [1, 10, 100];
		const matrix = VMath.rotation_z_mat4( angle );

		const expected = [
			-10,
			1,
			100,
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_z_mat4(45°) ) returns rotated vector': (assert)=>{
		const angle = 45*DtoR;
		const vector = [1,10,100];
		const matrix = VMath.rotation_z_mat4( angle );

		const expected = [
			vector[X]*Math.cos( angle ) - vector[Y]*Math.sin( angle ),
			vector[Y]*Math.cos( angle ) + vector[X]*Math.sin( angle ),
			vector[Z],
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'vec4_multiply_mat4( [1,10,100], rotation_z_mat4(10°) ) returns rotated vector': (assert)=>{
		const angle = 10*DtoR;
		const vector = [1,10,100];
		const matrix = VMath.rotation_z_mat4( angle );

		const expected = [
			vector[X]*Math.cos( angle ) - vector[Y]*Math.sin( angle ),
			vector[Y]*Math.cos( angle ) + vector[X]*Math.sin( angle ),
			vector[Z],
			1,
		];

		console.log( 'vector =', VMath.vec4_format( vector ) );
		console.log( ' angle =', angle );
		console.log( 'matrix =', VMath.mat4_format( matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},



	'=== ROTATION BY AXIS ===': (assert)=>assert(true),

	'rotate [1,0,0] about [0,1,0] by 10° returns rotated vector': (assert)=>{
		const vector   = [1, 0, 0];
		const axis     = [0, 1, 0];
		const angle    = 10*DtoR;

		const expected = [
			Math.cos( angle ),
			0,
			-Math.sin( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'rotate [1,0,0] about [0,0,1] by 10° returns rotated vector': (assert)=>{
		const vector   = [1, 0, 0];
		const axis     = [0, 0, 1];
		const angle    = 10*DtoR;

		const expected = [
			Math.cos( angle ),
			Math.sin( angle ),
			0,
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'rotate [0,1,0] about [1,0,0] by 10° returns rotated vector': (assert)=>{
		const vector   = [0, 1, 0];
		const axis     = [1, 0, 0];
		const angle    = 10*DtoR;

		const expected = [
			0,
			Math.cos( angle ),
			Math.sin( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'rotate [0,1,0] about [0,0,1] by 10° returns rotated vector': (assert)=>{
		const vector   = [0, 1, 0];
		const axis     = [0, 0, 1];
		const angle    = 10*DtoR;

		const expected = [
			-Math.sin( angle ),
			Math.cos( angle ),
			0,
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'rotate [0,0,1] about [1,0,0] by 10° returns rotated vector': (assert)=>{
		const vector   = [0, 0, 1];
		const axis     = [1, 0, 0];
		const angle    = 10*DtoR;

		const expected = [
			0,
			-Math.sin( angle ),
			Math.cos( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

	'rotate [0,0,1] about [0,1,0] by 10° returns rotated vector': (assert)=>{
		const vector   = [0, 0, 1];
		const axis     = [0, 1, 0];
		const angle    = 10*DtoR;

		const expected = [
			Math.sin( angle ),
			0,
			Math.cos( angle ),
			1,
		];

		console.log( 'vector =', VMath.vec3_format( vector ) );
		console.log( '  axis =', VMath.vec3_format( axis ) );
		console.log( ' angle =', angle );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			angle,
		);

		console.log( 'matrix =', VMath.mat4_format( rotation_matrix ) );

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			rotation_matrix,
		);

		round_vector( expected, 9 );
		round_vector( vector, 9 );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},



	'=== TRANSLATION ===': (assert)=>assert(true),

	'mat4_translate() returns expected result': (assert)=>{
		const vector = [1, 2, 3];
		const translation = [10, 20, 30];

		console.log( '     vector =', VMath.vec3_format( vector ) );
		console.log( 'translation =', VMath.vec3_format( translation ) );

		const expected = [11, 22, 33, 1];

		const translation_matrix = VMath.identity_mat4();
		VMath.mat4_translate(
			translation_matrix,
			translation_matrix,
			translation,
		);

		VMath.vec4_multiply_mat4(
			vector,
			vector,
			translation_matrix,
		);


		console.log( 'matrix   = ', VMath.mat4_format( translation_matrix ) );

		console.log( 'expected =', VMath.vec4_format( expected, 11 ) );
		console.log( '  result =', VMath.vec4_format( vector, 11 ) );

		assert( arrays_identical(vector, expected) );
	},

};


//EOF