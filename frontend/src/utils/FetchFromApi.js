import axios from "axios";
import { compressFormDataImages } from "./image-compression";

export const FetchData = async (url, method, data, file = false) => {
  const Base_URL = `${process.env.BackendDomainUrl}/api/v1`;
  const AccessToken = localStorage.getItem("accessToken");
  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const hasFiles =
    isFormData &&
    typeof File !== "undefined" &&
    [...data.values()].some((value) => value instanceof File);
  const requestData = hasFiles ? await compressFormDataImages(data) : data;

  const options = {
    headers: {
      "Content-Type":
        file || hasFiles ? "multipart/form-data" : "application/json",
      Authorization: `Bearer ${AccessToken}`,
    },
    withCredentials: true,
  };

  if (method === "get") {
    const response = await axios.get(`${Base_URL}/${url}`, {
      params: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AccessToken}`,
      },
    });
    return response;
  } else if (method === "post") {
    const response = await axios.post(
      `${Base_URL}/${url}`,
      requestData,
      options,
    );
    return response;
  } else if (method === "delete") {
    const response = await axios.delete(`${Base_URL}/${url}`, options);
    return response;
  } else {
    return "Please enter the valid method";
  }
};
