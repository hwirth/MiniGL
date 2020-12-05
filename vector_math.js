// vector_math.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// BRUTE FORCE DEBUGGING
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

export const BIT_SWAP_APP_MULTIPLICATION_ORDER = 1;
export const BIT_TRANSPOSE_PERSPECTIVE_MATRIX  = 2;
export const BIT_MATRIX_ROW_MAJOR              = 4;
export const BIT_TRANSPOSE_VEC4_MULTIPLY_MAT4  = 8;
export const BIT_TRANSPOSE_MATRIX_PRODUCT      = 16;
export const BIT_TRANSPOSE_MATRIX_PRODUCT_2    = 32;
export const BIT_TRANSPOSE_MAT4_TRANSLATE      = 64;
export const BIT_TRANSPOSE_MAT4_TRANSLATE_2    = 128;
export const BIT_MAX = 256;


/**
 * CONFIGURATION - Choose, how this library does things
 */
export const CONFIGURATION = {
	SWAP_APP_MULTIPLICATION_ORDER : false,
	MATRIX_ROW_MAJOR              : true,
	TRANSPOSE: {
		MATRIX_PRODUCT        : false,
		MATRIX_PRODUCT_2      : false,
		VEC4_MULTIPLY_MAT4    : false,
		MAT4_TRANSLATE        : false,
		MAT4_TRANSLATE_2      : false,
		PERSPECTIVE_MATRIX    : true,
		APP_MODEL_VIEW        : true,
	},
};

var configuration_bits;

export function debug_configuration () {
	console.groupCollapsed( 'VMath configuration loaded:', configuration_bits );
	console.log( 'SWAP_APP_MULTIPLICATION_ORDER ' , CONFIGURATION.SWAP_APP_MULTIPLICATION_ORDER );
	console.log( 'MATRIX_ROW_MAJOR              ' , CONFIGURATION.MATRIX_ROW_MAJOR );
	console.log( 'TRANSPOSE.MATRIX_PRODUCT      ' , CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT );
	console.log( 'TRANSPOSE.MATRIX_PRODUCT_2    ' , CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2 );
	console.log( 'TRANSPOSE.VEC4_MULTIPLY_MAT4  ' , CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4 );
	console.log( 'TRANSPOSE.MAT4_TRANSLATE      ' , CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE );
	console.log( 'TRANSPOSE.MAT4_TRANSLATE_2    ' , CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2 );
	console.log( 'TRANSPOSE.PERSPECTIVE_MATRIX  ' , CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX );
	console.groupEnd();
};

export function recalc_configuration_bits () {
	configuration_bits
	= CONFIGURATION.SWAP_APP_MULTIPLICATION_ORDER * BIT_SWAP_APP_MULTIPLICATION_ORDER
	+ CONFIGURATION.MATRIX_ROW_MAJOR              * BIT_MATRIX_ROW_MAJOR
	+ CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT      * BIT_TRANSPOSE_MATRIX_PRODUCT
	+ CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2    * BIT_TRANSPOSE_MATRIX_PRODUCT_2
	+ CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4  * BIT_TRANSPOSE_VEC4_MULTIPLY_MAT4
	+ CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE      * BIT_TRANSPOSE_MAT4_TRANSLATE
	+ CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2    * BIT_TRANSPOSE_MAT4_TRANSLATE_2
	+ CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX  * BIT_TRANSPOSE_PERSPECTIVE_MATRIX
	;
	debug_configuration();
}

export function load_new_configuration (bits) {
	CONFIGURATION.SWAP_APP_MULTIPLICATION_ORDER = (0 != (bits & BIT_SWAP_APP_MULTIPLICATION_ORDER) );
	CONFIGURATION.MATRIX_ROW_MAJOR              = (0 != (bits & BIT_MATRIX_ROW_MAJOR             ) );
	CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT      = (0 != (bits & BIT_TRANSPOSE_MATRIX_PRODUCT     ) );
	CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2    = (0 != (bits & BIT_TRANSPOSE_MATRIX_PRODUCT_2   ) );
	CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4  = (0 != (bits & BIT_TRANSPOSE_VEC4_MULTIPLY_MAT4 ) );
	CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE      = (0 != (bits & BIT_TRANSPOSE_MAT4_TRANSLATE     ) );
	CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2    = (0 != (bits & BIT_TRANSPOSE_MAT4_TRANSLATE_2   ) );
	CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX  = (0 != (bits & BIT_TRANSPOSE_PERSPECTIVE_MATRIX ) );

	if (CONFIGURATION.MATRIX_ROW_MAJOR) {
		_11 =  0;   _12 =  1;   _13 =  2;   _14 =  3;
		_21 =  4;   _22 =  5;   _23 =  6;   _24 =  7;
		_31 =  8;   _32 =  9;   _33 = 10;   _34 = 11;
		_41 = 12;   _42 = 13;   _43 = 14;   _44 = 15;
	} else {
		_11 =  0;   _12 =  4;   _13 =  8;   _14 = 12;
		_21 =  1;   _22 =  5;   _23 =  9;   _24 = 13;
		_31 =  2;   _32 =  6;   _33 = 10;   _34 = 14;
		_41 =  3;   _42 =  7;   _43 = 11;   _44 = 15;
	}

	recalc_configuration_bits();
}

export function load_next_configuration (previous = false) {
	if (previous) {
		configuration_bits = (configuration_bits + BIT_MAX - 1) % BIT_MAX;
	} else {
		configuration_bits = (configuration_bits + 1) % BIT_MAX;
	}
	load_new_configuration( configuration_bits );
}

recalc_configuration_bits();
const DEFAULT_CONFIGURATION = configuration_bits;

