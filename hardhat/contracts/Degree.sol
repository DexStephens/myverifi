// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract owned {

}

contract documented {

}

contract Degree is owned, documented {
    constructor() {

    }
}

// Numbers: can take gwei, wei, or ether, assumed to be wei by default
// Time: suffixes of seconds, minutes, hours, days, and weeks
// Error Handling: assert(bool condition), require(bool condition, (optional)string memory message), revert((optional)string memory reason)
// Keywords: this (current contract), super (contract one level higher in the inheritance hierarchy), selfdestruct(address payable recipient)
// Wei: the smallest unit of ether. When sending small amounts of Ether in a smart contract, the amount is typically specified in Wei. 1 ether = 10^18 wei
// Gwei: inbetween wei and ether, commonly used for specifying gas prices in transactions, 1 gwei = 10^9 wei, 1 eth = 10^9 gwei
// State variables: public, internal, and private
// Functions: external, public, internal, and privates
// View/pure: view is only reading state variables, and pure only perform computations on inputs with no blockchain state reading, do not cost gas
// Normal function with no view/pure: costs gas as it changes blockchain state, will by default create a transaction with the data it has
// What is with the view keyword?
// How does contract inheritance work and how does one contract use another contract, what does the deployment process for that look like?
// what is payable?