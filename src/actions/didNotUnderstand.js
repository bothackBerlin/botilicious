
export const didNotUnderstand = (bot, state) => {
  bot.sendMessage(state.chatId, 'Sorry, I did not understand you.');
};
