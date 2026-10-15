import { Request , Response } from "express"
import * as bookingService from "../service/bookingService"

export const addBooking = async (req: Request, res:Response) => {
        try{
            const newBookings = await bookingService.createBookings(req.body);
            res.status(201).json(newBookings);
            }catch(error){
                console.error("Error creating bookings:", error);
                res.status(500).json({message: "Error in creating bookings"});
            }
    };

    export const getAllBookings = async (req: Request, res: Response) => {
      try {
        if(req.user!.role !== 'admin'){
        return res.status(403).json({message:"only admin can add hotel"})
    }
        const booking = await bookingService.findAllBookings();
        res.status(200).json(booking);
      } catch (error) {
        console.error("Error retrieving booking:", error);
        res.status(500).json({ message: "Error retrieving booking" });
      }
    };

    export const getBookingsById = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id as string);
    
        const booking = await bookingService.findBookingsById(id)
    
        if (!booking){
            return res.status(404).json({message:"booking not found"})
        }
        return res.status(200).json(booking)
    }catch (error){
    res.status(500).json({message:"error retrieving booking"})
    }
    };

   export const deleteBooking = async(req: Request,res:Response) => {
       try{
             if (req.user!.role !== 'admin') {
               return res.status(403).json({ message: "Only Admin can delete bookings" })
           }
           const id =parseInt(req.params.id as string)
           const booking = await bookingService.deleteBookingById(id)
   
           if(!booking){
               return res.status(404).json({message:"booking not found"});
           }
           res.status(200).json({message:"booking Deleted successfully"});
       }catch(error){
           res.status(500).json({message:"Error deleting booking"})
       }
   };
    