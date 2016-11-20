import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askQualifications = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "qualifications";

  const text = "What are your qualifications?";
  return sendMessage(bot, getState(bot, req), text, options);
};
