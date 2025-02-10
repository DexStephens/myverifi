// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract InstitutionCredential is ERC1155, Ownable {
    string public institutionName;
    mapping(uint256 => string) public tokenURIs;
    mapping(uint256 => bool) public revokedTokens;
    uint256 private _nextTokenId = 1;

    event CredentialCreated(uint256 indexed tokenId, string uri);
    event CredentialIssued(address indexed recipient, uint256 tokenId);
    event CredentialRevoked(uint256 tokenId);

    constructor(address institutionOwner, string memory name, string memory jsonUri) 
        ERC1155(jsonUri) 
        Ownable(institutionOwner)
    {
        institutionName = name;
    }

    function createCredentialType(string memory jsonUri) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        tokenURIs[tokenId] = jsonUri;
        emit CredentialCreated(tokenId, jsonUri);
        return tokenId;
    }

    function issueCredential(address recipient, uint256 tokenId) external onlyOwner {
        require(balanceOf(recipient, tokenId) == 0, "Recipient already has this credential");
        require(bytes(tokenURIs[tokenId]).length > 0, "Credential type does not exist");

        _mint(recipient, tokenId, 1, "");
        emit CredentialIssued(recipient, tokenId);
    }

    function revokeCredential(uint256 tokenId) external onlyOwner {
        require(!revokedTokens[tokenId], "Already revoked");
        revokedTokens[tokenId] = true;
        emit CredentialRevoked(tokenId);
    }

    function isValidCredential(uint256 tokenId) external view returns (bool) {
        return !revokedTokens[tokenId];
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(tokenId), Strings.toString(tokenId), ".json"));
    }

    function verifyCredential(address account, uint256 tokenId) external view returns (bool) {
        return balanceOf(account, tokenId) > 0;
    }
}