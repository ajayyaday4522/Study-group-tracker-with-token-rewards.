const contractAddress = "0xde0d1b47775fca2f9075e154d982e351c9de4acd0b3532539e5699d445f0faff";
const contractABI = [
    [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "sessionId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                }
            ],
            "name": "SessionCompleted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "sessionId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "topic",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "SessionCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "recipient",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokensRewarded",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_sessionId",
                    "type": "uint256"
                }
            ],
            "name": "completeStudySession",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_topic",
                    "type": "string"
                }
            ],
            "name": "createStudySession",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getTokenBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rewardAmount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "sessionCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "sessions",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "topic",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "organizer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "completed",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "tokenBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];
let web3;
let contract;
let accounts;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        accounts = await web3.eth.getAccounts();
        contract = new web3.eth.Contract(contractABI, contractAddress);
        updateBalance();
        loadSessions();
    } else {
        alert("Please install MetaMask to use this application");
    }
});

async function createSession() {
    const topic = document.getElementById("topic").value;
    if (topic) {
        await contract.methods.createStudySession(topic).send({ from: accounts[0] });
        loadSessions();
    }
}

async function loadSessions() {
    const sessionList = document.getElementById("sessionList");
    sessionList.innerHTML = "";
    const count = await contract.methods.sessionCount().call();
    for (let i = 0; i < count; i++) {
        const session = await contract.methods.sessions(i).call();
        const li = document.createElement("li");
        li.innerHTML = `${session.topic} - ${session.completed ? "Completed" : "Pending"} <button onclick="completeSession(${i})">Complete</button>`;
        sessionList.appendChild(li);
    }
}

async function completeSession(sessionId) {
    await contract.methods.completeStudySession(sessionId).send({ from: accounts[0] });
    updateBalance();
    loadSessions();
}

async function updateBalance() {
    const balance = await contract.methods.getTokenBalance(accounts[0]).call();
    document.getElementById("balance").innerText = balance;
}
