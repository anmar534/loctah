'use client';

import { useRef, useState } from 'react';

type ImageUploadProps = {
  label?: string;
  onChange?: (files: File[]) => void;
};

export default function ImageUpload({ label = 'Upload image', onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        className="inline-flex items-center justify-center rounded-md border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-600"
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        Click to upload
      </button>
      <input
        ref={inputRef}
        accept="image/*"
        aria-label={label}
        className="hidden"
        multiple
        type="file"
        onChange={(event) => {
          const selected = Array.from(event.target.files ?? []);
          setFiles(selected);
          onChange?.(selected);
        }}
      />
      {files.length ? (
        <ul className="flex flex-wrap gap-2 text-xs text-slate-500">
          {files.map((file, index) => (
            <li
              className="rounded-md border border-slate-200 px-2 py-1"
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
            >
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
