
export const sendLocation = (bot, state, latitude, longitude) => {
  bot.sendLocation(state.chatId, latitude, longitude);
};
