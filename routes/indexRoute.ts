import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";
import { database } from "../models/userModel";
import { session } from "passport";

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    if (req.sessionStore.all) {
      const data: {}[] = [];
      req.sessionStore.all((err, sessions) => {
        if (sessions) {
          let sessionId = Object.keys(sessions);
          for (const sid of sessionId) {
            //@ts-ignore
            const session = sessions[sid];
            const userId = session.passport.user;
            data.push({ sessionId: sid, userId: userId });
          }
          res.render("admin", {data, user: req.user});
        }
      });
    }
  } else {
    res.redirect("/auth/login");
  }
});

router.post('/admin/revoke-session', ensureAuthenticated, (req, res) => {
    const sessionId = req.body.sessionId; 
    req.sessionStore.destroy(sessionId, (err) => {
      if (err) {
        return res.status(500).send('Revoke Session Failed');
      }
      res.redirect('/auth/login'); 
    });
  });

export default router;

