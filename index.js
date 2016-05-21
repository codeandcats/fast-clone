'use strict';

(function(root) {
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module && module.exports) {
			exports = module.exports = clone;
		}
		exports.clone = clone;
	} 
	else {
		root.clone = clone;
	}
	
	function clone(value) {
		if (typeof value === 'object') {
			var result;
			if (value instanceof Date) {
				result = new Date();
				result.setTime(value.getTime());
				return result;
			}
			result = JSON.parse(JSON.stringify(value));
			fixDates(result, value);
			return result;
		}
		else {
			return value;
		}
	}

	function fixDates(copy, original) {
		for (var key in original) {
			var originalValue = original[key];
			if (typeof originalValue === 'object') {
				if (originalValue instanceof Date) {
					var newValue = new Date();
					newValue.setTime(originalValue.getTime());
					copy[key] = newValue;
				}
				else {
					fixDates(copy[key], originalValue);
				}
			}
		}
	}	
})(this);

