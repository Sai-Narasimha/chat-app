import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const reciepentId = chat?.members?.find((id) => id !== user?._id);
  useEffect(() => {
    const getUser = async () => {
      if (!reciepentId) return null;
      const response = await getRequest(`${baseUrl}/users/find/${reciepentId}`);
      if (response?.error) return setError(response);
      setRecipientUser(response);
    };
    getUser();
  }, [reciepentId]);
  return { recipientUser, error };
};
