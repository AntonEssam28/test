import axios from "axios";
import { BaseUrl } from "../env/env.environment";

export async function sendLoginData(dataForm) {
  const {data} = await axios.post(
    `${BaseUrl}/users/signin`,
    dataForm
  );

  return data;
}
