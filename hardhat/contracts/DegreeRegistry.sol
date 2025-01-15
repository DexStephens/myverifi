// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract owned {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}

contract documented {
    modifier hasLink(string memory doc) {
        bytes memory docBytes = bytes(doc);

        require(docBytes.length > 4);

        require(
            docBytes[0] == 'h' &&
            docBytes[1] == 't' &&
            docBytes[2] == 't' &&
            docBytes[3] == 'p'
        );
        _;
    }
}

contract DegreeRegistry is owned, documented {
    struct University {
        address owner;
        bytes4 ceebCode;
        string name;
        bool exists;
    }

    struct Degree {
        University university;
        address recipient;
        string major;
        string level;
        uint256 timestamp;
        bool revoked;
    }

    struct DegreeList {
        Degree[] degrees;
        bool exists;
    }

    mapping(address => DegreeList) private _degreesEarned;
    // Use the CEEB code as the identifier
    mapping(bytes4 => University) private _universities;

    function universityExists(bytes4 code) private view returns (bool exists) {
        return _universities[code].exists;
    }

    function recipientExists(address recipient) private view returns (bool exists) {
        return _degreesEarned[recipient].exists;
    }

    function addUniversity(bytes4 ceeb, string memory university, address owner) public onlyOwner {
        require(!universityExists(ceeb), "University already exists");
        University memory newUniversity = University(owner, ceeb, university, true);
        _universities[ceeb] = newUniversity;

        emit UniversityAdded(newUniversity);
    }

    function assignDegree(address assignee, bytes4 ceeb, string memory major, string memory level) public {
        require(universityExists(ceeb), "University does not exist");
        University memory university = _universities[ceeb];

        Degree memory newDegree = Degree(university, assignee, major, level, block.timestamp, false);
        
        if (!recipientExists(assignee)) {
            Degree[] memory degrees;
            _degreesEarned[assignee] = DegreeList(degrees, true);
        }

        _degreesEarned[assignee].degrees.push(newDegree);

        emit DegreeEarned(assignee, newDegree);
    }

    event UniversityAdded(University university);
    event DegreeEarned(address recipient, Degree degree);
}

// msg.sender is an address
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
// What's with the requirement of _?
// Working with array structs is being very complicated?