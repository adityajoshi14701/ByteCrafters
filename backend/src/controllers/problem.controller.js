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
export const getAllProblems = async (req, res) => {
  try {
    // condition to check if user submitted that problem or not
    const problems = await db.problem.findMany();
    if (!problems) {
      return res.status(404).json({ message: "No problems found" });
    }
    return res.status(200).json({
      success: true,
      message: "Problems Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getProblemById = async (req, res) => {
  try {
    const problem = await db.problem.findUnique({
      where: { id: req.params.id },
    });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Problem Fetched Successfully",
      problem,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProblemById = async (req, res) => {};
export const deleteProblemById = async (req, res) => {};
export const getAllProblemsSolvedByUser = async (req, res) => {};
