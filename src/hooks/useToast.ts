import { useRef } from "react";
import { toast } from "sonner";


export const useToast = () => {
    const toastInfoId = useRef<string|number|null>(null);
    const toastSuccessId = useRef<string|number|null>(null);
    const toastErrorId = useRef<string|number|null>(null);
    const toastInfo  = (message:string) => {
        if(toastInfoId.current) toast.dismiss(toastInfoId.current);
        toastInfoId.current = toast.info(message,{
          position: "top-center",
        });
      }

      const toastSuccess  = (message:string) => {
        if(toastSuccessId.current) toast.dismiss(toastSuccessId.current);
        toastSuccessId.current = toast.success(message,{
          position: "bottom-right",
        });
      }

      const toastError  = (message:string) => {
        if(toastErrorId.current) toast.dismiss(toastErrorId.current);
        toastErrorId.current = toast.error(message,{
          position: "bottom-left",
        });
      }

  return {
    toastInfo,
    toastSuccess,
    toastError,
    toastInfoId:toastInfoId.current,
    toastSuccessId:toastSuccessId.current,
    toastErrorId:toastErrorId.current
  };
};  
