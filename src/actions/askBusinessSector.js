import { sendMessage } from '../actions/sendMessage';

import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

const BUTTON_TECHNOLOGY = {"text": "Technology"};
const BUTTON_TV_MEDIA = {"text": "TV & Media"};
const BUTTON_TALENTUM = {"text": "Talentum"};
const BUTTON_BI = {"text": "BI & Big Data"};
const BUTTON_ECOMMERCE = {"text": "Ecommerce"};
const BUTTON_INNOVATION = {"text": "Innovation"};
const BUTTON_SALES = {"text": "Sales"};
const BUTTON_SHOPS = {"text": "Shops & Retail"};
const BUTTON_CUSTOMER_SERVICE = {"text": "Customer Service"};
const BUTTON_OFFICE_SUPPORT = {"text": "Office Support"};

const BUTTON_NOT_THOSE = {"text": "Do you have any other options?"};
const BUTTON_PREVIOUS = {"text": "What were the first ones?"};

export const askBusinessSectorOne = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "business_sector";

  options.reply_markup = buildReplyKeyboardMarkup([
    [BUTTON_TECHNOLOGY, BUTTON_TV_MEDIA, BUTTON_TALENTUM],
    [BUTTON_BI, BUTTON_ECOMMERCE, BUTTON_INNOVATION],
    [BUTTON_NOT_THOSE]
  ]);

  return sendMessage(bot, getState(bot, req), 'In which of our business sectors do you want to be active?', options);
};

export const askBusinessSectorTwo = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "business_sector";

  options.reply_markup = buildReplyKeyboardMarkup([
    [BUTTON_SALES, BUTTON_SHOPS],
    [BUTTON_CUSTOMER_SERVICE, BUTTON_OFFICE_SUPPORT],
    [BUTTON_PREVIOUS, BUTTON_NOT_THOSE]
  ]);

  return sendMessage(bot, getState(bot, req), 'Here are some others:', options);
};
