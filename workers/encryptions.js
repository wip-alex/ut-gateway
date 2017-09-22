var forge = require('node-forge');

var rsa = forge.pki.rsa;
// var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001});


module.exports.generateKeys = () => {
  console.log('1.generateKeys');
  const data = {bits: 2048, workers: 2};
  makeKey(data);
}

///////////////
const makeKey = (data) => {
  rsa.generateKeyPair(data, (err, keypair) => {
    // keypair.privateKey, keypair.publicKey
    (err)? console.log('1.encryptions makeKey error : ', err) :
    console.log('1.generateKeys keypairs : ', keypair);
  });
}
