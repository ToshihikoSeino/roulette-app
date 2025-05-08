// pages/index.tsx
import { useState, useRef, useEffect } from "react";

type Task = {
  title: string;
  detail: string;
};

export default function Home() {
  // ------------------------
  // State
  // ------------------------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showEditEmptyModal, setShowEditEmptyModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDeleteIndex, setTaskToDeleteIndex] = useState<number | null>(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDetail, setCurrentDetail] = useState("");
  const [currentDetailIndex, setCurrentDetailIndex] = useState<number | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ------------------------
  // useEffect
  // ------------------------
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ------------------------
  // Handlers
  // ------------------------
  const addTask = () => {
    if (inputValue.trim()) {
      setTasks([...tasks, { title: inputValue.trim(), detail: "" }]);
      setInputValue("");
    }
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(tasks[index].title);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      setShowEditEmptyModal(true);
      return;
    }
    const updatedTasks = [...tasks];
    updatedTasks[editingIndex].title = trimmed;
    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

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

  const handleSpin = () => {
    if (isSpinning || intervalRef.current || tasks.length === 0) return;
    setIsSpinning(true);

    intervalRef.current = setInterval(() => {
      const random = tasks[Math.floor(Math.random() * tasks.length)].title;
      setResult(random);
    }, 70);

    timeoutRef.current = setTimeout(() => stopSpin(), 5000);
  };

  const stopSpin = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setIsSpinning(false);
  };

  const openDetailModal = (index: number) => {
    setCurrentDetail(tasks[index].detail);
    setCurrentDetailIndex(index);
    setShowDetailModal(true);
  };

  const saveDetail = () => {
    if (currentDetailIndex === null) return;
    const updatedTasks = [...tasks];
    updatedTasks[currentDetailIndex].detail = currentDetail;
    setTasks(updatedTasks);
    setShowDetailModal(false);
    setCurrentDetail("");
    setCurrentDetailIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // ------------------------
  // JSX
  // ------------------------
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {result && (
        <div className="mt-6 text-4xl font-semibold text-gray-800">
          🎯 {result}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">やることルーレット</h1>

      {/* タスク追加 */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="やることを入力"
          className="p-2 border rounded w-60"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          追加
        </button>
      </div>

      {/* タスクリスト */}
      <ul className="mb-4 text-gray-700 w-full max-w-md">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="flex justify-between items-start py-2 border-b border-gray-300"
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
                  <button onClick={saveEdit} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                    保存
                  </button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">
                    キャンセル
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span>・{task.title}</span>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => startEdit(index)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">編集</button>
                    <button onClick={() => openDetailModal(index)} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">詳細</button>
                    <button onClick={() => confirmDelete(index)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">削除</button>
                  </div>
                </div>

                {task.detail && (
                  <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                    {expandedIndices.includes(index)
                      ? task.detail
                      : `${task.detail.slice(0, 30)}${task.detail.length > 30 ? "..." : ""}`}
                    <button
                      onClick={() => toggleExpand(index)}
                      className="ml-2 text-blue-500 hover:underline text-xs"
                    >
                      {expandedIndices.includes(index) ? "▲ 折りたたむ" : "▼ 詳細を表示"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* 回すボタン */}
      <button
        onClick={isSpinning ? stopSpin : handleSpin}
        disabled={tasks.length === 0 || intervalRef.current !== null}
        className={`px-4 py-2 rounded text-white ${
          isSpinning ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        } transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isSpinning ? "🌀回転中🌀" : "回す！"}
      </button>

      {/* モーダル：削除確認 */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg border w-72">
            <p className="text-sm font-medium mb-3">本当に削除しますか？</p>
            <div className="flex justify-end gap-2 text-sm">
              <button onClick={handleCancelDelete} className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500">キャンセル</button>
              <button onClick={handleConfirmDelete} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">削除する</button>
            </div>
          </div>
        </div>
      )}

      {/* モーダル：空白の編集 */}
      {showEditEmptyModal && (
        <div className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg border w-72">
            <p className="text-sm font-medium mb-3">空白のタスクにはできません。</p>
            <div className="flex justify-end text-sm">
              <button onClick={() => setShowEditEmptyModal(false)} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">OK</button>
            </div>
          </div>
        </div>
      )}

      {/* モーダル：詳細編集 */}
      {showDetailModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-30 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg border w-96">
            <h2 className="text-lg font-bold mb-2">タスクの詳細</h2>
            <textarea
              className="w-full border rounded p-2 h-32"
              value={currentDetail}
              onChange={(e) => setCurrentDetail(e.target.value)}
              placeholder="詳細を入力"
            />
            <div className="flex justify-end gap-2 mt-2 text-sm">
              <button onClick={() => setShowDetailModal(false)} className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-500">閉じる</button>
              <button onClick={saveDetail} className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600">保存</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