export function reset_configuration () {
	load_new_configuration( DEFAULT_CONFIGURATION );
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// ACTUAL CONTENT OF THIS FILE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

export const PI = Math.PI;
export const TAU = PI * 2;
export const DtoR = TAU / 360;
export const RtoD = 360 / TAU;

export const X = 0;
export const Y = 1;
export const Z = 2;
export const W = 3;

export const R = 0;
export const G = 1;
export const B = 2;
export const A = 3;

export const AXES = [
	[1,0,0],
	[0,1,0],
	[0,0,1],
];


// Indices of a matrix
var _11, _12, _13, _14;
var _21, _22, _23, _24;
var _31, _32, _33, _34;
var _41, _42, _43, _44;

if (CONFIGURATION.MATRIX_ROW_MAJOR) {
	_11 =  0;   _12 =  1;   _13 =  2;   _14 =  3;
	_21 =  4;   _22 =  5;   _23 =  6;   _24 =  7;
	_31 =  8;   _32 =  9;   _33 = 10;   _34 = 11;
	_41 = 12;   _42 = 13;   _43 = 14;   _44 = 15;
} else {
	_11 =  0;   _12 =  4;   _13 =  8;   _14 = 12;
	_21 =  1;   _22 =  5;   _23 =  9;   _24 = 13;
	_31 =  2;   _32 =  6;   _33 = 10;   _34 = 14;
	_41 =  3;   _42 =  7;   _43 = 11;   _44 = 15;
}


/**
 * vec3_copy()
 */
export function vec3_copy (vec3) {
	return [vec3[0], vec3[1], vec3[2]];

} // vec3_copy


/**
 * vec3_format()
 */
export function vec3_format (vec3, precision = 3) {
	if (vec3 == undefined) return "[undefined]";

	let v1 = ((vec3[X] == undefined) ? NaN : ((vec3[X] instanceof Array) ? "array" : vec3[X].toFixed(precision)))
	let v2 = ((vec3[Y] == undefined) ? NaN : ((vec3[Y] instanceof Array) ? "array" : vec3[Y].toFixed(precision)))
	let v3 = ((vec3[Z] == undefined) ? NaN : ((vec3[Z] instanceof Array) ? "array" : vec3[Z].toFixed(precision)))

	v1 = String( v1 );
	v2 = String( v2 );
	v3 = String( v3 );

	while (v1.length < precision+3) v1 = " " + v1;
	while (v2.length < precision+3) v2 = " " + v2;
	while (v3.length < precision+3) v3 = " " + v3;

	while (v1.length > precision+3) v1 = v1.slice(0, -1);
	while (v2.length > precision+3) v2 = v2.slice(0, -1);
	while (v3.length > precision+3) v3 = v3.slice(0, -1);

	if (v1.charAt( v1.length - 1) == '.') v1 = v1.slice(0, -1) + ' ';
	if (v2.charAt( v2.length - 1) == '.') v2 = v2.slice(0, -1) + ' ';
	if (v3.charAt( v3.length - 1) == '.') v3 = v3.slice(0, -1) + ' ';

	return (
		  "[" + v1
		+ "|" + v2
		+ "|" + v3
		+ "]"
	);

} // vec3_format


/**
 * vec4_format()
 */
export function vec4_format (vec4, precision = 3) {
	if (vec4 == undefined) return "[undefined]";

	let v1 = ((vec4[X] == undefined) ? NaN : ((vec4[X] instanceof Array) ? "array" : vec4[X].toFixed(precision)))
	let v2 = ((vec4[Y] == undefined) ? NaN : ((vec4[Y] instanceof Array) ? "array" : vec4[Y].toFixed(precision)))
	let v3 = ((vec4[Z] == undefined) ? NaN : ((vec4[Z] instanceof Array) ? "array" : vec4[Z].toFixed(precision)))
	let v4 = ((vec4[W] == undefined) ? NaN : ((vec4[W] instanceof Array) ? "array" : vec4[W].toFixed(precision)))

	v1 = String( v1 );
	v2 = String( v2 );
	v3 = String( v3 );
	v4 = String( v4 );

	while (v1.length < precision+3) v1 = " " + v1;
	while (v2.length < precision+3) v2 = " " + v2;
	while (v3.length < precision+3) v3 = " " + v3;
	while (v4.length < precision+3) v4 = " " + v4;

	while (v1.length > precision+3) v1 = v1.slice(0, -1);
	while (v2.length > precision+3) v2 = v2.slice(0, -1);
	while (v3.length > precision+3) v3 = v3.slice(0, -1);
	while (v4.length > precision+3) v4 = v4.slice(0, -1);

	if (v1.charAt(v1.length - 1) == '.') v1 = v1.slice(0, -1) + ' ';
	if (v2.charAt(v2.length - 1) == '.') v2 = v2.slice(0, -1) + ' ';
	if (v3.charAt(v3.length - 1) == '.') v3 = v3.slice(0, -1) + ' ';
	if (v4.charAt(v4.length - 1) == '.') v4 = v4.slice(0, -1) + ' ';

	return (
		  "[" + v1
		+ "|" + v2
		+ "|" + v3
		+ "|" + v4
		+ "]"
	);

} // vec4_format


/**
 * mat4_format()
 */
export function mat4_format (mat4, precision = 3, caption = 'mat4') {
	if (mat4 == undefined) { return '|undefined|'; }

	function F (row, col) {
		let v = mat4[row * 4 + col];

		if (isNaN( v )) {
			v = 'NaN' + ' '.repeat( precision + 1 );
		} else {
			v = v.toFixed( precision );
		}

		if (v.charAt(0) != '-') v = ' ' + v;
		v = v.slice( 0, precision + 3 );

		return v;
	}

	return (
		((caption == '') ? '' : caption + ' =\n')
		+ '|' + F( 0, X ) + ' ' + F( 0, Y ) + ' ' + F( 0, Z ) + ' ' + F( 0, 3 ) + ' |\n'
		+ '|' + F( 1, X ) + ' ' + F( 1, Y ) + ' ' + F( 1, Z ) + ' ' + F( 1, 3 ) + ' |\n'
		+ '|' + F( 2, X ) + ' ' + F( 2, Y ) + ' ' + F( 2, Z ) + ' ' + F( 2, 3 ) + ' |\n'
		+ '|' + F( 3, X ) + ' ' + F( 3, Y ) + ' ' + F( 3, Z ) + ' ' + F( 3, 3 ) + ' |\n'
	).replace( /-0\./g, ' 0.' );//.replace( /\|/g, '' );

} // mat4_format


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// vec2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * vec2_length()
 */
export function vec2_length (vec2) {
	return Math.sqrt( vec2[0]*vec2[0] + vec2[1]*vec2[1] );

} // vec2_length


/**
 * vec2_normalize()
 */
export function vec2_normalize (vec2) {
	const length = vec2_length( vec2 );
	return [
		vec2[0] / length,
		vec2[1] / length,
	];

} // vec2_normalize;


/**
 * vec2_plus_vec2()
 */
export function vec2_plus_vec2 (vec2a, vec2b) {
	return [
		vec2a[0] + vec2b[0],
		vec2a[1] + vec2b[1],
	];

}; // vec2_plus_vec2


/**
 * vec2_minus_vec2()
 */
export function vec2_minus_vec2 (vec2a, vec2b) {
	return [
		vec2a[0] - vec2b[0],
		vec2a[1] - vec2b[1],
	];

}; // vec2_minus_vec2


/**
 * vec2_multiply_scalar()
 */
export function vec2_multiply_scalar (vec2, scalar) {
	return [
		vec2[0] * scalar,
		vec2[1] * scalar,
	];

}; // vec2_multiply_scalar


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// vec3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * vec3()
 */
export function vec3 (vec3in) {
	return [
		vec3in[X],
		vec3in[Y],
		vec3in[Z],
	];

} // vec3


/**
 * vec3_length()
 */
export function vec3_length (vec3) {
	return Math.sqrt( vec3[0]*vec3[0] + vec3[1]*vec3[1] + vec3[2]*vec3[2] );

} // ve3_length


/**
 * vec3_normalize()
 */
export function vec3_normalize (vec3) {
	const length = vec3_length( vec3 );
	return [
		vec3[0] / length,
		vec3[1] / length,
		vec3[2] / length,
	];
} // vec3_normalize;


/**
 * vec3_plus_vec3()
 */
export function vec3_plus_vec3 (vec3a, vec3b) {
	return [
		vec3a[0] + vec3b[0],
		vec3a[1] + vec3b[1],
		vec3a[2] + vec3b[2],
	];
}; // vec3_plus_vec3


/**
 * vec3_minus_vec3()
 */
export function vec3_minus_vec3 (vec3a, vec3b) {
	return [
		vec3a[0] - vec3b[0],
		vec3a[1] - vec3b[1],
		vec3a[2] - vec3b[2],
	];
}; // vec3_minus_vec3


/**
 * vec3_multiply_scalar()
 */
export function vec3_multiply_scalar (vec3, scalar) {
	return [
		vec3[0] * scalar,
		vec3[1] * scalar,
		vec3[2] * scalar,
	];

}; // vec3_multiply_scalar


/**
 * vec3_cross_vec3()
 * Right hand rule:    a x b
 *                       |
 *                       |
 *                       _
 *                      / |
 *                     |  |
 *                     |  |
 *         ____________|  |
 *  a <-- /               \____
 *        \__________
 *                 /   ____
 *                /   /    \
 *               /   /_____/
 *              /   /     \______
 *             /   /______/
 *             \__/
 *             /
 *            /
 *           b
 *
 * Calculating the normal of a triangle:
 *
 *            v1        Vertices ordered clockwise
 *     N      /\        Triangle flat on floor, N going up
 *      \   A/  \       A = v1 - v0
 *       \  /    \      B = v2 - v0
 *        \/______\
 *        v0  B   v2
 */
export function vec3_cross_vec3 (vec3a, vec3b) {
	const a = vec3a;
	const b = vec3b;
	return [
		a[Y]*b[Z] - a[Z]*b[Y],
		a[Z]*b[X] - a[X]*b[Z],
		a[X]*b[Y] - a[Y]*b[X],
	];

} // vec3_cross_vec3


/**
 * vec3_dot_vec3()
 * Dot product gives similarity between directions. Example in 2D:
 *
 *          a,b
 *        *----->    a dot b = +1
 *
 *     a     b       a dot b = -1
 *  <-----*----->
 *
 *  <-----*          a dot b = 0
 *     a  |
 *        |b
 *       \|
 *
 */
export function vec3_dot_vec3 (vec3a, vec3b) {
	const a = vec3a;
	const b = vec3b;
	return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];

} // vec3_dot_vec3


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// Plane functions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * distance_point_plane
 * plane_n must be normalized
 */
