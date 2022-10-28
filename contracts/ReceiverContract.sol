// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract ReceiverContract {
    uint256 tokenId;
    constructor() {
        
    }

    function sellToken(address tokenAddr, address _to, uint256 _tokenId) public returns (uint256) {
        IERC721(tokenAddr).transferFrom(address(this), _to, _tokenId);

        return _tokenId;
    }

    // function onERC721Received(
    //     address operator,
    //     address from,
    //     uint256 tokenId,
    //     bytes calldata data
    // ) external returns (bytes4) {
    //      return IERC721Receiver.onERC721Received.selector;
    // }
}
 