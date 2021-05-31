// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Pausable.sol";

/// @title VNCHR Item NFT token
/// @author VNCHR
/// @notice The contract represents VNCHR NFT Item
contract VNCHRItem is AccessControl, ERC1155, ERC1155Burnable, ERC1155Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice No NFTs can be minted after sale is complete for a token ID
    /// NFT Token ID --> Boolean
    mapping(uint256 => bool) public isSaleComplete;

    constructor(string memory uri) public ERC1155(uri) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
    }

    function setURI(string memory newuri) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "VNCHRItem: must have admin role to update URI");
        _setURI(newuri);
    }

    function markSaleOver(uint256 tokenId) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "VNCHRItem: must have admin role to update");
        isSaleComplete[tokenId] = true;
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "VNCHRItem: must have minter role to mint");
        require(!isSaleComplete[id], "VNCHRItem: Item sale complete");

        _mint(to, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, msg.sender), "VNCHRItem: must have minter role to mint");

        for (uint i = 0; i < ids.length; i++) {
            require(!isSaleComplete[ids[i]], "VNCHRItem: Item sale complete");
        }

        _mintBatch(to, ids, amounts, data);
    }

    function pause() public virtual {
        require(hasRole(PAUSER_ROLE, msg.sender), "VNCHRItem: must have pauser role to pause");
        _pause();
    }

    function unpause() public virtual {
        require(hasRole(PAUSER_ROLE, msg.sender), "VNCHRItem: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
