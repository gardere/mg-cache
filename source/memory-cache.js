var q = require('q');
var _ = require('lodash');
var cache = {};

var NEVER_EXPIRES = -1;

let garbageCollectorInterval;
const GARBAGE_COLLECTOR_INTERVAL = 30000;

module.exports.NEVER_EXPIRES = NEVER_EXPIRES;


module.exports.get = function(cacheKey) {
    return q.when((cache[cacheKey] || {}).value);
};

module.exports.put = function(cacheKey, value, ttl) {
    cache[cacheKey] =  {
    	value: value,
    	expiryDate: (ttl !== NEVER_EXPIRES) ? _.now() + ttl : NEVER_EXPIRES
    };

    if (!garbageCollectorInterval) {
      garbageCollectorInterval = setInterval(garbageCollector, GARBAGE_COLLECTOR_INTERVAL);
    }

  return q.when();
};

module.exports.configure = function() {
    return q.when(true);
};

module.exports.expiresAt = function(cacheKey) {
	return q.when((cache[cacheKey] || {}).expiryDate);
};

const garbageCollector = () => {
  const now = Date.now();
  const future = now + 1;
  const futureObject = {
    expiryDate: future
  };

  Object.keys(cache).forEach(key => {
    if ((cache[key] || futureObject).expiryDate !== NEVER_EXPIRES && (cache[key] || futureObject).expiryDate < now) {
      delete cache[key];
    }
  });

  if (Object.keys(cache).length === 0) {
    clearInterval(garbageCollectorInterval);
    garbageCollectorInterval = void 0;
  }
};


export const REQUIRES_STRINGIFY = false;