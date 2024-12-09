// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FundAdministrator {
    address public admin;

    constructor() {
        admin = msg.sender;
    }
}
