import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askStartDate = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "start_date";

  const text = "When can you start?";
  return sendMessage(bot, getState(bot, req), text, options);
};
