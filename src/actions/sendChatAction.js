
export const sendChatAction = (bot, state, message, options) => {
  bot.sendChatAction(state.chatId, message, options);
};
