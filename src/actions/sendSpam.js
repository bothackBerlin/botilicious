import { sendMessage } from '../actions/sendMessage';

import { buildInlineKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const sendSpam = (bot, req) => {
  const options = defaultNextStateOptions();

  options.reply_markup = buildInlineKeyboardMarkup([
    [{"text": "Instagram", "url": "https://www.instagram.com/o2deutschland/"}],
    [{"text": "Twitter", "url": "https://twitter.com/o2de"}]
  ]);
  const text = "Thank you so much for getting in touch with us. We're excited to hear from you soon! In the meantime you can also follow us to stay posted with latest news!\n\n Bye! 👋";
  return sendMessage(bot, getState(bot, req), text, options);
};
