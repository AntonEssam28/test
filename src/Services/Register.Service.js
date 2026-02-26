import axios from "axios";
import { BaseUrl } from "../env/env.environment";

export async function sendRegisterData(dataForm) {
  const {data} = await axios.post(
    `${BaseUrl}/users/signup`,
    dataForm
  );

  return data;
}
