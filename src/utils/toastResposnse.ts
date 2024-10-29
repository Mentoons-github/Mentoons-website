import { toast } from "sonner"

export const successToast = (message: string) => {
    toast.success(message, {
        position: "top-right",
        onAutoClose: () => {
            toast.dismiss()
        },
        onDismiss: () => {
            toast.dismiss()
        },
        icon: "✅",
    })
}
export const errorToast = (message: string) => {
    toast.error(message, {
        position: "top-right",
        onAutoClose: () => {
            toast.dismiss()
        },
        onDismiss: () => {
            toast.dismiss()
        },
        icon: "❌",
    })
}
