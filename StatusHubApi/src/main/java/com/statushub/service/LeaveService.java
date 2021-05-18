package com.statushub.service;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;


public interface LeaveService {

	public Result addLeaves(final Leave leaves);
	public void deleteLeaveTable();
	public Result getLeavesByTypeAndMonth(final String type,final String month);

	public Result deleteLeaveById(final Integer leaveIds);
	public int getLeaveCount(final int userId, final String type, final String startDate, final String endDate);
	public Result buildResourceUtilizationReport(final String startDate, final String endDate, final int dateCount);

	public Result buildLeaveReport(final String startDate, final String endDate, final String type);
}
