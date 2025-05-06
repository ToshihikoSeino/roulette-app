import { useState } from "react";

const categories = {
  暇つぶし: [
    "YouTubeを見る",
    "散歩する",
    "新しい曲を探す",
    "昼寝する",
    "日記を書く",
  ],
  勉強: ["JavaScriptの復習", "英単語10個覚える", "過去問を解く", "写経する"],
  運動: ["スクワット30回", "ストレッチ10分", "ダンス動画を見る", "外を走る"],
};

export default function Home() {
  const [category, setCategory] = useState<keyof typeof categories>("暇つぶし");
  const [result, setResult] = useState<string | null>(null);

  const handleSpin = () => {
    const options = categories[category];
    const random = options[Math.floor(Math.random() * options.length)];
    setResult(random);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">やることルーレット</h1>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as keyof typeof categories)}
        className="mb-4 p-2 rounded border"
      >
        {Object.keys(categories).map((key) => (
          <option key={key}>{key}</option>
        ))}
      </select>

      <button
        onClick={handleSpin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        回す！
      </button>

      {result && (
        <div className="mt-6 text-xl font-semibold text-gray-800">
          👉 {result}
        </div>
      )}
    </main>
  );
}
