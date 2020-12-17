package com.oversight.service;

import java.util.List;

import com.oversight.entity.Result;
import com.oversight.entity.Status;


public interface StatusService {
	
	public List<Status> saveStatus(final List<Status> statusList);
	public Result createReport(final String date);
	public Result createReport(final String userId,final String startDate, final String endDate);

}
