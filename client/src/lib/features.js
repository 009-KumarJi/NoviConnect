const fileFormat = (url= "") => {
  const fileExt = url.split(".").pop();
  if (["jpg", "jpeg", "png", "gif"].includes(fileExt)) {
    return "image";
  } else if (["mp4", "webm", "ogg"].includes(fileExt)) {
    return "video";
  } else if (["pdf", "doc", "docx", "xls", "xlsx"].includes(fileExt)) {
    return "document";
  } else if (["mp3", "wav"].includes(fileExt)) {
    return "audio";
  } else {
    return "file";
  }
};

const transformImg = (url="", width = 100) => url;

export { fileFormat, transformImg};
