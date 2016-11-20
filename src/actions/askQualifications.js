import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';
import { buildReplyKeyboardMarkup } from '../helpers/keyboard';

export const askQualifications = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "qualifications";
  // options.reply_markup = buildReplyKeyboardMarkup([
  //   [{"text": "That sure sounds great!"}],
  //   [{"text": "Nope."}]
  // ]);

  const text = "Whats you highest academic achievement so far?";
  return sendMessage(bot, getState(bot, req), text, options);
};
