
export const sendMessage = (bot, state, message) => {
  bot.sendMessage(state.chatId, message);
};
