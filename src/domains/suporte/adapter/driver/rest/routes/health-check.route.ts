import { Router, Request, Response } from "express";

const router = Router();

router.get("/v1", (_request: Request, response: Response) => {
  return response.status(200).json({ message: "Health check ok" });
});

export default router;
