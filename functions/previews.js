import axios from 'axios';

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { WORDPRESS_PROTOCOL, WORDPRESS_URL, JWT_USER, JWT_PASSWORD } = process.env;

const WP_API = `${WORDPRESS_PROTOCOL}://${WORDPRESS_URL}/wp-json`;

exports.handler = async (event) => {
  // Only allow POST
  // if (event.httpMethod !== "POST") {
  //   return { statusCode: 405, body: "Method Not Allowed" };
  // }
  const { queryStringParameters } = event;
  const { endpoint, preview_id: previewId } = queryStringParameters;
  const tokenReq = await axios.post(`${WP_API}/jwt-auth/v1/token`, {
    username: JWT_USER,
    password: JWT_PASSWORD
  });
  const { data } = tokenReq;
  const { token } = data;
  const revisionReq = await axios.get(`${WP_API}/wp/v2/${endpoint}/${previewId}/revisions?_embed`, {
    headers: {
        Authorization : `Bearer ${token}`
      }
    }
  );
  const { data: res } = revisionReq;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials' : 'true' // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify(res[0])
  };
};
