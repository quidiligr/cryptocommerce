

/* To connect using MetaMask */
var walletAddress = "";
async function connect() {
    console.log('6: START wallet connect()');
    walletAddress = "";

  if (window.ethereum) {
     await window.ethereum.request({ method: "eth_requestAccounts" });
     window.web3 = new Web3(window.ethereum);
     const account = web3.eth.accounts;
     
     //Get the current MetaMask selected/active wallet
     //const walletAddress = account.givenProvider.selectedAddress;
     walletAddress = account.givenProvider.selectedAddress;

     console.log(`18: Wallet: ${walletAddress}`);
     
     //document.getElementById("p_address").innerHTML = walletAddress;
     //document.getElementById("buyer_address").value = walletAddress;
  
  } else {
   console.log("24: Connect wallet to continue.");
   document.getElementById("p_address").innerHTML = "Connect wallet to continue.";
   
  }
}

async function paynow(){
    console.log('31: START paynow()');
    /*
    document.getElementById('p_error').innerHTML = '';
    document.getElementById('paynow').style.visibility = "hidden";
    document.getElementById('div_cancelpaynow').style.visibility = 'visible';
    */
    try{
        console.log('38: paynow() ATTEMPT to connect wallet...');
        await connect();
        
        if(walletAddress != null){
            var seller_wallet = document.getElementById('seller_wallet').value;
            var amount = parseFloat(document.getElementById('sum_eth').value)
            
            
            await charge(walletAddress, seller_wallet,amount);
        }
        else{
            
            
           console.log('49: Connect wallet.');
        }   
        
    }
    catch(e){
        var err = JSON.stringify(e,null,4);
        console.log(`55: ERROR paynow() ${err}`);
        /*
        document.getElementById('paynow').style.visibility = "visible";
        document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        */
        err = err.toLowerCase()
        if(err.includes('61: user denied transaction')){
            //document.getElementById('p_error').innerHTML = "Cancelled";    
            console.log('63: Order Cancelled');
        }
        else{
            //document.getElementById('p_error').innerHTML = "Error";
            console.log('67: Unspecified error');
        }
        
    }
}

async function cancelpaynow(btn){
    console.log('74: START cancelpaynow()');
    
    
    //document.getElementById('div_cancelpaynow').style.visibility = "hidden";
    //document.getElementById('paynow').style.visibility = 'visible';
    
    
    
}
async function charge(buyer,seller,amount){

    try{
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
    
    
    //amount = parseFloat(amount);
    console.log(`40: buyer wallet= ${buyer}`);
    console.log(`40: sellet wallet= ${seller}`);
    console.log(`40: amount= ${amount}`);
    const amountt = parseInt(amount * Math.pow(10, 18))
    console.log(`40: amountt= ${amountt}`);
    

    if(amount <= 0){
        //console.log('Invalid amount!');
        //document.getElementById('p_error').innerHTML = 'Invalid amount.';
        //document.getElementById('paynow').style.visibility = 'visible';
        //document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        return false;
        //return false;
    }
    
    console.log(`106: charge start...`);
    //document.getElementById('p_error').innerHTML = '';

    //document.getElementById('div_cancelpaynow').style.visibility = 'visible';

    

    //console.log(`47: wallet= ${walletAddress}`);
    if(buyer && buyer.length >= 12){
        //console.log(`115: buyer wallet is valid ${buyer}`);
        console.log(`106: sendTransactionharge start...`);
        

        
        const hash = await web3.eth.sendTransaction({
            from: buyer,//walletAddress,
            to: seller,
            //value: `${amount * Math.pow(10, 18)}`
            value:   amountt
        });

        console.log(`40: hash= ${JSON.stringify(hash)}`);
        //document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        if(hash){
            //console.log(`54: hash= ${JSON.stringify(hash)}`);
            //console.log(`54: hash= ${JSON.stringify(hash)}`);
            //window.location.replace("/cart/success");
            
            document.getElementById('transaction_hash').value = JSON.stringify(hash);
           
            
           document.getElementById('order_form').submit();

            

        }
        else{
            //document.getElementById('p_error').innerHTML = 'There was an error processing your crypto payment.';
            console.log('No hash!!!');
            
        }
        
        
    }
    else{
        //document.getElementById('div_cancelpaynow').style.visibility = 'hidden';
        //document.getElementById('paynow').style.visibility = 'visible';
        //document.getElementById('p_error').innerHTML = 'Connect wallet to continue.';
        console.log('146: Connect wallet to continue.');
        
    }
    }
    catch(e){
        //var err = JSON.stringify(e.stack,null,4);
        console.log(`162: ERROR paynow() ${e.stack}`);
        document.getElementById("btn_close_payment_modal").click();
        
    }

    //document.getElementById('order_form').submit();
    
   // return false;

}
