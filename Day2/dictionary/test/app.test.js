var app = require('../app')
    browser = require('tobi').createBrowser(3000, 'localhost');

describe('Web app', function() {
  describe('/search.html のテスト', function() {
    it('textboxにはHelloがセットされ こんにちは が返ってくる', function(done) {
      browser.get('/search.html', function(res, $) {
        $('div + p').should.be.empty;
        $('form')
          .fill({ word: 'Hello' })
          .submit(function(res, $) {
            $('form input[name=word]').should.have.value('Hello');
            $('div + p').should.have.text('こんにちは');
            done();
          });
      });
    });

    it('複数パラメータは最初の値だけ処理される', function(done) {
      browser.get('/search.html?word=hello&word=bye', function(res, $) {
        res.should.have.status(200);
        $('form input[name=word]').should.have.value('hello');
        done();
      });
    });

    it('大文字でもOK', function(done) {
      browser.get('/search.html?word=HELLO', function(res, $) {
        res.should.have.status(200);
        $('form input[name=word]').should.have.value('HELLO');
        $('div + p').should.have.text('こんにちは');
        done();
      });
    });

    it('前後の空白は無視される', function(done) {
      browser.get('/search.html?word=+++hello++', function(res, $) {
        res.should.have.status(200);
        $('form input[name=word]').should.have.value('hello');
        $('div + p').should.have.text('こんにちは');
        done();
      });
    });

    it('辞書にない単語はメッセージ表示', function(done) {
      browser.get('/search.html?word=hoge', function(res, $) {
        res.should.have.status(200);
        $('form input[name=word]').should.have.value('hoge');
        $('div + p').should.have.text('hogeは辞書に登録されていません');
        done();
      });
    });
  });

  describe('/search.txt のテスト', function() {
    it('複数パラメータは最初の値だけ処理される', function(done) {
      browser.get('/search.txt?word=hello&word=bye', function(res, text) {
        res.should.have.status(200);
        res.should.have.header('Content-Type');
        res.headers['content-type'].should.include('text/plain');
        text.should.equal('こんにちは');
        done();
      });
    });

    it('辞書にない単語は404', function(done) {
      browser.get('/search.txt?word=hoge', function(res, text) {
        res.should.have.status(404);
        done();
      });
    });
  });

  describe('/search.json のテスト', function() {
    it('単一パラメータはその値を処理', function(done) {
      browser.get('/search.json?word=hello', function(res, json) {
        res.should.have.status(200);
        res.should.be.json;
        json.should.eql({ hello: 'こんにちは' });
        done();
      });
    });

    it('複数パラメータは全て処理', function(done) {
      browser.get('/search.json?word=hello&word=bye', function(res, json) {
        res.should.have.status(200);
        res.should.be.json;
        json.should.eql({ hello: 'こんにちは', bye: 'さようなら' });
        done();
      });
    });

    it('辞書にない単語はnullがセットされる', function(done) {
      browser.get('/search.json?word=hoge', function(res, json) {
        res.should.have.status(200);
        res.should.be.json;
        json.should.eql({ hoge: null });
        done();
      });
    });
  });

  describe('/search.json のエラーテスト', function() {
    it('オブジェクトを渡されたら {} を返す', function(done) {
      browser.get('/search.json?word[foo]=bar', function(res, json) {
        res.should.have.status(200);
        res.should.be.json;
        json.should.eql({ });
        done();
      });
    });

    it('文字列以外の配列を渡されたら {} を返す', function(done) {
      browser.get('/search.json?word[foo]=bar&word=baz', function(res, json) {
        res.should.have.status(200);
        res.should.be.json;
        json.should.eql({ });
        done();
      });
    });
  });

  describe('/search.xml のテスト', function() {
    it('サポートしてないフォーマットは404', function(done) {
      browser.get('/search.xml', function(res, $) {
        res.should.have.status(404);
        done();
      });
    });
  });
});