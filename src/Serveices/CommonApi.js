import axios from "axios";

const CommonApi = async (reqUrl, reqMethod, reqData, reqHeader) => {

  const token = sessionStorage.getItem("token");

  const config = {
    url: reqUrl,
    method: reqMethod,
    data: reqData,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // 🔥 AUTO TOKEN
      ...reqHeader
    }
  };
if (reqData !== undefined && reqData !== null) {
  config.data = reqData;
}
  console.log("FINAL CONFIG:", config);

  console.log("HEADERS:", config.headers); // debug

  return await axios(config)
    .then(res => res)
    .catch(err => err.response || err);
};

export default CommonApi;