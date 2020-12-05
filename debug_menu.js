// debug_menu.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MINIGL - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import * as VMath from './vector_math.js';

/**
 * body.onload()
 * Install CSS rules in a <style> element shared by all modules
 */
addEventListener( 'load', ()=>{
	// Get or create <style> element
	let style_element = document.querySelector( '#minigl_styles' ) || document.createElement( 'style' );
	if (style_element.innerHTML.indexOf( 'debug.js' ) >= 0) return;
	style_element.id = 'minigl_styles';

	style_element.innerHTML = `
		/* Inserted by debug.js */
		.minigl_debug_menu {
		        position:absolute; z-index:998; bottom:0; right:0; user-select:none;
		        margin:0 -1px -1px 0; padding:0 4px 2px 1px; border:solid 1px #bbb; border-radius:5px 0 0 0;
		        background-color:#666; color:#fff; font-size:0; text-align:right;
		}
		.minigl_debug_menu .heading {
		        padding:0.3em 3px 0.1em 7px; font-size:11px; font-weight:bold; text-align:center; color:#179bfa;
		        text-shadow:
		                 1px 0 rgba(0,0,0, 0.25),
		                -1px 0 rgba(0,0,0, 0.25),
		                0  1px rgba(0,0,0, 0.25),
		                0 -1px rgba(0,0,0, 0.25)
		        ;
		        letter-spacing:0.1em;
		}
		.minigl_debug_menu .heading abbr { color:#ddd; }
		.minigl_debug_menu .groups { display:none; column-count:5; }
		.minigl_debug_menu.lock_menu .groups,
		.minigl_debug_menu:hover .groups,
		.minigl_debug_menu:focus-within .groups { display:block; }
		.minigl_debug_menu div div { position:relative; display:inline-block; width:calc130px; margin-bottom:2px; }
		.minigl_debug_menu h2 { font-size:1rem; text-align:center; }
		.minigl_debug_menu > div > span { display:block; width:140px; margin-bottom:2px; margin-left:3px; text-align:right; vertical-align:bottom; }
		.minigl_debug_menu button {
		        display:inline-block; width:calc(33.33% - 2px); line-height:1.5;
		        margin:1px; padding:0 0.35em;
		        filter:none; transition:all 0.15s ease-in-out;
			background:linear-gradient( to bottom,
		                rgba(181,181,181, 1) 0%,
		                rgba(157,157,157, 1) 50%,
		                rgba(140,140,140, 1) 51%,
		                rgba(192,192,192, 1) 100%
		        );
		        border:solid 2px #ddd; border-radius:0.2em;
		        box-shadow:1px 1px 2px 1px rgba(0,0,0, 0.25);
		        font-size:11px; color:#000;
		}
		.minigl_debug_menu button:active { position:relative; top:1px; }
		.minigl_debug_menu button:active,
		.minigl_debug_menu button.on {
		        background:linear-gradient( to bottom,
		                rgba(215,215,215, 1) 0%,
		                rgba(198,198,198, 1) 50%,
		                rgba(179,179,179, 1) 51%,
		                rgba(227,227,227, 1) 100%
		        );
		        border:solid 2px #fff; box-shadow:0 0 7px 2px rgba(255,225,255, 0.25);
		}
		.minigl_debug_menu button big { font-size:14px; line-height:0; pointer-events:none; }
		.minigl_debug_menu button.placeholder { visibility:hidden; }
		.minigl .debug { Xbackground:rgba(0,0,0, 0.85); }
	`.trim().replace( /\t/g, '' ) + '\n';

	document.querySelector( 'head' ).appendChild( style_element );
});



/**
 * DebugMenu()
 */
