// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./InstitutionCredential.sol";

contract CredentialFactory {
    mapping(address => address) public institutionContracts;
    event InstitutionDeployed(address indexed institution, address contractAddress);

    function deployInstitutionContract(string memory name, string memory uri) external {
        require(institutionContracts[msg.sender] == address(0), "Institution already has a contract");

        InstitutionCredential newContract = new InstitutionCredential(msg.sender, name, uri);
        institutionContracts[msg.sender] = address(newContract);

        emit InstitutionDeployed(msg.sender, address(newContract));
    }

    function getInstitutionContract(address institution) external view returns (address) {
        return institutionContracts[institution];
    }
}
