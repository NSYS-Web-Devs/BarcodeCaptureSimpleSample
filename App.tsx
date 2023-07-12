import React, { useState } from 'react';
import BleManager from 'react-native-ble-manager';
import {
  SafeAreaView,
  StatusBar,
  Text,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  Alert
} from 'react-native';



function App(): JSX.Element {
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState('');

  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const startConnect = () => {
    BleManager.start({ showAlert: false }).then(() => {
      // Success code
      console.log("Module initialized");
    });

    BleManager.connect("08:3A:F2:3B:04:1A")
      .then(() => {
        // Success code
        console.log("Connected");
        setShowData(true);
        Alert.alert("Connected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        Alert.alert(error);
        setShowData(false);
      });
  };

  const stopConnect = () => {
    BleManager.disconnect("08:3A:F2:3B:04:1A")
      .then(() => {
        // Success code
        console.log("Disconnected");
        setShowData(false);
        Alert.alert("Disconnected");
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        Alert.alert(error);
      });

  };


  // BleManager.scan([], 10, true).then(() => {
  //   // Success code
  //   console.log("Scan started");
  // });



    async function connectAndPrepare(peripheral, service, characteristic) {
      // Connect to device
      await BleManager.connect(peripheral);
      // Before startNotification you need to call retrieveServices
      await BleManager.retrieveServices(peripheral);
      // To enable BleManagerDidUpdateValueForCharacteristic listener
      await BleManager.startNotification(peripheral, service, characteristic);
      // Add event listener
      bleManagerEmitter.addListener(
        "BleManagerDidUpdateValueForCharacteristic",
        ({ value, peripheral, characteristic, service }) => {
          // Convert bytes array to string
          //const data = bytesToString(value);
          const bytesString = String.fromCharCode(...value)
          setData(bytesString);
          // console.log(`Received ${bytesString} for characteristic ${characteristic}`);
        }
      );
      // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
    }
if(showData){
    connectAndPrepare("08:3A:F2:3B:04:1A", "91bad492-b950-4226-aa2b-4ede9fa42f59", "cba1d466-344c-4be3-ab3f-189f80dd7518")
}
  
    


//   var handle = setInterval(async () => {
//       if(showData){
//         BleManager.connect("08:3A:F2:3B:04:1A")
//         .then(() => {
//           console.log('fffffffffffff');
//           connectAndPrepare("08:3A:F2:3B:04:1A", "91bad492-b950-4226-aa2b-4ede9fa42f59", "cba1d466-344c-4be3-ab3f-189f80dd7518")
          
//         })
//         .catch((error) => {
//           console.log('neeeeeeeee');
//         });

//       }
// }, 15000);





  return (
    <SafeAreaView>
      <StatusBar />
      <Text>Bluetooth Low Energy</Text>
      <TouchableOpacity onPress={() => startConnect()} style={{   borderWidth: 1, padding: 5, marginBottom: 20}}>
        <Text>Connect</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => stopConnect()} style={{   borderWidth: 1, padding: 5, marginBottom: 20}}>
        <Text>Disconnect</Text>
      </TouchableOpacity>

      <Text>{data}</Text>
    </SafeAreaView>
  );
}
export default App;
