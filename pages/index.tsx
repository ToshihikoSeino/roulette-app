import { useState, useRef } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, inputValue.trim()]);
      setInputValue("");
    }
  };
  const handleDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSpin = () => {
    if (isSpinning || intervalRef.current || tasks.length === 0) return;

    setIsSpinning(true);

    intervalRef.current = setInterval(() => {
      const random = tasks[Math.floor(Math.random() * tasks.length)];
      setResult(random);
    }, 60);

    timeoutRef.current = setTimeout(() => {
      stopSpin();
    }, 3000);
  };

  const stopSpin = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsSpinning(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {result && (
        <div className="mt-6 text-xl font-semibold text-gray-800">
          🎯 {result}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">やることルーレット</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            // Enterキーが押されたらaddTaskを実行
            if (e.key === "Enter") {
              addTask();
            }
          }}
          placeholder="やることを入力"
          className="p-2 border rounded w-60"
        />
        <button
          onClick={addTask}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          追加
        </button>
      </div>

      <ul className="mb-4 text-gray-700 w-full max-w-md">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-1 border-b border-gray-300"
          >
            <span>・{task}</span>
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={isSpinning ? stopSpin : handleSpin}
        disabled={tasks.length === 0 || intervalRef.current !== null}
        className={`px-4 py-2 rounded text-white ${
          isSpinning
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSpinning ? "止める" : "回す！"}
      </button>
    </main>
  );
}
