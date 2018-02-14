var imgpath;
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,’filestore’))
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      imgpath=raw.toString(‘hex’)+path.extname(file.originalname);
      cb(null, imgpath)
    })
  }
});

var upload = multer({ storage: storage });
app.post(‘/uploadfile’,upload.single(‘Bookcover’), function uploadImage(req,res) {
  var cookie_id = req.cookies.randomcookiename.auth_token;
  var user_id = req.cookies.randomcookiename.hasura_id;
  var Bookname=req.body.Bookname;
  var Author=req.body.Author;
  var Booktype=req.body.Booktype;
  var Desc=req.body.Desc;
  var Starrating=req.body.Starrating;
  var Category=req.body.Category;
  var Language=req.body.Language;
  var imgtype=req.file.mimetype;
  console.log(Bookname);
  console.log(Author);
  console.log(Category);
  console.log(Language);
  console.log(imgtype);
  console.log(imgpath);
  console.log(req.file);
  var imge=fs.readFileSync(req.file.destination+’/’+imgpath);
  var request = require(“request”);

  var options = {
    method: ‘POST’,
    url: ‘http://filestore.c100.hasura.me/v1/file/’+imgpath,
    body: imge,
    headers:
    { //’postman-token’: ‘e76ccac6-1945-b495-8194-dfe7cc77bf59’,
      //’cache-control’: ‘no-cache’,
      authorization: ‘Bearer ‘+cookie_id,
      ‘content-type’: imgtype }
    };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        if (response.statusCode==200){
          var request1 = require(“request”);

          var options = { method: ‘POST’,
            url: ‘http://data.c100.hasura.me/v1/query&#8217;,
            headers:
            { //’postman-token’: ‘c8ae8374-69ce-0541-4d0d-8cb1e9f6d830’,
              ‘cache-control’: ‘no-cache’,
              authorization: ‘Bearer ‘+cookie_id,
              ‘content-type’: ‘application/json’ },
              body:
              { type: ‘insert’,
                args:
                { table: ‘Book_upload’,
                  objects:
                  [ { Book_id: imgpath ,
                    User_id: user_id ,
                    Bookname: Bookname,
                    Author: Author,
                    Booktype: Booktype,
                    Desc: Desc,
                    Starrating: Starrating,
                    Category:Category,
                    Language:Language } ] } },
                    json: true };

                    request1(options, function (error, response, body) {
                      if (error) throw new Error(error);

                      console.log(body);
                      if(response.statusCode==200){
                        res.redirect(‘/displaybook.html’);
                      }
                    });
                  }
                });
              });
