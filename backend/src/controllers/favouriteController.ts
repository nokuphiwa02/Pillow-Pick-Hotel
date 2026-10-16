import { Request,Response } from "express";
import * as favouriteService from "../service/favouriteService"

export const addFavourites = async (req: Request, res:Response) => {
        try{
            const newFavourites = await favouriteService.createFavourites(req.body);
            res.status(201).json(newFavourites);
            }catch(error){
                console.error("Error creating Favourites:", error);
                res.status(500).json({message: "Error in creating Favourites"});
            }
    };

   export const getAllFavourites = async (req: Request, res: Response) => {
      try {
        
        const favourites = await favouriteService.findAllFavourites();
        res.status(200).json(favourites);
      } catch (error) {
        console.error("Error retrieving favourites:", error);
        res.status(500).json({ message: "Error retrieving favourites" });
      }
    };    

    export const getFavouritesById = async (req: Request, res: Response) => {
        try{
            const id = parseInt(req.params.id as string);
        
            const Favourites = await favouriteService.findFavouritesById(id)
        
            if (!Favourites){
                return res.status(404).json({message:"Favourites not found"})
            }
            return res.status(200).json(Favourites)
        }catch (error){
        res.status(500).json({message:"error retrieving Favourites"})
        }
        };

export const deleteFavourites = async(req: Request,res:Response) => {
       try{
           const id =parseInt(req.params.id as string)
           const Favourites = await favouriteService.deleteFavouritesById(id)
   
           if(!Favourites){
               return res.status(404).json({message:"Favourites not found"});
           }
           res.status(200).json({message:"Favourites Deleted successfully"});
       }catch(error){
           res.status(500).json({message:"Error deleting Favourites"})
       }
   };
    