export const DebugMenu = function (minigl) {
	const self = this;

	this.containerElement;
	this.buttons;

	// Labels in groups of (typically) 6 buttons
	const button_definition = [
		['Trans Fwd', 'Trans Up', 'Trans Back', 'Trans Left', 'Trans Down', 'Trans Right'],
		['Trans X+', 'Trans Y+', 'Trans Z+', 'Trans X-', 'Trans Y-', 'Trans Z-'],
		['Roll RollL', 'Rot Up', 'Roll RollR', 'Rot Left', 'Rot Down', 'Rot Right'],
		['Rot X+', 'Rot Y+', 'Rot Z+', 'Rot X-', 'Rot Y-', 'Rot Z-'],
		['Axis Left', 'Orbit Up', 'Axis Right', 'Orbit Left', 'Orbit Down', 'Orbit Right'],
		['FoV +', 'FoV -', 'Reset Cam', 'Mouse Flip X', 'Mouse Flip Y', 'Game Pad'],
		['VMath Prev', 'VMath Reset', 'VMath Next', 'VMath Swap', 'Transp Persp', 'VMath RowM'],
		['Transp VxM', 'Transp MxM', 'Transp MxM2', 'Transp TMVw', 'Transp Transl', 'Transp Trnsl2'],
		['Cam Debug', 'Rot Axis', 'Rot Abs', 'Cam Detail', 'Rot Rel', 'Rot Target'],
		['Debug GL0', 'Debug GL1', 'Debug Info', 'Check Errors', 'Toggle F/s', 'Lock Menu'],
	];

	// Use unicode arrows, turn space char of definition into <br> for button.innerHTML
	const replace = [
		['Right', '<big>&#x2b62;</big>'],
		['Left',  '<big>&#x2b60;</big>'],
		['Up',    '<big>&#x2b61;</big>'],
		['Down',  '<big>&#x2b63;</big>'],
		['Back',  '<big>&#x2b69;</big>'],
		['Fwd',   '<big>&#x2b67;</big>'],
		['RollR', '<big>&#x2b6e;</big>'],
		['RollL', '<big>&#x2b6f;</big>'],
		[' ',     '<br>'],
	];

	// Assign normalized commands to buttons
	const commands = {
		'Trans Right'   : 'translate_right',
		'Trans Left'    : 'translate_left',
		'Trans Up'      : 'translate_up',
		'Trans Down'    : 'translate_down',
		'Trans Back'    : 'translate_back',
		'Trans Fwd'     : 'translate_forward',
		'Trans X+'      : 'translate_x_positive',
		'Trans X-'      : 'translate_x_negative',
		'Trans Y+'      : 'translate_y_positive',
		'Trans Y-'      : 'translate_y_negative',
		'Trans Z+'      : 'translate_z_positive',
		'Trans Z-'      : 'translate_z_negative',
		'Roll RollL'    : 'roll_left',
		'Roll RollR'    : 'roll_right',
		'Rot Up'        : 'rotate_up',
		'Rot Left'      : 'rotate_left',
		'Rot Down'      : 'rotate_down',
		'Rot Right'     : 'rotate_right',
		'Rot X+'        : 'rotate_x_positive',
		'Rot X-'        : 'rotate_x_negative',
		'Rot Y+'        : 'rotate_y_positive',
		'Rot Y-'        : 'rotate_y_negative',
		'Rot Z+'        : 'rotate_z_positive',
		'Rot Z-'        : 'rotate_z_negative',
		'Axis Left'     : 'axis_left',
		'Axis Right'    : 'axis_right',
		'Orbit Up'      : 'orbit_up',
		'Orbit Left'    : 'orbit_left',
		'Orbit Down'    : 'orbit_down',
		'Orbit Right'   : 'orbit_right',
		'FoV +'         : 'fov_increase',
		'FoV -'         : 'fov_decrease',
		'Toggle F/s'    : 'toggle_fps',
		'Reset Cam'     : 'camera_reset',
		'Rot Axis'      : 'mouse_mode_orbit_axis',
		'Rot Target'    : 'mouse_mode_orbit_target',
		'Rot Abs'       : 'mouse_mode_rotate_absolute',
		'Rot Rel'       : 'mouse_mode_rotate_relative',
		'VMath Prev'    : 'vmath_prev',
		'VMath Reset'   : 'vmath_reset',
		'VMath Next'    : 'vmath_next',
		'VMath Swap'    : 'vmath_toggle',
		'VMath RowM'    : 'vmath_toggle',
		'Transp MxM'    : 'vmath_toggle',
		'Transp MxM2'   : 'vmath_toggle',
		'Transp VxM'    : 'vmath_toggle',
		'Transp MVw'    : 'vmath_toggle',
		'Transp Transl' : 'vmath_toggle',
		'Transp Trnsl2' : 'vmath_toggle',
		'Transp Persp'  : 'vmath_toggle',
	};


	/**
	 * init_button_states()
	 * Set individual button to "on" according to current MiniGL state
	 */
	function init_button_state (definition, button) {
		let state = false;

		switch (definition) {
		case 'Mouse Flip X'  :  state = minigl.mirrorMouseX;           break;
		case 'Mouse Flip Y'  :  state = minigl.mirrorMouseY;           break;
		case 'Toggle F/s'    :  state = (minigl.limitFPS != false);    break;
		case 'Debug GL0'     :  state = minigl.debug.webGL0;           break;
		case 'Debug GL1'     :  state = minigl.debug.webGL1;           break;
		case 'Debug Info'    :  state = minigl.debug.showOverlay;      break;
		case 'Check Errors'  :  state = minigl.debug.checkGLErrors;    break;
		case 'Cam Debug'     :  state = minigl.debug.camera;           break;
		case 'Cam Detail'    :  state = !minigl.debug.cameraCollapse;  break;
		case 'Rot Axis'      :  state = (minigl.mouseMode == 'orbit_axis');       break;
		case 'Rot Target'    :  state = (minigl.mouseMode == 'orbit_target');     break;
		case 'Rot Abs'       :  state = (minigl.mouseMode == 'rotate_absolute');  break;
		case 'Rot Rel'       :  state = (minigl.mouseMode == 'rotate_relative');  break;
		case 'Lock Menu':
			state = minigl.debug.lockMenu;
			self.containerElement.classList.toggle( 'lock_menu', state );
		break;
		case 'VMath Swap'    :  state = VMath.CONFIGURATION.SWAP_APP_MULTIPLICATION_ORDER;  break;
		case 'VMath RowM'    :  state = VMath.CONFIGURATION.MATRIX_ROW_MAJOR;               break;
		case 'Transp MxM'    :  state = VMath.CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT;       break;
		case 'Transp MxM2'   :  state = VMath.CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2;     break;
		case 'Transp VxM'    :  state = VMath.CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4;   break;
		case 'Transp MVw'    :  state = VMath.CONFIGURATION.TRANSPOSE.APP_MODEL_VIEW;       break;
		case 'Transp Transl' :  state = VMath.CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE;       break;
		case 'Transp Trnsl2' :  state = VMath.CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2;     break;
		case 'Transp Persp'  :  state = VMath.CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX;   break;
		}

		button.classList.toggle( 'on', state );

	} // init_button_states


	/**
	 * update_button_states()
	 */
	function update_button_states () {
		self.buttons.forEach( (button)=>{
			init_button_state( button.dataset.definition, button );
		});

	} // update_button_states


	/**
	 * evaluate_button_state()
	 * Gather toggle button states and set MiniGL variables accordinlgy
	 */
	function evaluate_button_state (button) {
		const state = button.classList.contains( 'on' );
		const definition = button.dataset.definition;

		switch (definition) {
		case 'Mouse Flip X'  :  minigl.mirrorMouseX         = state;   break;
		case 'Mouse Flip Y'  :  minigl.mirrorMouseY         = state;   break;
		case 'Debug GL0'     :  minigl.debug.webGL0         = state;   break;
		case 'Debug GL1'     :  minigl.debug.webGL1         = state;   break;
		case 'Check Errors'  :  minigl.debug.checkGLErrors  = state;   break;
		case 'Cam Debug'     :  minigl.debug.camera         = state;   break;
		case 'Cam Detail'    :  minigl.debug.cameraCollapse = !state;  break;
		case 'Rot Axis'      :  minigl.mouseMode = 'orbit_axis';       break;
		case 'Rot Target'    :  minigl.mouseMode = 'orbit_target';     break;
		case 'Rot Abs'       :  minigl.mouseMode = 'rotate_absolute';  break;
		case 'Rot Rel'       :  minigl.mouseMode = 'rotate_relative';  break;

		case 'Lock Menu':
			self.containerElement.classList.toggle( 'lock_menu', state );
			if (! state) minigl.containerElement.focus();
		break;
		case 'Debug Info':
			minigl.debug.showOverlay    = state;
			minigl.debugOverlay.toggle( state );
		break;
		case 'VMath Swap'    :  VMath.CONFIGURATION.SWAP_APP_MULTIPLICATION_ORDER = state;  break;
		case 'VMath RowM'    :  VMath.CONFIGURATION.MATRIX_ROW_MAJOR              = state;  break;
		case 'Transp MxM'    :  VMath.CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT      = state;  break;
		case 'Transp MxM2'   :  VMath.CONFIGURATION.TRANSPOSE.MATRIX_PRODUCT_2    = state;  break;
		case 'Transp VxM'    :  VMath.CONFIGURATION.TRANSPOSE.VEC4_MULTIPLY_MAT4  = state;  break;
		case 'Transp MVw'    :  VMath.CONFIGURATION.TRANSPOSE.APP_MODEL_VIEW      = state;  break;
		case 'Transp Transl' :  VMath.CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE      = state;  break;
		case 'Transp Trnsl2' :  VMath.CONFIGURATION.TRANSPOSE.MAT4_TRANSLATE_2    = state;  break;
		case 'Transp Persp'  :  VMath.CONFIGURATION.TRANSPOSE.PERSPECTIVE_MATRIX  = state;  break;
		}

		if (definition.substr(0, 5) == 'VMath') VMath.recalc_configuration_bits();

	} // update_control_buttons


	/**
	 * on_mouse_down()
	 */
	function on_mouse_down (event) {
		if (event.target.tagName == 'BUTTON') {
			self.lastClickedButton = event.target.dataset.definition;
		}
	} // on_mouse_down


	/**
	 * on_mouse_up()
	 */
	function on_mouse_up (event) {
		const button = event.target;
		const definition = button.dataset.definition;

		if (definition !== self.lastClickedButton) return;
		self.lastClickedButton = null;

		let evaluate_state = false;
		let update_state = false;

		const command = button.dataset.command;
		switch (command) {
		case 'mouse_mode_orbit_axis'      : // fall through
		case 'mouse_mode_orbit_target'    : // fall through
		case 'mouse_mode_rotate_relative' : // fall through
		case 'mouse_mode_rotate_absolute' : // fall through
			minigl.mouseMode = command.slice( 11 );
			update_state = true;
		break;
		case 'vmath_prev'  :
			VMath.load_next_configuration( true );
			update_button_states();
			minigl.camera.command( 'camera_reset' );
		break;
		case 'vmath_next'  :
			VMath.load_next_configuration( false );
			update_button_states();
			minigl.camera.command( 'camera_reset' );
		break;
		case 'vmath_reset':
			VMath.reset_configuration();
			update_button_states();
			minigl.camera.command( 'camera_reset' );
		break;
		case 'vmath_toggle':
			button.classList.toggle( 'on' );
			evaluate_state = true;
			minigl.camera.command( 'camera_reset' );
		break;
		case 'toggle':
			button.classList.toggle( 'on' );
			evaluate_state = true;
		break;
		case 'toggle_fps':
			switch (minigl.limitFPS) {
			case false :  minigl.limitFPS = 30;     break;
			case 30    :  minigl.limitFPS = 10;     break;
			case 10    :  minigl.limitFPS = false;  break;
			}
			update_state = true;
		break;
		default:  minigl.camera.command( command );
		}

		if (evaluate_state) setTimeout( ()=>evaluate_button_state(button) );
		if (update_state) update_button_states();

	} // on_mouse_up


	/**
	 * init()
	 */
	function init () {
		// Create debug menu
		self.containerElement = document.createElement( 'div' );
		self.containerElement.className = 'minigl_debug_menu';

		const heading = document.createElement( 'div' );
		heading.className = 'heading';
		heading.innerHTML = 'Mini<abbr>GL</abbr>';
		self.containerElement.appendChild( heading );

		const group_container = document.createElement( 'div' );
		group_container.className = 'groups';

		// Process button definitions and create groups
		self.buttons = [];
		button_definition.forEach( (group)=>{
			const group_element = document.createElement( 'span' );
			group.forEach( (definition)=>{
				const button = document.createElement( 'button' );

				if (definition == 'PLACEHOLDER') {
					button.className = 'placeholder';
					button.innerHTML = '&nbsp;<br>&nbsp;';
				} else {
					button.dataset.command
					= (commands[definition] == undefined)
					? 'toggle'
					: commands[definition]
					;
					button.dataset.definition = definition;
					init_button_state( definition, button );

					replace.forEach( (entry)=>{
						definition = definition.replace( entry[0], entry[1] );
					});
					button.innerHTML = definition;
				}

				group_element.appendChild( button );
				self.buttons.push( button );
			})
			group_container.appendChild( group_element );
		});

		self.containerElement.appendChild( group_container );
		minigl.containerElement.appendChild( self.containerElement );

		// Events
		self.lastClickedButton = null;
		self.containerElement.addEventListener( 'mousedown', on_mouse_down );
		self.containerElement.addEventListener( 'mouseup', on_mouse_up );

	} // init


	// CONSTRUCTOR

	init();

}; // DebugMenu


//EOF