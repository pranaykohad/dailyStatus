package com.oversight.service;

import java.util.List;

import com.oversight.entity.Status;


public interface StatusService {
	
	public List<Status> saveStatus(final List<Status> statusList);
	public List<Status> getUserByUserAndDate(final String user, final String startDate, final String endDate);
	public StringBuilder createDailyStatusReport(final String data);

}
