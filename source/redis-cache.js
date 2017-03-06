import {default as redis} from 'redis';

let logger = console;
let config = {};
let redisClient;

const getRedisClient = ()  => {
  if (typeof redisClient === 'undefined') {
    logger.log('Redis client initialised');
    redisClient = redis.createClient(config);
  }
  return Promise.resolve(redisClient);
};

const clientActionWrapper = (actionName, args, successMessage, errorMessage) => {
  return getRedisClient()
      .then(client => {
        return new Promise( (resolve, reject) => {
          client[actionName](...args, function (err, value) {
            if (err) {
              logger.error('redis:', errorMessage, "for key:", args[0], err.toString().substring(0, 255));
              reject(err);
            }
            else {
              logger.log('redis:', successMessage, 'for key "', args[0], '"');
              resolve(value);
            }
          });
        });
      });
};

export const get = key => clientActionWrapper('get', [key], 'retrieved value', 'error retrieving value');

export const put = (key, value, ttl_ms) => clientActionWrapper('set', [key, value], 'value set', 'error setting value')
      .then(() => clientActionWrapper('expire', [key, ttl_ms / 1000], 'ttl set', 'error setting ttl'));

export const expiresAt = key => clientActionWrapper('ttl', [key], 'retrieved ttl', 'error retrieving ttl');


export const configure = newConfig => {
  config = newConfig;
};

export const NEVER_EXPIRES = -1;

