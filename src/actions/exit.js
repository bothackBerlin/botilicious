
import { sendMessage } from '../actions/sendMessage';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const exit = (bot, req) => {
  const options = defaultNextStateOptions();
  return sendMessage(bot, getState(bot, req), "Thanks for the interest! Byeee! 👋", options);
}
