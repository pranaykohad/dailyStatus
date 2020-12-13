package com.oversight.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oversight.entity.Status;
import com.oversight.repository.StatusRepository;
import com.oversight.serviceInt.StatusService;

@Service
public class StatusServiceImpl implements StatusService {
	
	@Autowired
	private StatusRepository stsRepository;

	@Override
	public List<Status> saveStatus(List<Status> statusList) {
		return stsRepository.saveAll(statusList);
	}

	@Override
	public List<Status> getUserByUserAndDate(String userId, final String startDate, final String endDate) {
		return stsRepository.getUserByUserAndDate(userId, startDate, endDate);
	}

	@Override
	public StringBuilder createDailyStatusReport(String data) {
		StringBuilder content = new StringBuilder(data);
		return content;
	}

}
