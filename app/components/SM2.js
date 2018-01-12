//Adopt from https://github.com/lo-tp/sm2-plus/blob/master/source/src/index.js
//Note: only revise items from 0.3 (init) to 0.15 (takes 3 times BEST, or 9 day)
const WORST = 0.5; //no idea
const CORRECT = 0.8; //small error
const BEST = 1; //perfect
const BASE_DATE = new Date('01/01/2015'); //mm dd yyyy

const getDayDiff = (first, second) => {
  return Math.round((second-first)/(1000*60*60*24));
}

const limitNumber = (number, min, max) => {
  let ret = number;
  if (number < min) {
    ret = min;
  } else if (number > max) {
    ret = max;
  }

  return ret;
};

const getPercentOverdue = (word, today) => {
  const calculated = (today - word.update) / word.interval;
  return calculated > 2 ? 2 : calculated;
};

const calculate = (word, performanceRating, today) => {
  const percentOverDue = getPercentOverdue(word, today);

  const difficulty = limitNumber(
    word.difficulty + (8 - 9 * performanceRating) * percentOverDue / 17,
                                 0, 1);
  const difficultyWeight = 3 - 1.7 * difficulty;
  let interval;
  if (performanceRating === WORST) {
    interval = Math.round(1 / difficultyWeight / difficultyWeight) || 1;
  } else {
    interval = 1 + Math.round((difficultyWeight - 1) * percentOverDue);
  }

  return {
    ...word,
    difficulty,
    interval,
    dueDate: today + interval,
    update: today,
    percentOverDue: percentOverDue,
    phonetic: word.phonetic,
    word: word.word,
  };
};

const TODAY = 1000000;

const initialRecord = {
    interval: 1,
    dueDate: TODAY,
    update: TODAY - 1,
  };

const simulate = (difficulty, thrashHold) => {
  let record = {
        ...initialRecord,
        difficulty,
        dueDate: TODAY,
        update: TODAY - 1,
      };
  let index = 1;
  let day;
  while (record.difficulty >= thrashHold) {
    day = record.dueDate - TODAY;
    console.info(`day: ${day} index: ${index} difficulty:${record.difficulty}`);
    record = calculate(record, BEST, record.dueDate);
    index += 1;
  }

  console.info(`day: ${day} index: ${index} difficulty:${record.difficulty}`);

};

const Nsimulate = (difficulty, thrashHold, turns) => {
  let record = {
        ...initialRecord,
        difficulty,
        dueDate: TODAY,
        update: TODAY - 1,
      };
  let index = 1;
  let day;
  let ind = 0;
  while (record.difficulty >= thrashHold) {
    day = record.dueDate - TODAY;
    console.info(`day: ${day} index: ${index} difficulty:${record.difficulty}`);
    let ans = BEST;
    if (ind < turns.length) {
        ans = turns[ind];
        ind++;
    }
    record = calculate(record, ans, record.dueDate);
    index += 1;
  }

  console.info(`day: ${day} index: ${index} difficulty:${record.difficulty}`);

};

const isOverdue = (card, today) => {
  if (card.difficulty <= 0.15) return false;
  if (card.dueDate > today) return false;
  return true;
}

const splitDue = (rawCards, today) => {
  var cards = rawCards.map(function(object) { 
    return { ...object, percentOverDue: getPercentOverdue(object, today)};
  });
  var self = this;
  var dueCards = cards.filter((card) => { return isOverdue(card, today); });
  var rest = cards.filter((card) => { return !isOverdue(card, today); });
  return [dueCards, rest];
}

const splitInSession = (rawCards, today, MAX) => { //including percentOverdue
  splittedCards = splitDue(rawCards, today);
  splittedCards[0].sort(function(a,b) { 
    return parseFloat(b.percentOverDue)-parseFloat(a.percentOverDue); }
  );
  var res = [[],[]];
  res[0] = splittedCards[0].slice(0, 0 + MAX);
  res[1] = splittedCards[0].splice(MAX).concat(splittedCards[1]);
  return res;
}

module.exports = {
  calculate,
  getPercentOverdue,
  WORST,
  CORRECT,
  BEST,
  BASE_DATE,
  getDayDiff,
  splitInSession,
  splitDue,
};