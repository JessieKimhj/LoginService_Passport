import express from "express";
import passport from 'passport';
import { forwardAuthenticated } from "../middleware/checkAuth";
import { database } from "../models/userModel";
import { Strategy } from "passport-local";

const router = express.Router();

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login', successRedirect: "/dashboard" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get("/login", forwardAuthenticated, (req, res) => {
  //const errorMsg = req.session.errors[0];
  res.render("login", {messages: (req.session as any).messages});
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage:"invalid login"
    /* failureMsg needed when login fails */
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;