export function distance_point_plane (point, plane_p, plane_n) {
	point = vec3_normalize( point );
	return (
		  plane_n[X] * point[X]
		+ plane_n[Y] * point[Y]
		+ plane_n[Z] * point[Z]
		- vec3_dot_vec3( plane_n, plane_p )
	);

} // distance_point_plane


/**
 * vec3_intersect_plane()
 *
 *  y = C + Dy*x
 *  C = Dy*x - y
 *
 *  k = P-> + d * (dx, dy), N = P-> + d * (dy, -dx)
 *
 *
 *      Y|       /N                  xNx + yNy = C
 *  __   |      /                    xNx + yNy = PxNx + PyNy
 *    --__     /           xPx + yPy - N dot P = 0 (Defines a line)
 *      ^|--__/
 *      ||    --_.P
 *      C|      / --__
 *      ||     /      ..__
 *  ____v|____/___________--___________X
 *       |                    --__
 *       |                        --__k
 */
export function vec3_intersect_plane (plane_p, plane_n, line0, line1 ) {
	plane_n = vec3_normalize( plane_n );

	const plane_d = -vec3_dot_vec3( plane_n, plane_p );
	const ad = vec3_dot_vec3( line0, plane_n );
	const bd = vec3_dot_vec3( line1, plane_n );
	const t  = (-plane_d - ad) / (bd - ad);

	const line_01 = vec3_minus_vec3( line1, line0 );
	const v_intersect = vec3_multiply_scalar( line_01, t );
	const p_intersect = vec3_plus_vec3( line0, v_intersect );

	return {
		point : p_intersect,
		t : t,
	};

} // vec3_intersect_plane


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// mat4 Operators
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * mat4_multiply_mat4()
 *
 * https://en.wikipedia.org/wiki/Matrix_multiplication#Definition
 *
 *     | a11 a12 ... a1n |       | b11 b12 ... b1p |            | c11 c12 ... c1p |
 * A = | a21 a22 ... a2n |   B = | b21 b22 ... b2p |   C = AB = | c21 c22 ... c2p |
 *     |  |   |   \   |  |       |  |   |   \   |  |            |  |   |   \   |  |
 *     | am1 am2 ... amn |       | bn1 bn2 ... bnp |            | cm1 cm2 ... cmp |
 *
 * cij = ai1*b1j + ai2*b2j + ... + ain*bnk = Sum(k=1..n)aik*bkj for i=1..m, j=1..p
 *
 *     | a11*b11+...+a1n*bn1  a11*b12+...+a1n*bn2  ...  a11*b1p+...+a1n*bnp |
 * C = | a21*b11+...+a2n*bn1  a21*b12+...+a2n*bn2  ...  a21*b1p+...+a2n*bnp |
 *     |          |                    |            \            |          |
 *     | am1*b11+...+amn*bn1  am1*b12+...+amn*bn2  ...  am1*b1p+...+amn*bnp |
 */
