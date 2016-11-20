// import G from 'gizoogle';

export const sendMessage = (bot, state, message, options) => {
  // G.string(message, function(error, translation) {
    bot.sendMessage(state.chatId, message, options);
  // });
};
