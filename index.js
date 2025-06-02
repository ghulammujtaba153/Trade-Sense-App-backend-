import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './database/db.js';
import authRouter from './routes/authRoutes.js';
import courseRouter from './routes/courseRoutes.js';
import planRouter from './routes/planRoutes.js';
import enrollmentRouter from './routes/enrollmentRoutes.js';
import goalsRouter from './routes/goalsRoutes.js';
import habbitRouter from './routes/habbitRoutes.js';
import ratingRouter from './routes/ratingRoutes.js';
import dashboardRouter from './routes/dashboardRoutes.js';
import otpRouter from './routes/otpRoutes.js';
import resourceRouter from './routes/mindfulResourceRoutes.js';
import onBoardingQuestionnaireRouter from './routes/onBoardingQuestionnaireRoutes.js';
import onBoardingRouter from './routes/onBoardingRoutes.js';
import pillarsCategoriesRouter from './routes/pillarsCategoriesRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import tagsRouter from './routes/tagsRoutes.js';
import aboutRouter from './routes/aboutRoutes.js';
import testimonialRouter from './routes/testimonialRoutes.js';
import termsRouter from './routes/termsConditionRoutes.js';
import faqRouter from './routes/faqRoutes.js';
import ResourseProgressRouter from './routes/resourceProgressRoutes.js';
import deliveredNotificationRouter from './routes/deliveredNotificationRoutes.js';
import configureGoogleAuth from './services/googleAuth.js';
import passport from 'passport';
import favouriteRouter from './routes/favouriteRoutes.js';
import courseModuleRouter from './routes/courseModuleRoutes.js';

const app = express();
dotenv.config();

app.use(cors({
    origin: ['http://localhost:5173', 'https://trade-sense-admin.vercel.app', 'http://localhost:3000', "https://trade-sense-app-1.vercel.app"],
    credentials: true,
  }));
  
app.use(bodyParser.json());

configureGoogleAuth();

app.use(passport.initialize());
// app.use(passport.session());


app.use(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = req.user.token; 
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
  }
);


connectDB();

app.use('/api/auth', authRouter);
app.use("/api/otp", otpRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", courseModuleRouter)
app.use("/api/plans", planRouter);
app.use("/api/enrollments", enrollmentRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/habbits", habbitRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/resources", resourceRouter);
app.use("/api/onboarding/questionnaire", onBoardingQuestionnaireRouter);
app.use("/api/onboarding", onBoardingRouter);
app.use("/api/pillars/categories", pillarsCategoriesRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/tags", tagsRouter);
app.use('/api/about', aboutRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/terms", termsRouter);
app.use("/api/faq", faqRouter);
app.use("/api/resource/progress", ResourseProgressRouter);
app.use("/api/delivered/notifications", deliveredNotificationRouter)
app.use("/api/favorites", favouriteRouter)







app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT || 5000}`);
});
