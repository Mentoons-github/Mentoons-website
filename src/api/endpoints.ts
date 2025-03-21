import axiosInstance from "./axios";

export const Endpoints = {
  WORKSHOP_FORM: "workshop/submit-form",
  SIGNUP: "user/sign-up",
  VERIFY_OTP: "user/sign-up/verify",
  VERIFY_LOGIN_OTP: "user/sign-in/verify",
  LOGIN: "user/sign-in",
};

export const AddaApi = {
  connectFriends: (receiverId: string) =>
    axiosInstance.post("/adda/connectFriend", { receiverId }),
  createGroupParents: (details: {
    name: string;
    description: string;
    type: string;
    thumbnail: File ;
  }) => {
    const formData = new FormData();
    formData.append("name", details.name);
    formData.append("description", details.description);
    formData.append("type", details.type);
    formData.append("thumbnail", details.thumbnail);

    return axiosInstance.post("/adda/createGroup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
