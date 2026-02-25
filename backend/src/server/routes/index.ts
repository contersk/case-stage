import { Router } from "express";
import {} from "./../controllers";
import { ensureAuthenticated } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
  res.send("olá mundo!");
});

// router.post("/entrar/");
// router.post("/cadastrar");

export { router };
