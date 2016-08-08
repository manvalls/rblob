var Resolver = require('y-resolver'),
    RBlob = require('./main.js'),
    blob = Symbol();

class BrowserBlob extends RBlob{

  constructor(b){

    super(null,b.size,{
      type: b.type,
      name: b.name,
      lastModified: b.lastModified
    });

    this[blob] = b;

  }

  read(){
    var b = this[blob].slice(...arguments),
        fr = new FileReader();

    fr.resolver = new Resolver();
    fr.onload = onLoad;
    fr.readAsArrayBuffer(b);
    return fr.resolver.yielded;
  }

  getURL(){
    var url = URL.createObjectURL(this[blob]);
    this.until('detached').listen(URL.revokeObjectURL,[url],URL);
    return Resolver.accept(url);
  }

}

function onLoad(){
  this.resolver.accept(new Uint8Array(this.result));
}

/*/ exports /*/

module.exports = BrowserBlob;
