export const parseErrorMessage = (responseText) => {
  try {
    if (typeof responseText !== "string") {
      return "Something went wrong";
    }

    if (!responseText.includes("<pre>")) {
      return responseText;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(responseText, "text/html");

    const pre = doc.querySelector("pre");

    if (!pre) return responseText;

    return pre.innerHTML.split("<br>")[0];
  } catch {
    return "Something went wrong";
  }
};