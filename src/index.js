const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { askExperienceLevel } from './actions/askExperienceLevel';
import { askBusinessSectorOne, askBusinessSectorTwo } from './actions/askBusinessSector';
import { askIndividualJobs } from './actions/askIndividualJobs';
import { callExit } from './actions/callExit';
import { exit } from './actions/exit';

import { speechless } from './actions/speechless';
import { didNotUnderstand } from './actions/didNotUnderstand';
import { unknownError } from './actions/unknownError';

import { parseMessage } from './helpers/nlu';
import { defaultNextStateOptions } from './helpers/conversation';
import { getState, resetState } from './helpers/state';

const token = process.env.TELEGRAM_API_KEY ||
  console.warn('TELEGRAM_API_KEY env var not set');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
bot.state = {};

// Test 'invite for interview' call
bot.onText(/.*/, function (req, text) {
  if (text == "/debug") {
    return sendMessage(bot, getState(bot, req), JSON.stringify(getState(bot, req), null, '\t'));
  }
  if (text == "/reset") {
    const options = defaultNextStateOptions();
    resetState(bot, req);
    return sendMessage(bot, getState(bot, req), "State has been reset!", options);
  }
  parseMessage(text).then((parsed) => {
    if (!parsed.entities.intent || !parsed.entities.intent.length) {
      return didNotUnderstand(bot, getState(bot, req));
    }

    const intent = parsed.entities.intent[0].value;
    const intentConfidence = parsed.entities.intent[0].confidence;

    console.log(intent);
    switch(intent) {
      case 'find a job':
        return askExperienceLevel(bot, req);

      case 'reply_experience_level':
        getState(bot, req).experience_level = parsed.entities.experience_level[0].value;
        getState(bot, req).last_question = null;

        return askBusinessSectorOne(bot, req)

      case 'reply_business_sector':
        getState(bot, req).business_sector = parsed.entities.business_sector[0].value;

        return speechless(bot, req);

      case 'undecided':
        const last_question = getState(bot, req).last_question;
        getState(bot, req)[last_question] = null;
        getState(bot, req).last_question = null;

        const options = defaultNextStateOptions();
        sendMessage(bot, getState(bot, req), "That's okay, we have oppertunities for many different experience levels.", options);
        return setTimeout(() => askBusinessSectorOne(bot, req), 1000);

      case 'more_information':
        if (getState(bot, req).page == 2) {
          return askIndividualJobs(bot, req);
        }
        getState(bot, req).page = 2;

        return askBusinessSectorTwo(bot, req);

      case 'previous_options':
        getState(bot, req).page = 1;

        return askBusinessSectorOne(bot, req);

      case 'yes':

        return callExit(bot, req);

      case 'no':

        return exit(bot, req);

      default:
        return didNotUnderstand(bot, getState(bot, req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(bot, req));
  });
});
