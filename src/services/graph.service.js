const graphUrl = "https://graph.microsoft.com/v1.0/";
export const getUserInfo = (token) => {
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const options = {
    headers,
  };
  return fetch(`${graphUrl}/me`, options)
    .then((response) => response.json())
    .catch((response) => {
      throw new Error(response.text());
    });
};
