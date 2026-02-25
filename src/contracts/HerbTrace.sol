// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract HerbTrace is Initializable {
    function initialize() public initializer {
    }
    struct Batch {
        string batchId;
        string herbName;
        string manufacturerName;
        string harvestDate;
        string manufactureDate;
        string expiryDate;
        string origin;
        string details;
        string[] ipfsCIDs;
        uint256 timestamp;
        address manufacturer;
        bool exists;
    }

    mapping(string => Batch) public batches;
    string[] public batchIds;

    event BatchRegistered(string indexed batchId, string herbName, address indexed manufacturer);
    event BatchUpdated(string indexed batchId, address indexed manufacturer);

    function registerBatch(
        string memory _batchId,
        string memory _herbName,
        string memory _manufacturerName,
        string memory _harvestDate,
        string memory _manufactureDate,
        string memory _expiryDate,
        string memory _origin,
        string memory _details,
        string[] memory _ipfsCIDs
    ) public {
        require(!batches[_batchId].exists, "Batch already registered");

        batches[_batchId] = Batch({
            batchId: _batchId,
            herbName: _herbName,
            manufacturerName: _manufacturerName,
            harvestDate: _harvestDate,
            manufactureDate: _manufactureDate,
            expiryDate: _expiryDate,
            origin: _origin,
            details: _details,
            ipfsCIDs: _ipfsCIDs,
            timestamp: block.timestamp,
            manufacturer: msg.sender,
            exists: true
        });

        batchIds.push(_batchId);

        emit BatchRegistered(_batchId, _herbName, msg.sender);
    }

    function updateBatch(
        string memory _batchId,
        string[] memory _newIpfsCIDs
    ) public {
        require(batches[_batchId].exists, "Batch not found");
        require(batches[_batchId].manufacturer == msg.sender, "Only manufacturer can update");

        batches[_batchId].ipfsCIDs = _newIpfsCIDs;
        batches[_batchId].timestamp = block.timestamp;

        emit BatchUpdated(_batchId, msg.sender);
    }

    function getBatch(string memory _batchId) public view returns (
        string memory herbName,
        string memory manufacturerName,
        string memory harvestDate,
        string memory manufactureDate,
        string memory expiryDate,
        string memory origin,
        string memory details,
        string[] memory ipfsCIDs,
        uint256 timestamp,
        address manufacturer
    ) {
        require(batches[_batchId].exists, "Batch not found");
        Batch storage b = batches[_batchId];
        return (
            b.herbName, 
            b.manufacturerName, 
            b.harvestDate, 
            b.manufactureDate, 
            b.expiryDate, 
            b.origin, 
            b.details, 
            b.ipfsCIDs, 
            b.timestamp, 
            b.manufacturer
        );
    }

    function getBatchCount() public view returns (uint256) {
        return batchIds.length;
    }
}

