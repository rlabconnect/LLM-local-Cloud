const path = require("path");
const express = require('express');
const multer = require("multer");
const convertPdfToImages=require("./convert.js")
const grayscale=require("./grayscale.js")
const app = express();
const imageRead=require("./imageRead.js")
const openai=require("./openaiAPI.js")
// const deletefile=require("./deletefiles.js");
const {makedir,removedir}=require("./dircheckdelete.js")
const port = 3000;
let filenumber=1;
// removedir(filenumber)
makedir(filenumber);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,`./uploads${filenumber}`)
  },
  filename:function(req,file,cb){
    return cb(null,file.originalname)
  }
})
const upload=multer({storage:storage})
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.get("/", (req, res) => {
  return res.render("index")
});

// here is the main login for file handling
app.post("/upload",upload.single("file"),async(req,res)=>{
  const filepath=req.file.path
  const filterText = req.body.filterText || "";

  // here pdf is converted to images
  await convertPdfToImages(filepath,filenumber);
  // now converting the images to grayscale
  await grayscale(filenumber);
  // now send the data to microsoft azure api
  tempresult=await imageRead(filenumber,filterText);
  if(filterText){    
    let result=await openai(filenumber);
    return res.status(200).json({tempresult:result});
  }
  
  removedir(filenumber)
  // filenumber++;
  return res.status(200).json({tempresult});
})


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
