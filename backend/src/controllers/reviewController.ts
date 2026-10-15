import {  Request ,Response } from "express";
import * as reviewService from '../service/reviewService';

export const addReviews = async( req: Request, res: Response) => {
    try{
 const newReviews = await reviewService.createReviews(req.body);
 res.status(201).json(newReviews);
    }catch(error){
    console.error("Error creating reviews:",error);
    res.status(500).json({message: "Error in creating reviews "})
    }
};

    export const getAllReviews = async (req: Request, res: Response) => {
      try {
       
        const reviews = await reviewService.findAllReviews();
        res.status(200).json(reviews);
      } catch (error) {
        console.error("Error retrieving reviews:", error);
        res.status(500).json({ message: "Error retrieving reviews" });
      }
    };

     export const getReviewsById = async (req: Request, res: Response) => {
        try{
            const id = parseInt(req.params.id as string);
        
            const reviews = await reviewService.findReviewsById(id)
        
            if (!reviews){
                return res.status(404).json({message:"reviews not found"})
            }
            return res.status(200).json(reviews)
        }catch (error){
        res.status(500).json({message:"error retrieving reviews"})
        }
        };

       export const deleteReview = async(req: Request,res:Response) => {
              try{
                    if (req.user!.role !== 'admin') {
                      return res.status(403).json({ message: "Only Admin can delete bookings" })
                  }
                  const id =parseInt(req.params.id as string)
                  const review = await reviewService.deleteReviewsById (id)
          
                  if(!review){
                      return res.status(404).json({message:"review not found"});
                  }
                  res.status(200).json({message:"review Deleted successfully"});
              }catch(error){
                  res.status(500).json({message:"Error deleting review"})
              }
          }; 
