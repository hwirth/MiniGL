// camera.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MINIGL - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

// ../.work/manual_v0.0.1a/minigl/
import * as Helpers                     from './minigl_helpers.js';
import * as VMath                       from './vector_math.js';
import { PI, TAU, RtoD, DtoR }          from './vector_math.js';
import { X, Y, Z, W, AXES, R, G, B, A } from './vector_math.js';


/**
 * Camera()
 */
export const Camera = function (minigl, parameters = {}) {
	const self = this;

	this.initialParameters;

	this.mode;
	this.fov;
	this.zNear;
	this.zFar;
	this.position;
	this.rotation;
	this.vectorForward;
	this.vecrorRight;
	this.vectorUp;

	this.matrix;


	/**
	 * update_vectors()
	 */
	function update_vectors (rotation_matrix) {
		VMath.vec4_multiply_mat4(
			self.vectorRight,
			self.vectorRight,
			rotation_matrix,
		);
		VMath.vec4_multiply_mat4(
			self.vectorUp,
			self.vectorUp,
			rotation_matrix,
		);
		VMath.vec4_multiply_mat4(
			self.vectorForward,
			self.vectorForward,
			rotation_matrix,
		);

	} // update_vectors


	/**
	 * update_position()
	 */
	function update_position (translation_matrix) {
		VMath.vec4_multiply_mat4(
			self.position,
			self.position,
			translation_matrix,
		);

	} // update_position


	/**
	 * debug_camera()
	 */
	function debug_camera (caption) {
		if (minigl.debug.camera) {
			//console.clear();
			console.groupCollapsed( 'Camera ' + caption );
			console.log( 'position:', VMath.vec3_format( self.position ) );
			console.log( 'rotation:', VMath.vec3_format( self.rotation ) );
			console.log( '   zNear:', self.zNear );
			console.log( '    zFar:', self.zFar );
			console.log( '     fov:', self.fov );
			console.log( 'vForward:', VMath.vec3_format( self.vectorForward ) );
			console.log( '  vRight:', VMath.vec3_format( self.vectorRight ) );
			console.log( '     vUp:', VMath.vec3_format( self.vectorUp ) );
			console.log( '  matrix:', VMath.mat4_format( self.matrix ) );
			console.groupEnd();
		}

	} // debug_camera


	/**
	 * debug_start()
	 */
	function debug_start (caption, nested = true) {
if (nested) return;
		if (minigl.debug.camera) {
			if (minigl.debug.cameraCollapse) {
				console.groupCollapsed( 'Camera operation: "' + caption );
			} else {
				console.group( 'Camera operation: "' + caption );
			}
			if (!nested) debug_camera( 'before' );
			console.group( 'Operation details' );
		}

	} // debug_start


	/**
	 * debug_end()
	 */
	function debug_end (nested = true) {
if (nested) return;
		if (minigl.debug.camera) {
			console.groupEnd();
			if (!nested) debug_camera( 'after' );
			console.groupEnd();
		}

	} // debug_start


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// PUBLIC METHODS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * reset()
	 */
	this.reset = function () {
		if (minigl.debug.camera) console.clear();
		debug_start( 'reset' );

		const reset_parameters = Helpers.clone( self.initialParameters || {} );

		if (minigl.debug.camera) console.log( 'initialParameters:', self.initialParameters );

		self.fov      = Helpers.getParam( reset_parameters, 'fov'      , 45*DtoR );
		self.zNear    = Helpers.getParam( reset_parameters, 'zNear'    , 0.1     );
		self.zFar     = Helpers.getParam( reset_parameters, 'zFar'     , 10000   );

		self.position      = [0, 0, 0];
		self.vectorRight   = [1, 0, 0];
		self.vectorUp      = [0, 1, 0];
		self.vectorForward = [0, 0, 1];

		self.matrix = VMath.identity_mat4();

		if (minigl.callbacks.onResetCamera) minigl.callbacks.onResetCamera( self );

		debug_end();

	}; // reset()


	/**
	 * translateRelative()
	 */
	this.translateRelative = function (right, up, forward) {
		debug_start( 'translateRelative' );

		const translation_matrix = VMath.translation_mat4( [right, up, forward] );

		if (minigl.debug.camera) console.log( 'translation_matrix:', VMath.mat4_format(translation_matrix) );

		VMath.mat4_multiply_mat4(
			self.matrix,
			translation_matrix,
			self.matrix,
		);

		update_position( translation_matrix );

		debug_end();

	}; // translateRelative


	/**
	 * translateAbsolute()
	 */
	this.translateAbsolute = function (x, y, z) {
		debug_start( 'translateAbsolute' );

		const translation_matrix = VMath.identity_mat4();
		VMath.mat4_translate(
			translation_matrix,
			translation_matrix,
			VMath.vec3_multiply_scalar(
				self.vectorRight,
				x,
			),
		);
		VMath.mat4_translate(
			translation_matrix,
			translation_matrix,
			VMath.vec3_multiply_scalar(
				self.vectorUp,
				y,
			),
		);
		VMath.mat4_translate(
			translation_matrix,
			translation_matrix,
			VMath.vec3_multiply_scalar(
				self.vectorForward,
				z,
			),
		);

		if (minigl.debug.camera) console.log( 'translation_matrix:', VMath.mat4_format(translation_matrix) );

		VMath.mat4_multiply_mat4(
			self.matrix,
			translation_matrix,
			self.matrix,
		);

		update_position( translation_matrix );

		debug_end();

	}; // translateAbsolute


	/**
	 * rotateAbsolute()
	 */
	this.rotateAbsolute = function (x, y, z) {
		debug_start( 'rotateAbsolute' );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_multiply_mat4(
			rotation_matrix,
			rotation_matrix,
			VMath.rotation_x_mat4( x ),
		);
		VMath.mat4_multiply_mat4(
			rotation_matrix,
			rotation_matrix,
			VMath.rotation_y_mat4( y ),
		);
		VMath.mat4_multiply_mat4(
			rotation_matrix,
			rotation_matrix,
			VMath.rotation_z_mat4( z ),
		);

		VMath.mat4_multiply_mat4(
			self.matrix,
			self.matrix,
			rotation_matrix,
		);

		update_vectors( rotation_matrix );

		debug_end();

	}; // rotateAbsolute


	/**
	 * rotateRelative()
	 */
	this.rotateRelative = function (pitch, yaw, roll) {
		debug_start( 'rotateRelative' );

		const matrix_back    = VMath.translation_mat4( VMath.vec3_minus_vec3( self.position, [0,0,0] ) );
		const matrix_forward = VMath.translation_mat4( VMath.vec3_minus_vec3( [0,0,0], self.position ) );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			self.vectorRight,
			pitch,
		);
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			self.vectorUp,
			yaw,
		);
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			self.vectorForward,
			roll,
		);

		if (minigl.debug.camera) console.log( 'rotation_matrix:', VMath.mat4_format( rotation_matrix ) );
