export const getAllListDetails = async (req,res)=>{

    try{
        const playlists = await db.playlist.findMany({
            where:{
                userId:req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })
        res.status(200).json({
            success:true,
            message:"Playlist fetched successfull",
            playlists
        })
    }catch (error) {
        console.error("Error fetching playlist",error);
        res.status(500).json({error:"Error while fetching playlist"})
    }
}

export const getPlaylistDetails=async (req,res)=>{ 
    try {
        const {playlistId} = req.params
        const playlist = await db.playlist.findUnique({
            where:{
                userId:req.user.id,
                id:playlistId
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        if(!playlist)
            res.status(404).json({
        error:"Playlist not found"})
        res.status(200).json({
            success:true,
            message:"Playlist fetched successfull",
            playlist
        })
    } catch (error) {
        console.error("Error fetching playlist",error);
        res.status(500).json({error:"Error while fetching playlist"})
    }
}

export const createPlaylist=async (req,res)=>{
    try {
        const {name ,description}=req.body;
    const userId = req.user.id; 
    const playlist = await db.playlist.create({
      data:{
        name,description,userId
      }  
    })
    res.status(200).json({
        success:true,
        message:"Playlist created successfully",
        playlist
    })
    } catch (error) {
         console.error("Error creating playlist",error);
         res.status(500).json({error:"Error while creating playlist"})
         
    }
}

export const addProblemToPlaylist=async (req,res)=>{
    try {
        const {playlistId} = req.params
        const {problemIds}= req.body 
        if(!Array.isArray(problemIds)||problemIds.length===0){
            return res.status(400).json({error:"Invalid or Missing problems Id"})
        }

        const problemsInPlaylist = await db.problemsInPlaylist.createMany({
            data:
                problemIds.map((problemId)=>({
problemId,
playlistId
                }))
            
        })
        res.status(201).json({
            success:true,
            message:"Problem added successfully"
        })
    } catch (error) {
        console.error("Error while adding problem :",error);
        res.status(500).json({error:"Error while addding problem"});
        
    }
}

export const deletePlaylist=async (req,res)=>{
    try {
        const {playlistId}=req.params
       const deletedPlaylist= await db.problemsInPlaylist.delete({where:{
            playlistId
        }})

        res.status(200).json({
            success:true,
            message:"Playlist deleted successfully ",
            deletePlaylist
        })
    } catch (error) {
        console.error("Error while deleting problem :",error);
        res.status(500).json({error:"Error while deleting problem"});
    }
    
}

export const removeProblemFromPlaylist=async (req,res)=>{
    try {
        const {playlistId}=req.params;

        const {problemIds}=req.body;

        if(!Array.isArray(problemIds)||problemIds.length===0){
            return res.status(400).json({error:"Invalid or Missing problems Id"})
        }

        const deletedProblems =await db.problemsInPlaylist.deleteMany({
            where:{
                playlistId,
                problemId:{
                    in:problemIds
                }
            }
        })
        res.status(200).json({
            success:true,
            message:"Problems deleted successfully",
            deletedProblems
        })

    } catch (error) {
        console.error("Error while deleting problem :",error);
        res.status(500).json({error:"Error while deleting problem"});
    }
}