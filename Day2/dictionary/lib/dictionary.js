var ejDictionary = {
  hello: 'こんにちは'
 ,bye: 'さようなら'
 ,hey: 'へい'
 ,hi: 'やあ'
};

exports.translation = function(word) {
  if (Array.isArray(word)) {
    return multitrans(word);
  } else if (typeof word == 'string') {
    return trans(word);
  } else {
    throw new Error('Can not translation: ' + word);
  }
}

function trans(word) {
  var word = word.trim();
  var lword = word.toLowerCase();
  return { word: word, trans: ejDictionary[lword] || null };
}

function multitrans(words) {
  return words.map(function(w) {
    return trans(w);
  });
}
