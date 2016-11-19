export defaultNextStateOptions = () => {
  const replyKeyboardRemove = {
    hide_keyboard: true
  };
  return {
    reply_markup: replyKeyboardRemove
  };
}
