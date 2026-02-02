import toastLib from 'react-hot-toast'

export const toast = {
  success: (message: string) => {
    return toastLib.success(message)
  },

  error: (message: string) => {
    return toastLib.error(message)
  },

  loading: (message: string) => {
    return toastLib.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => {
    return toastLib.promise(promise, messages)
  },

  custom: (message: string) => {
    return toastLib(message)
  },

  dismiss: (toastId?: string) => {
    return toastLib.dismiss(toastId)
  },
}
