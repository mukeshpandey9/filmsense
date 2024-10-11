import OpenAI from "openai";
const openai = new OpenAI({
  organization: "org-zNRofSOwlV21VBF4zmiL7J7D",
  apiKey: import.meta.env.VITE_OPENAPI_KEY,
  dangerouslyAllowBrowser: true,
});

export default openai;
