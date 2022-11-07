const express = require('express');
const { DigiByteService } = require('./Rt');
const digiByteService = new DigiByteService();

const router = express.Router();
router.get('/', (req, res) => {
  try {
    const wallet = DigiByteService.getNewWallet();
    res.json(wallet);
  } catch (error) {
    res.json({ error: error?.message });
  }
})
router.get('/LTC', (req, res) => {
  try {
    const wallet = DigiByteService.getWallet();
    res.json(wallet);
  } catch (error) {
    res.json({ error: error?.message });
  }
})
router.get('/Doge', (req, res) => {
  try {
    const wallet = DigiByteService.getWalletDoge();
    res.json(wallet);
  } catch (error) {
    res.json({ error: error?.message });
  }
})
router.post('/deposit', async (req, res) => {
  try {
    const {
      address, my_address, privateKey,amount,} = req.body;
    const result = await digiByteService.deposit(address, my_address, privateKey,amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});
router.post('/depositLTC', async (req, res) => {
  try {
    const {
      address, my_address, privateKey,
    amount,} = req.body;
    const result = await digiByteService.depositLTC(address, my_address, privateKey,amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});
router.post('/depositDoge', async (req, res) => {
  try {
    const {
      address, my_address, privateKey,
    amount,} = req.body;
    const result = await digiByteService.depositDoge(address, my_address, privateKey,amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});

router.post('/sendLTC', async (req, res) => {
  try {
    const {
      address, my_address, privateKey, amount,
    } = req.body;
    console.log(privateKey)
    const result = await digiByteService.sendLTC(address, my_address, privateKey, amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});
router.post('/sendDoge', async (req, res) => {
  try {
    const {
      address, my_address, privateKey, amount,
    } = req.body
    console.log(privateKey)
    const result = await digiByteService.sendDoge(address, my_address, privateKey, amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});

router.post('/send', async (req, res) => {
  try {
    const {
      address, my_address, privateKey, amount,
    } = req.body;
    console.log(privateKey)
    const result = await digiByteService.sendTransaction(address, my_address, privateKey, amount);
    res.json(result);
  } catch (error) {
    res.json({ error: error?.message });
  }
});

module.exports = router;
