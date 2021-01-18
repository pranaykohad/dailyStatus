package com.statushub.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.statushub.constant.ReportConstant;
import com.statushub.entity.Attachment;
import com.statushub.entity.Result;
import com.statushub.entity.Status;
import com.statushub.repository.StatusRepository;
import com.statushub.service.StatusService;
import com.statushub.util.ReportUtil;

@Service
public class StatusServiceImpl implements StatusService {

	private static final Logger LOG = LoggerFactory.getLogger("StatusServiceImpl.class");

	private int subHeadCntr;

	@Autowired
	private StatusRepository stsRepo;

	@Autowired
	ReportUtil reportUtil;

	@Override
	public void updateStatus(final List<Status> statusList) {
		if(statusList != null) {
			final List<Status> saveList = new ArrayList<>();
			final List<Status> deleteList = new ArrayList<>();
			statusList.forEach(status -> {
				if(status.isDelete()) 
					deleteList.add(status);
				else
					saveList.add(status);
			});
			updateQuery(saveList, deleteList);
		} else {
			LOG.debug("Cannot save {}",statusList);
		}
	}

	@Override
	public Result createReport(final String date) {
		final Result result = new Result();
		final StringBuilder dailyStatusFileContent = createDailyReport(date);
		final byte[] byteConent = dailyStatusFileContent.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename(LocalDate.now()+".txt");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		return result;
	}

	@Override
	public Result createReport(final List<String> userIdList, final String startDate, final String endDate, final String reportType) {
		final Result result = new Result();
		final StringBuilder dailyStatusFileContent = createDailyReport(userIdList, startDate, endDate, reportType);
		final byte[] byteConent = dailyStatusFileContent.toString().getBytes();
		final Attachment attachment = new Attachment();
		attachment.setFileContent(byteConent);
		attachment.setFilename(reportType+" Report.csv");
		attachment.setMimeType("text/plain");
		result.setData(attachment);
		return result;
	}
	
	@Override
	public Result createReportByDateAndUserId(final String date, final String userId) {
		final Result result = new Result();
		final List<Status> statusList = stsRepo.getStatusByDateAndUserId(date, userId);
		if (statusList == null || statusList.isEmpty()) {
			result.setDescription("No record found");
		} else {
			result.setData(statusList);
		}
		return result;
	}
	
	private void updateQuery(final List<Status> saveList, final List<Status> deleteList) {
		try {
			if(!saveList.isEmpty())
				stsRepo.saveAll(saveList);
			if(!deleteList.isEmpty())
				stsRepo.deleteInBatch(deleteList);
		} catch (final Exception e) {
			LOG.debug("Error while saving, Error: ",e);
		}
		LOG.debug("Status is updated");
	}

	private StringBuilder createDailyReport(final String date) {
		final StringBuilder content = new StringBuilder();
		reportUtil.addGreeting(content);
		ReportConstant.getModuleList().forEach(module-> {
			subHeadCntr = 0;
			reportUtil.addModuleName(content, module);
			final List<String> userTypeList = reportUtil.getUserTypeList(module);
			createContent(date, content, module, userTypeList);
		});
		LOG.debug("Date {}", date);
		LOG.debug("Content {}", content);
		return content;
	}

	private void createContent(final String date, final StringBuilder content, final String module, final List<String> userTypeList) {
		userTypeList.forEach(usertype->{
			ReportConstant.getStateList().forEach(state->
			addStsToContent(date, content, module, usertype, state)
					);
			content.append(ReportConstant.ONE_LINE);
		});
	}

	private void addStsToContent(final String date, final StringBuilder content, final String module, final String userType, final String state) {
		final List<Status> statusList = getStatusByDate(date, module, userType, state);
		if(!statusList.isEmpty()) {
			subHeadCntr = subHeadCntr+1;
			content.append(subHeadCntr+")"+ReportConstant.TAB);
			reportUtil.createSubHeading(content, userType, state);
			reportUtil.addStatus(content, statusList);
			content.append(ReportConstant.ONE_LINE);
		} 
	}

	private StringBuilder createDailyReport(final List<String> userIdList, final String startDate, final String endDate, final String  reportType) {
		final StringBuilder content = new StringBuilder();
		reportUtil.addHeading(content, reportType, startDate, endDate);
		userIdList.forEach(userId->{
			reportUtil.addName(content, userId);
			final List<Status> statusList = stsRepo.getStatusByUserAndDateRange(userId, startDate, endDate);
			reportUtil.addCustomStatus(content, statusList);
			content.append(ReportConstant.ONE_LINE);
		});
		return content;
	}

	private List<Status> getStatusByDate(final String date, final String module, final String type, final String state) {
		return stsRepo.getStatusByDateModuleTypeAndState(date, module, type, state);
	}
	
}
