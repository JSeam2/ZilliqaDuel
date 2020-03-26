import 'aframe';
import 'aframe-event-set-component';
import 'aframe-particle-system-component';
import { Entity, Scene } from 'aframe-react';
import React, { useState, useEffect} from 'react';
import { ContractAddress, VERSION, chainId, msgVersion } from './Config';

// Zilliqa stuff
const { BN, Long, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  toBech32Address,
  getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

// const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions

var zilliqa;
var utils;

function App() {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
  const hTextSample = {
    intro: "Zilliqa Duel",
    pending: "Waiting for player to join..."
  }
  const pTextSample = {
    intro: "You are now a gunslinger in search for bounties. Place your bets and compete with your friends to who has the fastest fingers",
    pending: 'Please cancel game if you want to leave this screen, rejoining mechanics has not been implemented yet',
  }

  const [createColor, setCreateColor] = useState('yellow');
  const [joinColor, setJoinColor] = useState('green');
  const [cancelColor, setCancelColor] = useState('red');
  const [withdrawColor, setWithdrawColor] = useState('blue');

  const [zilPay, setZilPay] = useState("ZilPay not detected");
  const [pText, setPText] = useState(pTextSample.intro);
  const [hText, setHText] = useState(hTextSample.intro);

  const [gameState, setGameState] = useState(-1);

  useEffect(() => {
    window.addEventListener("load", () => {
      if (window.zilPay) {
        zilliqa = window.zilPay;
        utils = zilliqa.utils;

        console.log('ZilPay detected');
        setZilPay("ZilPay detected");

        // Ask for permission 
        zilliqa.wallet.connect();

        if (window.zilPay.wallet.isEnable) {
          const currentAddress = window.zilPay.wallet.defaultAccountbech32;
          console.log(zilliqa);
          console.log(`my Address: ${currentAddress}`);
        } else if (window.zilPay.wallet.isConnect) {
          window.zilPay.wallet.connect();
        } else {
          console.log(`isEnable: ${window.zilPay.wallet.isEnable}`);
        }
      } else {
        setZilPay("ZilPay not detected");
      }
    })
  })

  const handleCreate = () => {
    const deployedContract = zilliqa.contracts.at(ContractAddress);

    console.log('Calling Create ()');
    var amountZIL = prompt("Input Contribution Amount min 100 ZIL", 100);
    deployedContract.call(
      'Create',
      [],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new BN(amountZIL),
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(8000),
      },
      false,
    )
    .then((callTx) => {
      zilliqa.blockchain.getPendingTxn(callTx.id).then((pendingStatus) => {
        console.log(`Pending status is: `);
        console.log(pendingStatus.result);
        console.log(`The transaction id is:`, callTx.id);
        console.log(`Waiting transaction be confirmed`);

        callTx.confirm(callTx.id).then((confirmedTxn) => {
          console.log(`The transaction status is:`);
          console.log(confirmedTxn.receipt);
          if (confirmedTxn.receipt.success === true) {
            console.log(`Contract address is: ${deployedContract.address}`);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch((err) => {
      console.log(err);
    })
  }
  const handleJoin = () => {
    setJoinColor('blue');
  }
  const handleCancel = () => {
    setCancelColor('yellow');
    setPText(pTextSample.intro);
    setHText(hTextSample.intro);
  }
  const handleWithdraw = () => {
    setWithdrawColor('green');
  }
  return (
      <Scene>
        <a-assets>
          <img alt="ground" id="groundTexture" src="img/floor.jpg" />
          <img alt="sky" id="skyTexture" src="img/sky.jpg" />
        </a-assets>
        <Entity
          primitive="a-plane"
          src="#groundTexture"
          rotation="-90 0 0"
          height="100"
          width="100"
        />
        <Entity primitive="a-light" type="ambient" color="#445451" />
        <Entity
          primitive="a-light"
          type="point"
          intensity="2"
          position="2 4 4"
        />
        <Entity
          primitive="a-sky"
          height="2048"
          radius="30"
          src="#skyTexture"
          theta-length="90"
          width="2048"
        />
        {/* <Entity particle-system={{ preset: 'dust', particleCount: 2000 }} /> */}
        <Entity
          text={{ value: zilPay, align: 'center' }}
          position={{ x: 0, y: 1.83, z: -0.5 }}

        />
        <Entity
          text={{ value: hText, align: 'center' }}
          position={{ x: 0, y: 1.75, z: -0.5 }}

        />
        <Entity
          text={{ value: pText, align: 'center' }}
          position={{ x: 0, y: 1.75, z: -1 }}
        />
        <Entity primitive="a-camera">
          <Entity
            primitive="a-cursor"
            animation__click={{
              property: 'scale',
              startEvents: 'click',
              from: '0.1 0.1 0.1',
              to: '1 1 1',
              dur: 150,
            }}
            material='color: white; shader: flat'
          />
        </Entity>

        {/* <Entity
          geometry={{ primitive: 'box', depth: 0.2, height: 0.2, width: 0.2 }}
          material={{ color: '#24CAFF' }}
        /> */}
        <Entity
          text={{ value: 'Create Game', align: 'center' }}
          position={{ x: -0.21, y: 1.41, z: -0.8 }}
        />
        <Entity
          id="create-box"
          geometry={{ primitive: 'box' }}
          material={{ color: createColor, opacity: 0.3 }}
          position={{ x: -0.7, y: 1, z: -3 }}
          events={{ click: handleCreate }}
        >
        </Entity>
        <Entity
          text={{ value: 'Join Game', align: 'center' }}
          position={{ x: 0.21, y: 1.41, z: -0.8 }}
        />
        <Entity
          id="join-box"
          geometry={{ primitive: 'box' }}
          material={{ color: joinColor, opacity: 0.3 }}
          position={{ x: 0.7, y: 1, z: -3 }}
          events={{ click: handleJoin }}
        >
        </Entity>
        <Entity
          text={{ value: 'Cancel Game', align: 'center' }}
          position={{ x: 1.25, y: 1.68, z: -1.3 }}
        />
        <Entity
          id="cancel-box"
          geometry={{ primitive: 'box' }}
          material={{ color: cancelColor, opacity: 0.3 }}
          position={{ x: 4.7, y: 2, z: -5 }}
          events={{ click: handleCancel }}
        >
        </Entity>
        <Entity
          text={{ value: 'Withdraw', align: 'center' }}
          position={{ x: -1.25, y: 1.68, z: -1.3 }}
        />
        <Entity
          id="cancel-box"
          geometry={{ primitive: 'box' }}
          material={{ color: withdrawColor, opacity: 0.3 }}
          position={{ x: -4.7, y: 2, z: -5 }}
          events={{ click: handleWithdraw }}
        >
        </Entity>
      </Scene>
  );
}

export default App;
