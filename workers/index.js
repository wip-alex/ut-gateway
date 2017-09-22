const Gun = require('gun');
require('gun/lib/path.js');
var forge = require('node-forge');
const serialize = require('serialize-javascript');
const deserialize = (serializedJavascript) => {
  return eval('(' + serializedJavascript + ')');
};
const md5 = require('blueimp-md5');
// const md = forge.md.md5.create();

const gun = Gun(['http://localhost:9000/gun']);
const rsa = forge.pki.rsa;
// var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

module.exports.generateKeys = () => {
  // console.log('1.generateKeys');
  const data = {bits: 2048, workers: 2, keyindex: 1};
  makeKey(data);
}

///////////////
const makeKey = (data) => {
  const options = { bits: data.bits, workers: data.workers };
  // console.log('1.encryptions makeKey : ', data);
  rsa.generateKeyPair(options, (err, keypair) => {
    // keypair.privateKey, keypair.publicKey
    // const signature = md5(keypair);
    // (err)? console.log('1.encryptions makeKey error : ', err)
    // :console.log('1.generateKeys keypairs : ', keypair);

    const key = serialize(keypair);
    const signature = md5(key);
    // md.update(key);
    // const signature = md.digest().toHex();
    console.log(`2.encryptions generateKeys signature : ${signature}`);

    const serverkeys = gun.get('ut');
    serverkeys.get(`keys/serverkeys/${data.keyindex}`).put({keypair: key, signature: signature});
    serverkeys.get(`keys/serverkeys/${data.keyindex}`).get('keypair').val( key => {
      // md.update(key);
      // const signature = md.digest().toHex();
      const savedSignature = md5(key);
      const savedKeypair = deserialize(key);

      console.log('3.encryptions verify signature : ', savedSignature);
    });
  });
}
