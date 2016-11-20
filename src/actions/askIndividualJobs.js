import { sendMessage } from '../actions/sendMessage';

import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askIndividualJobs = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "individual_jobs";

  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "That sure sounds great!"}],
    [{"text": "Nope."}]
  ]);
  const text = "It doesn't look like we currently have any standard positions for you. 😕 Do you want to call us to speak about more individual opportunities?";
  return sendMessage(bot, getState(bot, req), text, options);
};
