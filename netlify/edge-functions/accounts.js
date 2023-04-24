export default async (request, context) => {
    const apiKey ='R6f95sv3bITomNzL';
    const secret ='LW8Y97J26SunxTOYhkC1ITx92U3W46UR';
    let allAccountData = [];

function sign(str, secret) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    return window.crypto.subtle
      .importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
      .then((key) => {
        return window.crypto.subtle.sign('HMAC', key, data);
      })
      .then((signature) => {
        return Array.from(new Uint8Array(signature))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
          .toLowerCase();
      });
  }

  
    const timestamp = Math.floor(Date.now() / 1000); console.log("FIRST TIMESTAMP ", timestamp);
    const str = timestamp + 'GET' + '/v2/accounts?limit=100&order=asc';
    const sig = await sign(str, secret);
    console.log(sig);
  
    const myHeaders = {
      'CB-ACCESS-KEY': apiKey,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-SIGN': sig,
      'CB-VERSION': "2017-10-02"
    };
  
    const url = 'https://api.coinbase.com/v2/accounts?limit=100&order=asc';
    console.log(`url1: ${url}`);
  
    const response = await fetch(url, {
      method: 'GET',
      headers: myHeaders,
    });
  
  
    let nextURI = "";

    const getRemainingData = async (accountPagination, accountData) => {
      console.log("running the getRemainingData fiunction")
      console.log()
      nextURI = accountPagination.next_uri
      console.log("nexTURI ", nextURI)
      const timestamp = Math.floor(Date.now() / 1000); console.log("SECOND TIMESTAMP ", timestamp);
      const path = nextURI.replace("https://api.coinbase.com", "");
      const str = timestamp + "GET" + path;
  
      //const str = timestamp + 'GET' + '/v2/accounts?&limit=100&order=asc&/v2/accounts?limit=100&order=asc&starting_after=a4268ea2-eead-54d9-8306-ebabc9d55792';
      const sig = await sign(str, secret);
      console.log(sig);
    
      const myHeaders = {
        'CB-ACCESS-KEY': apiKey,
        'CB-ACCESS-TIMESTAMP': timestamp,
        'CB-ACCESS-SIGN': sig,
        'CB-VERSION': "2017-10-02"
      };
    
      const url = "https://api.coinbase.com" + path;
      console.log(`url:2 ${url}`);
    
      const response = await fetch(url, {
        method: 'GET',
        headers: myHeaders,
      });
  
      const remainingAccountData = await response.json()
      .then( (remData) => {
        if (remData.data) {
          
          remData.data.forEach(element => {
            allAccountData.push(element)
          })
          
        }

        console.log("HERE IS THE REMININGACCOUNTDATA ", remData.data)
        console.log("length of allaccountsdata is now: ", allAccountData.length);
        //console.log(testdata)
        //allAccountData = [...accountData, ...remData.data];

        console.log("FINAL ARRAYYYYYYYYYYY",allAccountData)
        return "ALLACOIUNTDATAAAAAA";
      })
    
      .catch((err) => {
        console.log(err)
      })
      return allAccountData;
    };
    const responseData = await response.json()
        .then((res) => {
          console.log("hi")
         // console.log(res.data[0])
         console.log(res.data)
         res.data.forEach(element => {
          allAccountData.push(element)
        });
        
          nextURI = res.pagination.next_uri;
          if(nextURI) {
            console.log("getting remaining data...")
          getRemainingData(res.pagination, res.data);
        }
        return res.data;
        }).catch((err) => {
          console.log(err)
    });
      

  

  
      
    
    return new Response(JSON.stringify(responseData), {
        header:{
            "context-type":"application/json",
        },
    });
};