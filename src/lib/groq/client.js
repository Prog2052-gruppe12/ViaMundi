
import Groq from "groq-sdk";



if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not defined');
}

/**
 * Initialize Groq
 * @returns {Groq}
 */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default groq;
