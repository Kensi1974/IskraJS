var Stick = function(pinX, pinY, pinZ, opts) {
  opts = opts || {};
  this._pinX = pinX;
  this._pinY = pinY;
  this._pinZ = pinZ;

  this._normalSignal = (opts.normalSignal === 0) ? 0 : 1;
  this._pin.mode(this._normalSignal ? 'input_pullup' : 'input_pulldown');

  this._holdTime = opts.holdTime || 1;
  this._holdTimeoutID = null;

  var debounce = (opts.debounce === undefined) ? 10 : opts.debounce;
  setWatch(this._onChange.bind(this), this._pinX, this._pinY, {
    repeat: true,
    edge: 'both',
    debounce: debounce
  });
};

/* Deprecated: use `isPressed` intead */
Stick.prototype.read = function() {
  return this.isPressed() ? 'down' : 'up';
};

Stick.prototype.isPressed = function() {
  return this._pinZ.read() !== !!this._normalSignal;
};

Stick.prototype._onChange = function(e) {
  var pressed = (this._normalSignal === 0) ? e.state : !e.state;
  var self = this;

  if (this._holdTime && pressed) {
    // emit hold event after timeout specified in options
    this._holdTimeoutID = setTimeout(function() {
      self.emit('hold');
      self._holdTimeoutID = null;
    }, this._holdTime * 1000);
  } else if (!pressed) {
    // emit click only if hold was not already emitted
    if (this._holdTimeoutID) {
      clearTimeout(this._holdTimeoutID);
      this._holdTimeoutID = null;
      this.emit('click');
    }
  }

  this.emit(pressed ? 'press' : 'release');
};

exports.connect = function(pin, opts) {
  return new Stick(pin, opts);
};