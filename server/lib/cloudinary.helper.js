// Description: Helper functions for cloudinary
// base64MimeType: Returns the mime type of base64 string
export const getBase64 = (file) => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;