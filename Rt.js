/* eslint-disable no-await-in-loop */
const DigiByte = require('digibyte');
const ltc = require('bitcore-lib-ltc');
const Doge = require('bitcore-lib-doge');
const LTC = require('bitcore-lib-ltc');
const fetch = require('node-fetch-polyfill');
class DigiByteService {
  MINER_2 = 7200000

  SAT_IN_DOGE = 100000000;

  FEE_TO_SEND_DOGE = 0.04 * this.SAT_IN_DOGE;

  MINER_FEE_3 = 600000;

  MINER = 7200000

  SAT_IN_LTC = 100000000;

  FEE_TO_SEND_LTC = 0.0000073 * this.SAT_IN_LTC;

  MINER_FEE_2 = 2500;

  SAT_IN_DGB = 100000000;

  FEE_TO_SEND_DGB = 0.0000553 * this.SAT_IN_DGB;

  MINER_FEE = 2000;

  TRANSACTIONS_RECEIVE_INTERVAL = 20;

  TRANSACTIONS_RECEIVE_TIMEOUT = 1000;

  async createTxDoge(privateKey, origin, destination, manualAmount = 0) {
    const pk = new Doge.PrivateKey(privateKey);
    let utxos = await this.getUtxos3(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount += +utxo.value;
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_DOGE);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.tx_hash,
      vout: +utxo.tx_output_n,
      address: origin,
      scriptPubKey: Doge.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_DOGE,
    }));

    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_DOGE;
    }

    return new Doge.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE_3)
      .change(origin)
      .sign(pk);
  }
  async depositDoge(address, my_address, privateKey,amount) {
    const transaction = await this.createTxDoge(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    console.log(ap)
    const serializedTransaction = transaction.serialize(true);
    const transactionResult = await this.publishTx2(serializedTransaction);
    return  {result: transactionResult.tx_hash,id:ap,Amount:ap,balance:ap};
  }
  async createTxLTC(privateKey, origin, destination, manualAmount = 0) {
    const pk = new ltc.PrivateKey(privateKey);
    let utxos = await this.getUtxos2(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount += +utxo.value;
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_LTC);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.txid,
      vout: +utxo.vout,
      address: origin,
      scriptPubKey: ltc.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_LTC,
    }));

    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_LTC;
    }

    return new ltc.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE_2)
      .change(origin)
      .sign(pk);
  }
  async depositLTC(address, my_address, privateKey,amount) {
    const transaction = await this.createTxLTC(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    console.log(ap)
    const serializedTransaction = transaction.serialize(true);
    console.log(serializedTransaction)
    const transactionResult = await this.publishTx3(serializedTransaction,ap);
    return  {result: transactionResult.result,id:ap,Amount:ap,balance:ap};
  }
  static getNewWallet() {
    const wallet = DigiByte.PrivateKey();
    return {
      address: wallet.toAddress().toString(),
      privateKey: wallet.toWIF(),
    };
  }
  
  static getWalletDoge() {
    const wallet = Doge.PrivateKey();
    return {
      address: wallet.toAddress().toString(),
      privateKey: wallet.toWIF(),
};
  }
  static getWallet() {
    const wallet = ltc.PrivateKey();
    var publiy = wallet.toPublicKey();
    return {
      address: wallet.toAddress().toString(),
      privateKey: wallet.toWIF(),
};
  }
  async getUtxos2(address) {
    const up = 'https://litecoinblockexplorer.net/api/v2/utxo/'+address
    const response = await fetch(up,{ method: 'GET'}) .then(function(res) {
        return res.json();
    })
    const resultData = await response;
    return resultData;
  }   
  async getUtxos3(address) {
    const up = 'https://dogechain.info/api/v1/unspent/'+address
    const response = await fetch(up,{ method: 'GET'}) .then(function(res) {
        return res.json();
    })
    const resultData = await response;
    return resultData.unspent_outputs;
  }   
  async getUtxos(address) {
    const up = 'https://digiexplorer.info/api/v2/utxo/'+address
    const response = await fetch(up,{ method: 'GET'}) .then(function(res) {
        return res.json();
    })
    const resultData = await response;
    return resultData;
  }   
  async getbalance(address) {
    var address = DigiByte.PrivateKey(address).toAddress().toString();
    return address
}
  async createTx(privateKey, origin, destination, manualAmount = 0) {
    const pk = new DigiByte.PrivateKey(privateKey);
    let utxos = await this.getUtxos(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount += +utxo.value;
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_DGB);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.txid,
      vout: +utxo.vout,
      address: origin,
      scriptPubKey: DigiByte.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_DGB,
    }));

    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    // if there's no manual amount we're passing all utxos, so we subtract the fee ourselves
    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_DGB;
    }

    return new DigiByte.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE)
      .change(origin)
      .sign(pk);
  }
  async deposit(address, my_address, privateKey,amount) {
    const transaction = await this.createTx(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    console.log(ap)
    const serializedTransaction = transaction.serialize(true);
    const transactionResult = await this.publishTx(serializedTransaction);
    return {result: transactionResult.result,id:ap,Amount:ap,balance:ap};
  }
  
  async sendLTC(address, my_address, privateKey, amount) {
    const transaction = await this.createLTC(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    const serializedTransaction = transaction.serialize(true);
    const transactionResult = await this.publishTx3(serializedTransaction);
    return {result: transactionResult.result,id:ap,Amount:ap,balance:ap};
  }
  async sendDoge(address, my_address, privateKey, amount) {
    const transaction = await this.createDoge(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    const serializedTransaction = transaction.serialize(true);
    const transactionResult = await this.publishTx2(serializedTransaction);
    return {result: transactionResult.tx_hash,id:ap,Amount:ap,balance:ap};
  }
  async createTransaction(privateKey, origin, destination, manualAmount = amount) {
    const pk = new DigiByte.PrivateKey(privateKey);
    const amount = manualAmount
    let utxos = await this.getUtxos(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount = amount
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_DGB);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.txid,
      vout: +utxo.vout,
      address: origin,
      scriptPubKey: DigiByte.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_DGB,
    }));
    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    // if there's no manual amount we're passing all utxos, so we subtract the fee ourselves
    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_DGB;
    }

    return new DigiByte.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE)
      .change(origin)
      .sign(pk);
  }
  async createLTC(privateKey, origin, destination, manualAmount = amount) {
    const pk = new ltc.PrivateKey(privateKey);
    const amount = manualAmount
    let utxos = await this.getUtxos2(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount = amount
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_LTC);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.txid,
      vout: +utxo.vout,
      address: origin,
      scriptPubKey: LTC.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_LTC,
    }));
    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    // if there's no manual amount we're passing all utxos, so we subtract the fee ourselves
    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_LTC;
    }

    return new LTC.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE_2)
      .change(origin)
      .sign(pk);
  }
  async createDoge(privateKey, origin, destination, manualAmount = amount) {
    const pk = new Doge.PrivateKey(privateKey);
    const amount = manualAmount
    let utxos = await this.getUtxos3(origin);
    let transactionAmount = 0;

    if (!manualAmount) {
      utxos.forEach((utxo) => {
        transactionAmount = amount
      });
    } else {
      transactionAmount = +(manualAmount * this.SAT_IN_DOGE);
    }

    utxos = utxos.map((utxo) => ({
      txId: utxo.tx_hash,
      vout: +utxo.tx_output_n,
      address: origin,
      scriptPubKey: Doge.Script.fromAddress(origin),
      amount: parseFloat(utxo.value) / this.SAT_IN_DOGE,
    }));
    if (!transactionAmount) {
      throw new Error('Not enough balance');
    }
    transactionAmount = transactionAmount.toFixed(0);
    transactionAmount = +transactionAmount;

    // if there's no amount we're passing all utxos, so we subtract the fee ourselves
    if (!manualAmount) {
      transactionAmount -= this.FEE_TO_SEND_DOGE;
    }

    return new Doge.Transaction()
      .from(utxos)
      .to(destination, transactionAmount)
      .fee(this.MINER_FEE_3)
      .change(origin)
      .sign(pk);
  }
  async publishTx(serializedTransaction) {
    const up = 'https://digiexplorer.info/api/sendtx/'+serializedTransaction
        const response = await fetch(up,{ method: 'GET' }).then(function(res) {
            return res.json();
        })
        const resultData = await response;
        return resultData;
      }
  async publishTx2(serializedTransaction) {
      const up = 'https://dogechain.info/api/v1/pushtx'
      const response = await fetch(up,{ method: 'POST',body: 'tx='+serializedTransaction }) .then(function(res) {
          return res.json();
      })
      const resultData = await response;
      return resultData;
    }
  async publishTx3(serializedTransaction) {
      const up = 'https://litecoinblockexplorer.net/api/sendtx/'+serializedTransaction
          const response = await fetch(up,{ method: 'GET' }).then(function(res) {
              return res.json();
          })
          const resultData = await response;
          return resultData;
        }
  async sendTransaction(address, my_address, privateKey, amount) {
    const transaction = await this.createTransaction(privateKey, my_address, address, amount);
    var ap = transaction._inputAmount / this.SAT_IN_LTC
    console.log(ap)
    const serializedTransaction = transaction.serialize(true);
    const transactionResult = await this.publishTx(serializedTransaction);
    return {result: transactionResult.result,id:ap,Amount:ap,balance:ap};
  }
}

module.exports = { DigiByteService };
