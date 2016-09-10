var Corrector = function(input) {

	this._input = input;

	if (input.hasAttribute('data-pattern'))
		this._pattern = input.getAttribute('data-pattern');

	else if (input.hasAttribute('placeholder'))
		this._pattern = input.getAttribute('placeholder');

	if (input.hasAttribute('data-pattern-vars')) {

		vars = input.getAttribute('data-pattern-vars');
		this._vars = this.strToVars(vars);

	}

	var self = this;

	input.addEventListener('keydown', function() { self.keepState() } );
	input.addEventListener('input', function() { self.correct() } );

	this.correct();

}

Corrector.prototype._state = '';

Corrector.prototype._pattern = '';

Corrector.prototype._input;

Corrector.prototype._vars = {
	'X': '\\d',
};

Corrector.prototype.strToVars = function (str) {

	return (new Function('', 'return ' + str))();

}

Corrector.prototype.keepState = function() {

	this._state = this._input.value;

}

Corrector.prototype.correct = function() {

	var value = this._input.value;
	var symbol = value[value.length - 1];

	if (this._pattern.length < value.length) {

		this._input.value = this._state;
		return false;

	}

	var pattern = this._pattern.slice(0, value.length);

	var exp = this.toRegExp(pattern);

	if (!value.match(exp)) {

		var item = this._pattern[value.length - 1];

		if (!(item in this._vars)) {

			this._input.value = this._state + item;
			this.keepState();

			this._input.value += symbol;

			return this.correct();

		}
		else {

			this._input.value = this._state;
			return false;

		}

	}

	else return true;

}

Corrector.prototype.toRegExp = function(pattern) {

	pattern = pattern.replace(/(\W)/g, '\\$1');

	for (k in this._vars) {
		pattern = pattern.split(k).join(this._vars[k]);
	}

	return new RegExp(pattern);

}

Corrector.prototype.setPattern = function(pattern) {

	this._pattern = pattern;

}

Corrector.prototype.setVars = function(vars) {

	this._vars = vars;

}