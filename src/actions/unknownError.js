
export const unknownError = (bot, state) => {
  bot.sendMessage(state.chatId, 'Sorry, something went wrong. Maybe try again?');
};
