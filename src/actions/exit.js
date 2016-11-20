
import { sendMessage } from '../actions/sendMessage';
import { getState } from '../helpers/state';

export const exit = (bot, req) => {
  return sendMessage(bot, getState(bot, req), "Thanks for the interest! Byeee! 👋");
}
