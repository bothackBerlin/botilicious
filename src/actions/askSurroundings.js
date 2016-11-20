import { sendMessage } from '../actions/sendMessage';

import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';
import { buildReplyKeyboardMarkup } from '../helpers/keyboard';

export const askSurroundings = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "surroundings";
  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "I like to work with people!"}],
    [{"text": "I like to work with ideas!"}],
    [{"text": "I like to work outside!"}],
  ]);

  const text = "In what environment do you want to work in a daily basis?";
  return sendMessage(bot, getState(bot, req), text, options);
};
