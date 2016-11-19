const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { inviteForInterview } from './actions/inviteForInterview';
import { didNotUnderstand } from './actions/didNotUnderstand';
import { unknownError } from './actions/unknownError';
import { parseMessage } from './helpers/nlu';
import { defaultNextStateOptions } from './helpers/conversation';

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

// Test 'invite for interview' call
bot.onText(/.*/, function (req, text) {
  parseMessage(text).then((parsed) => {
    if (!parsed.entities.intent || !parsed.entities.intent.length) {
      return didNotUnderstand(bot, getState(req));
    }

    const intent = parsed.entities.intent[0].value;
    const intentConfidence = parsed.entities.intent[0].confidence;

    const replyKeyboardMarkup = {
      keyboard: [[{"text": "One"}, {"text": "Two"}]],
      one_time_keyboard: true,
      hide_keyboard: true
    };

    const inlineKeyboardMarkup = {
      inline_keyboard: [[{"text": "One", "url": "http://www.google.com"}, {"text": "Two", "url": "http://www.google.com"}]]
    };

    const options = defaultNextStateOptions();

    switch(intent) {
      case 'find_a_job':
        return sendMessage(bot, getState(req), 'So you want to work for us?');

      default:
        return didNotUnderstand(bot, getState(req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(req));
  });

});
