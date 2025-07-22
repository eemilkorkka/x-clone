import { useState, ChangeEvent } from "react"

export const MAX_FILES = 4;
const ALLOWED_TYPES: string[] = ["image/jpeg", "image/png", "image/gif", "image/svg", "image/jfif", "video/mp4"];

export const useFilePicker = () => {
    const [pickedFiles, setPickedFiles] = useState<{ url: string; file: File }[]>([]);

    const handleFileAdd = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = [...pickedFiles];

        for (let i = 0; i < files.length; i++) {
            if (newFiles.length >= MAX_FILES) break;

            const file = files[i];

            if (ALLOWED_TYPES.includes(file.type)) {
                const url = URL.createObjectURL(file);
                newFiles.push({ url, file });
            }
        }

        setPickedFiles(newFiles);
        e.target.value = "";
    }

    const handleFileRemove = (index: number) => {
        const newFiles = [...pickedFiles];
        const fileToRemove = newFiles[index];

        URL.revokeObjectURL(fileToRemove.url);
        newFiles.splice(index, 1);

        setPickedFiles(newFiles);
    }

    return { pickedFiles, handleFileAdd, handleFileRemove };
}