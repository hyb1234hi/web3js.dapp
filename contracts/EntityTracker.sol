pragma solidity ^0.4.17;

contract EntityTracker {
    string private entityName;
    uint private entityId;

    function EntityTracker() public {
        entityName = "null";
    }
    
    function setEntity(string n, uint i) public {
        entityName = n;
        entityId = i;
    }
    
    function getEntity()  public constant returns (string, uint) {
        return (entityName, entityId);
    }
}