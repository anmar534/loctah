type ErrorMessageProps = {
  title?: string;
  description?: string;
  retry?: () => void;
};

export default function ErrorMessage({ title = 'Something went wrong', description, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-red-100 bg-red-50 p-5 text-red-700">
      <strong className="text-sm font-semibold">{title}</strong>
      {description ? <p className="text-sm text-red-600">{description}</p> : null}
      {retry ? (
        <button
          type="button"
          className="self-start rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
          onClick={retry}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
