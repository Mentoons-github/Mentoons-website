export interface WordsQuestTypeDatas {
  title: string;
  fixedBoard: string[][];
  wordsToFind: string[];
  bg: string;
}

export interface WordsQuestType {
  easy: WordsQuestTypeDatas[];
  medium: WordsQuestTypeDatas[];
  hard: WordsQuestTypeDatas[];
}
