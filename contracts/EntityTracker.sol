pragma solidity ^0.4.17;

contract EntityTracker {
    string private entityName;
    uint private entityId;
    event EntityAdded(string name, uint id);

    function EntityTracker() public {
        entityName = "null";
    }
    
    function setEntity(string n, uint i) public {
        entityName = n;
        entityId = i;
        EntityAdded(entityName, entityId);
    }
    
    function getEntity()  public constant returns (string, uint) {
        return (entityName, entityId);
    }
}