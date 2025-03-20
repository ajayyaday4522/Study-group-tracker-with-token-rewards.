// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StudyGroupTracker {
    struct StudySession {
        string topic;
        address organizer;
        uint256 timestamp;
        bool completed;
    }
    
    mapping(uint256 => StudySession) public sessions;
    mapping(address => uint256) public tokenBalance;
    uint256 public sessionCount;
    uint256 public rewardAmount = 10;
    
    event SessionCreated(uint256 sessionId, string topic, address organizer, uint256 timestamp);
    event SessionCompleted(uint256 sessionId, address organizer);
    event TokensRewarded(address recipient, uint256 amount);
    
    function createStudySession(string memory _topic) public {
        sessions[sessionCount] = StudySession(_topic, msg.sender, block.timestamp, false);
        emit SessionCreated(sessionCount, _topic, msg.sender, block.timestamp);
        sessionCount++;
    }
    
    function completeStudySession(uint256 _sessionId) public {
        require(_sessionId < sessionCount, "Invalid session ID");
        require(sessions[_sessionId].organizer == msg.sender, "Only the organizer can mark as completed");
        require(!sessions[_sessionId].completed, "Session already completed");
        
        sessions[_sessionId].completed = true;
        tokenBalance[msg.sender] += rewardAmount;
        
        emit SessionCompleted(_sessionId, msg.sender);
        emit TokensRewarded(msg.sender, rewardAmount);
    }
    
    function getTokenBalance(address _user) public view returns (uint256) {
        return tokenBalance[_user];
    }
}
