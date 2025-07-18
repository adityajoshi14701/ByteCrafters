export const getAllSubmission = async(req,res)=>{
 try {
    const userId= req.user.id;
    const submissions= await db.submission.findMany({
        where:{
            userId:userId
        }
    })

    res.status(200).json({
        success:true,
        message:"Submissions fetched Successfully",
        submissions
    })
 } catch (error) {
    console.error(error);
    res.status(500).json({success:false,error:"Failed to fetch submissions"})
 }
}

export const getSubmissionForProblem =  async(req,res)=>{
    try {
        const userId =req.user.id;

        const problemId= req.params.problemId;

        const submissions= await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId,
            }
        })

        res.status(200).json({
            success:true,
            message:"Submission fetched successfully",
            submissions
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({success:false,error:"Failed to fetch submissions"})
    }
}

export const getAllTheSubmissionsForProblem = async(req,res)=>{
    try {
        const problemId=req.params.problemId;
        const submission= await db.submission.count({
            where:{
                problemId:problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submission fetched succesfully",
            count:submission
        })
    } catch (error) {
        console.error(error);
    res.status(500).json({success:false,error:"Failed to fetch submissions"})
    }
}