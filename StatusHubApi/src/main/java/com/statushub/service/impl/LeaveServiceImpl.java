package com.statushub.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.statushub.entity.Leave;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.User;
import com.statushub.repository.LeaveRepository;
import com.statushub.repository.UserRepository;
import com.statushub.service.LeaveService;

@Service
public class LeaveServiceImpl implements LeaveService {

	@Autowired
	private LeaveRepository leaveRepo;

	@Autowired
	UserRepository userRepository;

	@Override
	@Transactional
	public Result addLeaves(final List<Leave> leaves) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);

		for (final Leave leave : leaves) {
			final String title = leave.getTitle();
			final String[] tokens = title.split(":");

			if (tokens != null && tokens.length == 2) {
				final String userName = tokens[0];
				final String[] userFullName = userName.split(" ");

				if (userFullName != null && userFullName.length == 2) {
					saveLeave(result, leave, tokens, userFullName);
				}
			}
		}
		return result;
	}

	@Override
	public void deleteLeaveTable() {
		leaveRepo.deleteAll();
	}

	@Override
	public Result getLeavesByTypeAndMonth(final String type, final String month) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		final List<Leave> leaves = leaveRepo.getHalfdayLeavesByMonth(type, month + '%');
		if (!leaves.isEmpty()) {
			buildTitle(leaves);
			result.setData(leaves);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	@Override
	@Transactional
	public Result deleteLeaveById(final List<Integer> leaveIds) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		int count = 0;
		for (final int leaveId : leaveIds) {
			final int rowCount = leaveRepo.deleteLeaveByLeaveId(leaveId);
			count = rowCount > 0 ? ++count : count;
		}
		if (count > 0) {
			result.setStatus(ResStatus.SUCCESS);
			result.setData(count);
			result.setDescription("Leaves are successfully updated");
		}
		return result;
	}

	private void buildTitle(final List<Leave> leaves) {
		leaves.forEach(leave -> {
			leave.setTitle(
				leave.getUser().getFirstName() + " " + leave.getUser().getLastName() + ":" + leave.getType());
		});
	}

	private User getUserByFirstNameAndLastName(final String[] userFullName) {
		final String firstName = userFullName[0].toUpperCase();
		final String lastName = userFullName[1].toUpperCase();
		return userRepository.findByFirstnameAndLastname(firstName, lastName);
	}

	private void saveLeave(final Result result, final Leave leave, final String[] tokens, final String[] userFullName) {
		final User user = getUserByFirstNameAndLastName(userFullName);
		leave.setUser(user);
		leave.setType(!tokens[1].isEmpty() ? tokens[1] : "full-day");
		leaveRepo.save(leave);
		result.setStatus(ResStatus.SUCCESS);
		result.setDescription("Leaves are successfully updated");
	}

}
