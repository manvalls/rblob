var t = require('u-test'),
    assert = require('assert'),
    Connection = require('ebjs/connection'),
    label = require('ebjs/label'),
    labels = require('ebjs/definitions/labels'),
    RBlob = require('../main.js');

function dac(arr,str){
  assert.strictEqual((new TextDecoder()).decode(arr),str);
}

t('Browser blob',function*(){
  var b = new RBlob(new Blob(['012345678'],{type: 'foo/bar'}));

  t('Metadata',function*(){
    assert.strictEqual(b.size,9);
    assert.strictEqual(b.metadata.type,'foo/bar');
  });

  t('Read',function*(){
    dac(yield b.read(0,3),'012');
    dac(yield b.read(),'012345678');
  });

  t('URL',function*(){
    var url = yield b.getURL();

    assert.strictEqual(
      yield (yield fetch(url)).text(),
      '012345678'
    );
  });

  t('ebjs label',function(){
    assert.strictEqual(b[label],35);
  });

  t('Over a connection',function*(){
    var conn = new Connection(),
        bc = new RBlob(conn,b.size,b.metadata);

    b.handleConnection(conn.end);

    yield t('Metadata',function*(){
      assert.strictEqual(bc.size,9);
      assert.strictEqual(bc.metadata.type,'foo/bar');
    });

    yield t('Read',function*(){
      dac(yield bc.read(0,3),'012');
      dac(yield bc.read(),'012345678');
    });

    yield t('URL',function*(){
      var url = yield bc.getURL();

      assert.strictEqual(
        yield (yield fetch(url)).text(),
        '012345678'
      );
    });

    yield t('Detach',function*(){
      b.detach();
      yield conn.until('detached');
      yield bc.until('detached');
    });

    t('ebjs label',function(){
      assert.strictEqual(bc[label],35);
    });

  });

});

t('Empty blob',function(){
  var b = new RBlob();

  t('Read',function*(){
    var error;
    try{ yield b.read(); }
    catch(e){ error = e; }
    assert(!!error);
  });

  t('URL',function*(){
    var error;
    try{ yield b.getURL(); }
    catch(e){ error = e; }
    assert(!!error);
  });

});
