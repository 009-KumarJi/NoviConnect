import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {sout} from "../src/utils/helper.js";

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

const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating...");

    mutate(...args)
      .then(res => {
        if (res.data) {
          toast.success(res?.data?.message || "Data Updated!", {id: toastId});
          setData(res.data);
        } else {
          toast.error(res?.error?.data?.message || "Something went wrong!", {id: toastId});
        }
      })
      .catch(err =>
        toast.error(err?.response?.data?.message || "Something went wrong!", {id: toastId})
      )
      .finally(() =>
        setIsLoading(false)
      );
  }
  return [executeMutation, isLoading, data];
}

const useSockets = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      sout(`Listening for event: ${event}`)
      socket.on(event, handler);
    });
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        sout(`Removing event listener: ${event}`)
        socket.off(event, handler);
      });
    }
  }, [socket, handlers]);
}
export {useErrors, useAsyncMutation, useSockets};