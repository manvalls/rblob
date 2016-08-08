var {Target} = require('y-emitter'),
    Resolver = require('y-resolver'),
    emitter = Symbol(),
    metadata = Symbol(),
    connection = Symbol(),
    size = Symbol(),
    BrowserBlob;

class RBlob extends Target{

  constructor(conn,sz = 0,md = {}){

    super(emitter);

    if(conn){

      if(global.Blob && conn instanceof global.Blob){
        BrowserBlob = BrowserBlob || require('./browser.js');
        return new BrowserBlob(conn);
      }

      this[connection] = conn.lock();
      conn.until('detached').listen(this.detach,[],this);

    }

    this[size] = sz;
    this[metadata] = md;

  }

  read(){
    var res = new Resolver();
    if(this[connection]) this[connection].send(['read',res,...arguments]);
    else res.reject(new Error('Cannot read from this blob'));
    return res.yielded;
  }

  getURL(){
    var res = new Resolver();
    if(this[connection]) this[connection].send(['url',res,...arguments]);
    else res.reject(new Error('URL not available for this blob'));
    return res.yielded;
  }

  handleConnection(conn){
    var agent = conn.lock();
    agent.on('message',onMessage,this);
    this.until('detached').listen(conn.detach,[],conn);
  }

  get size(){
    return this[size];
  }

  get metadata(){
    return this[metadata];
  }

  detach(){
    if(this[connection]) this[connection].detach();
    this[emitter].set('detached');
  }

  get ['3asKNsYzcdGduft'](){ return 35; }

}

function onMessage(m,d,rb){
  var method,res,args;

  if(!(m && (m instanceof Array) && Resolver.is(m[1]))) return;
  [method,res,...args] = m;

  switch(method){
    case 'read': return res.bind(rb.read(...args));
    case 'url': return res.bind(rb.getURL(...args));
  }

}

/*/ exports /*/

module.exports = RBlob;
