
import { sendMessage } from '../actions/sendMessage';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';
import { buildInlineKeyboardMarkup } from '../helpers/keyboard';

export const callExit = (bot, req) => {
  const options = defaultNextStateOptions();
  return sendMessage(bot, getState(bot, req), 'Thanks for the interest! We are eager to hear from you! \n\n +4930816160140', options);
}
