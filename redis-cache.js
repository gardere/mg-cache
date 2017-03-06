let logger = console.log;
let config = {};

const getRedisClient = ()  => {
  if (typeof this.redisClient === 'undefined') {
    logger.log('Redis client initialised');
    this.redisClient = redis.createClient(config);
  }
  return Promise.resolve(this.redisClient);
};

export const get = key => {
  return getRedisClient()
  .then(client => {
    return new Promise( (resolve, reject) => {
      client.get(key, function (err, value) {
        logger[error?'error':'log'](...([err] || ['redis: retrieved value for key "', key, '"']));
        if (err)
          reject(err);
        else
          resolve(value);
      });
    });
  });
};

export const put = (key, value, ttl_ms) => {
  return getRedisClient()
  .then(client => {
    return new Promise( (resolve, reject) => {
      client.set(key, value, ttl_ms, function (err, value) {
        if (err)
          reject(err);
        else
          resolve(value);
      });
    });
  });
};

export const expiresAt = key => {
  return getRedisClient()
  .then(client => {
    return new Promise((resolve, reject) => {
      client.ttl(key, (err, value) => {
        if (err)
          reject(err);
        else
          resolve(value);
      });
    });
  });
};


export const configure = newConfig => {
  config = newConfig;
};

export const NEVER_EXPIRES = -1;

