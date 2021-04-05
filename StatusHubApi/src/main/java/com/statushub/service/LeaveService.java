package com.statushub.service;

import java.util.List;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;


public interface LeaveService {

	public void addLeave(Leave leave);
	public void addLeaves(List<Leave> leaves);
	public void truncateLeaveTable();
	public Result getHalfdayLeavesByMonth(String type, String month);
}
