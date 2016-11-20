import { sendMessage } from '../actions/sendMessage';

// import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

export const askPhone = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "phone";

  const text = "Awesome!!! Please give us your phone number to inform you about the next steps soon. It shouldn't be more than 5 days. ;)";
  sendMessage(bot, getState(bot, req), text, options);
};
