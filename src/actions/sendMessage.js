
export const sendMessage = (bot, state, message, options) => {
  bot.sendMessage(state.chatId, message, options);
};
