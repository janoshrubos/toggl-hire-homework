const BACKEND_URL = "https://toggl-hire-frontend-homework.vercel.app/api";

export const sendEmails = async (emails) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emails: emails }),
  };

  const response = await fetch(
    `${BACKEND_URL}/send`,
    requestOptions
  );

  let message = "";
  let data = [];

  switch (response.status) {
    case 200:
      message = "Emails sent successfully!";
      break;
    case 422:
      const jsonResponse = await response.json();
      message = "There was an error! Failed to send the following emails:";
      data = jsonResponse.emails;
      break;
    case 500:
      message = "There was an unexpcted server error! Please try again.";
      break;
    default:
      message = "There was an unexpcted error! Please try again.";
      break;
  }

  return {
    message,
    data,
    ok: response.ok,
  };
};
