'use strict';

import core from 'metal';
import templates from './LayoutBuilder.soy.js';
import Component from 'metal-component';
import Soy from 'metal-soy';
import './columns/LayoutCol';
import './builder/LayoutColResizer';

/**
 * UI Component that can receive data about rows/columns and render them
 * according to bootstrap's 3 grid system.
 */
class LayoutBuilder extends Component {
	/**
	 * @inheritDoc
	 */
	created() {
		this.calcBreakpoints_();
	}

	/**
	 * @inheritDoc
	 */
	attached() {
		this.on('dataChanged', this.calcBreakpoints_);
	}

	/**
	 * Recalculates `breakpoints_` according to the current value of `data`.
	 * @protected
	 */
	calcBreakpoints_() {
		const breakpoints = [];
		for (let i = 0; i < this.data.length; i++) {
			breakpoints.push({
				0: true
			});
			let last = 0;
			var columns = this.data[i].columns;
			for (let j = 0; j < columns.length; j++) {
				last += columns[j].size;
				breakpoints[i][last] = true;
			}
		}
		this.breakpoints_ = breakpoints;
	}

	/**
	 * Handles a `click` event on a button for removing rows.
	 * @param {!Event} event
	 * @protected
	 */
	handleClickRemove_(event) {
		var element = event.delegateTarget;
		var index = parseInt(element.getAttribute('data-index'), 10);
		this.data.splice(index, 1);
		this.data = this.data;
	}
}

/**
 * State definition.
 * @type {!Object}
 * @static
 */
LayoutBuilder.STATE = {
	/**
	 * Internal map indicating which breakpoints are being used (calculated from
	 * `data`).
	 * @type {!Array}
	 */
	breakpoints_: {
		validator: core.isArray,
		valueFn: () => [{0: true, 12: true}]
	},

	/**
	 * An array of rows/columns which defines contents and sizes.
	 * @type {!Array}
	 */
	data: {
		validator: core.isArray,
		valueFn: () => []
	}
};

Soy.register(LayoutBuilder, templates);

export default LayoutBuilder;
