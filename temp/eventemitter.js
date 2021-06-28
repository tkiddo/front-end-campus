function EventEmitter() {
  EventEmitter.prototype.init.call(this);
}

function apply(target, type, listener, args) {
  listener.apply(target, args);
  if (listener.isOnce) {
    target.removeListener(type, listener);
  }
}

EventEmitter.prototype.init = function() {
  this._eventsMap = new Map();
};

EventEmitter.prototype.on = function(type, listener) {
  const existing = this._eventsMap.get(type);
  const eventsMap = this._eventsMap;
  if (!existing) {
    eventsMap.set(type, listener);
  } else {
    if (typeof existing === 'function') {
      eventsMap.set(type, [existing, listener]);
    } else {
      eventsMap.get(type).push(listener);
    }
  }
};

EventEmitter.prototype.emit = function(type) {
  const handler = this._eventsMap.get(type);
  const args = [];
  for (let i = 1; i < arguments.length; i++) args.push(arguments[i]);
  if (handler === undefined) return false;
  if (typeof handler === 'function') {
    apply(this, type, handler, args);
  } else {
    handler.forEach((item) => {
      apply(this, type, item, args);
    });
  }
};

EventEmitter.prototype.once = function(type, listener) {
  listener.isOnce = true;
  this.on(type, listener);
};

EventEmitter.prototype.removeListener = function(type, listener) {
  const existing = this._eventsMap.get(type);
  const eventsMap = this._eventsMap;
  if (typeof existing === 'function') {
    eventsMap.delete(type);
  } else if (Array.isArray(existing)) {
    const idx = existing.findIndex((i) => i === listener);
    if (idx >= 0) {
      existing.splice(idx, 1);
    }
  }
};

module.exports = EventEmitter;
