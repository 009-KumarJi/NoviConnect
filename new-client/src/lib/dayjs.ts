import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import advancedFormat from "dayjs/plugin/advancedFormat.js";

dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

export default dayjs;
