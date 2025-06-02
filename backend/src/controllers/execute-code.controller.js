import { pollBatchResults, submitBatch } from "../libs/judge0.lib";

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
    const testCaseResults = detailedResults.map((result)=>({
      submissionId:  submission.id,
      testCase:result.testCase,
      passed: result.passed,
      stdout:result.stdout,
      expected:result.expected,
      stderr:result.stderr,
      complieOutput:result.complie_output,
      status:result.status,
      memory:result.memory,
      time:result.time
    }))

    await db.testCaseResult.createMany({
      data:testCaseResults
    })

    const submissionWithTestCase = await db.submission.findUnique({
      where:{
        id:submission.id
      },
      include:{
        testCases:true,
      }
    })




    // suggested by ai and added a bookmark in the fixing judge0 video for this
    res.status(200).json({
      message: "Code executed successfully",
      success:true,
      submission:submissionWithTestCase,  
    });
  } catch (error) {
    console.error("Error executing code:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
