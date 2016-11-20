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
    state[chatId] = {
      chatId,
      firstName: req.chat.first_name,
    };
  }
  return state[chatId];
}

const askExperienceLevel = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(req).last_question = "experience_level";

  sendMessage(bot, getState(req), 'So you want to work for us, huh?', options);
  options.reply_markup = buildReplyKeyboardMarkup([[{"text": "Internship"}, {"text": "Junior career"}], [{"text": "I don't know yet."}]]);

  return setTimeout(() => sendMessage(bot, getState(req), 'At what level do you see yourself at?', options), 1000);
};

// Test 'invite for interview' call
bot.onText(/.*/, function (req, text) {
  if (text == "/debug") {
    return sendMessage(bot, getState(req), JSON.stringify(getState(req), null, '\t'));
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

        return {};

      case 'undecided':
        const last_question = getState(req).last_question;
        getState(req)[last_question] = null;
        getState(req).last_question = null;

        return {};

      default:
        return didNotUnderstand(bot, getState(req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(req));
  });
});
