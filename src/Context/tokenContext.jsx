import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BaseUrl } from "../env/env.environment";

export const tokenContext = createContext();

export function TokenContextProvider({ children }) {


  const [userToken, setToken] = useState(() => localStorage.getItem("token"));

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userToken) {
      setUserData(null);
      return;
    }

    axios
      .get(`${BaseUrl}/users/profile-data`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setUserData(response.data.data.user);
      })
      .catch((err) => {
        console.error("Error fetching profile data", err);
      });
  }, [userToken]); 

  return (
    <tokenContext.Provider
      value={{
        userToken,
        setToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </tokenContext.Provider>
  );
}