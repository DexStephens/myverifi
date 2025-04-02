import express from "express";
import { authenticateToken } from "../middleware/auth";
import { apiToken } from "../middleware/apiToken";
import { ApiController } from "../controllers/api.controller";
const router = express.Router();

// Key management
router.post("/generate-apikey", authenticateToken, ApiController.generateApiKey);
router.post("/revoke-apikey", authenticateToken, ApiController.revokeApiKey);

// Issuer routes
router.get('/listCredentials', apiToken, ApiController.listCredentials);
router.post('/createCredential', apiToken, ApiController.createCredential);
router.post('/issue', apiToken, ApiController.issue);
router.post('/credentials', apiToken, ApiController.getCredentials);

export default router;
