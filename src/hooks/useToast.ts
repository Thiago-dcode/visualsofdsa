import { useRef } from "react";
import { toast, ToastT } from "sonner";

type ToastType = "info" | "warning" | "success" | "error" | "loading";
export const useToast = () => {
  const toastId = useRef<string | number | null>(null);


  const makeToast = (message: string, type: ToastType) => {

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = toast[type](message, {
      position: "top-center",

    });

  }
  const toastInfo = (message: string) => {
    makeToast(message, "info");
  }
  const toastWarning = (message: string) => {
    makeToast(message, "warning");
  }
  const toastSuccess = (message: string) => {
    makeToast(message, "success");
  }

  const toastError = (message: string) => {
    makeToast(message, "error");
  }

  const toastLoading = (message: string) => {
    makeToast(message, "loading");
  }
  return {
    toastInfo,
    toastSuccess,
    toastError,
    toastLoading,
    toastWarning,
    toastId: toastId.current
  };
};  
