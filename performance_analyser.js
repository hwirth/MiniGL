// performance_analyser.js
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/
// MiniGL - A simple WebGL 3D Engine - copy(l)eft 2020 - https://harald.ist.org/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////119:/

import * as Helpers from './minigl_helpers.js';


/**
 * PerformanceAnalyser()
 */
export const PerformanceAnalyser = function (parameters = {}) {
	const self = this;

	this.context;

	this.enabled;

	this.drawKeys;
	this.left;
	this.top;
	this.width;
	this.height;

	this.graphs;
	this.nrValues;
	this.minima;
	this.maxima;


	/**
	 * get_average()
	 */
	function get_average (arr) {
		return arr.reduce( (accumulator, value)=>{
			return accumulator + value;
		}) / (arr.length);

	} //  get_average


	/**
	 * dump()
	 */
	this.dump = function () {
		console.log( JSON.parse(JSON.stringify( self.graphs )) );

	}; // dump


	/**
	 * addGraph()
	 */
	this.addGraph = function (parameters) {

		function get_param( key, default_value) {
			return (parameters[key] === undefined) ? default_value : parameters[key];
		}

		const key = parameters.key;
		self.graphs[key] = {
			label     : get_param( 'label'    , key    ),
			color     : get_param( 'color'    , '#f00' ),
			lineWidth : get_param( 'lineWidth', 1      ),
			lineDash  : get_param( 'lineDash' , []     ),
			scale     : get_param( 'scale'    , 1      ),
			average   : get_param( 'average'  , 0      ),
		};

		const graph    = self.graphs[key];
		graph.values   = Array( self.nrValues ).fill( graph.average );
		graph.averages = Array( self.nrValues ).fill( graph.average );

	}; // addGraph


	/**
	 * storeValue()
	 */
	this.storeValue = function (key, value, add_to_averages = false) {
		if (!self.enabled) return;

		const graph = self.graphs[key];
		if (graph == undefined) throw new Error( 'Graph undefined: ' + key );

		const values = (add_to_averages) ? graph.averages : graph.values;

		values.shift();
		values.push( value );
		graph.average = get_average( values );

		if (! add_to_averages) {
			self.storeValue(
				key,
				graph.average,
				true,
			);
		}

	}; // storeValue


	/**
	 * drawGraph()
	 */
	this.drawGraph = function () {
		const context = self.context;
		const keys    = self.drawKeys || Object.keys( self.graphs );
		const left    = (self.left < 0) ? context.canvas.width + self.left : self.left;
		const top     = (self.top  < 0) ? context.canvas.height + self.top : self.top;
		const width   = self.width;
		const height  = self.height;

		const unit_headroom = 1.15;
		const font_size     = 10;


		/*
		 * Find minimum and maxmimum values
		 */
		let min = Number.POSITIVE_INFINITY;
		let max = Number.NEGATIVE_INFINITY;
		self.drawKeys.forEach( (key)=>{
			const graph = self.graphs[key];

			graph.values.forEach( (value)=>{
				const scaled_value = value * graph.scale;
				if (scaled_value < min) min = scaled_value;
				if (scaled_value > max) max = scaled_value;
			});
		});
		if (self.minima.length >= self.nrValues) self.minima.shift();
		if (self.maxima.length >= self.nrValues) self.maxima.shift();
		self.minima.push( min );
		self.maxima.push( max );


		/*
		 * Scale y-axis
		 */
		const value_span      = (get_average( self.maxima ) - get_average( self.minima ));
		const unit_proportion = value_span / height;
		let   unit_scale      = unit_proportion * unit_headroom;


		/*
		 * Graphs
		 */
		function get_coords (graph, index, averages) {
			const value = (averages) ? graph.averages[index] : graph.values[index];
			return {
				x: left +  index * width / (self.nrValues - 1),
				y: top + height - Math.min( height, value * graph.scale / unit_scale ),
			};
		}

		function get_color (color, opacity) {
			return (
				'rgba(' + color[0]
				+ ','   + color[1]
				+ ','   + color[2]
				+ ','   + (color[3] * opacity)
				+ ')'
			);
		}

		context.fillStyle = '#000'; //'rgba(0,0,0, 0.5)';
		context.fillRect( left, top, width, height );

		context.font = font_size + 'px monospace';
		context.textBaseline = 'top';

		var text_x, value_y;

		let text_y = (self.top < 0) ? (height-keys.length*font_size+2) : 0;
		keys.forEach( (key)=>{
			const graph = self.graphs[key];

			// Raw values
			let initial_coords  = get_coords( graph, 0, false );
			context.strokeStyle = get_color( graph.color, 0.5 );
			context.lineWidth   = graph.lineWidth / 2;
			context.setLineDash( [] );

			context.beginPath();
			context.moveTo( initial_coords.x, initial_coords.y );
			for (let i = 1; i < self.nrValues; ++i) {
				const coords = get_coords( graph, i, false );
				context.lineTo( coords.x, coords.y );
			}
			context.stroke();

			// Averages
			initial_coords      = get_coords( graph, 0, true );
			context.strokeStyle = get_color( graph.color, 1 );
			context.lineWidth   = graph.lineWidth;
			context.setLineDash( graph.lineDash );

			context.beginPath();
			context.moveTo( initial_coords.x, initial_coords.y );
			for (let i = 1; i < self.nrValues; ++i) {
				const coords = get_coords( graph, i, true );
				context.lineTo( coords.x, coords.y );
				value_y = coords.y;
			}
			context.stroke();

			// Legend
			if (self.left < 0) {
				text_x = left - 5;
				context.textAlign = 'right';
			} else {
				text_x = left+width + 5;
				context.textAlign = 'left';
			}
			context.fillStyle = get_color( graph.color, 1 );
			context.fillText( graph.label, text_x, top + initial_coords.y - font_size*0.8); //text_y );
			text_y += font_size;

			// Value
			if (self.left >= 0) {
				text_x = left - 5;
				context.textAlign = 'right';
			} else {
				text_x = left+width + 5;
				context.textAlign = 'left';
			}
			let current_average = graph.averages[graph.averages.length-1].toPrecision(4).slice(0,5);
			context.fillText( current_average, text_x, top + value_y - font_size*0.8 );
		});


		/*
		 * Coordinate grid
		 */
		while (unit_scale > 1) unit_scale /= 10;
		if (unit_scale < 0.25) unit_scale *= 10;

		context.lineWidth = 1.5;
		context.setLineDash( [] );
		for (let y = 0; y/unit_scale <= height; y+=10) {
			let luminance = 0.1;
			if (y % 250 == 0) {
				luminance = 0.35;
			}
			else if (y % 50 == 0) {
				luminance = 0.25;
			}
			context.strokeStyle = 'rgba(255,255,255, ' + luminance + ')';

			const y_pos = y / unit_scale;

			context.beginPath();
			context.moveTo( left, top + height - y_pos );
			context.lineTo( left + width, top + height - y_pos );
			context.stroke();

			if (y_pos > height) break;
		}

	}; // drawGraph



	/**
	 * toggle()
	 */
	this.toggle = function (new_state = null) {
		if (new_state === null) state = !self.enabled;
		self.enabled = new_state;

	}; // toggle


	/**
	 * init()
	 */
	function init (parameters) {
		self.context  = parameters.context;
		self.enabled  = Helpers.getParam( parameters, 'enabled'  , true );
		self.drawKeys = Helpers.getParam( parameters, 'drawKeys' , null );
		self.left     = Helpers.getParam( parameters, 'left'     , 0    );
		self.top      = Helpers.getParam( parameters, 'top'      , 0    );
		self.width    = Helpers.getParam( parameters, 'width'    , self.context.canvas.width - self.left );
		self.height   = Helpers.getParam( parameters, 'height'   , self.context.canvas.height - self.top );

		self.graphs = {};

		self.nrValues = parameters.nrValues ? parameters.nrValues : 50;

		self.minima = [0]; //Array( self.nrValues ).fill( parameters.initialMin || 0 );
		self.maxima = [0]; //Array( self.nrValues ).fill( parameters.initialMax || 0 );

		Object.keys( parameters.graphs ).forEach( (graph_key)=>{
			const definition = parameters.graphs[graph_key];
			self.addGraph({
				key       : graph_key,
				label     : definition.label,
				color     : definition.color,
				lineWidth : definition.lineWidth,
				lineDash  : definition.lineDash,
				scale     : definition.scale,
				average   : definition.average,
			});
		});

	} // init


	// CONSTRUCTOR

	init( parameters );

}; // Hysteresis


//EOF