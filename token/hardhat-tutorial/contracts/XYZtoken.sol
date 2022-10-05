// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XYZtoken is ERC20, Ownable {

      uint256 public constant tokenPrice = 0.00001 ether;
      uint256 public constant tokensPerNFT = 10 * 10**18;
      uint256 public constant maxTotalSupply = 10000 * 10**18;
      address public dev;
      mapping(address => uint256) public holders;
      
      constructor() ERC20("XYZ DAO Token", "CD") {
          dev=msg.sender;
      }

      function mint(uint256 amount) public payable {
          uint256 _requiredAmount = tokenPrice * amount;
          require(msg.value >= _requiredAmount, "Ether sent is incorrect");
          uint256 amountWithDecimals = amount * 10**18;
          require(
              (totalSupply() + amountWithDecimals) <= maxTotalSupply,
              "Exceeds the max total supply available."
          );
          _mint(msg.sender, amountWithDecimals);
          holders[msg.sender]=amount;
      }
      function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
      }

      receive() external payable {}
      fallback() external payable {}
  }
