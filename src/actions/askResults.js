import { sendMessage } from '../actions/sendMessage';
import { sendSpam } from '../actions/sendSpam';
import { askPhone } from '../actions/askPhone';

import { buildReplyKeyboardMarkup } from '../helpers/keyboard';
import { defaultNextStateOptions } from '../helpers/conversation';
import { getState } from '../helpers/state';

const RESULTS = [
  {
    "text": "You could be a tech-support, starting next Month in Berlin. How does that sound?\n\nVideo: https://www.youtube.com/watch?v=JUowv0KKJSI",
    "video": "https://www.youtube.com/watch?v=JUowv0KKJSI",
  },
  {
    "text": "You could also be a sales agent, starting January 2016 in Postdam.\n\nVideo: https://www.youtube.com/watch?v=EXFOSOJqpl4",
    "video": "https://www.youtube.com/watch?v=EXFOSOJqpl4",
  },
  {
    "text": "You might also be interested in a retail manager poistion in Berlin, starting January 2016.\n\nVideo: https://www.youtube.com/watch?v=1MtNn5UtFhw",
    "video": "https://www.youtube.com/watch?v=1MtNn5UtFhw",
  }
]

const YES_REPLIES = [
  "Awesome.",
  "Great!",
  "Nice :)",
];

const NO_REPLIES = [
  "Well...",
  "Too bad :/",
  "Damn!",
];

export const askResults = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).last_question = "results";
  if (!getState(bot, req).result_num) {
    getState(bot, req).result_num = 0;
    getState(bot, req).result_accepted = [];
  }

  options.reply_markup = buildReplyKeyboardMarkup([
    [{"text": "That sure sounds great!"}],
    [{"text": "Nope."}]
  ]);
  const text = RESULTS[getState(bot, req).result_num].text;
  getState(bot, req).result_num = getState(bot, req).result_num + 1;
  return sendMessage(bot, getState(bot, req), text, options);
};

export const handleYes = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).result_accepted.push(true);

  if (!RESULTS[getState(bot, req).result_num]) {
    return handleFinal(bot, req);
  }
  const text = YES_REPLIES[getState(bot, req).result_num - 1];
  sendMessage(bot, getState(bot, req), text, options);

  return setTimeout(() => askResults(bot, req), 500);
}

export const handleNo = (bot, req) => {
  const options = defaultNextStateOptions();
  getState(bot, req).result_accepted.push(false);

  if (!RESULTS[getState(bot, req).result_num]) {
    return handleFinal(bot, req);
  }
  const text = NO_REPLIES[getState(bot, req).result_num - 1];
  sendMessage(bot, getState(bot, req), text, options);

  return setTimeout(() => askResults(bot, req), 500);
};

const NUM_TO_TEXT = {
  1: "one",
  2: "two",
  3: "three",
}

const handleFinal = (bot, req) => {
  const options = defaultNextStateOptions();
  let countAccepted = 0;
  for(const acceptedState of getState(bot, req).result_accepted) {
    if (acceptedState) {
      countAccepted++;
    }
  }

  if (countAccepted > 0) {
    return handleSomeAccepted(bot, req);
  } else {
    return handleNoneAccepted(bot, req);
  }
};

const handleSomeAccepted = (bot, req) => {
  const options = defaultNextStateOptions();

  return askPhone(bot, req);
}

const handleNoneAccepted = (bot, req) => {
  const options = defaultNextStateOptions();

  const text = "Mmh. How about take a look on our career-portal to get more information about your opportunities. https://jobs.telefonica.com/";
  sendMessage(bot, getState(bot, req), text, options);

  return setTimeout(() => sendSpam(bot, req), 500);
}
