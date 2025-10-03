

/* To connect using MetaMask */
var walletAddress = "";
async function connect() {
    console.log('START wallet connect()');
    walletAddress = "";

  if (window.ethereum) {
     await window.ethereum.request({ method: "eth_requestAccounts" });
     window.web3 = new Web3(window.ethereum);
     const account = web3.eth.accounts;
     
     //Get the current MetaMask selected/active wallet
     //const walletAddress = account.givenProvider.selectedAddress;
     walletAddress = account.givenProvider.selectedAddress;

     console.log(`Wallet: ${walletAddress}`);
     
     document.getElementById("p_address").innerHTML = walletAddress;
     //document.getElementById("buyer_address").value = walletAddress;
  
  } else {
   console.log("Connect wallet to continue.");
   document.getElementById("p_address").innerHTML = "Connect wallet to continue.";
   //document.getElementById("hid_address").value = walletAddress;
  }
}

async function paynow(btn){
    console.log('START paynow()');
    //btn.style.visibility;
    document.getElementById('p_error').innerHTML = '';
    document.getElementById('paynow').style.visibility = "hidden";
    document.getElementById('div_cancelpaynow').style.visibility = 'visible';
    try{
        await connect();
        if(walletAddress != null){
            await charge(walletAddress, document.getElementById('seller_wallet').value,document.getElementById('sum').value);
        }
        else{
            document.getElementById('paynow').style.visibility = "visible";
            document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
            document.getElementById('p_error').innerHTML = "Connect wallet";
        }   
        
    }
    catch(e){
        var err = JSON.stringify(e,null,4);
        console.log(`ERROR paynow() ${err}`);
        document.getElementById('paynow').style.visibility = "visible";
        document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        err = err.toLowerCase()
        if(err.includes('user denied transaction')){
            document.getElementById('p_error').innerHTML = "Cancelled";    
        }
        else{
            document.getElementById('p_error').innerHTML = "Error";
        }
        
    }
}

async function cancelpaynow(btn){
    console.log('START cancelpaynow()');
    //btn.style.visibility;
    
    document.getElementById('div_cancelpaynow').style.visibility = "hidden";
    document.getElementById('paynow').style.visibility = 'visible';
    
    
}
async function charge(buyer,seller,amount){
    // using the promise
    /*web3.eth.sendTransaction({
        from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
        to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
        value: '1000000000000000'
    })
    .then(function(receipt){
        ...
    });
    */
    //const hash = await web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'))
    
    
    amount = parseFloat(amount);

    if(amount <= 0){
        //console.log('Invalid amount!');
        //document.getElementById('p_error').innerHTML = 'Invalid amount.';
        //document.getElementById('paynow').style.visibility = 'visible';
        //document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        return false;
        //return false;
    }
    console.log(`charge start...`);
    //document.getElementById('p_error').innerHTML = '';

    //document.getElementById('div_cancelpaynow').style.visibility = 'visible';

    

    console.log(`47: wallet= ${walletAddress}`);
    if(walletAddress && walletAddress.length >= 12){
        console.log(`wallet is valid ${walletAddress}`);
        const hash = await web3.eth.sendTransaction({
            from: buyer,//walletAddress,
            to: seller,
            value: `${amount * Math.pow(10, 18)}`
        });
        document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        if(hash){
            //console.log(`54: hash= ${JSON.stringify(hash)}`);
            //window.location.replace("/cart/success");
            
            document.getElementById('transaction_hash').value = JSON.stringify(hash);
           
            
            document.getElementById('cart_items').submit();
            

        }
        else{
            document.getElementById('p_error').innerHTML = 'There was an error processing your crypto payment.';
           
            //document.getElementById('paynow').style.visibility = 'visible';
        }
        
        
    }
    else{
        //document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        //document.getElementById('paynow').style.visibility = 'visible';
        //document.getElementById('p_error').innerHTML = 'Connect wallet to continue.';
        
    }
   // return false;

}
