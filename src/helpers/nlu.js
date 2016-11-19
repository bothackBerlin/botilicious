const { Wit, log } = require('node-wit');

const WIT_API_KEY = process.env.WIT_API_KEY ||
  console.warn('WIT_API_KEY env var not set.');

const client = new Wit({accessToken: WIT_API_KEY});

export const parseMessage = (message) => {
  return new Promise((resolve, reject) => {
    client.message(message, {})
      .then((data) => {
        console.log('parsed:', data);
        resolve(data);
      })
      .catch(reject);
  });
};
