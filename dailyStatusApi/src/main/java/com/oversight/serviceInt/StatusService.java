package com.oversight.serviceInt;

import java.util.List;

import com.oversight.entity.Status;


public interface StatusService {
	
	public List<Status> saveStatus(final List<Status> statusList);

}
