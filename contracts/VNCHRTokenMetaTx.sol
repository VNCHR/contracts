//SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20Capped.sol";
import "./ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VNCHRTokenMetaTx is 
    Ownable,
    ERC20("VNCHR","VNCHR"),
    ERC20Capped(5e6 ether),
    ERC20Permit("VNCHRTokenMetaTx")
    {

        function mint(address to,uint amount) external onlyOwner{
            _mint(to,amount);
        }

        function burn(uint amount) external{
            _burn(msg.sender,amount);
        }

        function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20,ERC20Capped) {
            super._beforeTokenTransfer(from, to, amount);
        }

}