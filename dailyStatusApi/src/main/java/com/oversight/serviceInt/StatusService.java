package com.oversight.serviceInt;

import java.util.List;

import com.oversight.entity.Status;


public interface StatusService {
	
	public List<Status> saveStatus(final List<Status> statusList);
	public List<Status> getUserByUserAndDate(final String user, final String date);

}
