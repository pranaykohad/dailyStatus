package com.statushub.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.statushub.constant.AppConstant;
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

	private static final String HUNDRED_PERCENT = "100%,";

	@Autowired
	private LeaveRepository leaveRepo;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private HolidayRepository holidayRepository;

	@Autowired
	private ReportUtil reportUtil;

	@Override
	@Transactional
	public Result addLeaves(final Leave leave) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		if (leave != null) {
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
			leaves.forEach(leave -> leave.setUser(null) );
			result.setData(leaves);
			result.setStatus(ResStatus.SUCCESS);
		}
		return result;
	}

	@Override
	@Transactional
	public Result deleteLeaveById(final Integer leaveId) {
		final Result result = new Result();
		result.setStatus(ResStatus.FAILURE);
		int count = 0;
		final int rowCount = leaveRepo.deleteLeaveByLeaveId(leaveId);
		count = rowCount > 0 ? ++count : count;
		if (count > 0) {
			result.setStatus(ResStatus.SUCCESS);
			result.setData(count);
			result.setDescription("Your leave has been deleted successfully");
		}
		return result;
	}

	@Override
	public int getLeaveCount(final int userId, final String type, final String startDate, final String endDate) {
		return leaveRepo.getLeaveCountByTypeAndDate(userId, type, startDate, endDate);
	}

	@Override
	public Result buildResourceUtilizationReport(final String startDate, final String endDate, final int dateCount) {
		final Result result = new Result();
		final List<User> billableUserList = userRepository.findAllBillableUsersButAmin(true);
		final StringBuilder content = new StringBuilder();
		reportUtil.buildResUtilReportHeading(content);

		float totolBBaseHours = 0.0f;
		float totolBHolidayHours = 0.0f;
		float totolBLeaveHours = 0.0f;
		float totolBAvailableHours = 0.0f;

		for (final User user : billableUserList) {
			final int fullDayLeavsCount = getLeaveCount(user.getUserId(), FULL_DAY, startDate, endDate);
			final int halfDayLeavsCount = getLeaveCount(user.getUserId(), HALF_DAY, startDate, endDate);
			final int holidayCount = holidayRepository.getHolidayCount(startDate, endDate);
			final float baseHours = dateCount * user.getBaseHours();

			float totalHolidayHours = 0.0f;
			if (holidayCount > 0) {
				totalHolidayHours = user.getBaseHours() * holidayCount;
			}

			float totalFullDayLeaveHours = 0.0f;
			if (fullDayLeavsCount > 0) {
				totalFullDayLeaveHours = user.getBaseHours() * fullDayLeavsCount;
			}

			float totalHalfDayLeaveHours = 0.0f;
			if (halfDayLeavsCount > 0) {
				totalHalfDayLeaveHours = (user.getBaseHours() / 2) * halfDayLeavsCount;
			}

			final float leaveHours = totalFullDayLeaveHours + totalHalfDayLeaveHours;
			final float availableHours = baseHours - (leaveHours + totalHolidayHours);

			addRow(content, user, baseHours, totalHolidayHours, leaveHours, availableHours);

			totolBBaseHours += baseHours;
			totolBHolidayHours += totalHolidayHours;
			totolBLeaveHours += leaveHours;
			totolBAvailableHours += availableHours;
		}

		addSubTotalLine("Billable Subtotal", content, totolBBaseHours, totolBHolidayHours, totolBLeaveHours,
			totolBAvailableHours);

		content.append(AppConstant.ONE_LINE + ",");
		content.append("Additional Resources Applied,");

		final List<User> unBillableUserList = userRepository.findAllBillableUsersButAmin(false);

		float totolUBBaseHours = 0.0f;
		float totolUBHolidayHours = 0.0f;
		float totolUBLeaveHours = 0.0f;
		float totolUBAvailableHours = 0.0f;

		for (final User user : unBillableUserList) {
			final int fullDayLeavsCount = getLeaveCount(user.getUserId(), FULL_DAY, startDate, endDate);
			final int halfDayLeavsCount = getLeaveCount(user.getUserId(), HALF_DAY, startDate, endDate);
			final int holidayCount = holidayRepository.getHolidayCount(startDate, endDate);
			final float baseHours = dateCount * user.getBaseHours();

			float totalHolidayHours = 0.0f;
			if (holidayCount > 0) {
				totalHolidayHours = user.getBaseHours() * holidayCount;
			}

			float totalFullDayLeaveHours = 0.0f;
			if (fullDayLeavsCount > 0) {
				totalFullDayLeaveHours = user.getBaseHours() * fullDayLeavsCount;
			}

			float totalHalfDayLeaveHours = 0.0f;
			if (halfDayLeavsCount > 0) {
				totalHalfDayLeaveHours = (user.getBaseHours() / 2) * halfDayLeavsCount;
			}

			final float leaveHours = totalFullDayLeaveHours + totalHalfDayLeaveHours;
			final float availableHours = baseHours - (leaveHours + totalHolidayHours);

			addRow(content, user, baseHours, totalHolidayHours, leaveHours, availableHours);

			totolUBBaseHours += baseHours;
			totolUBHolidayHours += totalHolidayHours;
			totolUBLeaveHours += leaveHours;
			totolUBAvailableHours += availableHours;
		}

		addSubTotalLine("Non-Billable Subtotal", content, totolUBBaseHours, totolUBHolidayHours, totolUBLeaveHours,
			totolUBAvailableHours);
		addTotalLine(content, totolBBaseHours + totolUBBaseHours, totolBHolidayHours + totolUBHolidayHours,
			totolBLeaveHours + totolUBLeaveHours, totolBAvailableHours + totolUBAvailableHours);
		buildResUtilFile(result, content, startDate, endDate);
		return result;
	}

	private void buildTitle(final List<Leave> leaves) {
		leaves.forEach(leave -> leave.setTitle(
			leave.getUser().getFirstName() + " " + leave.getUser().getLastName() + ":" + leave.getDayType()));
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
			leave.setDayType(!tokens[1].isEmpty() ? tokens[1] : FULL_DAY);
			leaveRepo.save(leave);
			result.setStatus(ResStatus.SUCCESS);
			result.setDescription("Your leave has been added successfully");
		}
	}

	private void buildResUtilFile(final Result result, final StringBuilder content, final String startDate, final String endDate) {
		final byte[] byteConent = content.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename("Resource utility Report "+startDate+"-"+endDate+".csv");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		result.setStatus(ResStatus.SUCCESS);
	}

	private void addTotalLine(final StringBuilder content, final float totolBaseHours, final float totolHolidayHours,
		final float totolLeaveHours, final float totolAvailableHours) {
		content.append(AppConstant.ONE_LINE + ",");
		content.append("Total" + ",,");
		content.append(totolBaseHours + ",");
		content.append(totolHolidayHours + ",");
		content.append(totolLeaveHours + ",");
		content.append(totolAvailableHours + ",");
		content.append(totolAvailableHours + ",");
		content.append(HUNDRED_PERCENT);
	}

	private void addSubTotalLine(final String subotalTitle, final StringBuilder content, final float totolBillableBH,
		final float totolBillableHH, final float totolBillableLH, final float totolBillableAH) {
		content.append(AppConstant.ONE_LINE + ",");
		content.append(subotalTitle + ",,");
		content.append(totolBillableBH + ",");
		content.append(totolBillableHH + ",");
		content.append(totolBillableLH + ",");
		content.append(totolBillableAH + ",");
		content.append(totolBillableAH + ",");
		content.append(HUNDRED_PERCENT);
		content.append(AppConstant.ONE_LINE);
	}

	private void addRow(final StringBuilder content, final User user, final float baseHours, final float totalHolidayHours,
		final float leaveHours, final float availableHours) {
		content.append(AppConstant.ONE_LINE+",");
		content.append(user.getFirstName() + " " + user.getLastName() + ",");
		content.append(user.getPosition() + ",");
		content.append(baseHours + ",");
		content.append(totalHolidayHours + ",");
		content.append(leaveHours + ",");
		content.append(availableHours + ",");
		content.append(availableHours + ",");
		content.append(HUNDRED_PERCENT);
	}

	@Override
	public Result buildLeaveReport(final String startDate, final String endDate, final String type) {
		final Result result = new Result();
		result.setStatus(ResStatus.SUCCESS);
		final StringBuilder content = new StringBuilder();
		reportUtil.buildLeaveReportHeading(content, startDate, endDate);
		final List<String> types = new ArrayList<>();
		if (type.equalsIgnoreCase("All")) {
			types.addAll(AppConstant.getLeaveTypes());
		} else {
			types.add(type);
		}
		final List<Leave> leaves = leaveRepo.getUserOnLeave(startDate, endDate, types);
		content.append(AppConstant.ONE_LINE);

		if(!leaves.isEmpty()) {
			int count = 1;
			for(final Leave leave: leaves) {
				content.append(count++ +",");
				content.append(leave.getUser().getFirstName()+" "+leave.getUser().getLastName()+",");
				content.append(leave.getDayType().equals(HALF_DAY) ? "1/2 Day," : "1 Day,");
				content.append(leave.getStart()+",");
				content.append(leave.getType().equalsIgnoreCase("P") ? "Planned" : "Un-Planned" +",");
				content.append(AppConstant.ONE_LINE);
			}
		}

		buildResUtilFile(result, content, startDate, endDate);
		return result;
	}

}
