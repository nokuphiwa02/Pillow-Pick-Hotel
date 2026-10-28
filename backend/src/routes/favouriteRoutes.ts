import { Router } from "express";
import { addFavourites,getAllFavourites,getFavouritesById,deleteFavourites } from "../controllers/favouriteController";

const router = Router();

router.post("/favourites", addFavourites)
router.get("/favourites", getAllFavourites)
router.get("/favourites/:id",getFavouritesById)
router.delete("/favourites/:id",deleteFavourites)

export default router;
