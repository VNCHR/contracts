//SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VNCHRToken is ERC20,Ownable{
    
    constructor() ERC20("VNCHR","VNCHR") public{}

    function mint(address to,uint amount) external onlyOwner{
        _mint(to,amount);
    }

}