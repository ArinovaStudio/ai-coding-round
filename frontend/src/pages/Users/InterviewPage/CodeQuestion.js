import CodeEditor from './CodeEditor';

export default function CodeQuestion({
  hint,
  answer,
  onAnswer,
  codeLang = 'javascript'
}) {
  return (
    <div className="flex-1 w-full">
      <CodeEditor
        codeLang={codeLang}
        code={answer}
        setCode={onAnswer}
      />
    </div>
  );
}
