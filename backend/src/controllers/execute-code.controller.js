import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";
import { all } from "axios";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing Test Case" });
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    const results = await pollBatchResults(tokens);

    //changes after this comment
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      complieOutput: result.complie_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    // suggested by ai and added a bookmark in the fixing judge0 video for this
    res.status(200).json({
      message: "Code executed successfully",
      success: true,
      submission: submissionWithTestCase,
    });
    console.log("Results:", results);
    let allPassed = true;

    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[index]?.trim();
      const passed = stdout === expectedOutput;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        time: result.time ? `${result.time} s` : undefined,
        memory: result.memory ? `${result.memory} KB` : undefined,
      };
      // console.log(`Test Case ${index + 1}`);
      // console.log(`Input: ${stdin[index]}`);
      // console.log(`Output: ${stdout}`);
      // console.log(`Expected: ${expected_output}`);
      // console.log("Matched :", passed);
    });

    console.log("detailedResults:", detailedResults);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
        stderr: detailedResults.some((result) => result.stderr)
          ? JSON.stringify(detailedResults.map((result) => result.stderr))
          : null,
        compileOutput: detailedResults.some((result) => result.compileOutput)
          ? JSON.stringify(
              detailedResults.map((result) => result.compileOutput)
            )
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((result) => result.memory)
          ? JSON.stringify(detailedResults.map((result) => result.memory))
          : null,
        time: detailedResults.some((result) => result.time)
          ? JSON.stringify(detailedResults.map((result) => result.time))
          : null,
      },
    });

    console.log("Submission created:", submission);

    // If all test cases passed, mark the problem as solved
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }
    // suggested by ai and added a bookmark in the fixing judge0 video for this
    res.status(200).json({
      message: "Code executed successfully",
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
