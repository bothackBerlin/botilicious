import { sendMessage } from '../actions/sendMessage';

import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askExperienceLevel = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "experience_level";

  sendMessage(bot, getState(bot, req), 'So you want to work for us, huh?', options);
  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "Internship"}, {"text": "Junior career"}],
    [{"text": "I don't know yet."}]
  ]);

  return setTimeout(() => sendMessage(bot, getState(bot, req), 'At what level do you see yourself at?', options), 1000);
};
