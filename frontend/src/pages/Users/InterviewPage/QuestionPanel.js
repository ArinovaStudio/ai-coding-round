import TextQuestion from "./TextQuestion";
import CodeQuestion from "./CodeQuestion";
import ChoiceQuestion from "./ChoiceQuestion";
export default function QuestionPanel({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  currentIndex,
  totalQuestions,
  isLastQuestion,
  isSubmitting,
}) {
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading question...
      </div>
    );
  }

  return (
    <div className="min-h-96 md:h-screen bg-[#323232] flex flex-col">
      {/* Question Area */}
      <div className="flex-1 flex flex-col p-6 md:p-8">
        {/* Question Text */}
        <h2 className="text-xl font-semibold text-white mb-8 leading-tight">
          {question.question}
        </h2>

        {/* Answer Area */}
        <div className="flex-1 flex flex-col">
          {question.questionType === "plainText" && (
            <TextQuestion
              hint="Write your answer here"
              answer={answer}
              onAnswer={onAnswer}
            />
          )}

          {(question.questionType === "MCQ" || question.options?.length) && (
            <ChoiceQuestion
              options={question.options || []}
              answer={answer}
              onAnswer={onAnswer}
            />
          )}
        </div>
      </div>

      {/* Footer with buttons */}
      <div className="border-t border-[#3a3a3a] px-6 md:px-8 py-4 flex items-center justify-between gap-4 bg-[#1f1f1f]">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="px-6 py-2 border border-gray-500 rounded text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← PREVIOUS
        </button>

        <span className="text-gray-500 text-xs">
          {currentIndex + 1} / {totalQuestions}
        </span>

        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="px-6 py-2 bg-white text-[#1a1a1a] rounded hover:bg-gray-100 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLastQuestion ? (isSubmitting ? '⏳ SUBMITTING...' : '🚀 SUBMIT') : 'NEXT'} {!isLastQuestion && <span>→</span>}
        </button>
      </div>
    </div>
  );
}
