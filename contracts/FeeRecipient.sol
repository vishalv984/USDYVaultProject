// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FeeRecipient {
    address public recipient;

    constructor() {
        recipient = msg.sender;
    }
}
