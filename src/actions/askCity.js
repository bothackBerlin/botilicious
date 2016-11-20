import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askCity = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "city";

  const text = "What city would you like to work in?";
  return sendMessage(bot, getState(bot, req), text, options);
};