/*
		VMath.mat4_multiply_mat4(
			self.matrix,
			matrix_forward,
			self.matrix,
		);
*/
		VMath.mat4_multiply_mat4(
			self.matrix,
			rotation_matrix,
			self.matrix,
		);
/*
		VMath.mat4_multiply_mat4(
			self.matrix,
			matrix_back,
			self.matrix,
		);
*/
		update_vectors( rotation_matrix );

		debug_end();

	}; // rotateRelative


	/**
	 * orbitTarget()
	 */
	this.orbitTarget = function (target, horizontal, vertical) {
		debug_start( 'orbitTarget' );

		/*
		const distance = VMath.vec3_length(
			VMath.vec3_minus_vec3(
				target,
				self.position,
			)
		);

		if (minigl.debug.camera) console.log( 'Distance:', distance );


		self.rotate( vertical, horizontal, 0 );
		self.translate( 0, 0, -distance );
		*/

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			self.vectorUp,
			horizontal,
		);
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			self.vectorRight,
			vertical,
		);

		const distance = VMath.vec3_length(
			VMath.vec3_minus_vec3(
				target,
				self.position,
			)
		);
		//self.translate( 0, 0, distance );
		VMath.mat4_multiply_mat4(
			self.matrix,
			self.matrix,
			rotation_matrix,
		);
		//self.translate( 0, 0, -distance );

		update_vectors( rotation_matrix );

		debug_end();

	}; // orbitTarget


	/**
	 * orbitAxis()
	 */
	this.orbitAxis = function (axis, angle, target = [0,0,0]) {
		debug_start( 'orbitAxis' );

		const distance = VMath.vec3_length(
			VMath.vec3_minus_vec3(
				target,
				self.position,
			)
		);

		const matrix_center = VMath.translation_mat4( VMath.vec3_minus_vec3( target, self.position ) );
		const matrix_back   = VMath.translation_mat4( VMath.vec3_minus_vec3( self.position, target ) );

		const rotation_matrix = VMath.identity_mat4();
		VMath.mat4_rotate(
			rotation_matrix,
			rotation_matrix,
			axis,
			-angle,
		);

		VMath.mat4_multiply_mat4(
			self.matrix,
			matrix_center,
			self.matrix,
		);
		VMath.mat4_multiply_mat4(
			self.matrix,
			rotation_matrix,
			self.matrix,
		);
		VMath.mat4_multiply_mat4(
			self.matrix,
			matrix_back,
			self.matrix,
		);

		VMath.vec4_multiply_mat4(
			self.position,
			self.position,
			matrix_center,
		);
		VMath.vec4_multiply_mat4(
			self.position,
			self.position,
			rotation_matrix,
		);
		VMath.vec4_multiply_mat4(
			self.position,
			self.position,
			matrix_back,
		);

		update_vectors( rotation_matrix );

		debug_end();

	}; // orbitAxis


	/**
	 * command()
	 */
	this.command = function (command, amount = null) {
		debug_start( command, /*nested*/false );

		const camera = minigl.camera;
		const angle  = (amount === null) ? 5*DtoR : amount;
		amount = (amount === null) ? 1 : amount;

		switch (command) {
		case 'rotate_x_positive'    :  camera.rotateAbsolute( angle, 0, 0 );      break;
		case 'rotate_x_negative'    :  camera.rotateAbsolute(-angle, 0, 0 );      break;
		case 'rotate_y_positive'    :  camera.rotateAbsolute( 0, angle, 0 );      break;
		case 'rotate_y_negative'    :  camera.rotateAbsolute( 0,-angle, 0 );      break;
		case 'rotate_z_positive'    :  camera.rotateAbsolute( 0, 0, angle );      break;
		case 'rotate_z_negative'    :  camera.rotateAbsolute( 0, 0,-angle );      break;

		case 'rotate_up'            :  camera.rotateRelative( angle, 0, 0 );      break;
		case 'rotate_down'          :  camera.rotateRelative(-angle, 0, 0 );      break;
		case 'rotate_right'         :  camera.rotateRelative( 0, angle, 0 );      break;
		case 'rotate_left'          :  camera.rotateRelative( 0,-angle, 0 );      break;

		case 'roll_right'           :  camera.rotateRelative( 0, 0, angle );      break;
		case 'roll_left'            :  camera.rotateRelative( 0, 0,-angle );      break;

		case 'orbit_right'          :  camera.orbitTarget( [0,0,0], angle, 0 );   break;
		case 'orbit_left'           :  camera.orbitTarget( [0,0,0],-angle, 0 );   break;
		case 'orbit_up'             :  camera.orbitTarget( [0,0,0], 0, angle );   break;
		case 'orbit_down'           :  camera.orbitTarget( [0,0,0], 0,-angle );   break;

		case 'axis_right'           :  camera.orbitAxis( AXES[Y], angle );        break;
		case 'axis_left'            :  camera.orbitAxis( AXES[Y],-angle );        break;

		case 'translate_right'      :  camera.translateRelative( amount, 0, 0 );  break;
		case 'translate_left'       :  camera.translateRelative(-amount, 0, 0 );  break;
		case 'translate_up'         :  camera.translateRelative( 0, amount, 0 );  break;
		case 'translate_down'       :  camera.translateRelative( 0,-amount, 0 );  break;
		case 'translate_back'       :  camera.translateRelative( 0, 0, amount );  break;
		case 'translate_forward'    :  camera.translateRelative( 0, 0,-amount );  break;

		case 'translate_x_positive' :  camera.translateAbsolute( amount, 0, 0 );  break;
		case 'translate_x_negative' :  camera.translateAbsolute(-amount, 0, 0 );  break;
		case 'translate_y_positive' :  camera.translateAbsolute( 0, amount, 0 );  break;
		case 'translate_y_negative' :  camera.translateAbsolute( 0,-amount, 0 );  break;
		case 'translate_z_positive' :  camera.translateAbsolute( 0, 0, amount );  break;
		case 'translate_z_negative' :  camera.translateAbsolute( 0, 0,-amount );  break;

		case 'fov_increase'         :  camera.fov *= 1.1;                         break;
		case 'fov_decrease'         :  camera.fov /= 1.1;                         break;
		case 'camera_reset'         :  camera.reset();                            break;
		}

		debug_end( /*nested*/false );

		minigl.requestUpdate();

	} // on_camera_control



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// CONSTRUCTOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

	/**
	 * init()
	 */
	function init (parameters) {
		self.initialParameters = parameters;
		self.reset();

	} // init


	// CONSTRUCTOR

	init( parameters );

}; // Camera


//EOF