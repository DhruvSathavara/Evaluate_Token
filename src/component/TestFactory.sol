// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DemoPairFactory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint timestamp
    );

    function createPair(
        address _token0,
        address _token1,
        address _pair
    ) public {
        emit PairCreated(_token0, _token1, _pair, block.timestamp);
    }
}
