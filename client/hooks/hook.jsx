import {useEffect, useState} from "react";
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

// const useAsyncMutation = (mutationHook) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [mutate] = mutationHook();
//
//   const executeMutation = async (toastMessage, ...args) => {
//     setIsLoading(true);
//     const toastId = toast.loading(toastMessage || "Updating...");
//     try {
//       const res = await mutate(...args);
//       if (res.data) {
//         toast.success(res.data.message || "Data Updated!", {id: toastId});
//         setData(res.data);
//       } else {
//         toast.error(res?.error?.data?.message || res?.data?.message || "Something went wrong!", {id: toastId});
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Something went wrong!", {id: toastId});
//     } finally {
//       setIsLoading(false);
//       toast.dismiss(toastId);
//     }
//   }
// };
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
export {useErrors, useAsyncMutation};