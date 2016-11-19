const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { inviteForInterview } from './actions/inviteForInterview';

const token = process.env.TELEGRAM_API_KEY ||
  console.warn('TELEGRAM_API_KEY env var not set');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const state = {};

const getState = (msg) => {
  const chatId = msg.chat.id;
  if (!state[chatId]) {
    state[chatId] = {
      chatId,
      firstName: msg.chat.first_name,
    };
  }
  return state[chatId];
}

// Test 'invite for interview' call
bot.onText(/.*/, function (msg, text) {
  if (/.*invite.*/.test(text)) {
    inviteForInterview(bot, getState(msg));
  } else {
    sendMessage(bot, getState(msg), 'I don\'t understand, ' + getState(msg).firstName);
  }
});
