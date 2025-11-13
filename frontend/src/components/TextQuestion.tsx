interface TextQuestionProps {
  hint: string;
  answer: string;
  onAnswer: (answer: string) => void;
}

export default function TextQuestion({
  hint,
  answer,
  onAnswer,
}: TextQuestionProps) {
  return (
    <textarea
      className="flex-1 w-full bg-[#1f1f1f] text-gray-200 placeholder-gray-500 border border-[#3a3a3a] rounded p-4 font-mono text-sm focus:outline-none focus:border-orange-500 focus:border-2 resize-none min-h-40 md:min-h-64"
      placeholder={hint}
      value={answer}
      onChange={(e) => onAnswer(e.target.value)}
    />
  );
}