export function mat4_multiply_mat4 (mat4out, mat4a, mat4b, row_major = true) {
	const temp = [[], [], [], []];

	const A = mat4a;
	const B = mat4b;

	if (! CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2) {
		temp[_11] = A[_11]*B[_11] + A[_12]*B[_21] + A[_13]*B[_31] + A[_14]*B[_41];
		temp[_12] = A[_11]*B[_12] + A[_12]*B[_22] + A[_13]*B[_32] + A[_14]*B[_42];
		temp[_13] = A[_11]*B[_13] + A[_12]*B[_23] + A[_13]*B[_33] + A[_14]*B[_43];
		temp[_14] = A[_11]*B[_14] + A[_12]*B[_24] + A[_13]*B[_34] + A[_14]*B[_44];

		temp[_21] = A[_21]*B[_11] + A[_22]*B[_21] + A[_23]*B[_31] + A[_24]*B[_41];
		temp[_22] = A[_21]*B[_12] + A[_22]*B[_22] + A[_23]*B[_32] + A[_24]*B[_42];
		temp[_23] = A[_21]*B[_13] + A[_22]*B[_23] + A[_23]*B[_33] + A[_24]*B[_43];
		temp[_24] = A[_21]*B[_14] + A[_22]*B[_24] + A[_23]*B[_34] + A[_24]*B[_44];

		temp[_31] = A[_31]*B[_11] + A[_32]*B[_21] + A[_33]*B[_31] + A[_34]*B[_41];
		temp[_32] = A[_31]*B[_12] + A[_32]*B[_22] + A[_33]*B[_32] + A[_34]*B[_42];
		temp[_33] = A[_31]*B[_13] + A[_32]*B[_23] + A[_33]*B[_33] + A[_34]*B[_43];
		temp[_34] = A[_31]*B[_14] + A[_32]*B[_24] + A[_33]*B[_34] + A[_34]*B[_44];

		temp[_41] = A[_41]*B[_11] + A[_42]*B[_21] + A[_43]*B[_31] + A[_44]*B[_41];
		temp[_42] = A[_41]*B[_12] + A[_42]*B[_22] + A[_43]*B[_32] + A[_44]*B[_42];
		temp[_43] = A[_41]*B[_13] + A[_42]*B[_23] + A[_43]*B[_33] + A[_44]*B[_43];
		temp[_44] = A[_41]*B[_14] + A[_42]*B[_24] + A[_43]*B[_34] + A[_44]*B[_44];
	} else {
		temp[_11] = A[_11]*B[_11] + A[_21]*B[_12] + A[_31]*B[_13] + A[_41]*B[_14];
		temp[_12] = A[_11]*B[_21] + A[_21]*B[_22] + A[_31]*B[_23] + A[_41]*B[_24];
		temp[_13] = A[_11]*B[_31] + A[_21]*B[_32] + A[_31]*B[_33] + A[_41]*B[_34];
		temp[_14] = A[_11]*B[_41] + A[_21]*B[_42] + A[_31]*B[_43] + A[_41]*B[_44];

		temp[_21] = A[_12]*B[_11] + A[_22]*B[_12] + A[_32]*B[_13] + A[_42]*B[_14];
		temp[_22] = A[_12]*B[_21] + A[_22]*B[_22] + A[_32]*B[_23] + A[_42]*B[_24];
		temp[_23] = A[_12]*B[_31] + A[_22]*B[_32] + A[_32]*B[_33] + A[_42]*B[_34];
		temp[_24] = A[_12]*B[_41] + A[_22]*B[_42] + A[_32]*B[_43] + A[_42]*B[_44];

		temp[_31] = A[_13]*B[_11] + A[_23]*B[_12] + A[_33]*B[_13] + A[_43]*B[_14];
		temp[_32] = A[_13]*B[_21] + A[_23]*B[_22] + A[_33]*B[_23] + A[_43]*B[_24];
		temp[_33] = A[_13]*B[_31] + A[_23]*B[_32] + A[_33]*B[_33] + A[_43]*B[_34];
		temp[_34] = A[_13]*B[_41] + A[_23]*B[_42] + A[_33]*B[_43] + A[_43]*B[_44];

		temp[_41] = A[_14]*B[_11] + A[_24]*B[_12] + A[_34]*B[_13] + A[_44]*B[_14];
		temp[_42] = A[_14]*B[_21] + A[_24]*B[_22] + A[_34]*B[_23] + A[_44]*B[_24];
		temp[_43] = A[_14]*B[_31] + A[_24]*B[_32] + A[_34]*B[_33] + A[_44]*B[_34];
		temp[_44] = A[_14]*B[_41] + A[_24]*B[_42] + A[_34]*B[_43] + A[_44]*B[_44];
	}

	if (! CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT) {
	mat4out[_11] = temp[_11];  mat4out[_12] = temp[_12];  mat4out[_13] = temp[_13];  mat4out[_14] = temp[_14];
	mat4out[_21] = temp[_21];  mat4out[_22] = temp[_22];  mat4out[_23] = temp[_23];  mat4out[_24] = temp[_24];
	mat4out[_31] = temp[_31];  mat4out[_32] = temp[_32];  mat4out[_33] = temp[_33];  mat4out[_34] = temp[_34];
	mat4out[_41] = temp[_41];  mat4out[_42] = temp[_42];  mat4out[_43] = temp[_43];  mat4out[_44] = temp[_44];
	} else {
	mat4out[_11] = temp[_11];  mat4out[_21] = temp[_12];  mat4out[_31] = temp[_13];  mat4out[_41] = temp[_14];
	mat4out[_12] = temp[_21];  mat4out[_22] = temp[_22];  mat4out[_32] = temp[_23];  mat4out[_42] = temp[_24];
	mat4out[_13] = temp[_31];  mat4out[_23] = temp[_32];  mat4out[_33] = temp[_33];  mat4out[_43] = temp[_34];
	mat4out[_14] = temp[_41];  mat4out[_24] = temp[_42];  mat4out[_34] = temp[_43];  mat4out[_44] = temp[_44];
	}

} // mat4_multiply_mat4


