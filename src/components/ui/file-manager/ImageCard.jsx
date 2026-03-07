import {
    Image as ImageIcon,
    File,
    Trash2,
    Check,
} from "lucide-react";
export function ImageCard({ file, isSelected, onSelect, onDelete, getFileUrl, formatFileSize }) {
    const isImage = file.mime_type?.startsWith("image/") || file.mime_type === "image";

    return (
        <div
            onClick={() => onSelect(file)}
            className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 bg-white ${isSelected
                ? "border-indigo-500 ring-2 ring-indigo-100 shadow-md"
                : "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                }`}
        >
            <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {isImage ? (
                    <img
                        src={getFileUrl(file)}
                        loading="lazy"
                        alt={file.file_original_name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGMUYxRjEiLz48cGF0aCBkPSJNMjAgMjVhNSA1IDAgMTAgMCAxMCA1IDUgMCAwMCAwLTEwem0xNiAxNUgxNGwtLjAwMi0uMDAyTDIwIDMybDYgNiA0LTRMMzYgNDB6IiBmaWxsPSIjQ0NDIi8+PC9zdmc+";
                        }}
                    />
                ) : (
                    <File className="w-8 h-8 text-gray-300" />
                )}
            </div>

            {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm z-10">
                    <Check className="w-3 h-3 text-white" />
                </div>
            )}

            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(file.id);
                    }}
                    className="absolute top-1.5 left-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 shadow-sm"
                    title="Delete file"
                >
                    <Trash2 className="w-2.5 h-2.5" />
                </button>
            )}

            <div className="p-1.5 border-t border-gray-100 bg-white">
                <p className="text-xs font-medium text-gray-800 truncate leading-tight">
                    {file.file_original_name}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(file.file_size)}</p>
            </div>
        </div>
    );
}