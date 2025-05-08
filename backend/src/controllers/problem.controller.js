import db from "../libs/db.js";
export const createProblem = async (req, res) => {
  // get all the data from req body
  // again check the role of user
  // loop through  each and every reference solution for different languages ]
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    referenceSoltuions,
  } = req.body;
  // for looping use for of loop , if not geeting see the todo ts
  if (!req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to create a problem" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSoltuions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported ` });
      }
      const submissions = testcases.map(({ input, ouput }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: ouput,
      }));
      const submissionResults = await submitBatch(submissions);
      const results = submissionResults.map((res) => {
        res.token;
      });
    }
  } catch (error) {}
};
export const getAllProblems = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblemById = async (req, res) => {};
export const deleteProblemById = async (req, res) => {};
export const getAllProblemsSolvedByUser = async (req, res) => {};
