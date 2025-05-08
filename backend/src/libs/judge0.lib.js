export const getJudge0LanguageId = (language) => {
  const langauageMap = {
    JAVA: 63,
    JAVASCRIPT: 62,
    PYTHON: 72,
  };
  return langauageMap[language.toUppperCase()] || null;
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );
};
