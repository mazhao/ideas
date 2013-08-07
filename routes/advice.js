/******************************
 * mongodb connector
 ******************************/
// mongodb connector
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('offerideas', server);

db.open(function(err, db){
    if(!err) {
        console.log('connect to offerides database');
        db.collection('advices', {strict: true}, function(err, collection){

            if(err) {
                console.log('the advices collection does\'t exists. creating it with sample data');
                populateDB();
            }

        })
    }
});

var populateDB = function(){
  var advices = [{
        category: '运营建议',
        title: '淘女郎资源',
        desc: '淘女郎可以作为很好的入手资源。'
  }, {
        category: '产品建议',
        title: '简单易用，无障碍',
        desc: '简单易用，无障碍是最低的要求。'
  }];

    db.collection('advices', function(err, collection){
         collection.insert(advices, {safe:true}, function(err, result){});
    })  ;
};

/******************************
 * 添加建议
 ******************************/


/**
 * 重定向到添加建议的页面。
 * @param req
 * @param res
 */
exports.goto_add = function(req, res) {

    res.render('advice', {page:'advice'});

}

/**
 * 提交建议
 * @param req
 * @param res
 */
exports.add = function(req, res) {

    var category = req.body.category;
    var title = req.body.title;
    var desc = req.body.desc;

    console.log('category:' + category + '\t title:' + title + '\t description:' + desc);

    db.collection('advices', function(err, collection){
        collection.insert({category: category,
            title: title,
            desc: desc
            }, {
                safe:true
            }, function(err, result){
                if (err) {
                    console.log('can not save new advice');
                } else {
                    console.log('advice save success, ' + result[0]);
                }
        });
    });

    //res.render('advice', {page:'advice'});
    res.redirect('/list');
}

/**
 * 显示一条建议
 * @param req
 * @param res
 */
exports.get = function(req, res) {

    res.render('advice', {page:'advice'});

}

/********************************
 *
 *********************************/

exports.list = function (req, res) {

    var datas = [];

    db.collection('advices', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('find items count:' + items.length);
            res.render('list', {page:'list', datas: items});
        });
    });

}

/**
 * like or dislike
 * @param req
 * @param res
 */
exports.like = function(req, res) {
    var type = req.query.type;
    var id = req.query.id;

    console.log('type:' + type);
    console.log('id  :' + id);


    if('like' == type) {
        console.log('begin like');
        db.collection('advices', function(err, collection){
            collection.findOne({_id: BSON.ObjectID.createFromHexString(id)}, function(err, document){
                document.each(function(err, doc){
                    console.log('find advice:' + doc.title);
                });



//                console.log('find like doc:' + document.category);
//                console.log('find like doc:' + document[0].title);
//                console.log('find like doc:' + document[0].desc);


            });
        });
    } else if('dislike' == type) {
        db.collection('advices', function(err, collection){
            collection.findOne({_id: BSON.ObjectID.createFromHexString(id)}, function(err, document){
                console.log('find dislike doc:' + document);
//                console.log('find like doc:' + document[0].category);
//                console.log('find like doc:' + document[0].title);
//                console.log('find like doc:' + document[0].desc);
            });
        });

    }


}

