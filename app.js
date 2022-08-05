const express = require("express");
const app = express();
const ejs = require("ejs");
const multer = require("multer");
const File = require("./models/file_model");
const bcrypt = require("bcrypt");

module.exports = app;

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: "uploads", limits: { fileSize: 10000 } });

app.route("/").get((req, res) => {
  res.render("index");
});

app.route("/upload").post(upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password !== null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }
  const file = await File.create(fileData);

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` });
});

app.route("/file/:id").get(handleDownload).post(handleDownload);

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id);
  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true });
    }
  }

  file.downloadCount++;
  await file.save();

  res.download(file.path, file.originalName);
}
