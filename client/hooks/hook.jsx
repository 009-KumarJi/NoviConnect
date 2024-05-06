import {useEffect} from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({isError, error, fallback}) => {
      if (isError) {
        fallback
          ? fallback()
          : toast.error(error?.data?.message || "Something-went wrong!");
      }
    })
  }, [errors]);
}

export {useErrors};