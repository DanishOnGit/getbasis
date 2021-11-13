import { toast } from "react-toastify";

export const notify = ({ message, type }) => {
  const style = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };
  switch (type) {
    case "success": {
      return toast.success(message, style);
    }
    case "error": {
    if(!message) return toast.error('Something went wrong',style)
      return toast.error(message, style);
    }
    case "info": {
      return toast.info(message, style);
    }
    default: {
      return toast(message, style);
    }
  }
};
