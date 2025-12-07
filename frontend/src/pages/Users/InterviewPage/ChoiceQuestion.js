export default function ChoiceQuestion({ options, answer, onAnswer, }) {
  return (
    <div className="space-y-3 flex flex-col justify-start">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onAnswer(String(index))}
          className={`flex items-center gap-4 p-4 rounded border-2 transition-all text-left ${answer === String(index)
              ? "border-orange-500 bg-[#1f1f1f]"
              : "border-[#3a3a3a] hover:border-gray-400 bg-transparent"
            }`}
        >
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${answer === String(index)
                ? "border-orange-500 bg-orange-500"
                : "border-gray-500"
              }`}
          >
            {answer === String(index) && (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <span
            className={`text-sm font-medium ${answer === String(index) ? "text-white" : "text-gray-300"
              }`}
          >
            {option}
          </span>
        </button>
      ))}
    </div>
  );
}
