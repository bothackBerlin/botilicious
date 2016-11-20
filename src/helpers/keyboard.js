
export const buildReplyKeyboardMarkup = (keyboard) => {
  return {
    keyboard,
    one_time_keyboard: true,
    hide_keyboard: true
  };
};

export const buildInlineKeyboardMarkup = (keyboard) => {
  return {
    inline_keyboard: keyboard,
  };
};
