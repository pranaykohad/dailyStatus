package com.statushub.service;

import java.util.List;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;


public interface LeaveService {

	public Result addLeaves(final List<Leave> leaves);
	public void deleteLeaveTable();
	public Result getLeavesByTypeAndMonth(final String type,final String month);
	public Result deleteLeaveById(final List<Integer> leaveIds);
}
