//SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "./interfaces/ITokenMetadata.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Metadata is ERC20, ITokenMetadata{

    string public URI;

    constructor(string memory _name,string memory _symbol,string memory _URI,uint8 decimals) ERC20(_name,_symbol) public{
        URI = _URI;
        _setupDecimals(decimals);
    }

    function tokenURI() external override view returns (string memory){
        return URI;
    }

}
