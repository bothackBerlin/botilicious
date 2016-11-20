import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askSurroundings = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "surroundings";

  const text = "In what environment do you want to work on a daily basis?";
  return sendMessage(bot, getState(bot, req), text, options);
};
