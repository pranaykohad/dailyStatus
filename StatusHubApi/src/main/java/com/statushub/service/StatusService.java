package com.statushub.service;

import java.util.List;

import com.statushub.entity.Result;
import com.statushub.entity.Status;


public interface StatusService {

	public void updateStatus(final List<Status> statusList);
	public Result createReport(final String date);
	public Result createReportByDateAndUserId(final String date, final String userId);
	public Result createReport(final List<String> userIdList, final String startDate, final String endDate, final String reportType);
}
