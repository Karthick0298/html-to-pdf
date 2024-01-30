const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const puppeteer = require("puppeteer");

const app = express();
const port = 5000;

const dataFromDatabase = {
  cust_name: "John Doe",
  tent_user_first_name: "Dr. Smith",
  tent_name: "Medical Clinic",
  appointment_number: "123456",
  date: "2024-01-01",
  time: "10:00 AM",
  meeting_link: "https://example.com/meeting",
  terms_and_conditions_content: "<li>Terms and conditions apply</li>",
  patient_or_client: "Patient",
};

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: false,
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/generate-pdf", (req, res) => {
  res.render("template", dataFromDatabase);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/generate-pdf`, {
    waitUntil: "networkidle0",
  });

  await page.pdf({ path: "output.pdf", format: "A4" });

  await browser.close();
  //   process.exit();
})();