/**
 * vec4_multiply_mat4()
 *  |x|   |a1 a2 a3 a4|
 *  |y| * |b1 b2 b3 b4| =
 *  |z|   |c1 c2 c3 c4|
 *  |w|   |d1 d2 d3 d4|
 *
 *  = [x*a1+y*a2+z*a3+w*a4, x*b1+y*b2+z*b3+w*b4, x*c1+y*c2+z*c3+w*c4, x*d1+y*d2+z*d3+w*d4]
 *
 */
export function vec4_multiply_mat4 (vec4out, vec4in, mat4in, row_major = true) {
	let x = vec4in[0];
	let y = vec4in[1];
	let z = vec4in[2];
	let w = (vec4in[3] == undefined) ? 1 : vec4in[3];

	const M = mat4in;

	if (! CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4) {
		vec4out[X] = x*M[_11] + y*M[_12] + z*M[_13] + w*M[_14];
		vec4out[Y] = x*M[_21] + y*M[_22] + z*M[_23] + w*M[_24];
		vec4out[Z] = x*M[_31] + y*M[_32] + z*M[_33] + w*M[_34];
		vec4out[W] = x*M[_41] + y*M[_42] + z*M[_43] + w*M[_44];
	} else {
		vec4out[X] = x*M[_11] + y*M[_21] + z*M[_31] + w*M[_41];
		vec4out[Y] = x*M[_12] + y*M[_22] + z*M[_32] + w*M[_42];
		vec4out[Z] = x*M[_13] + y*M[_23] + z*M[_33] + w*M[_43];
		vec4out[W] = x*M[_14] + y*M[_24] + z*M[_34] + w*M[_44];
	}

	return vec4out;

} // vec4_multiply_mat4


/**
 * mat4_invert()
 */
export function mat4_invert (mat4) {
	return [
		mat4[0], mat4[4], mat4[ 8], 0,
		mat4[1], mat4[5], mat4[ 9], 0,
		mat4[2], mat4[6], mat4[10], 0,

			-(mat4[12] * mat4[0] + mat4[13] * mat4[4] + mat4[14] * mat4[ 8]),
			-(mat4[12] * mat4[4] + mat4[13] * mat4[5] + mat4[14] * mat4[ 9]),
			-(mat4[12] * mat4[8] + mat4[13] * mat4[6] + mat4[14] * mat4[10]),
			1,
	];

} // mat4_invert


/**
 * mat4_translate()
 */
