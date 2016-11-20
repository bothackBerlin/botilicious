const TelegramBot = require('node-telegram-bot-api');

import { sendMessage } from './actions/sendMessage';
import { sendChatAction } from './actions/sendChatAction';
import { sendPhoto } from './actions/sendPhoto';
import { askBusinessSectorOne, askBusinessSectorTwo } from './actions/askBusinessSector';
import { askCity } from './actions/askCity';
import { askExperienceLevel } from './actions/askExperienceLevel';
import { askIndividualJobs } from './actions/askIndividualJobs';
import { askInterestFreetext } from './actions/askInterestFreetext';
import { askQualifications } from './actions/askQualifications';
import { askResults } from './actions/askResults';
import { askStartDate } from './actions/askStartDate';
import { askSurroundings } from './actions/askSurroundings';
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

const handleMock = (bot, req) => {
  if (getState(bot, req).last_question == "city") {
    getState(bot, req).city = "Berlin";
    getState(bot, req).last_question = null;

    askStartDate(bot, req);
    return false;
  }
  else if (getState(bot, req).last_question == "start_date") {
    getState(bot, req).start_date = "2016.12.01";
    getState(bot, req).last_question = null;

    askQualifications(bot, req);
    return false;
  }
  else if (getState(bot, req).last_question == "qualifications") {
    getState(bot, req).qualifications = "college";
    getState(bot, req).last_question = null;

    askInterestFreetext(bot, req);
    return false;
  }
  else if (getState(bot, req).last_question == "interest_freetext") {
    getState(bot, req).interest_freetext = "Bla bla bla bla";
    getState(bot, req).last_question = null;

    const options = defaultNextStateOptions();
    sendMessage(bot, getState(bot, req), "Great! We're almost done!", options);

    setTimeout(() => askSurroundings(bot, req), 1000);
    return false;
  }
  else if (getState(bot, req).last_question == "surroundings") {
    getState(bot, req).surroundings = "outside";
    getState(bot, req).last_question = null;

    sendMessage(bot, getState(bot, req), "Let me see if I can find something for you. Just a sec!", options)
    sendChatAction(bot, getState(bot, req), "typing", options);
    const options = defaultNextStateOptions();
    setTimeout(() => sendMessage(bot, getState(bot, req), "Great! We're almost done!", options), 5000);
    return false;
  }
  return true;
};

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
  if (text == "/start") {
    return askExperienceLevel(bot, req);
  }
  parseMessage(text).then((parsed) => {
    if (!parsed.entities.intent || !parsed.entities.intent.length) {
      if (!handleMock(bot, req)) {
        return;
      }
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
        getState(bot, req).last_question = null;

        return askCity(bot, req);

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
        if (!handleMock(bot, req)) {
          return;
        }

        return didNotUnderstand(bot, getState(bot, req));
    }

  }).catch((error) => {
    console.error(error);
    return unknownError(bot, getState(bot, req));
  });
});
