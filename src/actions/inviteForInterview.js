import { sendMessage } from './sendMessage';
import { sendLocation } from './sendLocation';

export const inviteForInterview = (bot, state) => {
  console.log('state:', state);
  const message = 'come by for an interview!';
  sendMessage(bot, state, message);
  sendLocation(bot, state, '47.4925', '19.0513');
};
