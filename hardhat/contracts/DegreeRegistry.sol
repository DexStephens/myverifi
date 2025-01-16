// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
}

contract documented {
    function hasLink(string memory doc) internal pure {
        bytes memory docBytes = bytes(doc);

        require(docBytes.length > 4);

        require(
            docBytes[0] == 'h' &&
            docBytes[1] == 't' &&
            docBytes[2] == 't' &&
            docBytes[3] == 'p'
        );
    }
}

contract DegreeRegistry is owned, documented {
    struct University {
        address owner;
        string ceebCode;
        string name;
        bool exists;
    }

    struct Degree {
        University university;
        string docLink;
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
    mapping(string => University) private _universities;

    function universityExists(string memory code) private view returns (bool exists) {
        return _universities[code].exists;
    }

    function isUniversityOwner(address sender, string memory ceeb) private view returns (bool isOwner) {
        return _universities[ceeb].owner == sender;
    }

    function recipientExists(address recipient) private view returns (bool exists) {
        return _degreesEarned[recipient].exists;
    }

    function addUniversity(string memory ceeb, string memory university, address owner) public onlyOwner {
        require(!universityExists(ceeb), "University already exists");
        University memory newUniversity = University(owner, ceeb, university, true);
        _universities[ceeb] = newUniversity;

        emit UniversityAdded(newUniversity);
    }

    function assignDegree(address assignee, string memory ceeb, string memory major, string memory level, string memory docLink) public {
        require(universityExists(ceeb), "University does not exist");
        require(isUniversityOwner(msg.sender, ceeb), "Only University owner can assign degrees");
        University memory university = _universities[ceeb];

        hasLink(docLink);
        Degree memory newDegree = Degree(university, docLink, assignee, major, level, block.timestamp, false);
        
        if (!recipientExists(assignee)) {
            _degreesEarned[assignee].exists = true;
        }

        _degreesEarned[assignee].degrees.push(newDegree);

        emit DegreeEarned(assignee, newDegree);
    }

    function getDegrees(address recipient) public view returns (Degree[] memory) {
        require(recipientExists(recipient), "No degrees found for this address.");
        return _degreesEarned[recipient].degrees;
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