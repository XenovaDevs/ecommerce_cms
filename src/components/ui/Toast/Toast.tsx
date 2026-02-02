import { Toaster as HotToaster } from 'react-hot-toast'

export const Toast = () => {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fafafa',
          color: '#1a1a1a',
          border: '1px solid #d4d4d4',
          borderRadius: '0.75rem',
          padding: '1rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
          maxWidth: '420px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#c9a96e',
            secondary: '#fafafa',
          },
          style: {
            border: '1px solid #c9a96e',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fafafa',
          },
          style: {
            border: '1px solid #ef4444',
          },
        },
        loading: {
          iconTheme: {
            primary: '#c9a96e',
            secondary: '#fafafa',
          },
        },
      }}
    />
  )
}

Toast.displayName = 'Toast'
