import { sendMessage } from '../actions/sendMessage';
import { getState } from '../helpers/state';

export const speechless = (bot, req) => {
  return sendMessage(bot, getState(bot, req), "Uh oh. I understood you, but I don't know how to answer. 🙈");
}
