//SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

//see EIP-1046

interface ITokenMetadata /* is ERC20 */ {

    /// @notice A distinct Uniform Resource Identifier (URI) for a given token.
    function tokenURI() external view returns (string memory);
}