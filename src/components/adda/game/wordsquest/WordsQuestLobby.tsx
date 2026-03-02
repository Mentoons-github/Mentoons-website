const WordsQuestLobby = ({
  showDifficultyModal,
}: {
  showDifficultyModal: () => void;
}) => {
  return (
    <div className="h-screen bg-[url('/assets/games/wordsQuest/bg.jpg')] bg-cover bg-center flex flex-col items-center justify-center gap-4 sm:gap-8 p-4">
      <img
        src="/assets/games/wordsQuest/title Logo.png"
        alt="title"
        className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-2xl"
      />
      <button
        onClick={showDifficultyModal}
        className="w-64 h-24 sm:w-72 sm:h-28 md:w-80 md:h-32 bg-[url('/assets/games/wordBuilder/play.png')] bg-cover bg-no-repeat bg-center rounded-3xl hover:scale-110 transition-transform"
      />
    </div>
  );
};

export default WordsQuestLobby;
