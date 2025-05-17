import { Router } from "express";
import * as VisitorController from '../controllers/visitor_controller.js'; // Import the controller

const visitorRoutes = Router();


visitorRoutes.get('/visit_page', VisitorController.visit_page);
visitorRoutes.get('/get_all_visit', VisitorController.get_all_visit);
visitorRoutes.post('/add_message', VisitorController.add_message);



export default visitorRoutes;
