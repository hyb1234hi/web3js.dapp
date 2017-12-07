pragma solidity ^0.4.17;

contract BaseContract {
    address originatingAddress;

    function BaseContract() public {
        originatingAddress = msg.sender;
    }

    modifier ownerSpecificOp {
        require(msg.sender == originatingAddress);
        _;
    }
}

contract EntityTracker is BaseContract {

    struct Entity {
        bytes16 name;
        uint id;
    }

    mapping(address => Entity) entities;

    address[] public entityObjects;

    event EntityAdded(bytes16 name, uint id);

    function setEntity(address a, uint i, bytes16 n) ownerSpecificOp public {
        var entity = entities[a];
        entity.name = n;
        entity.id = i;
        entityObjects.push(a)-1;
        EntityAdded(entity.name, entity.id);
    }

    function getEntities() view public returns(address[]) {
        return entityObjects;
    }

    function getEntity(address a) view public returns (bytes16, uint) {
        return (entities[a].name, entities[a].id);
    }

    function entitiyCount() view public returns (uint) {
        return entityObjects.length;
    }
}