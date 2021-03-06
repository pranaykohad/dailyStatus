package com.statushub.service;

import java.util.List;

import com.statushub.entity.Leave;


public interface LeaveService {

	public void addLeave(Leave leave);
	public void addLeaves(List<Leave> leaves);
	public void truncateLeaveTable();
}
