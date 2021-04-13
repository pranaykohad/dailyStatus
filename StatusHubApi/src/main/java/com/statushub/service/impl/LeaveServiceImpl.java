package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.statushub.constant.ReportConstant;
import com.statushub.entity.Attachment;
import com.statushub.entity.Leave;
import com.statushub.entity.Result;
import com.statushub.entity.Result.ResStatus;
import com.statushub.entity.User;
import com.statushub.repository.HolidayRepository;
import com.statushub.repository.LeaveRepository;
import com.statushub.repository.UserRepository;
import com.statushub.service.LeaveService;
import com.statushub.util.ReportUtil;

@Service
public class LeaveServiceImpl implements LeaveService {

	private static final String FULL_DAY = "full-day";

	private static final String HALF_DAY = "half-day";

	@Autowired
	private LeaveRepository leaveRepo;

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	HolidayRepository holidayRepository;

	@Autowired
	ReportUtil reportUtil;
	
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
		final String firstName = userFullName[0].toUpperCase().trim();
		final String lastName = userFullName[1].toUpperCase().trim();
		return userRepository.findByFirstnameAndLastname(firstName, lastName);
	}

	private void saveLeave(final Result result, final Leave leave, final String[] tokens, final String[] userFullName) {
		final User user = getUserByFirstNameAndLastName(userFullName);
		if (user != null) {
			leave.setUser(user);
			leave.setType(!tokens[1].isEmpty() ? tokens[1] : FULL_DAY);
			leaveRepo.save(leave);
			result.setStatus(ResStatus.SUCCESS);
			result.setDescription("Leaves are successfully updated");
		}
	}

	@Override
	public int getLeaveCount(final int userId, final String type, String startDate, final String endDate) {
		return leaveRepo.getLeaveCount(userId, type, startDate, endDate);
	}

	@Override
	public Result buildResourceUtilizationReport(final String startDate, final String endDate, final int dateCount) {
		
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		
		final List<User> userList = getAllUserList();
		
		final StringBuilder content = new StringBuilder();
		reportUtil.buildResUtilReportHeading(content);
		
		for(User user: userList) {

			final int fullDayLeavsCount = getLeaveCount(user.getUserId(), FULL_DAY, startDate, endDate);
			final int halfDayLeavsCount = getLeaveCount(user.getUserId(), HALF_DAY, startDate, endDate);
			final int holidayCount = holidayRepository.getHolidayCount(startDate, endDate);
			final float baseHours = dateCount * user.getBaseHours();
			
			float totalHolidayHours = 0.0f;
			if(holidayCount > 0) {
				totalHolidayHours = user.getBaseHours() * holidayCount;
			}
			float totalFullDayLeaveHours = 0.0f;
			if(fullDayLeavsCount > 0) {
				totalFullDayLeaveHours = user.getBaseHours() * fullDayLeavsCount;
			}
			float totalHalfDayLeaveHours = 0.0f;
			if(halfDayLeavsCount > 0) {
				totalHalfDayLeaveHours = (user.getBaseHours() / 2) * halfDayLeavsCount;
			}
			final float leaveHours = totalFullDayLeaveHours + totalHalfDayLeaveHours;
			final float availableHours = baseHours - (leaveHours + totalHolidayHours);
			
			addRow(content, user, baseHours, totalHolidayHours, leaveHours, availableHours);
		}
		
		final byte[] byteConent = content.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename("Resource utility Report.csv");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		
		return result;
	}

	private void addRow(final StringBuilder content, User user, final float baseHours, float totalHolidayHours,
			final float leaveHours, final float availableHours) {
		content.append(ReportConstant.ONE_LINE);
		content.append(",");
		content.append(user.getFirstName()+" "+user.getLastName()+",");
		content.append(user.getPosition()+",");
		content.append(baseHours+",");
		content.append(totalHolidayHours+",");
		content.append(leaveHours+",");
		content.append(availableHours+",");
		content.append(availableHours+",");
		content.append("100%,");
	}

	private List<User> getAllUserList() {
		final List<String> userTypes = new ArrayList<>();
		userTypes.addAll(ReportConstant.getAllUserTypeList());
		return userRepository.findAllUsers(userTypes);
	}

	

}
