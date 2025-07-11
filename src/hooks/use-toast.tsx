import { toast as sonnerToast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

// Define a minimal ToastOptions type or use 'any' if you don't need strict typing
type ToastOptions = {
  title?: string;
  description?: string;
  type?: ToastType;
  variant?: string; // Add variant to support custom variants like "destructive"
  // Add other options as needed
};

interface UseToast {
  toast: (options: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

export const toast = (
  options: ToastOptions
) => {
  sonnerToast(options.title ?? '', options);
};

export function useToast(): UseToast {

  const success = (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, options);
  };

  return { toast, success, error, info, warning };
}