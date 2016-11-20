import { sendMessage } from '../actions/sendMessage';

import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

const RESULTS = [
  {
    "text": "You could be a tech-support, starting next Month in Berlin. How does that sound?",
    "video": "https://www.youtube.com/watch?v=JUowv0KKJSI"
  },
  {
    "text": "You could also be a sales agent, starting January 2016"
  }
]

export const askResults = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "results";

  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "That sure sounds great!"}],
    [{"text": "Nope."}]
  ]);
  const text = "It doesn't look like we currently have any standard positions for you. 😕 Do you want to call us to speak about more individual opportunities?";
  return sendMessage(bot, getState(bot, req), text, options);
};
