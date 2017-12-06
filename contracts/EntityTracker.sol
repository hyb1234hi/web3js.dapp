pragma solidity ^0.4.17;

contract EntityTracker {
    uint private entityId;
    string private entityName;
    
    function setEntity(string n, uint i) public {
        entityName = n;
        entityId = i;
    }
    
    function getEntity()  public constant returns (string, uint) {
        return (entityName, entityId);
    }
}