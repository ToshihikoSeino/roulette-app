import { useState, useRef } from "react";

export default function Home() {
  //追加するタスク
  const [tasks, setTasks] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  //編集中のタスク
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  //削除するタスク
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDeleteIndex, setTaskToDeleteIndex] = useState<number | null>(
    null
  );
  //ルーレットの結果
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  //タスクの追加をする関数
  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, inputValue.trim()]);
      setInputValue("");
    }
  };

  //タスクを削除する関数
  const confirmDelete = (index: number) => {
    setTaskToDeleteIndex(index);
    setShowConfirmModal(true);
  };
  const handleConfirmDelete = () => {
    if (taskToDeleteIndex === null) return;

    setTasks(tasks.filter((_, i) => i !== taskToDeleteIndex));
    setShowConfirmModal(false);
    setTaskToDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setTaskToDeleteIndex(null);
  };

  //タスクを編集する関数
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(tasks[index]);
  };
  const saveEdit = () => {
    if (editingIndex === null) return;

    const trimmed = editValue.trim();
    if (trimmed === "") {
      alert("空白のタスクにはできません");
      return; // 空白入力なら何もしない
    }
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex] = trimmed;
    setTasks(updatedTasks);

    setEditingIndex(null);
    setEditValue("");
  };
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  //ルーレットを回す関数
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
  //ルーレットを止める関数(連打するとバグるので修正中)
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
            {editingIndex === index ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="p-1 border rounded w-2/3"
                  autoFocus
                />
                <div className="flex gap-1">
                  <button
                    onClick={saveEdit}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                  >
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>・{task}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(index)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => confirmDelete(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    削除
                  </button>
                </div>
              </>
            )}
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

      {showConfirmModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg border w-72">
            <p className="text-sm font-medium mb-3">本当に削除しますか？</p>
            <div className="flex justify-end gap-2 text-sm">
              <button
                onClick={handleCancelDelete}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
