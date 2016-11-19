
export const sendMessage = (bot, state, message, options) => {
  bot.sendMessage(state.chatId, message, options);
};

// undo any possible local app state if we move to next conversation step
export const sendClearMessage = (bot, state, message) {
  const replyKeyboardRemove = {
    hide_keyboard: true
  };
  sendMessage(bot, state, message, { reply_markup: replyKeyboardRemove});
};
