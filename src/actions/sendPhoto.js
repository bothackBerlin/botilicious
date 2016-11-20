
export const sendPhoto = (bot, state, message, options) => {
  bot.sendPhoto(state.chatId, message, options);
};
