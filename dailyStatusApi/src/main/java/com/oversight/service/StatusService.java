package com.oversight.service;

import java.util.List;

import com.oversight.entity.Result;
import com.oversight.entity.Status;


public interface StatusService {
	
	public List<Status> saveStatus(final List<Status> statusList);
	public List<Status> getStatusByDate(final String date);
	public List<Status> getStatusByUserAndDateRange(final String userId, final String startDate, final String endDate);
	public StringBuilder createDailyStatusReport(final String date);
	public List<Status> getStatus(final String date, final String module, final String type, final String state);
	public Result createReport(final String date);

}
