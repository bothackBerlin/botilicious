const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { inviteForInterview } from './actions/inviteForInterview';
import { didNotUnderstand } from './actions/didNotUnderstand';
import { unknownError } from './actions/unknownError';
import { parseMessage } from './helpers/nlu';

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

    switch(intent) {
      case 'find a job':
        return sendMessage(bot, getState(req), 'So you want to work at us?');

      default:
        return didNotUnderstand(bot, getState(req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(req));
  });

});
