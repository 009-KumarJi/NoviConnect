import moment from "moment";

const fileFormat = (url = "") => {
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

const transformImg = (url = "", width = 100) => {
  if (typeof url !== 'string') {
    console.error('Invalid url: url should be a string');
    return url;
  }
  return url.replace("upload/", `upload/dpr_auto/w_${width}/`);
};
const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = Array.from(
    {length: 7},
    (_, i) =>
      currentDate.clone().subtract(i, 'days').format('dddd'));
  return last7Days.reverse();
}

const getOrSaveFromStorage = ({key, value, get}) => {
  return get
    ? localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null
    : localStorage.setItem(key, JSON.stringify(value));
}
export {fileFormat, transformImg, getLast7Days, getOrSaveFromStorage};
