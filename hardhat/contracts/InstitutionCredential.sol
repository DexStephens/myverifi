// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract InstitutionCredential is ERC1155, Ownable {
    string public institutionName;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => string) public tokenIds;
    mapping(uint256 => bool) public revokedTokens;
    uint256 private _nextTokenId = 1;

    event CredentialCreated(string name, uint256 tokenId, address institution);
    event CredentialIssued(uint256 tokenId, address recipient);
    event CredentialRevoked(uint256 tokenId);

    constructor(address institutionOwner, string memory name, string memory jsonUri) 
        ERC1155(jsonUri) 
        Ownable(institutionOwner)
    {
        institutionName = name;
    }

    function createCredentialType(string memory name, string memory cid) external onlyOwner {
        uint256 tokenId = _nextTokenId++;
        tokenIds[tokenId] = name;
        _tokenURIs[tokenId] = cid;
        emit CredentialCreated(name, tokenId, msg.sender);
    }

    function issueCredential(address recipient, uint256 tokenId) external onlyOwner {
        require(balanceOf(recipient, tokenId) == 0, "Recipient already has this credential");
        require(bytes(tokenIds[tokenId]).length > 0, "Credential type does not exist");

        _mint(recipient, tokenId, 1, "");
        emit CredentialIssued(tokenId, recipient);
    }

    function batchIssueCredential(address[] memory recipients, uint256 tokenId) external onlyOwner {
        require(bytes(tokenIds[tokenId]).length > 0, "Credential type does not exist");
        require(recipients.length <= 100, "Too many recipients in one batch");

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            require(balanceOf(recipient, tokenId) == 0, "Recipient already has this credential");

            _mint(recipient, tokenId, 1, "");
            emit CredentialIssued(tokenId, recipient);
        }
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
        return (_tokenURIs[tokenId]);
    }

    function verifyCredential(address account, uint256 tokenId) external view returns (bool) {
        return balanceOf(account, tokenId) > 0;
    }
}