package com.statushub.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.repository.LeaveRepository;
import com.statushub.service.LeaveService;

@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepo;

	@Override
	public void addLeaves(List<Leave> leaves) {
		leaveRepo.saveAll(leaves);
	}

	@Override
	public void truncateLeaveTable() {
		leaveRepo.deleteAll();
	}

	@Override
	public void addLeave(Leave leave) {
		leaveRepo.saveAndFlush(leave);
	}

	@Override
	public Result getHalfdayLeavesByMonth(final String type, final String month) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		List<Leave> leaves = leaveRepo.getHalfdayLeavesByMonth(type, month + '%');
		if (!leaves.isEmpty()) {
			buildTitle(leaves);
			result.setData(leaves);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	private void buildTitle(List<Leave> leaves) {
		leaves.forEach(leave -> {
			leave.setTitle(
					leave.getType() + ":" + leave.getUser().getFirstName() + " " + leave.getUser().getLastName());
		});

	}

}
