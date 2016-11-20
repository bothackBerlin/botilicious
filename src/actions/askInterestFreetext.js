import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askInterestFreetext = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "interest_freetext";

  const text = "Could you please tell me about one of your hobbies and why you are interested in it in a few sentences?";
  return sendMessage(bot, getState(bot, req), text, options);
};
