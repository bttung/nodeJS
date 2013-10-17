var dict = require('../lib/dictionary');
exports.search = {};

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.search.html = function(req, res){
  var jword = dict.translation(getWord(req));
  res.render('search', { title: '簡易英和', word: jword.word, tword: jword.trans });
};

exports.search.txt = function(req, res) {
  var trans = dict.translation(getWord(req)).trans;
  if (trans) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(trans);
  } else {
    res.send(404);
  }
}

exports.search.json = function(req, res) {
  var word = req.param('word', '');
  if (typeof word == 'string') {
    word = [word];
  } else if (!Array.isArray(word)) {
    return res.json({});
  } else {
    var someNotString = word.some(function(w) {
      return (typeof w != 'string');
    });
    if (someNotString) {
      return res.json({});
    }
  }
  
  var ary = dict.translation(word);
  var obj = {};
  
  ary.forEach(function(d) {
    obj[d.word] = d.trans;
  });
  res.json(obj);
}

function getWord(req) {
  var word = req.param('word', '');
  if (typeof word != 'string') {
    word = word[0] || '';
  }
  return word;
}
