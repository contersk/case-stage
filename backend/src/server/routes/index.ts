import { Router } from "express";
import {} from "./../controllers";
import { ensureAuthenticated } from "../shared/middleware";

const router = Router();

router.get("/", (req, res) => {
  res.send("olá mundo!");
});

router.get("/cidades", ensureAuthenticated);
router.get("/cidades/:id", ensureAuthenticated);

router.post("/cidades", ensureAuthenticated);

router.put("/cidades/:id", ensureAuthenticated);

router.delete("/cidades/:id", ensureAuthenticated);

router.get("/pessoas", ensureAuthenticated);

router.get("/pessoas/:id", ensureAuthenticated);

router.post("/pessoas", ensureAuthenticated);

router.put("/pessoas/:id", ensureAuthenticated);

router.delete("/pessoas/:id", ensureAuthenticated);

// router.post("/entrar/");
// router.post("/cadastrar");

export { router };
