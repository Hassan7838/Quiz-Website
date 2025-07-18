const express = require("express");
const cors = require("cors");
const db= require('better-sqlite3')('Quiz.db')
db.pragma('journal_mode= WAL')
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');                 //load the ejs files
app.use(express.urlencoded({extented:false})); //middleware to use the data passes in request
app.use(express.static('public'));             //load the public folder

const createTables = db.transaction(() => {
     db.prepare(`
         CREATE TABLE IF NOT EXISTS users(
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT NOT NULL UNIQUE,
         password TEXT NOT NULL)
     `).run();
 })
 createTables();

 app.get("/",(req,res)=>{
      res.render('home');
 })

 app.get("/index",(req,res)=>{
      res.render('index');
 })

 app.get("/quiz",(req,res)=>{
      res.render('quiz');
 })

 app.get("/result",(req,res)=>{
      res.render('result');
 })

 app.get("/signup",(req,res)=>{
     res.render('signup');
 })

 app.get("/about",(req,res)=>{
      res.render('about');
 })

 app.get("/contact",(req,res)=>{
      res.render('contact');
 })

 // User Signup and Login 
 app.post("/signup",(req,res)=>{
     const {username, password}= req.body 
     const user= db.prepare(`
         INSERT INTO users(username,password)
         VALUES(?,?)
     `)
     user.run(username,password)
     res.redirect('/login')
 })

 app.get("/login",(req,res)=>{
      res.render('login',{error:null});
 })

 app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const stmt = db.prepare(`
        SELECT * FROM users WHERE username = ? AND password = ?
    `);

    const user = stmt.get(username, password); 

    if (user) {
        res.render('index'); 
    } else {
        res.render('login', { error: "Username or Password is invalid" }); 
    }
 });

// Quiz request and response handling
app.get("/api/questions/:topic", (req, res) => {
  const topic = req.params.topic.toLowerCase();
  const topicQuestions = questions[topic];

  if (topicQuestions) {
    const sanitized = topicQuestions.map(q => ({
      question: q.question,
      options: q.options
    }));
    res.json(sanitized);
  } else {
    res.status(404).json({ error: "Quiz topic not found." });
  }
});

app.post("/api/submit/:topic", (req, res) => {
  const topic = req.params.topic.toLowerCase();
  const userAnswers = req.body.answers;
  const topicQuestions = questions[topic];
  if (!topicQuestions) return res.status(404).json({ error: "Invalid topic" });
  let score = 0;
  userAnswers.forEach((answer, i) => {
    if (answer === topicQuestions[i].answer) score++;
  });
  res.json({ score });
});

// Sample and Categorized questions data
const questions = {
  html: [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Transfer Markup Language"
    ],
    answer: 0
  },
  {
    question: "What part of an HTML document provides information like the page title and linked stylesheets?",
    options: ["Head section", "Body section", "Footer", "Header"],
    answer: 0
  },
  {
    question: "Which HTML attribute is used to uniquely identify an element?",
    options: ["class", "id", "name", "key"],
    answer: 1
  },
  {
    question: "What is the purpose of the 'type' attribute in an input element?",
    options: ["To set the font", "To define validation rules", "To specify input format", "To create a button"],
    answer: 2
  },
  {
    question: "Which attribute is used to make a link open in a new tab?",
    options: ["target", "rel", "href", "title"],
    answer: 0
  }
],
  css: [
  {
    question: "What does CSS stand for?",
    options: ["Colorful Style Sheets", "Cascading Style Sheets", "Creative Style Syntax", "Computer Style Script"],
    answer: 1
  },
  {
    question: "Which property controls the text color?",
    options: ["text", "background-color", "color", "font-color"],
    answer: 2
  },
  {
    question: "How do you apply styles to a class in CSS?",
    options: [".classname", "#classname", "*classname", "classname"],
    answer: 0
  },
  {
    question: "Which CSS property sets the space between letters?",
    options: ["letter-spacing", "word-spacing", "spacing", "font-spacing"],
    answer: 0
  },
  {
    question: "How do you make text bold in CSS?",
    options: ["font-style: bold;", "font-weight: bold;", "text-style: bold;", "bold: true;"],
    answer: 1
  }
],

  js: [
  {
    question: "Which keyword declares a variable in JavaScript?",
    options: ["let", "define", "set", "varname"],
    answer: 0
  },
  {
    question: "How do you write a comment in JavaScript?",
    options: ["comment", "# comment", "// comment", "** comment **"],
    answer: 2
  },
  {
    question: "What is the output of typeof 'hello'?",
    options: ["string", "text", "word", "character"],
    answer: 0
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "append()", "add()", "insert()"],
    answer: 0
  },
  {
    question: "What will this return: Boolean(0)?",
    options: ["true", "false", "undefined", "error"],
    answer: 1
  }
]
};

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});