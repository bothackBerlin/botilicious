
export const getState = (bot, req) => {
  const chatId = req.chat.id;
  if (!bot.state[chatId]) {
    resetState(bot, req);
  }
  return bot.state[chatId];
}

export const resetState = (bot, req) => {
  const chatId = req.chat.id;
  bot.state[chatId] = initialState(req);
};

export const initialState = (req) => {
  const chatId = req.chat.id;
  return {
    chatId,
    firstName: req.chat.first_name,
  };
}
