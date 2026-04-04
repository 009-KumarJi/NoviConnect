import { useState, type ChangeEvent } from 'react';

export const useInputValidation = (initValue: string, validator?: (val: string) => { isValid: boolean, errorMessage: string } | string | undefined) => {
  const [value, setValue] = useState(initValue);
  const [error, setError] = useState<string | null>(null);

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (validator) {
      const result: any = validator(e.target.value);
      if (result === undefined || result === null || result === true || result?.isValid === true) {
        setError(null);
      } else if (typeof result === 'string') {
        setError(result);
      } else if (result?.errorMessage) {
        setError(result.errorMessage);
      } else {
        setError("Invalid input");
      }
    }
  };
  return { value, changeHandler, error };
};

export const useStrongPassword = () => {
  return useInputValidation("", (val) => {
    const isStrong = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(val);
    if (!isStrong) return { isValid: false, errorMessage: "Password must have min 8 chars, 1 letter, and 1 number" };
    return { isValid: true, errorMessage: "" };
  });
};

export const useFileHandler = (type: "single" | "multiple" | "audio" | "video") => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        setError(null);
    } else {
        setFile(null);
        setPreview(null);
    }
  };
  return { file, preview, changeHandler, error };
};
