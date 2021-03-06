package com.statushub.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Leave;
import com.statushub.repository.LeaveRepository;
import com.statushub.service.LeaveService;

@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepo;

	@Override
	public void addLeaves(List<Leave> leaves) {
		leaveRepo.saveAll(leaves);
	}

	@Override
	public void truncateLeaveTable() {
		leaveRepo.deleteAll();
	}

	@Override
	public void addLeave(Leave leave) {
		leaveRepo.saveAndFlush(leave);
	}
	
}