export function mat4_translate (mat4out, mat4in, vec3in) {
	if (! CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2) {
		// Copy over parts, that stay the same
		if (mat4out !== mat4in) {
			mat4out[_11] = mat4in[_11];
			mat4out[_21] = mat4in[_21];
			mat4out[_31] = mat4in[_31];
			mat4out[_41] = mat4in[_41];

			mat4out[_12] = mat4in[_12];
			mat4out[_22] = mat4in[_22];
			mat4out[_32] = mat4in[_32];
			mat4out[_42] = mat4in[_42];

			mat4out[_13] = mat4in[_13];
			mat4out[_23] = mat4in[_23];
			mat4out[_33] = mat4in[_33];
			mat4out[_43] = mat4in[_43];
		}

		const M = mat4in;
		const v = vec3in;

		if (! CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE) {
			mat4out[_14] = M[_11]*v[X] + M[_12]*v[Y] + M[_13]*v[Z] + M[_14];
			mat4out[_24] = M[_21]*v[X] + M[_22]*v[Y] + M[_23]*v[Z] + M[_24];
			mat4out[_34] = M[_31]*v[X] + M[_32]*v[Y] + M[_33]*v[Z] + M[_43];
			mat4out[_44] = M[_41]*v[X] + M[_42]*v[Y] + M[_43]*v[Z] + M[_44];
		} else {
			mat4out[_14] = M[_11]*v[X] + M[_21]*v[Y] + M[_31]*v[Z] + M[_41];
			mat4out[_24] = M[_12]*v[X] + M[_22]*v[Y] + M[_32]*v[Z] + M[_42];
			mat4out[_34] = M[_13]*v[X] + M[_23]*v[Y] + M[_33]*v[Z] + M[_43];
			mat4out[_44] = M[_14]*v[X] + M[_24]*v[Y] + M[_34]*v[Z] + M[_44];
		}
	} else {
		// Copy over parts, that stay the same
		if (mat4out !== mat4in) {
			mat4out[_11] = mat4in[_11];
			mat4out[_12] = mat4in[_12];
			mat4out[_13] = mat4in[_13];
			mat4out[_14] = mat4in[_14];

			mat4out[_21] = mat4in[_21];
			mat4out[_22] = mat4in[_22];
			mat4out[_23] = mat4in[_23];
			mat4out[_24] = mat4in[_24];

			mat4out[_31] = mat4in[_31];
			mat4out[_32] = mat4in[_32];
			mat4out[_33] = mat4in[_33];
			mat4out[_34] = mat4in[_34];
		}

		const M = mat4in;
		const v = vec3in;

		if (! CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE) {
			mat4out[_14] = M[_11]*v[X] + M[_12]*v[Y] + M[_13]*v[Z] + M[_14];
			mat4out[_24] = M[_21]*v[X] + M[_22]*v[Y] + M[_23]*v[Z] + M[_24];
			mat4out[_34] = M[_31]*v[X] + M[_32]*v[Y] + M[_33]*v[Z] + M[_43];
			mat4out[_44] = M[_41]*v[X] + M[_42]*v[Y] + M[_43]*v[Z] + M[_44];
		} else {
			mat4out[_14] = M[_11]*v[X] + M[_21]*v[Y] + M[_31]*v[Z] + M[_41];
			mat4out[_24] = M[_12]*v[X] + M[_22]*v[Y] + M[_32]*v[Z] + M[_42];
			mat4out[_34] = M[_13]*v[X] + M[_23]*v[Y] + M[_33]*v[Z] + M[_43];
			mat4out[_44] = M[_14]*v[X] + M[_24]*v[Y] + M[_34]*v[Z] + M[_44];
		}
	}

} // mat4_translate


/**
 * mat4_scale()
 */
export function mat4_scale (mat4out, mat4in, vec3in) {
	mat4out[ 0] = mat4in[ 0] * vec3in[0];
	mat4out[ 1] = mat4in[ 1] * vec3in[0];
	mat4out[ 2] = mat4in[ 2] * vec3in[0];
	mat4out[ 3] = mat4in[ 3] * vec3in[0];

	mat4out[ 4] = mat4in[ 4] * vec3in[1];
	mat4out[ 5] = mat4in[ 5] * vec3in[1];
	mat4out[ 6] = mat4in[ 6] * vec3in[1];
	mat4out[ 7] = mat4in[ 7] * vec3in[1];

	mat4out[ 8] = mat4in[ 8] * vec3in[2];
	mat4out[ 9] = mat4in[ 9] * vec3in[2];
	mat4out[10] = mat4in[10] * vec3in[2];
	mat4out[11] = mat4in[11] * vec3in[2];

	mat4out[12] = mat4in[12];
	mat4out[13] = mat4in[13];
	mat4out[14] = mat4in[14];
	mat4out[15] = mat4in[15];

} // mat4_scale


/**
 * mat4_rotate()
 */
export function mat4_rotate (mat4out, mat4in, vec3axis, angle) {
	mat4_multiply_mat4(
		mat4out,
		mat4in,
		rotation_mat4(
			vec3axis,
			angle,
		),
	);
} // mat4_rotate


/**
 * mat4_transpose()
 */
export function mat4_transpose (mat4out, mat4in) {
	const source = mat4in.map( (x)=>x );

	mat4out[_11] = source[_11];
	mat4out[_12] = source[_21];
	mat4out[_13] = source[_31];
	mat4out[_14] = source[_41];

	mat4out[_21] = source[_12];
	mat4out[_22] = source[_22];
	mat4out[_23] = source[_32];
	mat4out[_24] = source[_42];

	mat4out[_31] = source[_13];
	mat4out[_32] = source[_23];
	mat4out[_33] = source[_33];
	mat4out[_34] = source[_43];

	mat4out[_41] = source[_14];
	mat4out[_42] = source[_24];
	mat4out[_43] = source[_34];
	mat4out[_44] = source[_44];

	return mat4out;

} // mat4_transpose


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// mat4 Generators
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

/**
 * identity_mat4()
 */
export function identity_mat4 () {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];

} // identity_mat4


/**
 * rotation_mat4()
 */
