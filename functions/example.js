require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  // const { queryStringParameters } = event;
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : '*', // Required for CORS support to work
      'Access-Control-Allow-Credentials' : 'true' // Required for cookies, authorization headers with HTTPS
    },
    body: 'Example Post'
  };
};
