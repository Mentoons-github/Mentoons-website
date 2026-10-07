import { useState } from "react";

const DailyReport = () => {
  const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
  const [name, setName] = useState("");
  const [taskInput, setTaskInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const currentDate = new Date().toLocaleDateString();

  const addTask = () => {
    if (taskInput.trim() !== "") {
      setTasks([...tasks, taskInput.trim()]);
      setTaskInput("");
    }
  };

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-5 border border-gray-400">
      <div className="flex items-end justify-end mr-10 mb-5">
        {days.map((day) => (
          <div key={day} className="mx-2 text-lg font-semibold">
            {day}
          </div>
        ))}
      </div>

      <div className="relative w-full border-2 border-black p-2 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 p-3">
            <div className="flex items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <h1 className="font-bold text-xl">DATE :</h1>
                  <span className="ml-3 text-lg">{currentDate}</span>
                </div>
                <div className="flex items-center">
                  <label htmlFor="name" className="font-bold text-xl">
                    NAME :
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="outline-none ml-3 text-lg border-b-2 border-black w-80 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <img
                  src="https://mentoons-website.s3.ap-northeast-1.amazonaws.com/logo/ec9141ccd046aff5a1ffb4fe60f79316.png"
                  alt="logo"
                  className="w-40 h-16 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="w-1/3 border-l-2 border-black h-full flex items-center justify-center p-3 bg-gray-50">
            <div className="text-center font-semibold text-3xl tracking-wider">
              NOTES
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-0 border-2 border-black">
        {/* TASK Section */}
        <div className="border-r-2 border-black p-4">
          <h2 className="font-bold text-2xl mb-3 border-b-2 border-black pb-2">
            TASK :
          </h2>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Type a new task..."
              className="flex-1 border-b-2 border-black outline-none text-lg py-2"
              onKeyPress={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-black text-white font-semibold hover:bg-gray-800"
            >
              ADD
            </button>
          </div>

          <div className="min-h-[420px] relative">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 32px,
                  #e5e7eb 32px,
                  #e5e7eb 33px
                )`,
              }}
            ></div>

            <div className="relative pt-2 pl-2 space-y-7 text-lg">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 min-h-[32px]"
                >
                  <span className="font-medium text-gray-700 w-8 flex-shrink-0 pt-0.5">
                    {index + 1}.
                  </span>
                  <span className="flex-1 border-b border-gray-400 pb-1 leading-snug pr-8">
                    {task}
                  </span>
                  <button
                    onClick={() => deleteTask(index)}
                    className="text-red-600 opacity-0 group-hover:opacity-100 transition text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {tasks.length === 0 && (
                <p className="text-gray-400 italic pt-8 pl-2">
                  No tasks added yet...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* NOTES Section - Now with lined paper */}
        <div className="p-4">
          <h2 className="font-bold text-2xl mb-3 border-b-2 border-black pb-2">
            NOTES
          </h2>

          <div className="min-h-[460px] relative border border-gray-300">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent 0px,
                  transparent 32px,
                  #e5e7eb 32px,
                  #e5e7eb 33px
                )`,
              }}
            ></div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes here..."
              className="relative w-full h-full p-4 text-lg bg-transparent resize-none focus:outline-none leading-snug"
              style={{ lineHeight: "32px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;
