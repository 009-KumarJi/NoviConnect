export const sout = (...text) => import.meta.env.VITE_MODE === "development" && console.log(...text);
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}