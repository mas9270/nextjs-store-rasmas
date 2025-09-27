import multer from "multer";

// فایل‌ها موقتاً روی حافظه (RAM) ذخیره می‌شن
export const upload = multer({ storage: multer.memoryStorage() });
