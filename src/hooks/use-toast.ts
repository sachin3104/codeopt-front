import { toast } from 'sonner';

export const useToast = () => ({
  success: (msg: string)  => toast.success(msg),
  error:   (msg: string)  => toast.error(msg),
  info:    (msg: string)  => toast(msg),
  loading: (msg: string) => {
    const id = toast.loading(msg);
    return {
      done:  (m?: string) => toast.success(m ?? msg, { id }),
      error: (m?: string) => toast.error(m ?? 'Error',  { id }),
    };
  },
}); 