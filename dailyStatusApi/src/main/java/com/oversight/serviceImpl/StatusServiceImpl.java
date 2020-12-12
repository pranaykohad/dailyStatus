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

}
