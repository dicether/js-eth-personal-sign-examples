const ethUtil = require("ethereumjs-util")
const sigUtil = require("eth-sig-util")

var accounts = [undefined];

connectButton.addEventListener("click", function (event) {
    event.preventDefault()
    connect()
})

function connect() {
    if (typeof ethereum !== "undefined") {
        ethereum.request({
            method: "eth_requestAccounts"
        }).then(result => {
            accounts = result
            alert("Connected!");
        }).catch(error => {
            alert("Error: " + error.message);
        });
    } else {
        alert("ethereum not available!");
    }
}

ethSignButton.addEventListener("click", function (event) {
    event.preventDefault()
    const msg = "0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0";
    const from = accounts[0];
    if (!from) {
        alert("You need to connect!");
        return;
    }

    console.log("Sending eth_sign request");
    const params = [from, msg];
    console.dir(params);

    ethereum.request({
        method: "eth_sign",
        params: params,
    }).then(result => {
        console.log("result:", result);
        alert("eth_sign: " + result)
    }).catch(error => {
        alert("Error: " + error.message);
    });
})

signTypedDataButton.addEventListener("click", function (event) {
    event.preventDefault()

    const msgParams = [
        {
            type: "string",
            name: "Message",
            value: "Hi, Alice!"
        },
        {
            type: "uint32",
            name: "A number",
            value: "1337"
        }
    ];

    const from = accounts[0];
    if (!from) {
        alert("You need to connect!");
        return;
    }

    console.log("Sending signTypedData request");
    const params = [msgParams, from];
    console.dir(params);

    ethereum.request({
        method: "eth_signTypedData",
        params: params,
    }).then(result => {
        console.log("result:", result);
        const recovered = sigUtil.recoverTypedSignatureLegacy({data: msgParams, sig: result})
        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
            alert("Successfully ecRecovered signer as " + from)
        } else {
            alert("Failed to verify signer when comparing " + result + " to " + from)
        }
    }).catch(error => {
        alert("Error: " + error.message);
    });
})

signTypedDataV3Button.addEventListener("click", function (event) {
    event.preventDefault()

    const msgParams = JSON.stringify({
        types: {
            EIP712Domain: [
                {name: "name", type: "string"},
                {name: "version", type: "string"},
                {name: "chainId", type: "uint256"},
                {name: "verifyingContract", type: "address"}
            ],
            Person: [
                {name: "age", type: "uint64"},
                {name: "name", type: "string"},
                {name: "wallet", type: "address"}
            ],
            Mail: [
                {name: "from", type: "Person"},
                {name: "to", type: "Person"},
                {name: "contents", type: "string"},
                {name: "id", type: "uint256"},
            ]
        },
        primaryType: "Mail",
        domain: {
            name: "Ether Mail",
            version: "1",
            chainId: 1,
            verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
        },
        message: {
            from: {age: 46, name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"},
            to: {age: 445711732, name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"},
            contents: "Hello, Bob!",
            id: "18446744073709551617"
        }
    });

    const from = accounts[0];
    if (!from) {
        alert("You need to connect!");
        return;
    }

    const params = [from, msgParams];

    console.log("Sending eth_signTypedData_v3 request");
    console.dir(params);

    ethereum.request({
        method: "eth_signTypedData_v3",
        params: params,
    }).then(result => {
        console.log("result:", result);
        const recovered = sigUtil.recoverTypedSignature({data: JSON.parse(msgParams), sig: result})
        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
            alert("Successfully ecRecovered signer as " + from)
        } else {
            alert("Failed to verify signer when comparing " + result + " to " + from)
        }
    }).catch(error => {
        alert("Error: " + error.message);
    });
})

signTypedDataDicetherButton.addEventListener("click", function (event) {
    event.preventDefault()

    const msgParams = JSON.stringify({
        "types": {
            "EIP712Domain": [{"name": "name", "type": "string"}, {
                "name": "version",
                "type": "string"
            }, {"name": "chainId", "type": "uint256"}, {"name": "verifyingContract", "type": "address"}],
            "Bet": [{"name": "roundId", "type": "uint32"}, {"name": "gameType", "type": "uint8"}, {
                "name": "number",
                "type": "uint256"
            }, {"name": "value", "type": "uint256"}, {"name": "balance", "type": "int256"}, {
                "name": "serverHash",
                "type": "bytes32"
            }, {"name": "userHash", "type": "bytes32"}, {"name": "gameId", "type": "uint256"}]
        },
        "primaryType": "Bet",
        "domain": {
            "name": "Dicether",
            "version": "2",
            "chainId": 1,
            "verifyingContract": "0xaEc1F783B29Aab2727d7C374Aa55483fe299feFa"
        },
        "message": {
            "roundId": 1,
            "gameType": 4,
            "num": 1,
            "value": "320000000000000",
            "balance": "-640000000000000",
            "serverHash": "0x4ed3c2d4c6acd062a3a61add7ecdb2fcfd988d944ba18e52a0b0d912d7a43cf4",
            "userHash": "0x6901562dd98a823e76140dc8728eca225174406eaa6bf0da7b0ab67f6f93de4d",
            "gameId": 2393,
            "number": 1
        }
    });

    const from = accounts[0];
    if (!from) {
        alert("You need to connect!");
        return;
    }

    const params = [from, msgParams];

    console.log("Sending eth_signTypedData_v3 request");
    console.dir(params);

    ethereum.request({
        method: "eth_signTypedData_v3",
        params: params,
    }).then(result => {
        const recovered = sigUtil.recoverTypedSignature({data: JSON.parse(msgParams), sig: result})
        if (ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)) {
            alert("Successfully ecRecovered signer as " + from)
        } else {
            alert("Failed to verify signer when comparing " + result + " to " + from)
        }
    }).catch(error => {
        alert("Error: " + error.message);
    });
})