export function rotation_mat4 (vec3axis, angle) {
	// https://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle

	const x = vec3axis[X];
	const y = vec3axis[Y];
	const z = vec3axis[Z];

	const x_x = x*x;
	const x_y = x*y;
	const x_z = x*z;
	const y_z = y*z;
	const y_y = y*y;
	const z_z = z*z;

	const sin_angle = Math.sin( angle );
	const cos_angle = Math.cos( angle );
	const one_minus_cos_angle = 1 - cos_angle;

	const x_sin_angle = x * sin_angle;
	const y_sin_angle = y * sin_angle;
	const z_sin_angle = z * sin_angle;

	const x_y_one_minus_cos_angle = x_y * one_minus_cos_angle;
	const x_z_one_minus_cos_angle = x_z * one_minus_cos_angle;
	const y_z_one_minus_cos_angle = y_z * one_minus_cos_angle;
	const x_x_one_minus_cos_angle = x_x * one_minus_cos_angle;
	const y_y_one_minus_cos_angle = y_y * one_minus_cos_angle;
	const z_z_one_minus_cos_angle = z_z * one_minus_cos_angle;

	const mat4out = [];

	mat4out[_11] = x_x_one_minus_cos_angle + cos_angle;
	mat4out[_12] = x_y_one_minus_cos_angle - z_sin_angle;
	mat4out[_13] = x_z_one_minus_cos_angle + y_sin_angle;
	mat4out[_14] = 0;

	mat4out[_21] = x_y_one_minus_cos_angle + z_sin_angle;
	mat4out[_22] = y_y_one_minus_cos_angle + cos_angle;
	mat4out[_23] = y_z_one_minus_cos_angle - x_sin_angle;
	mat4out[_24] = 0;

	mat4out[_31] = x_z_one_minus_cos_angle - y_sin_angle;
	mat4out[_32] = y_z_one_minus_cos_angle + x_sin_angle;
	mat4out[_33] = z_z_one_minus_cos_angle + cos_angle;
	mat4out[_34] = 0;

	mat4out[_41] = 0;
	mat4out[_42] = 0;
	mat4out[_43] = 0;
	mat4out[_44] = 1;

	return mat4out;

} // rotation_mat4


/**
 * rotation_x_mat4()
 */
export function rotation_x_mat4 (angle) {
	return [
		1, 0, 0, 0,
		0, Math.cos(angle), -Math.sin(angle), 0,
		0, Math.sin(angle),  Math.cos(angle), 0,
		0, 0, 0, 1,
	];

} // rotation_x_mat4


/**
 * rotation_y_mat4()
 */
export function rotation_y_mat4 (angle) {
	return [
		 Math.cos(angle), 0, Math.sin(angle), 0,
		 0, 1, 0, 0,
		-Math.sin(angle), 0, Math.cos(angle), 0,
		 0, 0, 0, 1,
	];

} // rotation_y_mat4


/**
 * rotation_z_mat4()
 */
export function rotation_z_mat4 (angle) {
	return [
		Math.cos(angle), -Math.sin(angle), 0, 0,
		Math.sin(angle),  Math.cos(angle), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	];

} // rotation_z_mat4


/**
 * translation_mat4()
 */
export function translation_mat4 (vec3) {
	const x = vec3[0];
	const y = vec3[1];
	const z = vec3[2];
	return [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1,
	];

}; // translation_mat4


/**
 * scale_mat4()
 */
export function scale_mat4 (vec3) {
	const x = vec3[0];
	const y = vec3[1];
	const z = vec3[2];
	return [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1,
	];

}; // scale_mat4


/**
 * projection_mat4()
 *
 * Screen                  Normalized
 *   0,0       1024,0             -1            It's easier to work with normalized coordinates:
 *    +------------+          +----+----+       Aspect ratio a = screen width / screen height
 *    |            |          |    |    |       [x, y, z] --> [x*a, y, z]
 *    |            |          |    |    |       [x, y, z] --> [x*(w/h), y, z]
 *    |            |  -->  -1 +----+----+ +1
 *    |            |          |    |    |
 *    |            |          |    |    |
 *    +------------+          +----+----+
 *   0,768   1024,768             +1
 *
 *
 * Frustrum (Top or side view)
 *   ____zFar____        __b__   The farther away an object, the smaller it appears:
 * -1\          /+1      \   |   Angle(a, c) = theta = field_of_view/2,
 *    \        /          c  a   Scaling factor f = 1 / tan(theta)
 *     \      /            \ |   [x, y, z] --> [x*a*f, y*f, z]
 *    -1\____/+1___+x,+y    \|   [x, y, z] --> [x*(w/h)*(1/tan(fov/2)), y*(1/tan(fov/2)), z]
 *       zNear
 *  ______________
 *      Screen
 *
 *  We also normalize the z-coordinate to the range [0..1].
 *  In a first step, we scale z to the space in the frustrum.
 *  The normalized z-position between screen and zFar is:
 *    q  = zFar / (zFar-zNear)
 *    z' = z * q
 *    z' = z * zFar / (zFar - zNear)
 *
 *  Then, we correct for the gap between screen and zNear:
 *    z" = z * q - (zFar*zNear)/(zFar-zNear)
 *       = z * q - zNear*q
 *       = z * zFar/(zFar-zNear) - (zFar*zNear)/(zFar-zNear)
 *    Q  = zNear * q
 *
 *  Finally, we need to make more distant objects move less:
 *    [x, y, z] --> [x*a*f/z, y*f/z, z"]
 *    [x, y, z] --> [x*a*f/z, y*f/z, z*q - zNear*q]
 *    [x, y, z] --> [ x*(w/h)*(1/tan(fov/2))/z,
 *                    y      *(1/tan(fov/2))/z,
 *                    z * zFar/(zFar-zNear) - (zFar*zNear)/(zFar-zNear)
 *                  ]
 *  Which gives us:
 *    [x, y, z] --> [a*f*x/z, f*y/z, z*q-zNear*q]
 *
 *  First approach to making our matrix:
 *  |x|   |a*f 0  0|   |a*f*x + 0*y + 0*z|
 *  |y| * | 0  f  0| = |  0*x + f*y + 0*z| = [a*f*x, f*y, z*q]
 *  |z|   | 0  0  q|   |  0*x + 0*y + q*z|
 *
 *  We need to include the correction term Q (-zNear*q), so we add a 4th dimension.
 *  We also need to divide by z, so we store 1 in the 4th column to keep the z value:
 *  |x|   |a*f 0  0  0|   |a*f*x + 0*y + 0*z + 0*1|   |a*f*x|
 *  |y| * | 0  f  0  0| = |  0*x + f*y + 0*z + 0*1| = | f*y |
 *  |z|   | 0  0  q  1|   |  0*x + 0*y + q*z - Q*1|   |q*z-Q|
 *  |1|   | 0  0 -Q  0|   |  0*x + 0*x + 1*z + 0*1|   |  z  |
 *                                    ]
 *  After performing the transformation, we will use the 4th element to divide x, y and z by z:
 *  |a*f*x|     |a*f*x/z|
 *  | f*y | --> | f*y/z |
 *  |q*z-Q|     | q-Q/z |
 *  |  z  |
 *
 */
