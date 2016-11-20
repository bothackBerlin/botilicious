
export const sendPhoto = (bot, state, message, options) => {
  bot.sendDocument(state.chatId, message, options);
};
