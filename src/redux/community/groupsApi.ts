import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/groups`;

export const fetchGroupsApi = async (token: string) => {
  return await axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchMembersApi = async (groupId: string, token: string) => {
  return await axios.get(`${BASE_URL}/${groupId}/members`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchGroupMessagesApi = async (groupId: string, token: string) => {
  return await axios.get(`${BASE_URL}/${groupId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const joinGroupApi = async (groupId: string, token: string) => {
  return await axios.put(
    `${BASE_URL}/${groupId}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