export function projection_mat4 (
	screen_width,
	screen_height,
	field_of_view = 90 * DtoR,
	zNear = 0.1,
	zFar = 1000,
) {
	const fovy = field_of_view;
	const near = zNear;
	const far = zFar;
	const aspect = screen_width / screen_height;

	const out = [];
	const f = 1.0 / Math.tan(fovy / 2);
	const nf = 1 / (near - far);

	if (! CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX) {
		out[_11] = f / aspect; out[_12] = 0; out[_13] = 0;                  out[_14] = 0;
		out[_21] = 0;          out[_22] = f; out[_23] = 0;                  out[_24] = 0;
		out[_31] = 0;          out[_32] = 0; out[_33] = (far + near) * nf;  out[_34] = 2 * far * near * nf;
		out[_41] = 0;          out[_42] = 0; out[_43] = -1;                 out[_44] = 0;
	} else {
		out[_11] = f / aspect; out[_12] = 0; out[_13] = 0;                   out[_14] = 0;
		out[_21] = 0;          out[_22] = f; out[_23] = 0;                   out[_24] = 0;
		out[_31] = 0;          out[_32] = 0; out[_33] = (far + near) * nf;   out[_34] = -1;
		out[_41] = 0;          out[_42] = 0; out[_43] = 2 * far * near * nf; out[_44] = 0;
	}

	return out;

} // projection_mat4


/**
 * point_at_mat4()
 *
 * Rotating P by angle a around origin O, resulting in Q:
 *
 *       Y|       |     /Y' = vector B
 *        |<-Bx-->|
 *        |       |   /
 *  _ _ _ 1________________.P
 *     ^  |       | /      |    |       P = [1|1] : Qx = Ax + Bx
 *  _ _|_ | _ _ _ _ _ _ _ _| _ _ _                  Qy = Ay + By
 *     |  |_      /--__    |    |
 *     |  | --_  /|    --__|            P = [x|y] : Qx = Px*Ax + Py*Bx
 *    By  |  a -/          |-__ |                   Qy = Px*Ay + Py*By
 *     |  |    /  |        |   -.Q
 *     |  |   /            |   /        |Px|*|Ax Ay| = |Px*Ax + Py*Bx|
 *     |  |  /    |      | |  / |       |Py| |Bx By|   |Px*Ay + Py*By|
 *     |  | /              | /
 *  ___v__|/______|______|_1____|___X
 *     ^  O  --__          /
 *   Ay|  |      -|__    |/     |
 *  _ _v_ | _ _ _ _  --__/ _ _ _ _
 *        |       |      |-__   |
 *        |<----Ax------>|   --__
 *        |       |      |      |--__X' = vector A = Forward as unit vector
 *
 *
 * Rotate P by angle a around point T, in 3D. B and C are orthogonal to A.
 *
 *  |Px| |Ax Ay Az 0|   |Px*Ax + Py*Bx + Pz*Cx + 1*Tx|
 *  |Py|*|Bx By Bz 0| = |Px*Ay + Py*By + Pz*Cy + 1*Ty|
 *  |Pz| |Cz Cz Cz 0|   |Px*Az + Py*Bz + Pz*Cz + 1*Tz|
 *  |1 | |Tx Ty Tz 1|   |Px*0  + Py*0  + Pz*0  + 1*1 |
 *
 */
export function point_at_mat4 (source, target, up) {
	const new_forward = vec3_normalize( vec3_minus_vec3( target, source ) );
	const a           = vec3_multiply_scalar( new_forward, vec3_dot_vec3( up, new_forward ) );
	const new_up      = vec3_normalize( vec3_minus_vec3( up, a ) );
	const new_right   = vec3_cross_vec3( new_up, new_forward );

	const A = new_right;
	const B = new_up;
	const C = new_forward
	const T = target;

	return [
		[A[X], A[Y], A[Z], 0],
		[B[X], B[Y], B[Z], 0],
		[C[X], C[Y], C[Z], 0],
		[T[X], T[Y], T[Z], 1],
	];

} // point_at_mat4


/**
 * look_at_mat4()
 */
export function look_at_mat4 (source, target, up) { // Only for Rotation/Translation Matrices
	const new_forward = vec3_normalize(
		vec3_minus_vec3(
			source,
			target,
		)
	);
	const new_up = vec3_normalize(
		vec3_minus_vec3(
			vec3_multiply_scalar(
				new_forward,
				vec3_dot_vec3(   // Forward may have y-component, so we rotate  up  accordingly
					up,
					new_forward,
				)
			),
			up,
		)
	);
	const new_right = vec3_cross_vec3(  // hupft
		new_up,
		new_forward,
	);

	const A = new_right;
	const B = new_up;
	const C = new_forward
	const T = target;

	return [
		[A[X], B[X], C[X], 0],
		[A[Y], B[Y], C[Y], 0],
		[A[Z], B[Z], C[Z], 0],
		[
			-(T[X] * A[X] + T[Y] * B[X] + T[Z] * A[Z]),
			-(T[X] * A[Y] + T[Y] * B[Y] + T[Z] * B[Z]),
			-(T[X] * A[Z] + T[Y] * B[Z] + T[Z] * C[Z]),
			1
		],
	];

} // look_at_mat4


//EOF