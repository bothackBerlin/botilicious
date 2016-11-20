const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { inviteForInterview } from './actions/inviteForInterview';
import { didNotUnderstand } from './actions/didNotUnderstand';
import { unknownError } from './actions/unknownError';
import { parseMessage } from './helpers/nlu';
import { defaultNextStateOptions } from './helpers/conversation';
import { buildReplyKeyboardMarkup, buildInlineKeyboardMarkup } from './helpers/keyboard';

const token = process.env.TELEGRAM_API_KEY ||
  console.warn('TELEGRAM_API_KEY env var not set');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const state = {};

const getState = (req) => {
  const chatId = req.chat.id;
  if (!state[chatId]) {
    resetState(req);
  }
  return state[chatId];
}

const resetState = (req) => {
  const chatId = req.chat.id;
  state[chatId] = initialSate(req);
};

const initialSate = (req) => {
  const chatId = req.chat.id;
  return {
    chatId,
    firstName: req.chat.first_name,
  };
}

const askExperienceLevel = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(req).last_question = "experience_level";

  sendMessage(bot, getState(req), 'So you want to work for us, huh?', options);
  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "Internship"}, {"text": "Junior career"}],
    [{"text": "I don't know yet."}]
  ]);

  return setTimeout(() => sendMessage(bot, getState(req), 'At what level do you see yourself at?', options), 1000);
};

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

const askBusinessSectorOne = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(req).last_question = "business_sector";

  options.reply_markup = buildReplyKeyboardMarkup([
    [BUTTON_TECHNOLOGY, BUTTON_TV_MEDIA, BUTTON_TALENTUM],
    [BUTTON_BI, BUTTON_ECOMMERCE, BUTTON_INNOVATION],
    [BUTTON_NOT_THOSE]
  ]);

  return sendMessage(bot, getState(req), 'I which of our business sectors do you want to be active?', options);
};

const speechless = (bot, req) => {
  return sendMessage(bot, getState(req), "Uh oh. I understood you, but I don't know how to answer. 🙈");
}

// Test 'invite for interview' call
bot.onText(/.*/, function (req, text) {
  if (text == "/debug") {
    return sendMessage(bot, getState(req), JSON.stringify(getState(req), null, '\t'));
  }
  if (text == "/reset") {
    resetState(req);
    return sendMessage(bot, getState(req), "State has been reset!");
  }
  parseMessage(text).then((parsed) => {
    if (!parsed.entities.intent || !parsed.entities.intent.length) {
      return didNotUnderstand(bot, getState(req));
    }

    const intent = parsed.entities.intent[0].value;
    const intentConfidence = parsed.entities.intent[0].confidence;

    console.log(intent);
    switch(intent) {
      case 'find a job':
        return askExperienceLevel(bot, req);

      case 'reply_experience_level':
        getState(req).experience_level = parsed.entities.experience_level[0].value;
        getState(req).last_question = null;

        return askBusinessSectorOne(bot, req)

      case 'reply_business_sector':
        getState(req).business_sector = parsed.entities.business_sector[0].value;

        return speechless(bot, req);

      case 'undecided':
        const last_question = getState(req).last_question;
        getState(req)[last_question] = null;
        getState(req).last_question = null;

        const options = defaultNextStateOptions();
        sendMessage(bot, getState(req), "That's okay, we have oppertunities for many different experience levels.", options);
        return setTimeout(() => askBusinessSectorOne(bot, req), 1000);

      case 'more information':
        return speechless(bot, req);

      default:
        return didNotUnderstand(bot, getState(req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(req));
  });
});
