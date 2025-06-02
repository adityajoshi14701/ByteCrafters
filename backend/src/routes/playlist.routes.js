import express from "express"
import verifyUser from "../middleware/auth.middleware";
import { getAllListDetails,getPlaylistDetails,createPlaylist,deletePlaylist,removeProblemFromPlaylist,addProblemToPlaylist } from "../controllers/playlist.controller";

const playlistRoutes = express.Router();

playlistRoutes.get("/",verifyUser,getAllListDetails);
playlistRoutes.get("/:plaulistId",verifyUser,getPlaylistDetails);
playlistRoutes.post("/create-playlist",verifyUser,createPlaylist);
playlistRoutes.post('/:playlistId/add-problem',verifyUser,addProblemToPlaylist);
playlistRoutes.delete("/:playlistId",verifyUser,deletePlaylist);
playlistRoutes.delete("/playlistId/remove-problem",verifyUser,removeProblemFromPlaylist)

export default playlistRoutes;